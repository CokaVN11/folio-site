import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import type { ContactMessage } from '../schemas/dto.js';

const sesClient = new SESClient({});

interface EmailConfig {
  fromEmail: string;
  notificationEmail: string;
  configurationSet?: string;
}

/**
 * Get email configuration from environment variables
 */
function getEmailConfig(): EmailConfig {
  const fromEmail = process.env.FROM_EMAIL;
  const notificationEmail = process.env.NOTIFICATION_EMAIL;
  const configurationSet = process.env.SES_CONFIGURATION_SET;

  if (!fromEmail || !notificationEmail) {
    throw new Error('Email configuration missing: FROM_EMAIL and NOTIFICATION_EMAIL environment variables are required');
  }

  return {
    fromEmail,
    notificationEmail,
    configurationSet,
  };
}

/**
 * Generate HTML email template for contact form notification
 */
function generateEmailTemplate(message: ContactMessage): string {
  const formatDate = new Date(message.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Message</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            color: #2c3e50;
            font-size: 24px;
        }
        .message-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 25px;
        }
        .detail-row {
            margin-bottom: 15px;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
            margin-bottom: 5px;
        }
        .detail-value {
            color: #212529;
        }
        .message-content {
            background-color: #ffffff;
            border: 1px solid #dee2e6;
            padding: 20px;
            border-radius: 6px;
            white-space: pre-wrap;
            font-size: 16px;
            line-height: 1.7;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            font-size: 14px;
            color: #6c757d;
        }
        .timestamp {
            background-color: #e3f2fd;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #1565c0;
        }
        .ip-address {
            background-color: #f3e5f5;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 13px;
            color: #7b1fa2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Message</h1>
        </div>

        <div class="message-details">
            <div class="detail-row">
                <div class="detail-label">From:</div>
                <div class="detail-value">
                    <strong>${message.name}</strong><br>
                    📧 ${message.email}
                </div>
            </div>

            <div class="detail-row">
                <div class="detail-label">Message Details:</div>
                <div class="detail-value">
                    <span class="timestamp">📅 ${formatDate}</span><br>
                    ${message.ip ? `<span class="ip-address">🌐 IP: ${message.ip}</span>` : ''}
                </div>
            </div>
        </div>

        <div class="detail-row">
            <div class="detail-label">Message:</div>
            <div class="message-content">${message.message}</div>
        </div>

        <div class="footer">
            <p>This message was sent via your portfolio website contact form.</p>
            <p>Message ID: <code>${message.id}</code></p>
        </div>
    </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of the email
 */
function generateTextTemplate(message: ContactMessage): string {
  const formatDate = new Date(message.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return `
NEW CONTACT FORM MESSAGE
========================

From: ${message.name}
Email: ${message.email}
Date: ${formatDate}
${message.ip ? `IP Address: ${message.ip}` : ''}

Message:
--------
${message.message}

---
Message ID: ${message.id}
Sent via portfolio website contact form
  `.trim();
}

/**
 * Send email notification for new contact form submission
 */
export async function sendContactNotificationEmail(message: ContactMessage): Promise<void> {
  try {
    const config = getEmailConfig();

    const htmlBody = generateEmailTemplate(message);
    const textBody = generateTextTemplate(message);

    const subject = `New Contact Form Message from ${message.name}`;

    const emailParams = {
      Source: config.fromEmail,
      Destination: {
        ToAddresses: [config.notificationEmail],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
      ...(config.configurationSet && {
        ConfigurationSetName: config.configurationSet,
      }),
    };

    const command = new SendEmailCommand(emailParams);
    const result = await sesClient.send(command);

    console.log('Email notification sent successfully:', {
      messageId: result.MessageId,
      to: config.notificationEmail,
      from: config.fromEmail,
      subject,
    });

  } catch (error) {
    console.error('Failed to send email notification:', error);

    // Re-throw the error so the calling function can handle it
    // We don't want to fail the entire contact submission just because email fails
    // but we want to log it for monitoring
    throw new Error(`Email notification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if email configuration is properly set up
 */
export function isEmailConfigured(): boolean {
  try {
    const config = getEmailConfig();
    return !!(config.fromEmail && config.notificationEmail);
  } catch {
    return false;
  }
}