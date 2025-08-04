interface UserInfo {
  username: string;
  registryUrl: string;  
}

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

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      return { success: true, user: data.user };
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

      return await response.json();
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
