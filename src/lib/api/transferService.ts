/**
 * Transfer Service
 * API client for transfer-related operations
 */
import AuthService from './authService';

interface TransferHistoryResponse {
  success: boolean;
  data: {
    transfers: any[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  error?: string;
}

interface TransferDetailsResponse {
  success: boolean;
  data: any;
  error?: string;
}

class TransferService {
  private static readonly BASE_URL = 'http://localhost:5000/api/transfer';

  /**
   * Get authenticated headers
   */
  private static getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...AuthService.getAuthHeaders(),
    };
  }

  /**
   * Get transfer history for authenticated user
   */
  static async getHistory(params: {
    limit?: number;
    offset?: number;
    status?: string;
    paymentMethod?: string;
  } = {}): Promise<TransferHistoryResponse> {
    try {
      const user = AuthService.getUser();
      if (!user || !user.whatsappNumber) {
        throw new Error('User not authenticated or WhatsApp number not available');
      }

      const queryParams = new URLSearchParams({
        whatsappNumber: user.whatsappNumber,
        limit: (params.limit || 20).toString(),
        offset: (params.offset || 0).toString(),
        ...(params.status && { status: params.status }),
        ...(params.paymentMethod && { paymentMethod: params.paymentMethod }),
      });

      const response = await fetch(`${this.BASE_URL}/history?${queryParams}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transfer history');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Transfer history fetch failed:', error);
      throw error;
    }
  }

  /**
   * Get transfer details by ID
   */
  static async getDetails(transferId: string): Promise<TransferDetailsResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/details/${transferId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transfer details');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Transfer details fetch failed:', error);
      throw error;
    }
  }

  /**
   * Get transfer status by ID
   */
  static async getStatus(transferId: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/status/${transferId}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transfer status');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Transfer status fetch failed:', error);
      throw error;
    }
  }

  /**
   * Download invoice for transfer
   */
  static async downloadInvoice(transferId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.BASE_URL}/invoice/${transferId}`, {
        method: 'GET',
        headers: {
          ...AuthService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download invoice');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Invoice download failed:', error);
      throw error;
    }
  }

  /**
   * Transform backend transfer data to frontend format
   */
  static transformTransferData(backendTransfer: any): any {
    return {
      transferId: backendTransfer.transferId,
      status: backendTransfer.status,
      paymentMethod: backendTransfer.paymentMethod,
      sender: {
        currency: backendTransfer.sender.currency,
        amount: backendTransfer.sender.amount,
      },
      recipient: {
        name: backendTransfer.recipient.name,
        currency: backendTransfer.recipient.currency,
        amount: backendTransfer.recipient.amount,
        bank: backendTransfer.recipient.bank,
        account: backendTransfer.recipient.account,
      },
      blockchain: {
        txHash: backendTransfer.blockchain?.txHash || '',
        cardanoScanUrl: backendTransfer.blockchain?.cardanoScanUrl || '',
      },
      createdAt: backendTransfer.createdAt,
      completedAt: backendTransfer.completedAt,
    };
  }

  /**
   * Calculate transfer amounts without initiating
   */
  static async calculateTransfer(
    paymentMethod: string,
    senderCurrency: string,
    amount: number,
    recipientCurrency: string
  ): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/calculate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          paymentMethod,
          senderCurrency,
          amount,
          recipientCurrency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate transfer');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Transfer calculation failed:', error);
      throw error;
    }
  }

  /**
   * Initiate a new transfer
   */
  static async initiateTransfer(transferRequest: any): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/initiate`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(transferRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate transfer');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Transfer initiation failed:', error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(): Promise<any> {
    try {
      const historyResponse = await this.getHistory({ limit: 1000 });

      if (!historyResponse.success) {
        throw new Error('Failed to fetch user statistics');
      }

      const transfers = historyResponse.data.transfers;

      const stats = {
        totalTransfers: transfers.length,
        completedTransfers: transfers.filter(t => t.status === 'completed').length,
        pendingTransfers: transfers.filter(t => ['pending', 'processing', 'paid'].includes(t.status)).length,
        failedTransfers: transfers.filter(t => ['failed', 'cancelled'].includes(t.status)).length,
        totalVolume: transfers
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + (t.recipient?.amount || 0), 0),
        averageAmount: 0,
      };

      if (stats.completedTransfers > 0) {
        stats.averageAmount = stats.totalVolume / stats.completedTransfers;
      }

      return stats;
    } catch (error) {
      console.error('User stats fetch failed:', error);
      throw error;
    }
  }
}

export default TransferService;