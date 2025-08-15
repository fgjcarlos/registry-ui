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
      console.debug('Attempting login to registry:', credentials.registryUrl);
      
      // Clean the registry URL and use nginx proxy for localhost
      let baseUrl = credentials.registryUrl.replace(/\/+$/, '');
      
      // Use nginx proxy for localhost registry to avoid CORS issues
      if (baseUrl.includes('localhost:5000') || baseUrl.includes('127.0.0.1:5000')) {
        baseUrl = 'http://localhost:8080';
        console.debug('Using nginx proxy for local registry');
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
          // Try to include any response body to help debugging
          const versionBody = await this.safeJson(versionResponse);
          return {
            success: false,
            error: `Registry requires authentication but no WWW-Authenticate header provided. Response: ${JSON.stringify(versionBody)}`
          };
        }

        console.debug('Auth challenge received');

        // Check if it's basic authentication (common for private registries)
        if (authHeader.toLowerCase().includes('basic')) {
          console.debug('Using HTTP Basic authentication');
          
          // Try HTTP Basic authentication with proper UTF-8 encoding
          // Use the same encoding approach as browsers for UTF-8 strings
          const authString = `${credentials.username}:${credentials.password}`;
          const basicAuth = btoa(unescape(encodeURIComponent(authString)));
          const basicAuthResponse = await fetch(`${baseUrl}/v2/`, {
            method: 'GET',
            headers: {
              'Authorization': `Basic ${basicAuth}`,
              'Accept': 'application/json',
            },
          });

          console.debug('Basic auth response status:', basicAuthResponse.status);

          if (basicAuthResponse.ok) {
            console.debug('Basic auth successful');
            return {
              success: true,
              token: basicAuth, // Store the basic auth token (base64 username:password)
              authType: 'basic'
            };
          } else {
            // Try to get body for more detailed error message, but avoid throwing
            let errorText = '';
            try {
              errorText = await basicAuthResponse.text();
            } catch {
              // ignore
            }
            return {
              success: false,
              error: `Authentication failed - invalid username or password. Server response: ${errorText || basicAuthResponse.statusText}`
            };
          }
        }
        
        // Otherwise, try Bearer token authentication (for Docker Hub, etc.)
  console.debug('Using Bearer token authentication');
        
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
          // propagate token error with added context
          return {
            success: false,
            error: `Failed to obtain auth token: ${tokenResponse.error}`
          };
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
          const verifyBody = await this.safeJson(verifyResponse);
          return {
            success: false,
            error: `Authentication failed when verifying token. Status: ${verifyResponse.status}. Response: ${JSON.stringify(verifyBody)}`
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
        const versionBody = await this.safeJson(versionResponse);
        return {
          success: false,
          error: `Registry error: ${versionResponse.status} ${versionResponse.statusText}. Response: ${JSON.stringify(versionBody)}`
        };
      }

    } catch (error) {
      console.error('Registry login error:', error instanceof Error ? error.message : error);

      // Handle network-like errors (fetch failures)
      if (error instanceof TypeError) {
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

  // Helper to safely parse JSON responses and fall back to raw text
  private static async safeJson(response: Response): Promise<Record<string, unknown> | string | undefined> {
    try {
      return await response.json();
    } catch {
      try {
        const txt = await response.text();
        return { _rawText: txt };
      } catch {
        return undefined;
      }
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
        const body = await this.safeJson(response);
        if (response.status === 401) {
          return {
            success: false,
            error: `Invalid username or password. Auth server response: ${JSON.stringify(body)}`
          };
        }
        return {
          success: false,
          error: `Authentication server error: ${response.status}. Response: ${JSON.stringify(body)}`
        };
      }

      const data = await this.safeJson(response);

      // If we got JSON with a token, return it
      if (data && typeof data === 'object' && 'token' in data && typeof (data as Record<string, unknown>).token === 'string') {
        const token = String((data as Record<string, unknown>).token);
        return {
          success: true,
          token
        };
      }

      // If we couldn't parse token, provide more details for debugging
      const raw = data && typeof data === 'object' && '_rawText' in data && (data as unknown as Record<string, unknown>)._rawText ? (data as unknown as Record<string, unknown>)._rawText : JSON.stringify(data);
      return {
        success: false,
        error: `No token received from authentication server. Response: ${raw}`
      };

    } catch (error) {
      console.error('getAuthToken error:', error instanceof Error ? error.message : error);
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
