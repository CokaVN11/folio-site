import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { JwtPayload } from 'aws-jwt-verify/jwt-model';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;

if (!COGNITO_USER_POOL_ID || !COGNITO_CLIENT_ID) {
  console.warn('Cognito configuration missing. Authentication will be disabled.');
}

// Create a verifier that expects valid access tokens
const jwtVerifier =
  COGNITO_USER_POOL_ID && COGNITO_CLIENT_ID
    ? CognitoJwtVerifier.create({
        userPoolId: COGNITO_USER_POOL_ID,
        tokenUse: 'access',
        clientId: COGNITO_CLIENT_ID,
      })
    : null;

/**
 * Decode and verify JWT token from Cognito
 */
export async function verifyCognitoToken(token: string): Promise<JwtPayload | null> {
  try {
    if (!jwtVerifier) {
      console.warn('Cognito not configured, skipping token verification');
      return null;
    }

    // Verify the JWT using AWS JWT verify library
    const payload = await jwtVerifier.verify(token);
    return payload;
  } catch (error) {
    console.error('Error verifying Cognito token:', error);
    return null;
  }
}

/**
 * Extract JWT token from Authorization header
 */
export function extractTokenFromAuthHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Authenticate request using Cognito JWT
 */
export async function authenticateRequest(
  event: APIGatewayProxyEventV2
): Promise<{ authenticated: boolean; payload?: JwtPayload; error?: string }> {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;

  if (!authHeader) {
    return { authenticated: false, error: 'Missing Authorization header' };
  }

  const token = extractTokenFromAuthHeader(authHeader);
  if (!token) {
    return { authenticated: false, error: 'Invalid Authorization header format' };
  }

  if (!COGNITO_USER_POOL_ID) {
    console.warn('Cognito not configured, allowing request without authentication');
    return { authenticated: true };
  }

  const payload = await verifyCognitoToken(token);
  if (!payload) {
    return { authenticated: false, error: 'Invalid or expired token' };
  }

  // Check if token is not expired
  const now = Math.floor(Date.now() / 1000);
  const exp = payload.exp;
  if (exp && exp < now) {
    return { authenticated: false, error: 'Token expired' };
  }

  return { authenticated: true, payload };
}

/**
 * Middleware function to protect routes
 */
export function requireAuthentication(
  event: APIGatewayProxyEventV2
): Promise<{ authenticated: boolean; payload?: JwtPayload; error?: string }> {
  return authenticateRequest(event);
}

/**
 * Check if user has admin privileges
 * This is a simple implementation - in production you might want to check
 * specific claims or group membership
 */
export function isAdminUser(payload: JwtPayload): boolean {
  // For now, any authenticated user is considered admin
  // In production, you might check for specific Cognito groups
  const groups = payload['cognito:groups'] as string[] | undefined;
  return !groups || groups.includes('admin') || groups.length === 0;
}

/**
 * Extract user information from Cognito payload
 */
export function extractUserInfo(payload: JwtPayload) {
  return {
    sub: payload.sub,
    email: payload.email,
    username: payload['cognito:username'],
    groups: (payload['cognito:groups'] as string[]) || [],
  };
}
