import * as mime from 'mime-types';
import * as path from 'node:path';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { walkDirectory } from './utils';

export = async () => {

  const config = new pulumi.Config();

  const dnsName = config.require('dns-name');

  const awsRegion = await aws.getRegion();

  const fullDnsName = `www.${dnsName}`;

  const gmailVerificationCode = config.require('gmail-verification-code');

  const eastProvider = new aws.Provider('east', {
    region: 'us-east-1',
    profile: aws.config.profile,
  });

  const zone = new aws.route53.Zone('zone', {
    name: dnsName,
    tags: { source: 'pulumi', project: 'website' }
  });

  const certificate = new aws.acm.Certificate('certificate', {
    domainName: fullDnsName,
    validationMethod: 'DNS',
  }, { provider: eastProvider });

  const certificateValidationDomain = new aws.route53.Record(`${fullDnsName}-validation`, {
    name: certificate.domainValidationOptions[0].resourceRecordName,
    type: certificate.domainValidationOptions[0].resourceRecordType,
    zoneId: zone.zoneId,
    records: [certificate.domainValidationOptions[0].resourceRecordValue],
    ttl: 600
  });

  const certificateValidation = new aws.acm.CertificateValidation(
    `certificate_validation`, {
      certificateArn: certificate.arn,
      validationRecordFqdns: [certificateValidationDomain.fqdn],
    }, { provider: eastProvider }
  );

  const certificateArn = certificateValidation.certificateArn;

  const emailRecord = new aws.route53.Record('email_record', {
    name: dnsName,
    zoneId: zone.zoneId,
    type: 'MX',
    ttl: 300,
    records: [
      "1 ASPMX.L.GOOGLE.COM.",
      "5 ALT1.ASPMX.L.GOOGLE.COM.",
      "5 ALT2.ASPMX.L.GOOGLE.COM.",
      "10 ALT3.ASPMX.L.GOOGLE.COM.",
      "10 ALT4.ASPMX.L.GOOGLE.COM.",
      `15 ${gmailVerificationCode}.`,
    ],
  });

  const siteDir = path.join(__dirname, "../dist");

  const rootBucket = new aws.s3.Bucket(`${dnsName}-site-bucket`, {
    bucket: dnsName,
    acl: 'private',
    website: { redirectAllRequestsTo: `https://${fullDnsName}` }
  });

  const siteBucket = new aws.s3.Bucket(`${fullDnsName}-site-bucket`, {
    bucket: fullDnsName,
    acl: 'public-read',
    website: { indexDocument: 'index.html' }
  });

  const logsBucket = new aws.s3.Bucket(`${dnsName}-logs`, {
    acl: 'private'
  });

  for await (const filePath of walkDirectory(siteDir)) {
    const key = path.relative(siteDir, filePath);
    new aws.s3.BucketObject(key, {
      bucket: siteBucket,
      source: new pulumi.asset.FileAsset(filePath),
      acl: 'public-read',
      contentType: mime.lookup(filePath) || 'binary/octet-stream',
    });
  }

  const cdnLambdaExecutionRole = new aws.iam.Role('cdn_lambda_exec', {
    assumeRolePolicy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: [
              'lambda.amazonaws.com',
              'edgelambda.amazonaws.com'
            ]
          }
        }
      ],
    })
  });

  const cdnLambdaExecutionRolePolicy = new aws.iam.RolePolicy('cdn_lambda_exec_policy', {
    role: cdnLambdaExecutionRole.id,
    policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'logs:CreateLogGroup',
          ]
        }
      ],
    }),
  });

  const cdnEdgeFunction = new aws.lambda.CallbackFunction('edge_lambda_func', {
    role: cdnLambdaExecutionRole,
    callback: async (event: any) => {
      const request = event.Records[0].cf.request;
      const uri = request.uri;

      // Check whether the URI is missing a file name.
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } 
      // Check whether the URI is missing a file extension.
      else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    },
    runtime: 'nodejs16.x',
    publish: true,
    timeout: 10,
  }, { provider: eastProvider });

  const cloudfrontDistribution = new aws.cloudfront.Distribution('distribution', {
    enabled: true,
    isIpv6Enabled: false,
    aliases: [fullDnsName],
    origins: [
      {
        originId: siteBucket.arn,
        domainName: siteBucket.websiteEndpoint,
        customOriginConfig: {
          originProtocolPolicy: 'http-only',
          httpPort: 80,
          httpsPort: 443,
          originSslProtocols: ["TLSv1.2"],
        }
      }
    ],
    comment: '',
    defaultRootObject: 'index.html',
    defaultCacheBehavior: {
      targetOriginId: siteBucket.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      forwardedValues: { cookies: { forward: 'none' }, queryString: false },
      lambdaFunctionAssociations: [
        {
          eventType: 'origin-request',
          lambdaArn: cdnEdgeFunction.qualifiedArn,
          includeBody: false,
        }
      ],
      minTtl: 0,
      defaultTtl: 600,
      maxTtl: 600,
    },
    priceClass: 'PriceClass_100',
    customErrorResponses: [
      { errorCode: 404, responseCode: 404, responsePagePath: '/404.html' }
    ],
    restrictions: { geoRestriction: { restrictionType: 'none' } },
    viewerCertificate: {
      acmCertificateArn: certificateArn,
      sslSupportMethod: 'sni-only',
    },
    loggingConfig: {
      bucket: logsBucket.bucketDomainName,
      includeCookies: false,
      prefix: `${fullDnsName}/`
    },
  });

  const websiteRecord = new aws.route53.Record(fullDnsName, {
    name: 'www',
    zoneId: zone.zoneId,
    type: 'A',
    aliases: [
      {
        name: cloudfrontDistribution.domainName,
        zoneId: cloudfrontDistribution.hostedZoneId,
        evaluateTargetHealth: true,
      }
    ]
  });

  const rootWebsiteRecord = new aws.route53.Record(dnsName, {
    name: dnsName,
    zoneId: zone.zoneId,
    type: 'A',
    aliases: [
      {
        name: `s3-website.${awsRegion.name}.amazonaws.com`,
        zoneId: rootBucket.hostedZoneId,
        evaluateTargetHealth: true,
      }
    ]
  });

  return {
    websiteEndpoint: siteBucket.websiteEndpoint,
    cloudfrontDomain: cloudfrontDistribution.domainName,
    endpoint: `https://${fullDnsName}`
  };
}
