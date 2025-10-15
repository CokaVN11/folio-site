# Environment Variables Documentation

This document describes all environment variables used across the monorepo.

## Frontend (apps/web)

### NEXT_PUBLIC_API_URL

- **Type**: String (URL)
- **Required**: Yes
- **Description**: API Gateway endpoint URL for the contact form backend
- **Example**: `https://abc123.execute-api.us-east-1.amazonaws.com`
- **Usage**: Used by the contact form to submit messages
- **Set by**: Terraform output after infrastructure deployment
- **Location**: `.env.local` or build-time environment

### Getting the value

After deploying infrastructure:

```bash
cd infra/terraform
terraform output -raw api_gateway_url
```

## Backend (apps/services/contact-lambda)

### TABLE_NAME

- **Type**: String
- **Required**: Yes
- **Description**: DynamoDB table name for storing contact messages
- **Example**: `folio-site-contact-messages-production`
- **Set by**: Terraform (automatically via Lambda environment configuration)
- **Usage**: DynamoDB client uses this to write contact form submissions

### AWS_REGION

- **Type**: String
- **Required**: Yes (defaults to Lambda region)
- **Description**: AWS region for DynamoDB and other services
- **Example**: `us-east-1`
- **Set by**: Terraform (automatically via Lambda environment configuration)
- **Usage**: AWS SDK client configuration

## Infrastructure (infra/terraform)

### TF_VAR_aws_region

- **Type**: String
- **Required**: No (defaults to us-east-1)
- **Description**: AWS region for all resources
- **Example**: `us-east-1`
- **Set in**: `terraform.tfvars` or as environment variable

### TF_VAR_project_name

- **Type**: String
- **Required**: No (defaults to folio-site)
- **Description**: Project name used for resource naming
- **Example**: `folio-site`
- **Set in**: `terraform.tfvars`

### TF_VAR_environment

- **Type**: String
- **Required**: No (defaults to production)
- **Description**: Environment name (dev, staging, production)
- **Example**: `production`
- **Set in**: `terraform.tfvars`

### TF_VAR_domain_name

- **Type**: String
- **Required**: No
- **Description**: Custom domain name for CloudFront (optional)
- **Example**: `portfolio.example.com`
- **Set in**: `terraform.tfvars`
- **Note**: Leave empty to skip CloudFront creation

### TF_VAR_lambda_zip_path

- **Type**: String (file path)
- **Required**: No (has default)
- **Description**: Path to Lambda deployment package
- **Example**: `../../apps/services/contact-lambda/handler.zip`
- **Set in**: `terraform.tfvars` or command line

## CI/CD (GitHub Actions)

### AWS_ROLE_ARN

- **Type**: String (ARN)
- **Required**: Yes
- **Description**: IAM role ARN for GitHub Actions OIDC authentication
- **Example**: `arn:aws:iam::123456789012:role/GitHubActionsRole`
- **Set in**: GitHub repository secrets
- **Usage**: Authenticate to AWS without long-lived credentials
- **Setup**: See `.github/OIDC_SETUP.md`

## Local Development Setup

1. **Copy template**:

   ```bash
   cp .env.example .env
   ```

2. **Deploy infrastructure** (if not done):

   ```bash
   cd infra/terraform
   terraform init
   terraform apply
   ```

3. **Get API Gateway URL**:

   ```bash
   terraform output -raw api_gateway_url
   ```

4. **Update .env**:

   ```bash
   echo "NEXT_PUBLIC_API_URL=<api-url-from-step-3>" > .env
   ```

5. **Start development**:
   ```bash
   pnpm dev
   ```

## Production Deployment

Environment variables are automatically set during CI/CD:

1. **Lambda environment**: Set by Terraform in `lambda_api.tf`
2. **Web build**: API URL injected during build step in `deploy.yml`
3. **AWS credentials**: OIDC authentication via `AWS_ROLE_ARN` secret

## Security Notes

- Never commit `.env` files to git
- Use `.env.example` for templates only
- Lambda environment variables are encrypted at rest
- Use AWS Secrets Manager for sensitive data (future enhancement)
- OIDC is preferred over long-lived IAM credentials

## Troubleshooting

### "API URL not configured" error

**Cause**: `NEXT_PUBLIC_API_URL` not set or incorrect

**Fix**:

```bash
# Check current value
echo $NEXT_PUBLIC_API_URL

# Set from Terraform
cd infra/terraform
export NEXT_PUBLIC_API_URL=$(terraform output -raw api_gateway_url)
```

### Lambda can't access DynamoDB

**Cause**: `TABLE_NAME` not set or IAM permissions missing

**Fix**:

1. Check Terraform applied successfully
2. Verify IAM role has DynamoDB permissions
3. Check Lambda environment in AWS Console

### GitHub Actions deployment fails

**Cause**: `AWS_ROLE_ARN` not set or trust policy incorrect

**Fix**:

1. Verify secret exists in GitHub repository settings
2. Follow `.github/OIDC_SETUP.md` to configure OIDC
3. Check IAM role trust relationship includes repository
