import * as mime from 'mime-types';
import * as path from 'node:path';
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as fs from 'node:fs';
import * as url from 'node:url';

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function* walkDirectory(dir: string): AsyncGenerator<string> {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walkDirectory(entry);
        else if (d.isFile()) yield entry;
    }
}

export default async () => {
  const config = new pulumi.Config();

  const dnsName = config.require('dns-name');

  const fullDnsName = `www.${dnsName}`;

  const tags = {
    source: 'pulumi',
    project: 'website',
  };

  const gmailVerificationCode = config.require('gmail-verification-code');

  const eastProvider = new aws.Provider('east', {
    region: 'us-east-1',
    profile: aws.config.profile,
  });

  const zone = new aws.route53.Zone('zone', {
    name: dnsName,
    tags,
  });

  const certificate = new aws.acm.Certificate('certificate', {
    domainName: dnsName,
    validationMethod: 'DNS',
    subjectAlternativeNames: [fullDnsName],
    tags,
  }, { provider: eastProvider });

  const fqdns: pulumi.Output<string>[] = [];
  for (let i = 0; i < 2; i++) {
    const certificateValidationDomain = new aws.route53.Record(`${fullDnsName}-validation-${i}`, {
      name: certificate.domainValidationOptions[i].resourceRecordName,
      type: certificate.domainValidationOptions[i].resourceRecordType,
      zoneId: zone.zoneId,
      records: [certificate.domainValidationOptions[i].resourceRecordValue],
      ttl: 600
    });
    fqdns.push(certificateValidationDomain.fqdn);
  }

  const certificateValidation = new aws.acm.CertificateValidation(
    `certificate_validation`, {
      certificateArn: certificate.arn,
      validationRecordFqdns: fqdns,
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

  const siteDir = path.join(dirname, "./dist");

  const siteBucket = new aws.s3.Bucket(`${dnsName}-site`, {
    tags,
  });
  const siteBucketAccessBlock = new aws.s3.BucketPublicAccessBlock(`${dnsName}-access-block`, {
    bucket: siteBucket.bucket,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
  });

  const logsBucket = new aws.s3.Bucket(`${dnsName}-logs`, {
    tags,
  });
  const logsBucketAccessBlock = new aws.s3.BucketPublicAccessBlock(`${dnsName}-logs-access-block`, {
    bucket: logsBucket.bucket,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
  });

  for await (const filePath of walkDirectory(siteDir)) {
    const key = path.relative(siteDir, filePath);
    new aws.s3.BucketObject(key, {
      bucket: siteBucket,
      source: new pulumi.asset.FileAsset(filePath),
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

  const cdnRequestEdgeFunction = new aws.lambda.CallbackFunction(`edge-request`, {
    role: cdnLambdaExecutionRole,
    // The `async` is important here, it significantly changes the generated
    // code and this doesn't work without it.
    callback: async (event: any) => {
      const request = event.Records[0].cf.request;

      const host = request.headers.host[0].value;
      if (host === dnsName) {
        const path = request.uri === '/index.html' ? '' : request.uri;
        return {
          status: 302,
          statusDescription: 'Found',
          headers: {
            location: [
              { key: 'Location', value: `https://${fullDnsName}${path}` }
            ]
          }
        };
      }
      request.headers.host = [
        { key: 'Host', value: request.origin.s3.domainName }
      ];

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

  const cachePolicy = new aws.cloudfront.CachePolicy('cache-policy', {
    defaultTtl: 600,
    maxTtl: 600,
    minTtl: 0,
    parametersInCacheKeyAndForwardedToOrigin: {
      cookiesConfig: {
        cookieBehavior: 'none'
      },
      headersConfig: {
        headerBehavior: 'whitelist',
        headers: { items: ['Host'] }
      },
      queryStringsConfig: {
        queryStringBehavior: 'none'
      },
      enableAcceptEncodingGzip: true,
      enableAcceptEncodingBrotli: true,
    }
  });

  const cacheStaticResourcesPolicy = new aws.cloudfront.ResponseHeadersPolicy('static-response-headers', {
    customHeadersConfig: {
      items: [
        { header: 'Cache-Control', override: false, value: `max-age=${30 * 24 * 3600}` }
      ]
    }
  });

  const accessControl = new aws.cloudfront.OriginAccessControl('access-control', {
    description: 'camfeenstra.com access control',
    originAccessControlOriginType: 's3',
    signingBehavior: 'always',
    signingProtocol: 'sigv4'
  });

  const bucketPolicy = new aws.s3.BucketPolicy(`${dnsName}-policy`, {
    bucket: siteBucket.bucket,
    policy: siteBucket.arn.apply((arn) =>
      JSON.stringify({
        Version: '2012-10-17',
        Statement: {
          Sid: 'AllowCloudfrontServicePrincipalReadOnly',
          Effect: 'Allow',
          Principal: {
            Service: 'cloudfront.amazonaws.com'
          },
          Action: ['s3:GetObject', 's3:ListBucket'],
          Resource: [arn, `${arn}/*`]
        }
      })
    ),
  });

  function staticCacheBehaviorForPattern(pattern: string) {
    return {
      pathPattern: pattern,
      targetOriginId: siteBucket.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      compress: true,
      cachePolicyId: cachePolicy.id,
      lambdaFunctionAssociations: [
        {
          eventType: 'origin-request',
          lambdaArn: cdnRequestEdgeFunction.qualifiedArn,
          includeBody: false,
        }
      ],
      responseHeadersPolicyId: cacheStaticResourcesPolicy.id,
    };
  }

  const cloudfrontDistribution = new aws.cloudfront.Distribution('distribution', {
    enabled: true,
    isIpv6Enabled: false,
    aliases: [fullDnsName, dnsName],
    origins: [
      {
        originId: siteBucket.arn,
        domainName: siteBucket.bucketRegionalDomainName,
        originAccessControlId: accessControl.id
      }
    ],
    comment: '',
    defaultRootObject: 'index.html',
    defaultCacheBehavior: {
      targetOriginId: siteBucket.arn,
      viewerProtocolPolicy: 'redirect-to-https',
      allowedMethods: ['GET', 'HEAD', 'OPTIONS'],
      cachedMethods: ['GET', 'HEAD', 'OPTIONS'],
      lambdaFunctionAssociations: [
        {
          eventType: 'origin-request',
          lambdaArn: cdnRequestEdgeFunction.qualifiedArn,
          includeBody: false,
        },
      ],
      compress: true,
      cachePolicyId: cachePolicy.id,
    },
    orderedCacheBehaviors: [
      '*.jpg',
      '*.png',
      '*.js',
      '*.css',
      '*.svg'
    ].map(staticCacheBehaviorForPattern),
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
  }, { deleteBeforeReplace: true });

  for (const domain of [dnsName, fullDnsName]) {
    new aws.route53.Record(domain, {
      name: domain,
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
  }

  return {
    cloudfrontDomain: cloudfrontDistribution.domainName,
    endpoint: `https://${fullDnsName}`
  };
}
