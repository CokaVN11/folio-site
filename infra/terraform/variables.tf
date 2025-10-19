variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "ap-southeast-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "folio"
}

variable "environment" {
  description = "Environment name (e.g., dev, staging, production)"
  type        = string
  default     = "production"
}

variable "domain_name" {
  description = "Custom domain name for the site (optional)"
  type        = string
  default     = ""
}

variable "site_origin" {
  description = "Origin URL for CORS settings (defaults to CloudFront distribution)"
  type        = string
  default     = ""
}

variable "lambda_zip_path" {
  description = "Path to Lambda deployment package"
  type        = string
  default     = "../../apps/services/lambda/handler.zip"
}

variable "certificate_arn" {
  description = "ACM certificate ARN for custom domain (us-east-1 region required)"
  type        = string
  default     = "arn:aws:acm:us-east-1:066604590083:certificate/49ecc09e-72ae-48fb-9b58-2f15aae52b07"
}

variable "notification_email" {
  description = "Email address to receive contact form notifications"
  type        = string
  default     = ""
}

variable "from_email" {
  description = "Email address to send notifications from (must be verified in SES)"
  type        = string
  default     = ""
}

