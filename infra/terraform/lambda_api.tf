# IAM role for Lambda
resource "aws_iam_role" "lambda" {
  name = "${var.project_name}-lambda-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# Attach basic Lambda execution policy
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Policy for DynamoDB access
resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "${var.project_name}-lambda-dynamodb-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem"
        ]
        Resource = [
          aws_dynamodb_table.contact_messages.arn,
          "${aws_dynamodb_table.contact_messages.arn}/index/*"
        ]
      }
    ]
  })
}

# Policy for S3 access
resource "aws_iam_role_policy" "lambda_s3" {
  name = "${var.project_name}-lambda-s3-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.site.arn,
          "${aws_s3_bucket.site.arn}/*"
        ]
      }
    ]
  })
}

# Policy for Cognito access
resource "aws_iam_role_policy" "lambda_cognito" {
  name = "${var.project_name}-lambda-cognito-policy"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "cognito-idp:ListUsers",
          "cognito-idp:AdminGetUser",
          "cognito-idp:ListGroupsForUser"
        ]
        Resource = "*" # You may want to restrict this to specific user pool ARN
      }
    ]
  })
}

# Lambda function
resource "aws_lambda_function" "contact" {
  function_name = "${var.project_name}-api-${var.environment}"
  role          = aws_iam_role.lambda.arn
  handler       = "handler.handler"
  runtime       = "nodejs20.x"
  timeout       = 30
  memory_size   = 256

  # Use local file if available, otherwise use S3
  filename         = fileexists(var.lambda_zip_path) ? var.lambda_zip_path : null
  source_code_hash = fileexists(var.lambda_zip_path) ? filebase64sha256(var.lambda_zip_path) : null

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.contact_messages.name
      CONTENT_BUCKET = aws_s3_bucket.site.id
      SITE_BUCKET = aws_s3_bucket.site.id
      ALLOWED_ORIGIN = var.site_origin != "" ? var.site_origin : "*"
      COGNITO_USER_POOL_ID = aws_cognito_user_pool.admin.id
      COGNITO_CLIENT_ID = aws_cognito_user_pool_client.admin.id
    }
  }

  logging_config {
    log_format = "JSON"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_dynamodb,
    aws_iam_role_policy.lambda_s3,
    aws_iam_role_policy.lambda_cognito
  ]
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.contact.function_name}"
  retention_in_days = 14
}