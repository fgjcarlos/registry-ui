import { LoginCredentials, LoginResponse } from '../types';

export class RegistryService {
  /**
   * Authenticate with Docker registry (server-side version)
   * @param username - Username
   * @param password - Password  
   * @param registryUrl - Registry URL
   * @returns Promise with authentication result
   */
  static async authenticate(username: string, password: string, registryUrl: string): Promise<LoginResponse> {
    const credentials: LoginCredentials = { username, password, registryUrl };
    return this.login(credentials);
  }
  /**
   * Login to Docker registry
   * @param credentials - The login credentials
   * @returns Promise with login response
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Attempting login to registry:', credentials.registryUrl);
      
      // Clean the registry URL and use nginx proxy for localhost
      let baseUrl = credentials.registryUrl.replace(/\/+$/, '');
      
      // Use nginx proxy for localhost registry to avoid CORS issues
      if (baseUrl.includes('localhost:5000') || baseUrl.includes('127.0.0.1:5000')) {
        baseUrl = 'http://localhost:8080';
        console.log('Using nginx proxy for local registry');
      }
      
      // Step 1: Try to access the registry API version endpoint
      const versionResponse = await fetch(`${baseUrl}/v2/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      // If we get 401, the registry requires authentication
      if (versionResponse.status === 401) {
        // Extract authentication challenge from WWW-Authenticate header
        const authHeader = versionResponse.headers.get('WWW-Authenticate');
        if (!authHeader) {
          return {
            success: false,
            error: 'Registry requires authentication but no authentication method provided'
          };
        }

        console.log('Auth challenge received:', authHeader);

        // Check if it's basic authentication (common for private registries)
        if (authHeader.toLowerCase().includes('basic')) {
          console.log('Using HTTP Basic authentication');
          
          // Try HTTP Basic authentication with proper UTF-8 encoding
          const authString = `${credentials.username}:${credentials.password}`;
          console.log('Auth string:', authString);
          
          // Use the same encoding approach as browsers for UTF-8 strings
          const basicAuth = btoa(unescape(encodeURIComponent(authString)));
          console.log('Basic auth token:', basicAuth);
          
          const basicAuthResponse = await fetch(`${baseUrl}/v2/`, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Accept': 'application/json',
            },
          });

          console.log('Basic auth response status:', basicAuthResponse.status);
          
          if (basicAuthResponse.ok) {
            console.log('Basic auth successful!');
            return {
              success: true,
              token: basicAuth, // Store the basic auth token
              authType: 'basic'
            };
          } else {
            const errorText = await basicAuthResponse.text();
            console.log('Basic auth error response:', errorText);
            return {
              success: false,
              error: 'Authentication failed - invalid username or password'
            };
          }
        }
        
        // Otherwise, try Bearer token authentication (for Docker Hub, etc.)
        console.log('Using Bearer token authentication');
        
        // Parse the WWW-Authenticate header to get the auth server and service
        const authChallenge = this.parseAuthChallenge(authHeader);
        if (!authChallenge) {
          return {
            success: false,
            error: 'Invalid authentication challenge from registry'
          };
        }

        // Step 2: Get authentication token from auth server
        const tokenResponse = await this.getAuthToken(
          authChallenge,
          credentials.username,
          credentials.password
        );

        if (!tokenResponse.success) {
          return tokenResponse;
        }

        // Step 3: Verify token works by making authenticated request
        const verifyResponse = await fetch(`${baseUrl}/v2/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenResponse.token}`,
            'Accept': 'application/json',
          },
        });

        if (verifyResponse.ok) {
          return {
            success: true,
            token: tokenResponse.token,
            authType: 'bearer'
          };
        } else {
          return {
            success: false,
            error: 'Authentication failed - invalid credentials'
          };
        }
      } 
      // If we get 200, the registry doesn't require authentication
      else if (versionResponse.ok) {
        return {
          success: true,
          token: undefined // No token needed
        };
      } 
      // Other status codes indicate registry issues
      else {
        return {
          success: false,
          error: `Registry error: ${versionResponse.status} ${versionResponse.statusText}`
        };
      }

    } catch (error) {
      console.error('Registry login error:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Unable to connect to registry. Please check the URL and your network connection.'
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Parse WWW-Authenticate header to extract auth server details
   * @param authHeader - WWW-Authenticate header value
   * @returns Parsed auth challenge or null
   */
  private static parseAuthChallenge(authHeader: string): {
    realm: string;
    service?: string;
    scope?: string;
  } | null {
    try {
      // Example: Bearer realm="https://auth.docker.io/token",service="registry.docker.io"
      const bearerMatch = authHeader.match(/Bearer\s+(.+)/);
      if (!bearerMatch) return null;

      const params = bearerMatch[1];
      const realm = params.match(/realm="([^"]+)"/)?.[1];
      const service = params.match(/service="([^"]+)"/)?.[1];
      const scope = params.match(/scope="([^"]+)"/)?.[1];

      if (!realm) return null;

      return { realm, service, scope };
    } catch {
      return null;
    }
  }

  /**
   * Get authentication token from registry auth server
   * @param authChallenge - Parsed auth challenge
   * @param username - Username
   * @param password - Password
   * @returns Login response with token
   */
  private static async getAuthToken(
    authChallenge: { realm: string; service?: string; scope?: string },
    username: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const authUrl = new URL(authChallenge.realm);
      
      // Add query parameters
      if (authChallenge.service) {
        authUrl.searchParams.set('service', authChallenge.service);
      }
      if (authChallenge.scope) {
        authUrl.searchParams.set('scope', authChallenge.scope);
      }

      // Create authorization header (Basic auth)
      const authString = btoa(`${username}:${password}`);

      const response = await fetch(authUrl.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${authString}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            error: 'Invalid username or password'
          };
        }
        return {
          success: false,
          error: `Authentication server error: ${response.status}`
        };
      }

      const data = await response.json();
      
      if (data.token) {
        return {
          success: true,
          token: data.token
        };
      } else {
        return {
          success: false,
          error: 'No token received from authentication server'
        };
      }

    } catch (error) {
      return {
        success: false,
        error: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Validate registry URL format
   * @param url - Registry URL to validate
   * @returns boolean indicating if URL is valid
   */
  static validateRegistryUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  }
}
