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

// Use relative URL to go through Next.js (avoids CSP issues)
const API_BASE_URL = '';

class TransferService {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
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

    return response.json();
  }

  async calculateTransfer(
    paymentMethod: string,
    senderCurrency: string,
    senderAmount: number,
    recipientCurrency: string
  ): Promise<ApiResponse<TransferCalculation>> {
    return this.makeRequest<TransferCalculation>('/api/transfer/calculate', {
      method: 'POST',
      body: JSON.stringify({
        paymentMethod,
        senderCurrency,
        senderAmount,
        recipientCurrency,
      }),
    });
  }

  async initiateTransfer(transferData: TransferRequest): Promise<ApiResponse<TransferInitiation>> {
    return this.makeRequest<TransferInitiation>('/api/transfer/initiate', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  }

  async confirmPayment(transferId: string, txHash: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest<{ message: string }>('/api/transfer/confirm', {
      method: 'POST',
      body: JSON.stringify({
        transferId,
        txHash,
      }),
    });
  }

  async getTransferStatus(transferId: string): Promise<ApiResponse<TransferStatus>> {
    return this.makeRequest<TransferStatus>(`/api/transfer/status/${transferId}`);
  }

  async getTransferDetails(transferId: string): Promise<ApiResponse<TransferDetails>> {
    return this.makeRequest<TransferDetails>(`/api/transfer/details/${transferId}`);
  }

  async getTransferHistory(limit?: number, offset?: number): Promise<ApiResponse<TransferHistory>> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/api/transfer/history?${queryString}` : '/api/transfer/history';

    return this.makeRequest<TransferHistory>(endpoint);
  }

  /**
   * Get transaction history (new endpoint)
   */
  async getTransactionHistory(limit: number = 10): Promise<any> {
    return this.makeRequest(`/api/transactions/history?limit=${limit}`);
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<any> {
    return this.makeRequest('/api/transactions/stats/summary');
  }

  /**
   * Download invoice PDF for a transfer
   */
  async downloadInvoice(transferId: string): Promise<Blob> {
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
  }
}

export const transferService = new TransferService();