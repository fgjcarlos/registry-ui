import { UserInfo } from '@/types';
import { GetSessionResponseSchema, SaveSessionResponseSchema } from '@/validators/authValidators';

export class SessionService {
  /**
   * Save session data via API (server-side with HttpOnly cookies)
   */
  static async saveSession(username: string, password: string, registryUrl: string): Promise<{ success: boolean; error?: string; user?: UserInfo }> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, registryUrl }),
      });

      // Handle non-OK responses before validation
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Full API error response:', errorData);

        // Handle 401 Unauthorized specifically
        if (response.status === 401) {
          return { success: false, error: 'Unauthorized: Invalid credentials' };
        }

        return { success: false, error: errorData.error || 'Login failed' };
      }

      const data = await response.json();

      // Log the full API response for debugging
      console.log('Full API response:', data);

      // Validate response using Zod
      const parsedData = SaveSessionResponseSchema.parse(data);

      // Handle cases where only 'error' is present
      if ('error' in parsedData) {
        return { success: false, error: parsedData.error };
      }

      // Fallback for undefined 'success'
      return { success: parsedData.success ?? false, user: parsedData.user, error: parsedData.error };
    } catch (error) {
      console.error('Failed to save session:', error);
      return { success: false, error: 'Network error' };
    }
  }

  /**
   * Get current session data from server
   */
  static async getSession(): Promise<{ authenticated: boolean; user?: UserInfo }> {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      const data = await response.json();

      // Validate response using Zod
      return GetSessionResponseSchema.parse(data);
    } catch (error) {
      console.error('Failed to get session:', error);
      return { authenticated: false };
    }
  }

  /**
   * Clear session data (logout)
   */
  static async clearSession(): Promise<{ success: boolean }> {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();
      return { success: data.success };
    } catch (error) {
      console.error('Failed to clear session:', error);
      return { success: false };
    }
  }

  /**
   * Check if user is authenticated (client-side check)
   */
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session.authenticated;
  }

  /**
   * Get current user info
   */
  static async getCurrentUser(): Promise<UserInfo | null> {
    const session = await this.getSession();
    return session.authenticated && session.user ? session.user : null;
  }
}
