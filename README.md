# Portfolio Website

A modern, full-stack portfolio website with serverless architecture, showcasing professional projects and providing a contact form with AWS backend integration.

## 🚀 Features

- **Modern Frontend**: Next.js 15 with React, TypeScript, and Tailwind CSS
- **Serverless Backend**: AWS Lambda + API Gateway for contact form processing
- **Infrastructure as Code**: Complete Terraform configuration for AWS resources
- **Monorepo Architecture**: pnpm workspaces for organized code management
- **CI/CD Pipeline**: Automated deployment with GitHub Actions and OIDC authentication
- **Responsive Design**: Mobile-friendly with dark mode support
- **SEO Optimized**: Meta tags, sitemap, and semantic HTML

## 📋 Prerequisites

- Node.js 20+
- pnpm 8+
- AWS Account
- Terraform 1.5+
- GitHub repository (for CI/CD)

## 🏗️ Project Structure

```
folio-site/
├── apps/
│   ├── web/                    # Next.js frontend application
│   │   ├── src/
│   │   │   ├── app/           # Next.js app directory
│   │   │   ├── components/    # React components
│   │   │   └── styles/        # Global styles
│   │   └── package.json
│   └── services/
│       └── contact-lambda/    # AWS Lambda for contact form
│           ├── src/
│           │   ├── handler.ts # Lambda entry point
│           │   ├── dto.ts     # Data schemas
│           │   ├── cors.ts    # CORS utilities
│           │   └── ddb.ts     # DynamoDB client
│           └── package.json
├── infra/
│   └── terraform/             # Infrastructure as Code
│       ├── main.tf           # Provider configuration
│       ├── s3_site.tf        # S3 bucket for static hosting
│       ├── lambda_api.tf     # Lambda function
│       ├── api_gateway.tf    # API Gateway HTTP API
│       ├── dynamodb.tf       # DynamoDB table
│       └── cloudfront.tf     # CloudFront distribution (optional)
├── .github/
│   └── workflows/            # CI/CD pipelines
│       ├── ci.yml           # Build and test
│       └── deploy.yml       # Deployment workflow
├── openspec/                 # OpenSpec specifications
├── package.json             # Root workspace configuration
└── pnpm-workspace.yaml      # pnpm workspace definition

```

## 🛠️ Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/folio-site.git
cd folio-site

# Install dependencies
pnpm install
```

### 2. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
# NEXT_PUBLIC_API_URL will be set after infrastructure deployment
```

### 3. Deploy Infrastructure

```bash
# Navigate to Terraform directory
cd infra/terraform

# Copy and configure terraform.tfvars
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your AWS settings

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply

# Note the API Gateway URL from outputs
terraform output api_gateway_url
```

### 4. Update Frontend Configuration

```bash
# Update .env with the API Gateway URL
echo "NEXT_PUBLIC_API_URL=<your-api-gateway-url>" >> .env
```

### 5. Local Development

```bash
# Start the development server
pnpm dev

# Or run specific workspace
pnpm --filter web dev
```

## 📦 Building

### Build All Workspaces

```bash
pnpm build:all
```

### Build Individual Workspaces

```bash
# Build web application
pnpm --filter web build

# Build Lambda function
pnpm --filter contact-lambda build
```

## 🚀 Deployment

### Automated Deployment (Recommended)

The project uses GitHub Actions for automated deployment:

1. **Setup AWS OIDC** (one-time setup)
   - Follow `.github/OIDC_SETUP.md`
   - Add `AWS_ROLE_ARN` to GitHub repository secrets

2. **Deploy via Git**
   ```bash
   git push origin main
   ```

   - CI workflow runs on pull requests
   - Deploy workflow runs on main branch pushes

### Manual Deployment

```bash
# Build Lambda
pnpm --filter contact-lambda build

# Package Lambda
cd apps/services/contact-lambda/dist
zip -r ../handler.zip .
cd ../../../..

# Apply Terraform with Lambda package
cd infra/terraform
terraform apply -var="lambda_zip_path=../../apps/services/contact-lambda/handler.zip"

# Build and deploy web
cd ../..
NEXT_PUBLIC_API_URL=$(cd infra/terraform && terraform output -raw api_gateway_url)
pnpm --filter web build

# Sync to S3
BUCKET_NAME=$(cd infra/terraform && terraform output -raw site_bucket_name)
aws s3 sync apps/web/out/ s3://$BUCKET_NAME/ --delete
```

## 🧪 Testing

```bash
# Type checking
pnpm type-check

# Format code
pnpm fmt

# Format check (CI)
pnpm fmt:check

# Lint web application
pnpm --filter web lint
```

## 🔧 Available Scripts

| Command             | Description                  |
| ------------------- | ---------------------------- |
| `pnpm dev`          | Start web development server |
| `pnpm build:web`    | Build web application        |
| `pnpm build:lambda` | Build Lambda function        |
| `pnpm build:all`    | Build all workspaces         |
| `pnpm fmt`          | Format all code              |
| `pnpm fmt:check`    | Check code formatting        |
| `pnpm type-check`   | Run TypeScript type checking |
| `pnpm clean`        | Clean build artifacts        |

## 🌐 Architecture

### Frontend (Next.js)

- Static site generation with Next.js 15
- Deployed to S3 with optional CloudFront CDN
- Environment-based API configuration

### Backend (Serverless)

- AWS Lambda (Node.js 20) for contact form processing
- API Gateway HTTP API for REST endpoints
- DynamoDB for message persistence
- Zod for request validation

### Infrastructure

- All resources defined in Terraform
- Separate staging/production via workspaces
- OIDC-based GitHub Actions authentication
- CloudWatch logging for observability

## 📝 Environment Variables

### Frontend (`apps/web`)

- `NEXT_PUBLIC_API_URL` - API Gateway endpoint URL

### Lambda (`apps/services/contact-lambda`)

- `TABLE_NAME` - DynamoDB table name (set by Terraform)
- `AWS_REGION` - AWS region (set by Terraform)

### Terraform (`infra/terraform`)

- `aws_region` - AWS region for deployment
- `project_name` - Project name for resource naming
- `environment` - Environment (dev/staging/production)
- `domain_name` - Custom domain (optional, for CloudFront)

## 🔒 Security

- No long-lived AWS credentials in code
- OIDC authentication for GitHub Actions
- Least-privilege IAM roles
- CORS configured for API Gateway
- Input validation with Zod schemas
- CloudWatch logging for audit trails

## 🐛 Troubleshooting

### Build Failures

```bash
# Clean all build artifacts
pnpm clean

# Reinstall dependencies
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Terraform State Issues

```bash
cd infra/terraform
terraform refresh
terraform plan
```

### Lambda Not Updating

```bash
# Rebuild and repackage
pnpm --filter contact-lambda build
cd apps/services/contact-lambda/dist
zip -r ../handler.zip .
cd ../../..

# Force update
cd infra/terraform
terraform taint aws_lambda_function.contact
terraform apply
```

## 📚 Additional Documentation

- [OpenSpec Workflow](./openspec/AGENTS.md) - Specification-driven development
- [OIDC Setup Guide](./.github/OIDC_SETUP.md) - AWS authentication for CI/CD
- [Project Context](./openspec/project.md) - Architecture and conventions

## 🤝 Contributing

1. Create a feature branch
2. Make changes following project conventions
3. Ensure tests pass and code is formatted
4. Submit pull request

## 📄 License

MIT

## 🙋 Support

For issues or questions:

- Check existing documentation
- Review CloudWatch logs for runtime errors
- Open a GitHub issue with details and logs
