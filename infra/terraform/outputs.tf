output "site_bucket_name" {
  description = "Name of the S3 bucket hosting the static site and content"
  value       = aws_s3_bucket.site.id
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_url" {
  description = "URL of the site"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "api_gateway_url" {
  description = "URL of the API Gateway endpoint"
  value       = aws_apigatewayv2_stage.api.invoke_url
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table for contact messages"
  value       = aws_dynamodb_table.contact_messages.name
}

output "lambda_function_name" {
  description = "Name of the Lambda function"
  value       = aws_lambda_function.contact.function_name
}

output "cognito_user_pool_id" {
  description = "ID of the Cognito User Pool for admin authentication"
  value       = aws_cognito_user_pool.admin.id
}

output "cognito_user_pool_client_id" {
  description = "ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.admin.id
}

output "cognito_user_pool_endpoint" {
  description = "Endpoint of the Cognito User Pool"
  value       = aws_cognito_user_pool.admin.endpoint
}

output "admin_user_created" {
  description = "Whether initial admin user was created"
  value       = var.create_admin_user && var.admin_email != ""
}