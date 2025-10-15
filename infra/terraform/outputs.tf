output "site_bucket_name" {
  description = "Name of the S3 bucket hosting the static site"
  value       = aws_s3_bucket.site.id
}

output "site_bucket_website_endpoint" {
  description = "Website endpoint for the S3 bucket"
  value       = aws_s3_bucket_website_configuration.site.website_endpoint
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

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID (if enabled)"
  value       = var.domain_name != "" ? aws_cloudfront_distribution.site[0].id : null
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name (if enabled)"
  value       = var.domain_name != "" ? aws_cloudfront_distribution.site[0].domain_name : null
}
