import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserWallet } from '@meshsdk/core';

interface WalletContextType {
  wallet: BrowserWallet | null;
  connected: boolean;
  connecting: boolean;
  balance: string;
  address: string;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  sendTransaction: (recipientAddress: string, amount: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [wallet, setWallet] = useState<BrowserWallet | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState('0');
  const [address, setAddress] = useState('');

  const connectWallet = async (walletName: string) => {
    try {
      setConnecting(true);
      const browserWallet = await BrowserWallet.enable(walletName);
      setWallet(browserWallet);
      setConnected(true);

      const walletAddress = await browserWallet.getChangeAddress();
      setAddress(walletAddress);

      await refreshBalance();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setConnected(false);
    setBalance('0');
    setAddress('');
  };

  const refreshBalance = async () => {
    if (!wallet) return;
    
    try {
      const utxos = await wallet.getUtxos();
      let totalBalance = 0;
      
      utxos.forEach((utxo) => {
        const lovelaceAmount = utxo.output.amount.find((asset) => asset.unit === 'lovelace');
        if (lovelaceAmount) {
          totalBalance += parseInt(lovelaceAmount.quantity);
        }
      });
      
      const adaBalance = (totalBalance / 1000000).toFixed(2);
      setBalance(adaBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const sendTransaction = async (recipientAddress: string, amount: string): Promise<string> => {
    if (!wallet) throw new Error('Wallet not connected');

    try {
      const tx = await wallet.createTx()
        .payToAddress(recipientAddress, [{ unit: 'lovelace', quantity: (parseFloat(amount) * 1000000).toString() }])
        .complete();

      const signedTx = await wallet.signTx(tx);
      const txHash = await wallet.submitTx(signedTx);
      
      await refreshBalance();
      return txHash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      const savedWallet = localStorage.getItem('connectedWallet');
      if (savedWallet) {
        try {
          await connectWallet(savedWallet);
        } catch (error) {
          localStorage.removeItem('connectedWallet');
        }
      }
    };
    
    checkConnection();
  }, []);

  useEffect(() => {
    if (connected && wallet) {
      localStorage.setItem('connectedWallet', 'eternl');
      const interval = setInterval(refreshBalance, 30000);
      return () => clearInterval(interval);
    } else {
      localStorage.removeItem('connectedWallet');
    }
  }, [connected, wallet]);

  const value: WalletContextType = {
    wallet,
    connected,
    connecting,
    balance,
    address,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    sendTransaction,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}