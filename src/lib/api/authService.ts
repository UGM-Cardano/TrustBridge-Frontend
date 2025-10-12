/**
 * Authentication Service
 * Centralized auth token management for API calls
 */

class AuthService {
  private static readonly TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';

  /**
   * Get access token from localStorage
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token from localStorage
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get user data from localStorage
   */
  static getUser(): any | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Set authentication tokens
   */
  static setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Set user data
   */
  static setUser(user: any): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear all authentication data
   */
  static clearAuth(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get authentication headers for API requests
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export default AuthService;
