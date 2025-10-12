import {
  ApiResponse,
  TransferCalculation,
  TransferRequest,
  TransferInitiation,
  TransferHistory,
  TransferDetails,
  BackendWalletInfo,
  TokenWithStats,
  ExchangeRate
} from '@/lib/types/api';

import {
  mockBackendInfo,
  mockTransferHistory,
  mockExchangeRates,
  mockCardanoTokens,
  mockTransactionStats,
  mockTransferCalculation,
  mockTransferInitiation,
  generateMockTransferDetails
} from './mockData';

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  private isDemo = true;

  // Check if we're in demo mode
  isDemoMode(): boolean {
    return this.isDemo;
  }

  // Backend info endpoint
  async getBackendInfo(): Promise<ApiResponse<BackendWalletInfo>> {
    await delay(300);
    return mockBackendInfo;
  }

  // Transfer history endpoint
  async getTransferHistory(limit: number = 5, offset: number = 0): Promise<ApiResponse<TransferHistory>> {
    await delay(400);

    const { data } = mockTransferHistory;
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, data.transfers.length);

    return {
      ...mockTransferHistory,
      data: {
        ...data,
        transfers: data.transfers.slice(startIndex, endIndex),
        limit,
        offset,
        hasMore: endIndex < data.transfers.length
      }
    };
  }

  // Transfer calculation
  async calculateTransfer(
    paymentMethod: string,
    senderCurrency: string,
    senderAmount: number,
    recipientCurrency: string
  ): Promise<ApiResponse<TransferCalculation>> {
    await delay(600);

    // Dynamic calculation based on input
    const exchangeRates: Record<string, Record<string, number>> = {
      'USD': { 'IDR': 15000, 'EUR': 0.85, 'GBP': 0.795 },
      'EUR': { 'USD': 1.085, 'IDR': 16275, 'GBP': 0.935 },
      'GBP': { 'USD': 1.258, 'EUR': 1.069, 'IDR': 18870 }
    };

    const rate = exchangeRates[senderCurrency]?.[recipientCurrency] || 1;
    const recipientAmount = senderAmount * rate;
    const feeAmount = senderAmount * 0.025; // 2.5% fee

    return {
      success: true,
      data: {
        senderAmount,
        senderCurrency,
        recipientAmount: Math.round(recipientAmount * 100) / 100,
        recipientCurrency,
        exchangeRate: rate,
        adaAmount: senderAmount * 0.65, // Rough ADA conversion
        blockchain: {
          usesMockToken: true,
          hubToken: `mock${senderCurrency}`,
          recipientToken: `mock${recipientCurrency}`,
          path: ['ADA', `mock${senderCurrency}`, `mock${recipientCurrency}`],
          policyIds: {
            [`mock${senderCurrency}`]: 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
            [`mock${recipientCurrency}`]: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
          }
        },
        fee: {
          percentage: 2.5,
          amount: Math.round(feeAmount * 100) / 100
        },
        totalAmount: Math.round((senderAmount + feeAmount) * 100) / 100
      }
    };
  }

  // Transfer initiation
  async initiateTransfer(transferData: TransferRequest): Promise<ApiResponse<TransferInitiation>> {
    await delay(800);

    return {
      success: true,
      data: {
        transferId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        status: 'INITIATED',
        message: `Transfer of ${transferData.senderAmount} ${transferData.senderCurrency} to ${transferData.recipientName} has been initiated successfully.`,
        estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }
    };
  }

  // Transfer details
  async getTransferDetails(transferId: string): Promise<ApiResponse<TransferDetails>> {
    await delay(300);
    return generateMockTransferDetails(transferId);
  }

  // Exchange rates
  async getExchangeRates(): Promise<ApiResponse<ExchangeRate[]>> {
    await delay(200);
    return mockExchangeRates;
  }

  // Cardano tokens
  async getCardanoTokens(): Promise<ApiResponse<TokenWithStats[]>> {
    await delay(300);
    return mockCardanoTokens;
  }

  // Transaction statistics
  async getTransactionStats(): Promise<any> {
    await delay(400);
    return mockTransactionStats;
  }

  // Transaction history (alias for transfer history)
  async getTransactionHistory(limit: number = 10): Promise<any> {
    await delay(350);

    const { data } = mockTransferHistory;
    return {
      success: true,
      data: {
        transactions: data.transfers.slice(0, limit).map(transfer => ({
          ...transfer,
          type: 'transfer',
          description: `${transfer.paymentMethod} payment to ${transfer.recipient.name}`
        })),
        total: data.total,
        hasMore: limit < data.total
      }
    };
  }

  // Confirm payment (mock)
  async confirmPayment(transferId: string, txHash: string): Promise<ApiResponse<{ message: string }>> {
    await delay(500);

    return {
      success: true,
      data: {
        message: `Payment confirmed for transfer ${transferId}. Transaction hash: ${txHash}`
      }
    };
  }

  // Download invoice (mock)
  async downloadInvoice(transferId: string): Promise<Blob> {
    await delay(600);

    // Create a mock PDF blob
    const pdfContent = `Mock Invoice for Transfer ${transferId}\n\nThis is a demo invoice.\nGenerated at: ${new Date().toISOString()}`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  // Login (mock)
  async login(whatsappNumber: string, countryCode: string): Promise<any> {
    await delay(700);

    return {
      success: true,
      data: {
        tokens: {
          accessToken: `mock_access_token_${Date.now()}`,
          refreshToken: `mock_refresh_token_${Date.now()}`
        },
        user: {
          id: 'user_' + Math.random().toString(36).substr(2, 9),
          whatsappNumber: `${countryCode}${whatsappNumber}`,
          status: 'active'
        }
      }
    };
  }
}

// Export singleton instance
export const mockApiService = new MockApiService();