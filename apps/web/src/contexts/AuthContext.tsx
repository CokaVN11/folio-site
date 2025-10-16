'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
  CognitoRefreshToken,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

// Types for user data
interface User {
  id: string;
  email: string;
  username: string;
  groups: string[];
}

// Type definitions for better type safety
interface CognitoUserAttributes {
  sub: string;
  email: string;
  'cognito:name': string;
  'cognito:groups'?: string[];
}

// Centralized error handling utility
const handleCognitoError = (error: any): string => {
  if (error.code === 'UserNotConfirmedException') {
    return 'Please confirm your email address';
  } else if (error.code === 'NotAuthorizedException') {
    return 'Invalid email or password';
  } else if (error.code === 'UserNotFoundException') {
    return 'User not found';
  } else if (error.code === 'TooManyRequestsException') {
    return 'Too many login attempts. Please try again later';
  } else if (error.code === 'InvalidPasswordException') {
    return 'Password does not meet the requirements';
  } else if (error.code === 'InvalidParameterException') {
    return error.message || 'Invalid parameters provided';
  } else {
    return error.message || 'An error occurred';
  }
};

// State reset utility
const resetAuthState = (
  setUser: (user: User | null) => void,
  setCognitoUser: (user: any) => void,
  setPendingUser: (user: any) => void,
  setRequiresNewPassword: (requires: boolean) => void,
  setError: (error: string | null) => void
) => {
  setUser(null);
  setCognitoUser(null);
  setPendingUser(null);
  setRequiresNewPassword(false);
  setError(null);
};

// Enhanced user data extraction with session support
const extractUserData = (attributes: any, session?: any): User => {
  const userAttributes: CognitoUserAttributes = {
    sub: '',
    email: '',
    'cognito:name': '',
  };

  attributes.forEach((attr: any) => {
    const name = attr.getName();
    const value = attr.getValue();
    userAttributes[name as keyof CognitoUserAttributes] = value;
  });

  // Extract groups from JWT token payload if available
  let groups: string[] = [];
  if (session?.getIdToken) {
    const tokenPayload = session.getIdToken().payload;
    groups = tokenPayload['cognito:groups'] || [];
  } else if (userAttributes['cognito:groups']) {
    groups = Array.isArray(userAttributes['cognito:groups'])
      ? userAttributes['cognito:groups']
      : [];
  }

  return {
    id: userAttributes.sub,
    email: userAttributes.email,
    username: userAttributes['cognito:name'],
    groups,
  };
};

// Async flow wrapper for consistent error handling and state management
async function executeAuthFlow<T>(
  operation: () => Promise<T>,
  onSuccess: (result: T) => void,
  onError: (message: string) => void,
  setLoading: (loading: boolean) => void
): Promise<void> {
  setLoading(true);
  try {
    const result = await operation();
    onSuccess(result);
  } catch (error) {
    onError(handleCognitoError(error));
  } finally {
    setLoading(false);
  }
}

