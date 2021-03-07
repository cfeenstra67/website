"""An AWS Python Pulumi program"""

import json
import mimetypes
import os

import pulumi
import pulumi_aws as aws

from infra.utils import get_all_subpaths, filebase64sha256


def main():

    config = pulumi.Config()

    dns_name = config.require('dns-name')

    aws_region = aws.get_region()

    full_dns_name = f"www.{dns_name}"

    gmail_verification_code = config.require('gmail-verification-code')

    east_provider = aws.Provider(
        "east",
        profile=aws.config.profile,
        region="us-east-1"
    )

    zone = aws.route53.Zone(
        "zone",
        name=dns_name,
        tags={
            'source': 'pulumi',
            'project': 'website'
        }
    )

    certificate = aws.acm.Certificate(
        "certificate",
        domain_name=full_dns_name,
        validation_method="DNS",
        opts=pulumi.ResourceOptions(provider=east_provider)
    )

    certificate_validation_domain = aws.route53.Record(
        f"{full_dns_name}-validation",
        name=certificate.domain_validation_options[0].resource_record_name,
        zone_id=zone.zone_id,
        type=certificate.domain_validation_options[0].resource_record_type,
        records=[certificate.domain_validation_options[0].resource_record_value],
        ttl=600
    )

    certificate_validation = aws.acm.CertificateValidation(
        "certificate_validation",
        certificate_arn=certificate.arn,
        validation_record_fqdns=[certificate_validation_domain.fqdn],
        opts=pulumi.ResourceOptions(provider=east_provider)
    )

    certificate_arn = certificate_validation.certificate_arn

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
        dns_name + "-site-bucket",
        bucket=dns_name,
        acl="public-read",
        website={
            'error_document': '404.html',
            'index_document': 'index.html'
        }
    )

    logs_bucket = aws.s3.Bucket(
        dns_name + "-logs",
        acl="private",
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

    cdn_lambda_execution_role = aws.iam.Role(
        "cdn_lambda_exec",
        assume_role_policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Action": "sts:AssumeRole",
                "Effect": "Allow",
                "Principal": {
                    "Service": [
                        "lambda.amazonaws.com",
                        "edgelambda.amazonaws.com"
                    ]
                },
            }]
        })
    )

    cdn_lambda_execution_role_policy = aws.iam.RolePolicy(
        "cdn_lambda_exec_policy",
        role=cdn_lambda_execution_role.id,
        policy=json.dumps({
            "Version": "2012-10-17",
            "Statement": [{
                "Effect": "Allow",
                "Resource": "*",
                "Action": [
                    "logs:CreateLogStream",
                    "logs:PutLogEvents",
                    "logs:CreateLogGroup"
                ]
            }]
        })
    )

    cdn_edge_function = aws.lambda_.Function(
        "edge_lambda_func",
        role=cdn_lambda_execution_role.arn,
        code=pulumi.FileArchive("build/lambda.zip"),
        source_code_hash=filebase64sha256("build/lambda.zip"),
        handler="lambda_handler.handle",
        runtime="python3.8",
        publish=True,
        opts=pulumi.ResourceOptions(provider=east_provider)
    )

    cloudfront_distribution = aws.cloudfront.Distribution(
        "distribution",
        enabled=True,
        is_ipv6_enabled=False,
        aliases=[full_dns_name],
        origins=[
            aws.cloudfront.DistributionOriginArgs(
                origin_id=site_bucket.arn,
                domain_name=site_bucket.website_endpoint,
                custom_origin_config={
                    "origin_protocol_policy": "http-only",
                    "http_port": 80,
                    "https_port": 443,
                    "origin_ssl_protocols": ["TLSv1.2"]
                }
            )
        ],
        comment="",
        default_root_object="index.html",
        default_cache_behavior=aws.cloudfront.DistributionDefaultCacheBehaviorArgs(
            target_origin_id=site_bucket.arn,
            viewer_protocol_policy="redirect-to-https",
            allowed_methods=["GET", "HEAD", "OPTIONS"],
            cached_methods=["GET", "HEAD", "OPTIONS"],
            forwarded_values={
                "cookies": {"forward": "none"},
                "query_string": False
            },
            lambda_function_associations=[
                {
                    "event_type": "origin-request",
                    "lambda_arn": cdn_edge_function.qualified_arn,
                    "include_body": False
                }
            ],
            min_ttl=0,
            default_ttl=600,
            max_ttl=600
        ),
        price_class="PriceClass_100",
        custom_error_responses=[
            {
                "error_code": 404,
                "response_code": 404,
                "response_page_path": "/404.html"
            }
        ],
        restrictions={
            "geo_restriction": {"restriction_type": "none"}
        },
        viewer_certificate={
            "acm_certificate_arn": certificate_arn,
            "ssl_support_method": "sni-only"
        },
        logging_config={
            "bucket": logs_bucket.bucket_domain_name,
            "include_cookies": False,
            "prefix": f"{full_dns_name}/"
        }
    )

    website_record = aws.route53.Record(
        full_dns_name,
        name="www",
        zone_id=zone.zone_id,
        type="A",
        aliases=[
            {
                'name': cloudfront_distribution.domain_name,
                'zone_id': cloudfront_distribution.hosted_zone_id,
                'evaluate_target_health': True
            }
        ]
    )

    pulumi.export("website_endpoint", site_bucket.website_endpoint)
    pulumi.export("cloudfront_domain", cloudfront_distribution.domain_name)
    pulumi.export("endpoint", f"https://{full_dns_name}")
