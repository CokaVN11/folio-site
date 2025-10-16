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
  default     = "../../apps/services/contact-lambda/handler.zip"
}

variable "admin_email" {
  description = "Email address for initial admin user"
  type        = string
  default     = ""
}

variable "create_admin_user" {
  description = "Whether to create initial admin user"
  type        = bool
  default     = false
}