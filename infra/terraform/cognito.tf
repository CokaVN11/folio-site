# Cognito User Pool for admin authentication
resource "aws_cognito_user_pool" "admin" {
  name = "${var.project_name}-admin-users-${var.environment}"

  username_attributes = ["email"]

  auto_verified_attributes = ["email"]

  user_pool_add_ons {
    advanced_security_mode = "OFF"
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_LINK"
    email_subject          = "Verify your email for ${var.project_name}"
    email_message          = "Please click the link below to verify your email address. {####}"
  }

  password_policy {
    minimum_length    = 8
    require_lowercase  = true
    require_uppercase  = true
    require_numbers    = true
    require_symbols    = true
    temporary_password_validity_days = 7
  }

  admin_create_user_config {
    allow_admin_create_user_only = true
  }

  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable            = true
  }

  tags = {
    Name = "${var.project_name}-admin-user-pool"
  }
}

# Cognito User Pool Client
resource "aws_cognito_user_pool_client" "admin" {
  name            = "${var.project_name}-admin-client-${var.environment}"
  user_pool_id    = aws_cognito_user_pool.admin.id
  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  access_token_validity  = 1
  id_token_validity      = 1
  refresh_token_validity = 30

  prevent_user_existence_errors = "ENABLED"

  enable_token_revocation = true
}

# Cognito User Pool Group for Admins
resource "aws_cognito_user_group" "admins" {
  name         = "admins"
  user_pool_id = aws_cognito_user_pool.admin.id
  description  = "Administrators with full access to content management"
  precedence   = 0
}

# Initial admin user (optional - you can create this manually)
resource "aws_cognito_user" "admin" {
  count = var.create_admin_user && var.admin_email != "" ? 1 : 0

  user_pool_id = aws_cognito_user_pool.admin.id
  username     = var.admin_email
  attributes = {
    email = var.admin_email
  }

  # User will need to set their password on first login
  message_action = "SUPPRESS" # Don't send welcome email, will handle manually

  temporary_password = "TempPassword123!" # Change immediately on first login

  enabled = true
}

# Add admin user to admins group
resource "aws_cognito_user_in_group" "admin" {
  count = var.create_admin_user && var.admin_email != "" ? 1 : 0

  user_pool_id = aws_cognito_user_pool.admin.id
  group_name   = aws_cognito_user_group.admins.name
  username     = aws_cognito_user.admin[0].username
}