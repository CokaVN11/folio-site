# Contact Lambda Service

AWS Lambda function that processes contact form submissions and stores them in DynamoDB.

## Features

- Request validation with Zod schemas
- CORS support for browser requests
- Error handling with proper status codes
- DynamoDB persistence
- CloudWatch logging

## Tech Stack

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Build Tool**: tsup
- **AWS SDK**: v3 (DynamoDB)
- **Validation**: Zod

## Development

```bash
# Install dependencies (from root)
pnpm install

# Build Lambda
pnpm --filter contact-lambda build

# Clean build artifacts
pnpm --filter contact-lambda clean
```

## Structure

```
apps/services/contact-lambda/
├── src/
│   ├── handler.ts    # Lambda entry point
│   ├── dto.ts        # Data transfer objects and schemas
│   ├── cors.ts       # CORS utilities
│   └── ddb.ts        # DynamoDB client wrapper
├── dist/            # Build output (generated)
├── tsconfig.json
├── tsup.config.ts   # Build configuration
└── package.json
```

## API Contract

### POST /contact

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello, I would like to discuss..."
}
```

**Success Response (201):**

```json
{
  "message": "Contact message received successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validation Error (400):**

```json
{
  "error": "Validation Error",
  "message": "Invalid request data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Server Error (500):**

```json
{
  "error": "Internal Server Error",
  "message": "An error occurred processing your request"
}
```

## Environment Variables

Set by Terraform during deployment:

- `TABLE_NAME` - DynamoDB table name
- `AWS_REGION` - AWS region

## Building for Deployment

```bash
# Build TypeScript to JavaScript
pnpm --filter contact-lambda build

# Package for Lambda
cd apps/services/contact-lambda/dist
zip -r ../handler.zip .
```

The resulting `handler.zip` is used by Terraform for Lambda deployment.

## Testing Locally

You can test the handler locally with a sample event:

```typescript
import { handler } from './src/handler';

const event = {
  requestContext: {
    http: {
      method: 'POST',
      sourceIp: '127.0.0.1',
    },
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message',
  }),
};

handler(event as any).then(console.log);
```

## Validation Rules

- **name**: 1-100 characters, required
- **email**: Valid email format, max 255 characters, required
- **message**: 10-2000 characters, required

## DynamoDB Schema

**Table**: `contact_messages`

**Attributes**:

- `id` (S) - Primary key (UUID)
- `timestamp` (S) - ISO 8601 timestamp
- `name` (S) - Sender name
- `email` (S) - Sender email
- `message` (S) - Message content
- `ip` (S) - Source IP address (optional)

**Indexes**:

- `TimestampIndex` - GSI on timestamp for chronological queries

## Monitoring

View logs in CloudWatch:

```bash
aws logs tail /aws/lambda/folio-site-contact-production --follow
```

## Deployment

Automatically deployed via GitHub Actions. The workflow:

1. Builds the Lambda function
2. Packages it as a zip file
3. Uploads to S3 (via Terraform)
4. Updates Lambda function code
