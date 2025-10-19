# Portfolio Website

## 🌐 Live Portfolio

**🔗 [https://portfolio.coka.id.vn](https://portfolio.coka.id.vn)**

This portfolio is deployed and accessible at the domain above. The site demonstrates a complete serverless architecture with CI/CD automation.

## 🚀 Features

- **Modern Frontend**: Next.js 15 with React, TypeScript, and Tailwind CSS
- **Serverless Backend**: AWS Lambda + API Gateway for contact form processing
- **Infrastructure as Code**: Terraform configuration for AWS resources
- **Monorepo Architecture**: pnpm workspaces for organized code management
- **CI/CD Pipeline**: Automated deployment with GitHub Actions and OIDC authentication
- **Responsive Design**: Mobile-friendly with dark mode support
- **SEO Optimized**: Meta tags, sitemap, and semantic HTML

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
│       └── lambda/    # AWS Lambda for contact form
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
├── package.json             # Root workspace configuration
└── pnpm-workspace.yaml      # pnpm workspace definition

```
