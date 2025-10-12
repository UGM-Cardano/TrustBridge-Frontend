import {
  ApiResponse,
  TransferHistory,
  TransferHistoryItem,
  BackendWalletInfo,
  CardanoToken,
  TokenWithStats,
  TransferDetails,
  BlockchainTransaction,
  TransferCalculation,
  TransferInitiation,
  ExchangeRate
} from '@/lib/types/api';

// Mock Backend Wallet Info
export const mockBackendInfo: ApiResponse<BackendWalletInfo> = {
  success: true,
  data: {
    address: 'addr_test1qpa0rd55emex859ggm83ukpxv5wvzlg7cx0w2c9lw2szkpeh3lvdgekjev6eyn7rr7px8e7kkc72zewmvnvkr4zxl7zqx46s82',
    publicKeyHash: 'e3c5d8f2a7b1c9e4f6d2a8b5c7e9f1a3d5c8b2e6f9a1c4d7b0e3f6a9c2d5e8f1',
    balance: {
      ada: 1250.75,
      lovelace: '1250750000',
      assets: [
        { unit: 'mockADA', quantity: '1000000' },
        { unit: 'mockUSDC', quantity: '5000000' },
        { unit: 'mockIDR', quantity: '15000000' },
        { unit: 'mockEUR', quantity: '2500000' }
      ]
    },
    isReady: true
  }
};

// Mock Transfer History
export const mockTransferHistory: ApiResponse<TransferHistory> = {
  success: true,
  data: {
    transfers: [
      {
        transferId: 'TXN-2024-001234',
        status: 'COMPLETED',
        paymentMethod: 'WALLET',
        sender: {
          currency: 'USD',
          amount: 250.00,
          symbol: '$'
        },
        recipient: {
          name: 'Ahmad Rahman',
          currency: 'IDR',
          amount: 3750000,
          symbol: 'Rp',
          bank: 'Bank Central Asia',
          account: '****5678'
        },
        blockchain: {
          path: ['ADA', 'mockUSD', 'mockIDR'],
          mockADAAmount: 150.5,
          hubToken: 'mockUSD',
          recipientToken: 'mockIDR',
          txHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
          cardanoScanUrl: 'https://preprod.cardanoscan.io/transaction/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
          policyIds: {
            'mockUSD': 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
            'mockIDR': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
          }
        },
        fees: {
          percentage: 2.5,
          amount: 6.25
        },
        createdAt: '2024-01-15T10:30:00Z',
        completedAt: '2024-01-15T10:35:00Z'
      },
      {
        transferId: 'TXN-2024-001235',
        status: 'PROCESSING',
        paymentMethod: 'MASTERCARD',
        sender: {
          currency: 'EUR',
          amount: 100.00,
          symbol: '€'
        },
        recipient: {
          name: 'Maria Garcia',
          currency: 'USD',
          amount: 108.50,
          symbol: '$',
          bank: 'Chase Bank',
          account: '****9012'
        },
        blockchain: {
          path: ['ADA', 'mockEUR', 'mockUSD'],
          mockADAAmount: 75.25,
          hubToken: 'mockEUR',
          recipientToken: 'mockUSD',
          txHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
          cardanoScanUrl: 'https://preprod.cardanoscan.io/transaction/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
          policyIds: {
            'mockEUR': 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
            'mockUSD': 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3'
          }
        },
        fees: {
          percentage: 2.5,
          amount: 2.50
        },
        createdAt: '2024-01-16T14:20:00Z'
      },
      {
        transferId: 'TXN-2024-001236',
        status: 'FAILED',
        paymentMethod: 'VISA',
        sender: {
          currency: 'USD',
          amount: 50.00,
          symbol: '$'
        },
        recipient: {
          name: 'John Smith',
          currency: 'GBP',
          amount: 39.75,
          symbol: '£',
          bank: 'Barclays Bank',
          account: '****3456'
        },
        blockchain: {
          path: ['ADA', 'mockUSD', 'mockGBP'],
          mockADAAmount: 35.0,
          hubToken: 'mockUSD',
          recipientToken: 'mockGBP',
          txHash: '',
          cardanoScanUrl: '',
          policyIds: {
            'mockUSD': 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
            'mockGBP': 'd5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4'
          }
        },
        fees: {
          percentage: 2.5,
          amount: 1.25
        },
        createdAt: '2024-01-17T09:15:00Z'
      }
    ],
    total: 28,
    limit: 5,
    offset: 0,
    hasMore: true
  }
};

// Mock Exchange Rates
export const mockExchangeRates: ApiResponse<ExchangeRate[]> = {
  success: true,
  data: [
    { from: 'USD', to: 'IDR', rate: 15000, timestamp: new Date().toISOString() },
    { from: 'USD', to: 'EUR', rate: 0.85, timestamp: new Date().toISOString() },
    { from: 'USD', to: 'GBP', rate: 0.795, timestamp: new Date().toISOString() },
    { from: 'EUR', to: 'USD', rate: 1.085, timestamp: new Date().toISOString() },
    { from: 'EUR', to: 'IDR', rate: 16275, timestamp: new Date().toISOString() },
    { from: 'GBP', to: 'USD', rate: 1.258, timestamp: new Date().toISOString() },
    { from: 'ADA', to: 'USD', rate: 0.385, timestamp: new Date().toISOString() }
  ]
};

