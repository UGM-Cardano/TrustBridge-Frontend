import {
  ApiResponse,
  TransferCalculation,
  TransferRequest,
  TransferInitiation,
  TransferStatus,
  TransferDetails,
  TransferHistory
} from '@/lib/types/api';
import AuthService from './authService';
import { mockApiService } from '@/lib/mock/mockApiService';

// Use relative URL to go through Next.js (avoids CSP issues)
const API_BASE_URL = '';

class TransferService {
  private isDemo = false;

  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const authHeaders = AuthService.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.isDemo = false;
      return data;
    } catch (error) {
      console.warn(`API request failed for ${endpoint}, falling back to mock data:`, error);
      this.isDemo = true;
      throw error; // Let individual methods handle the fallback
    }
  }

  isDemoMode(): boolean {
    return this.isDemo;
  }

  async calculateTransfer(
    paymentMethod: string,
    senderCurrency: string,
    senderAmount: number,
    recipientCurrency: string
  ): Promise<ApiResponse<TransferCalculation>> {
    try {
      return await this.makeRequest<TransferCalculation>('/api/transfer/calculate', {
        method: 'POST',
        body: JSON.stringify({
          paymentMethod,
          senderCurrency,
          senderAmount,
          recipientCurrency,
        }),
      });
    } catch (error) {
      return mockApiService.calculateTransfer(paymentMethod, senderCurrency, senderAmount, recipientCurrency);
    }
  }

  async initiateTransfer(transferData: TransferRequest): Promise<ApiResponse<TransferInitiation>> {
    try {
      return await this.makeRequest<TransferInitiation>('/api/transfer/initiate', {
        method: 'POST',
        body: JSON.stringify(transferData),
      });
    } catch (error) {
      return mockApiService.initiateTransfer(transferData);
    }
  }

  async confirmPayment(transferId: string, txHash: string): Promise<ApiResponse<{ message: string }>> {
    try {
      return await this.makeRequest<{ message: string }>('/api/transfer/confirm', {
        method: 'POST',
        body: JSON.stringify({
          transferId,
          txHash,
        }),
      });
    } catch (error) {
      return mockApiService.confirmPayment(transferId, txHash);
    }
  }

  async getTransferStatus(transferId: string): Promise<ApiResponse<TransferStatus>> {
    try {
      return await this.makeRequest<TransferStatus>(`/api/transfer/status/${transferId}`);
    } catch (error) {
      // Mock status response
      return {
        success: true,
        data: {
          transferId,
          status: 'INITIATED' as const,
          message: 'Transfer is being processed',
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  async getTransferDetails(transferId: string): Promise<ApiResponse<TransferDetails>> {
    try {
      return await this.makeRequest<TransferDetails>(`/api/transfer/details/${transferId}`);
    } catch (error) {
      return mockApiService.getTransferDetails(transferId);
    }
  }

  async getTransferHistory(limit?: number, offset?: number): Promise<ApiResponse<TransferHistory>> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());

      const queryString = params.toString();
      const endpoint = queryString ? `/api/transfer/history?${queryString}` : '/api/transfer/history';

      return await this.makeRequest<TransferHistory>(endpoint);
    } catch (error) {
      return mockApiService.getTransferHistory(limit || 5, offset || 0);
    }
  }

  /**
   * Get transaction history (new endpoint)
   */
  async getTransactionHistory(limit: number = 10): Promise<any> {
    try {
      return await this.makeRequest(`/api/transactions/history?limit=${limit}`);
    } catch (error) {
      return mockApiService.getTransactionHistory(limit);
    }
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<any> {
    try {
      return await this.makeRequest('/api/transactions/stats/summary');
    } catch (error) {
      return mockApiService.getTransactionStats();
    }
  }

  /**
   * Download invoice PDF for a transfer
   */
  async downloadInvoice(transferId: string): Promise<Blob> {
    try {
      const authHeaders = AuthService.getAuthHeaders();

      const response = await fetch(`${API_BASE_URL}/api/transfer/invoice/${transferId}`, {
        headers: {
          ...authHeaders,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      return mockApiService.downloadInvoice(transferId);
    }
  }

  // Backend info endpoint
  async getBackendInfo(): Promise<any> {
    try {
      return await this.makeRequest('/api/cardano/backend-info');
    } catch (error) {
      return mockApiService.getBackendInfo();
    }
  }

  // Exchange rates endpoint
  async getExchangeRates(): Promise<any> {
    try {
      return await this.makeRequest('/api/exchange/rates');
    } catch (error) {
      return mockApiService.getExchangeRates();
    }
  }

  // Cardano tokens endpoint
  async getCardanoTokens(): Promise<any> {
    try {
      return await this.makeRequest('/api/cardano/tokens');
    } catch (error) {
      return mockApiService.getCardanoTokens();
    }
  }
}

export const transferService = new TransferService();