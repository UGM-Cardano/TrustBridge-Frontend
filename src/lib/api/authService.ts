/**
 * Authentication Service
 * Centralized auth token management for API calls
 */
import { mockApiService } from '@/lib/mock/mockApiService';

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

  /**
   * Login with backend API
   */
  static async login(whatsappNumber: string, countryCode: string): Promise<any> {
    try {
      // Format WhatsApp number properly
      const fullNumber = countryCode + whatsappNumber;

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsappNumber: fullNumber,
          countryCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Handle backend response format: { success: true, message: "Login successful", user: {...}, tokens: {...} }
      if (data.success && data.tokens && data.user) {
        this.setTokens(data.tokens.accessToken, data.tokens.refreshToken);
        this.setUser(data.user);
        return {
          success: true,
          tokens: data.tokens,
          user: data.user,
          message: data.message
        };
      } else {
        throw new Error(data.error || data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Backend login failed:', error);
      // Use mock data as fallback for development
      return mockApiService.login(whatsappNumber, countryCode);
    }
  }
}

export default AuthService;
