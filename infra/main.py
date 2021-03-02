"""An AWS Python Pulumi program"""

import mimetypes
import os

import pulumi
import pulumi_aws as aws

from infra.utils import get_all_subpaths


def main():

    config = pulumi.Config()

    dns_name = config.require('dns-name')

    full_dns_name = f"www.{dns_name}"

    gmail_verification_code = config.require('gmail-verification-code')

    zone = aws.route53.Zone(
        "zone",
        name=dns_name,
        tags={
            'source': 'pulumi',
            'project': 'website'
        }
    )

    email_record = aws.route53.Record(
        "email_record",
        name=dns_name,
        zone_id=zone.zone_id,
        type="MX",
        ttl=300,
        records=[
            "1 ASPMX.L.GOOGLE.COM.",
            "5 ALT1.ASPMX.L.GOOGLE.COM.",
            "5 ALT2.ASPMX.L.GOOGLE.COM.",
            "10 ALT3.ASPMX.L.GOOGLE.COM.",
            "10 ALT4.ASPMX.L.GOOGLE.COM.",
            f"15 {gmail_verification_code}"
        ]
    )

    site_dir = "out"

    site_bucket = aws.s3.Bucket(
        full_dns_name + "-site-bucket",
        bucket=full_dns_name,
        acl="public-read",
        website={
            'error_document': '404.html',
            'index_document': 'index.html'
        }
    )

    for path in get_all_subpaths(site_dir):
        file_path = os.path.join(site_dir, path)
        path_object = aws.s3.BucketObject(
            path,
            bucket=site_bucket,
            source=pulumi.FileAsset(file_path),
            acl="public-read",
            content_type=mimetypes.guess_type(file_path)[0]
        )

    website_record = aws.route53.Record(
        "website_record",
        name=full_dns_name,
        zone_id=zone.zone_id,
        type="A",
        aliases=[
            {
                'name': site_bucket.website_endpoint,
                'zone_id': site_bucket.hosted_zone_id,
                'evaluate_target_health': True
            }
        ]
    )

    pulumi.export("website_endpoint", site_bucket.website_endpoint)
