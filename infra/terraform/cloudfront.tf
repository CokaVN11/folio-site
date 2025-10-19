# CloudFront Origin Access Control for S3
resource "aws_cloudfront_origin_access_control" "s3" {
  name                              = "${var.project_name}-s3-oac-${var.environment}"
  description                       = "Origin Access Control for S3 bucket"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = var.domain_name != "" ? [var.domain_name] : []

  # Primary origin: S3 static website endpoint
  origin {
    domain_name = aws_s3_bucket_website_configuration.site.website_endpoint
    origin_id   = "S3-Website-${aws_s3_bucket.site.id}"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # Backup origin: S3 with OAC (current setup)
  origin {
    domain_name = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id   = "S3-OAC-${aws_s3_bucket.site.id}"

    origin_access_control_id = aws_cloudfront_origin_access_control.s3.id
  }

  # Default cache behavior for site content - Primary S3 Website Origin
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-Website-${aws_s3_bucket.site.id}"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 300  # 5 minutes - short TTL for HTML/JSON
    max_ttl                = 3600 # 1 hour
    compress               = true

    # Add URL canonicalization function at viewer request
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_canonicalization.arn
    }

    # Add compression headers at viewer response
    function_association {
      event_type   = "viewer-response"
      function_arn = aws_cloudfront_function.compression_headers.arn
    }
  }

  # Cache behavior for content assets - Primary S3 Website Origin
  ordered_cache_behavior {
    path_pattern           = "/content/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-Website-${aws_s3_bucket.site.id}"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 86400    # 1 day - long TTL for immutable assets
    default_ttl            = 604800   # 7 days
    max_ttl                = 31536000 # 1 year
    compress               = true
  }

  # Fallback cache behavior for API/Lambda - Backup OAC Origin (for future use)
  ordered_cache_behavior {
    path_pattern           = "/api/*"
    allowed_methods        = ["HEAD", "DELETE", "POST", "GET", "OPTIONS", "PUT", "PATCH"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-OAC-${aws_s3_bucket.site.id}"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # Managed-CachingOptimized
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 0   # No caching for API
    max_ttl                = 0
    compress               = true
  }

  # Custom error responses for SPA routing (S3 website handles this, but keep as backup)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.domain_name != "" ? var.certificate_arn : null
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
    cloudfront_default_certificate = var.domain_name == ""
  }

  tags = {
    Name = "${var.project_name}-cloudfront"
  }
}

# CloudFront Function for URL canonicalization
resource "aws_cloudfront_function" "url_canonicalization" {
  name    = "${var.project_name}-url-canonicalization-${var.environment}"
  runtime = "cloudfront-js-1.0"
  code    = <<-EOT
    function handler(event) {
        var request = event.request;
        var headers = request.headers;
        var host = headers.host ? headers.host.value : '';
        var uri = request.uri;

        // Redirect www to non-www (example.com preference)
        if (host.startsWith('www.')) {
            var newHost = host.substring(4); // Remove 'www.'
            var redirectUrl = 'https://' + newHost + uri;

            return {
                statusCode: 301,
                statusDescription: 'Moved Permanently',
                headers: {
                    'location': {
                        value: redirectUrl
                    },
                    'cache-control': {
                        value: 'public, max-age=3600'
                    }
                }
            };
        }

        return request;
    }
  EOT

  publish = true
}

# CloudFront Function for compression headers
resource "aws_cloudfront_function" "compression_headers" {
  name    = "${var.project_name}-compression-headers-${var.environment}"
  runtime = "cloudfront-js-1.0"
  code    = <<-EOT
    function handler(event) {
        var response = event.response;
        var headers = response.headers;

        // Add compression headers to indicate supported compression
        headers['vary'] = {
            value: 'Accept-Encoding'
        };

        // Add cache-control header for better compression caching
        if (event.request.uri.match(/\.(html|css|js|json|xml|txt|svg|webmanifest)$/)) {
            headers['cache-control'] = {
                value: 'public, max-age=0, must-revalidate'
            };
        }

        // Add debugging header
        headers['x-compression-enabled'] = {
            value: 'true'
        };

        return response;
    }
  EOT

  publish = true
}
