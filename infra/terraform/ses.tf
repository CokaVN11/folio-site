# SES Configuration for Email Notifications

# Variables for email configuration
variable "notification_email" {
  description = "Email address to receive contact form notifications"
  type        = string
  default     = ""
}

variable "from_email" {
  description = "Email address to send notifications from (must be verified in SES)"
  type        = string
  default     = ""
}

# Verify email identity for sending emails
resource "aws_ses_email_identity" "from_email" {
  count = var.from_email != "" ? 1 : 0
  email = var.from_email
}

# Verify email identity for receiving notifications
resource "aws_ses_email_identity" "notification_email" {
  count = var.notification_email != "" ? 1 : 0
  email = var.notification_email
}

# SES configuration set for better deliverability
resource "aws_ses_configuration_set" "contact_notifications" {
  name = "${var.project_name}-contact-notifications-${var.environment}"

  delivery_options {
    tls_policy = "Require"
  }

  sending_options {
    sending_mode = "High"
  }
}

# CloudWatch metrics for SES
resource "aws_cloudwatch_metric_alarm" "ses_bounce_rate" {
  count = var.from_email != "" ? 1 : 0

  alarm_name          = "${var.project_name}-ses-high-bounce-rate-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Bounce"
  namespace           = "AWS/SES"
  period              = "86400"  # 24 hours
  statistic           = "Sum"
  threshold           = "5"
  alarm_description   = "High bounce rate detected for contact form emails"
  treat_missing_data  = "notBreaching"

  dimensions = {
    ConfigurationSetName = aws_ses_configuration_set.contact_notifications.name
  }
}

# SNS topic for bounce/complaint notifications (optional)
resource "aws_sns_topic" "ses_notifications" {
  count = var.from_email != "" ? 1 : 0
  name = "${var.project_name}-ses-notifications-${var.environment}"
}

# CloudWatch alarm for SES complaints
resource "aws_cloudwatch_metric_alarm" "ses_complaint_rate" {
  count = var.from_email != "" ? 1 : 0

  alarm_name          = "${var.project_name}-ses-complaints-${var.environment}"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "Complaint"
  namespace           = "AWS/SES"
  period              = "86400"  # 24 hours
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Complaint received for contact form emails"
  treat_missing_data  = "notBreaching"

  alarm_actions = aws_sns_topic.ses_notifications[*].id

  dimensions = {
    ConfigurationSetName = aws_ses_configuration_set.contact_notifications.name
  }
}