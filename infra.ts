import * as pulumi from '@pulumi/pulumi';
import * as saws from '@stackattack/aws';
import shared from 'shared-infra';

export default () => {
  const ctx = saws.context();
  const config = new pulumi.Config();
  const dnsName = config.require('dns-name');
  const sharedStack = config.require('shared-stack');
  
  const sharedRef = saws.stackRef(sharedStack, shared);

  const fullDnsName = `www.${dnsName}`;

  const certificate = sharedRef.require('camFeenstraEastCertificate');

  const bucket = saws.bucket(ctx);

  saws.bucketFiles(ctx, {
    bucket,
    paths: ['./dist'],
  });

  saws.staticSite(ctx, {
    bucket,
    domain: fullDnsName,
    redirectDomains: [dnsName],
    adapter: saws.astroAdapter(),
    certificate
  });

  return { url: `https://${fullDnsName}` };
}