// Mock Cardano Tokens
export const mockCardanoTokens: ApiResponse<TokenWithStats[]> = {
  success: true,
  data: [
    {
      token: {
        id: 1,
        token_name: 'mockUSD',
        token_symbol: 'mUSD',
        policy_id: 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
        asset_unit: 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
        decimals: 6,
        total_supply: '10000000000000',
        deployment_tx_hash: 'abc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
        cardano_network: 'Preprod',
        description: 'Mock USD token for testing cross-border payments',
        is_active: true,
        deployed_at: '2024-01-01T00:00:00Z'
      },
      stats: {
        totalMints: 45,
        totalMintedAmount: '5000000000',
        totalSwaps: 123,
        lastActivity: '2024-01-17T15:30:00Z'
      }
    },
    {
      token: {
        id: 2,
        token_name: 'mockIDR',
        token_symbol: 'mIDR',
        policy_id: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        asset_unit: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        decimals: 2,
        total_supply: '150000000000000',
        deployment_tx_hash: 'def456ghi789jkl012mno345pqr678stu901vwx234yz567abc123',
        cardano_network: 'Preprod',
        description: 'Mock Indonesian Rupiah token for remittance testing',
        is_active: true,
        deployed_at: '2024-01-01T00:00:00Z'
      },
      stats: {
        totalMints: 32,
        totalMintedAmount: '480000000000',
        totalSwaps: 89,
        lastActivity: '2024-01-17T14:45:00Z'
      }
    }
  ]
};

// Mock Transaction Statistics
export const mockTransactionStats = {
  success: true,
  data: {
    totalTransactions: 28,
    completedTransactions: 22,
    processingTransactions: 3,
    failedTransactions: 3,
    totalAmount: 12450.75,
    averageAmount: 445.38,
    totalFees: 311.27,
    popularCurrencies: [
      { currency: 'USD', count: 15, percentage: 53.6 },
      { currency: 'EUR', count: 8, percentage: 28.6 },
      { currency: 'IDR', count: 5, percentage: 17.8 }
    ],
    recentActivity: [
      { date: '2024-01-17', transactions: 3, amount: 400.00 },
      { date: '2024-01-16', transactions: 5, amount: 750.50 },
      { date: '2024-01-15', transactions: 8, amount: 1250.75 },
      { date: '2024-01-14', transactions: 4, amount: 520.00 },
      { date: '2024-01-13', transactions: 6, amount: 890.25 }
    ]
  }
};

// Mock Transfer Calculation
export const mockTransferCalculation: ApiResponse<TransferCalculation> = {
  success: true,
  data: {
    senderAmount: 100,
    senderCurrency: 'USD',
    recipientAmount: 1485000,
    recipientCurrency: 'IDR',
    exchangeRate: 15000,
    adaAmount: 65.5,
    blockchain: {
      usesMockToken: true,
      hubToken: 'mockUSD',
      recipientToken: 'mockIDR',
      path: ['ADA', 'mockUSD', 'mockIDR'],
      policyIds: {
        'mockUSD': 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
        'mockIDR': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
      }
    },
    fee: {
      percentage: 2.5,
      amount: 2.5
    },
    totalAmount: 102.5
  }
};

// Mock Transfer Initiation
export const mockTransferInitiation: ApiResponse<TransferInitiation> = {
  success: true,
  data: {
    transferId: `TXN-${Date.now()}`,
    status: 'INITIATED',
    message: 'Transfer initiated successfully. Please complete the payment to proceed.',
    estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
  }
};

// Function to generate mock transfer details
export const generateMockTransferDetails = (transferId: string): ApiResponse<TransferDetails> => {
  const mockTransactions: BlockchainTransaction[] = [
    {
      step: 1,
      action: 'Payment Confirmation',
      amount: '102.50 USD',
      from: 'User Wallet',
      to: 'TrustBridge',
      txHash: `${transferId.replace('TXN-', '')}abc123`,
      cardanoScanUrl: `https://preprod.cardanoscan.io/transaction/${transferId.replace('TXN-', '')}abc123`,
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
    },
    {
      step: 2,
      action: 'Mint mockUSD',
      amount: '100.00 mockUSD',
      from: 'Minting Contract',
      to: 'Backend Wallet',
      txHash: `${transferId.replace('TXN-', '')}def456`,
      cardanoScanUrl: `https://preprod.cardanoscan.io/transaction/${transferId.replace('TXN-', '')}def456`,
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
    }
  ];

  return {
    success: true,
    data: {
      transferId,
      status: 'PROCESSING',
      paymentMethod: 'WALLET',
      sender: {
        currency: 'USD',
        amount: 100,
        symbol: '$',
        totalCharged: 102.5
      },
      recipient: {
        name: 'Ahmad Rahman',
        currency: 'IDR',
        amount: 1485000,
        symbol: 'Rp',
        bank: 'Bank Central Asia',
        account: '1234567890'
      },
      blockchain: {
        path: ['ADA', 'mockUSD', 'mockIDR'],
        mockADAAmount: 65.5,
        hubToken: 'mockUSD',
        recipientToken: 'mockIDR',
        policyIds: {
          'mockUSD': 'f66d78b4bcf24e091c1d31f35d9e4c3a2b1f8e7d6c5b4a3',
          'mockIDR': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
        },
        transactions: mockTransactions
      },
      fees: {
        percentage: 2.5,
        amount: 2.5
      },
      timeline: [
        { status: 'INITIATED', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { status: 'PAYMENT_CONFIRMED', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
        { status: 'MINTED_MOCKADA', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() }
      ],
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
  };
};