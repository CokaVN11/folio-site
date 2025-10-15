# GitHub Actions OIDC Setup for AWS

This document explains how to configure GitHub Actions to authenticate with AWS using OIDC (OpenID Connect) instead of long-lived credentials.

## Prerequisites

- AWS account with appropriate permissions
- GitHub repository

## Step 1: Create OIDC Identity Provider in AWS

1. Go to AWS IAM Console → Identity Providers
2. Click "Add provider"
3. Select "OpenID Connect"
4. Enter the following:
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
5. Click "Add provider"

## Step 2: Create IAM Role for GitHub Actions

1. Go to IAM → Roles → Create role
2. Select "Web identity"
3. Choose the OIDC provider created above
4. For Audience, select `sts.amazonaws.com`
5. Click "Next"

## Step 3: Attach Policies

Attach the following policies to the role:

### Required Permissions

Create a custom policy with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:*",
        "lambda:*",
        "apigateway:*",
        "dynamodb:*",
        "cloudfront:*",
        "iam:*",
        "logs:*",
        "cloudwatch:*"
      ],
      "Resource": "*"
    }
  ]
}
```

**Note**: For production, follow the principle of least privilege and scope down permissions.

## Step 4: Configure Trust Relationship

Edit the trust relationship of the role to include your GitHub repository:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

Replace:

- `YOUR_ACCOUNT_ID` with your AWS account ID
- `YOUR_GITHUB_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

## Step 5: Add Secret to GitHub

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add the following secret:
   - **Name**: `AWS_ROLE_ARN`
   - **Value**: `arn:aws:iam::YOUR_ACCOUNT_ID:role/YOUR_ROLE_NAME`

## Step 6: Test the Setup

Push a commit to the main branch and verify that the deployment workflow runs successfully.

## Troubleshooting

### "Not authorized to perform sts:AssumeRoleWithWebIdentity"

- Verify the trust relationship includes your repository
- Check that the condition matches your branch

### "Access Denied" during Terraform operations

- Ensure the IAM role has sufficient permissions
- Check resource-level policies

## Security Best Practices

1. **Principle of Least Privilege**: Grant only the permissions needed
2. **Branch Restrictions**: Limit OIDC authentication to specific branches (e.g., `main`)
3. **Audit Logs**: Enable CloudTrail to monitor API calls
4. **Regular Reviews**: Periodically review and update IAM policies

## References

- [GitHub Actions OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [AWS IAM OIDC Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