// Process user session with attributes extraction
const processUserSession = (
  cognitoUser: CognitoUser | null,
  onSuccess: (userData: User) => void,
  onError: (message: string) => void
) => {
  cognitoUser?.getUserAttributes((err?: Error, attributes?: CognitoUserAttribute[]) => {
    if (err) {
      console.warn('Failed to get user attributes:', err);
      onError('Failed to get user attributes');
      return;
    }

    cognitoUser.getSession((sessionErr: any, session: any) => {
      if (sessionErr) {
        onError('Failed to get user session');
        return;
      }

      if (session.isValid()) {
        const userData = extractUserData(attributes, session);
        onSuccess(userData);
      } else {
        onError('Invalid user session');
      }
    });
  });
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  requiresNewPassword: boolean;
  pendingUser: any;
  login: (email: string, password: string) => Promise<void>;
  completeNewPasswordChallenge: (newPassword: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Cognito User Pool configuration
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cognitoUser, setCognitoUser] = useState<any>(null);
  const [requiresNewPassword, setRequiresNewPassword] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);

  // Initialize Cognito User Pool
  const getUserPool = () => {
    if (!userPoolId || !clientId) {
      throw new Error('Cognito configuration missing');
    }

    if (typeof window === 'undefined') return null;

    return new CognitoUserPool({
      UserPoolId: userPoolId,
      ClientId: clientId,
    });
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const userPool = getUserPool();
        if (!userPool) return;

        const currentUser = userPool.getCurrentUser();
        if (!currentUser) {
          setIsLoading(false);
          return;
        }

        processUserSession(
          currentUser,
          (userData) => {
            setUser(userData);
            setCognitoUser(currentUser);
            setIsLoading(false);
          },
          (errorMessage) => {
            console.error('Session error:', errorMessage);
            setIsLoading(false);
          }
        );
      } catch (err) {
        console.error('Session check error:', err);
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Auto-refresh token before expiration
  useEffect(() => {
    if (!cognitoUser || !user) return;

    const refreshTokenInterval = setInterval(
      async () => {
        try {
          await refreshToken();
        } catch (err) {
          console.error('Auto refresh failed:', err);
          logout();
        }
      },
      50 * 60 * 1000
    ); // Refresh every 50 minutes

    return () => clearInterval(refreshTokenInterval);
  }, [cognitoUser, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userPool = getUserPool();
      if (!userPool) {
        throw new Error('Cognito not initialized');
      }

      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });

      const cognitoUserData = {
        Username: email,
        Pool: userPool,
      };

      const cognitoUserInstance = new CognitoUser(cognitoUserData);

      cognitoUserInstance.authenticateUser(authenticationDetails, {
        onSuccess: async (session: any) => {
          // Get user attributes after successful authentication
          cognitoUserInstance.getUserAttributes((err: any, attributes: any) => {
            if (err) {
              setError('Failed to get user attributes');
              setIsLoading(false);
              return;
            }

            const userData = extractUserData(attributes, session);
            setUser(userData);
            setCognitoUser(cognitoUserInstance);
            setIsLoading(false);
          });
        },
        onFailure: (err: any) => {
          setError(handleCognitoError(err));
        },
        newPasswordRequired: (userAttributes: any, requiredAttributes: any) => {
          // User needs to set a new password
          setRequiresNewPassword(true);
          setPendingUser(cognitoUserInstance);
          setError('Please set a new password to complete your login.');
          setIsLoading(false);
        },
      });
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const completeNewPasswordChallenge = async (newPassword: string) => {
    if (!pendingUser) {
      setError('No pending password change found');
      return;
    }

    executeAuthFlow(
      () => {
        return new Promise<void>((resolve, reject) => {
          pendingUser.completeNewPasswordChallenge(newPassword, {
            onSuccess: async (session: any) => {
              // Get user attributes after successful password change
              pendingUser.getUserAttributes((err: any, attributes: any) => {
                if (err) {
                  reject(new Error('Failed to get user attributes'));
                  return;
                }

                const userData = extractUserData(attributes, session);
                setUser(userData);
                setCognitoUser(pendingUser);
                setRequiresNewPassword(false);
                setPendingUser(null);
                resolve();
              });
            },
            onFailure: (err: any) => {
              reject(new Error(handleCognitoError(err)));
            },
          });
        });
      },
      () => {
        // Password update successful - handled in the promise
      },
      (errorMessage) => {
        setError(errorMessage);
      },
      setIsLoading
    );
  };

  const logout = () => {
    if (cognitoUser) {
      cognitoUser.signOut();
    }
    resetAuthState(setUser, setCognitoUser, setPendingUser, setRequiresNewPassword, setError);
  };

  const refreshToken = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!cognitoUser) {
        reject(new Error('No user session'));
        return;
      }

      cognitoUser.refreshSession(
        new CognitoRefreshToken({ RefreshToken: cognitoUser.signInUserSession.refreshToken.token }),
        (err: any, session: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthState = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    requiresNewPassword,
    pendingUser,
    login,
    completeNewPasswordChallenge,
    logout,
    refreshToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Utility hook for checking admin access
export function useAdminAuth() {
  const { user, isAuthenticated, requiresNewPassword } = useAuth();

  const isAdmin = (isAuthenticated && user?.groups?.includes('admins')) ?? false;

  return {
    user,
    isAuthenticated,
    isAdmin,
    isAuthorized: isAdmin, // Alias for clarity
    requiresNewPassword,
  };
}
