# S3 bucket for static site and content storage
resource "aws_s3_bucket" "site" {
  bucket = "${var.project_name}-site-${var.environment}"
}

# S3 static website configuration
resource "aws_s3_bucket_website_configuration" "site" {
  bucket = aws_s3_bucket.site.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

# Partially relaxed bucket access for website hosting (still secure for management)
resource "aws_s3_bucket_public_access_block" "site" {
  bucket = aws_s3_bucket.site.id

  # Block public ACLs and policies to maintain control
  block_public_acls       = true
  block_public_policy     = false # Allow public policy for website hosting
  ignore_public_acls      = true
  restrict_public_buckets = false # Allow public bucket access for website
}

# S3 bucket versioning for the site prefix
resource "aws_s3_bucket_versioning" "site" {
  bucket = aws_s3_bucket.site.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Bucket policy for dual access: CloudFront OAC (backup) + Public Website (primary)
resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontOACAccess"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.site.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.site.arn
          }
        }
      },
      {
        Sid       = "AllowPublicWebsiteAccess"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.site.arn}/*"
      }
    ]
  })

  depends_on = [
    aws_s3_bucket_public_access_block.site,
    aws_cloudfront_distribution.site,
    aws_s3_bucket_website_configuration.site
  ]
}