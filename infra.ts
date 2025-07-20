import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as saws from '@stackattack/aws';
import shared from 'shared-infra';

interface GithubRolePolicyArgs {
  bucketArn: pulumi.Input<string>;
  distributionArn: pulumi.Input<string>;
}

function githubRolePolicy({
  bucketArn,
  distributionArn,
}: GithubRolePolicyArgs) {
  return aws.iam.getPolicyDocumentOutput({
    statements: [
      {
        actions: [
          "iam",
          "s3",
          "acm",
          "route53",
          "cloudfront",
          "lambda",
        ].flatMap((service) => [
          `${service}:Get*`,
          `${service}:List*`,
          `${service}:Describe*`,
        ]),
        resources: ["*"],
      },
      {
        actions: [
          "lambda:TagResource",
          "s3:PutBucketTagging",
          "acm:AddTagsToCertificate",
        ],
        resources: ["*"],
      },
      {
        actions: ["s3:PutObject*", "s3:DeleteObject"],
        resources: [bucketArn, pulumi.interpolate`${bucketArn}/*`],
      },
      {
        actions: ["cloudfront:UpdateDistribution"],
        resources: [distributionArn],
      },
    ],
  });
}

export default () => {
  const ctx = saws.context();
  const config = new pulumi.Config();
  const dnsName = config.require('dns-name');
  const sharedStack = config.require('shared-stack');
  
  const sharedRef = saws.stackRef(sharedStack, shared);

  const fullDnsName = `www.${dnsName}`;

  const certificate = sharedRef.require('camFeenstraEastCertificate');

  const bucket = saws.bucket(ctx, {
    paths: ['./dist'],
  });

  const { distribution, url } = saws.staticSite(ctx, {
    bucket,
    domain: fullDnsName,
    redirectDomains: [dnsName],
    adapter: saws.astroAdapter(),
    certificate
  });

  const githubRole = saws.githubRole(ctx, {
    repo: 'cfeenstra67/website',
    openIdProvider: null,
    policy: githubRolePolicy({
      bucketArn: bucket.arn,
      distributionArn: distribution.arn
    }).json
  });


  return { url, githubRoleArn: githubRole.arn };
}
