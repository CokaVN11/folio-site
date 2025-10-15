terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.100.0"
    }
  }

  # Remote state management
  backend "s3" {
    bucket         = "folio-terraform-state-ap-southeast-1"
    key            = "folio-site/terraform.tfstate"
    region         = "ap-southeast-1"
    use_lockfile   = true
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
