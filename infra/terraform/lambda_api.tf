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
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.contact_messages.arn,
          "${aws_dynamodb_table.contact_messages.arn}/index/*"
        ]
      }
    ]
  })
}

# Lambda function
resource "aws_lambda_function" "contact" {
  function_name = "${var.project_name}-contact-${var.environment}"
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
    }
  }

  logging_config {
    log_format = "JSON"
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.lambda_dynamodb
  ]
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.contact.function_name}"
  retention_in_days = 14
}
