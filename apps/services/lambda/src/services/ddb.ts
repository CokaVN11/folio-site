import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { ContactMessage } from '../schemas/dto.ts';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || 'contact_messages';

/**
 * Save a contact message to DynamoDB
 */
export async function saveContactMessage(message: ContactMessage): Promise<void> {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: message,
  });

  await ddbDocClient.send(command);
}
