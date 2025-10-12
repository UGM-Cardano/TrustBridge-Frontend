import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CreditCard,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  Calculator,
  ArrowRightLeft
} from "lucide-react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

const CURRENCIES = [
  { code: 'ADA', name: 'Cardano', symbol: '₳', flag: '⚡' },
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
];

export default function Rates() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Calculator states
  const [calcAmount, setCalcAmount] = useState('1');
  const [calcFromCurrency, setCalcFromCurrency] = useState('ADA');
  const [calcToCurrency, setCalcToCurrency] = useState('USD');
  const [calcResult, setCalcResult] = useState<number | null>(null);

  useEffect(() => {
    loadExchangeRates();
  }, []);

  useEffect(() => {
    // Recalculate when amount or currencies change
    if (calcAmount && rates[calcFromCurrency] && rates[calcToCurrency]) {
      const amount = parseFloat(calcAmount);
      if (!isNaN(amount)) {
        // Convert from source to ADA, then ADA to target
        const fromRate = rates[calcFromCurrency];
        const toRate = rates[calcToCurrency];
        const result = (amount / fromRate) * toRate;
        setCalcResult(result);
      }
    }
  }, [calcAmount, calcFromCurrency, calcToCurrency, rates]);

  const loadExchangeRates = async (refresh = false) => {
    try {
      if (refresh) setIsRefreshing(true);
      else setIsLoading(true);

      // Use mock data for now
      const mockRates: Record<string, number> = {
        'ADA': 1,
        'USD': 0.35,
        'EUR': 0.32,
        'IDR': 5500,
        'GBP': 0.28,
        'JPY': 52.5,
        'CNY': 2.50,
        'MXN': 6.20,
      };

      setRates(mockRates);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error loading exchange rates:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const swapCurrencies = () => {
    const temp = calcFromCurrency;
    setCalcFromCurrency(calcToCurrency);
    setCalcToCurrency(temp);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>Exchange Rates - TrustBridge</title>
        <meta name="description" content="Current exchange rates for cross-border payments" />
      </Head>

      {/* Navigation */}
      <nav className="glass border-0 border-b border-blue-500/20 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-blue">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-glow">TrustBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 glass border-blue-400/30 text-blue-300 hover:text-white hover:border-blue-300/50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Exchange Rates</h1>
            <p className="text-blue-200">Current rates for supported currencies</p>
          </div>
          <Button
            onClick={() => loadExchangeRates(true)}
            disabled={isRefreshing}
            className="btn-space glow-effect"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Rates'}
          </Button>
        </div>

        {lastUpdated && (
          <p className="text-sm text-blue-300 mb-6">
            Last updated: {lastUpdated}
          </p>
        )}

        {/* Currency Calculator */}
        <Card className="mb-8 glass-dark border-blue-400/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Currency Calculator</span>
            </CardTitle>
            <CardDescription>Convert between supported currencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* From Currency */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  From
                </label>
                <Input
                  type="number"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(e.target.value)}
                  className="mb-2 glass border-blue-400/30 text-white"
                  placeholder="Enter amount"
                />
                <select
                  value={calcFromCurrency}
                  onChange={(e) => setCalcFromCurrency(e.target.value)}
                  className="w-full px-3 py-2 glass border-blue-400/30 rounded-lg text-white bg-transparent"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapCurrencies}
                  className="glass border-blue-400/30"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">
                  To
                </label>
                <div className="mb-2 px-3 py-2 glass border-blue-400/30 rounded-lg text-white font-semibold">
                  {calcResult !== null ? calcResult.toFixed(6) : '0.000000'}
                </div>
                <select
                  value={calcToCurrency}
                  onChange={(e) => setCalcToCurrency(e.target.value)}
                  className="w-full px-3 py-2 glass border-blue-400/30 rounded-lg text-white bg-transparent"
                >
                  {CURRENCIES.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {calcResult !== null && (
              <div className="mt-4 p-4 glass rounded-lg border border-blue-400/20">
                <p className="text-sm text-blue-200 text-center">
                  {calcAmount} {calcFromCurrency} = <span className="font-bold text-white">{calcResult.toFixed(6)}</span> {calcToCurrency}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exchange Rates Grid */}
        <Card className="glass-dark border-blue-400/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Current Exchange Rates (1 ADA =)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {CURRENCIES.filter(c => c.code !== 'ADA').map(currency => {
                const rate = rates[currency.code];
                return (
                  <div
                    key={currency.code}
                    className="p-4 glass rounded-lg border border-blue-400/20 hover:bg-blue-500/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{currency.flag}</span>
                        <div>
                          <p className="font-semibold text-white">{currency.code}</p>
                          <p className="text-xs text-blue-300">{currency.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {rate ? rate.toFixed(6) : 'N/A'}
                      </p>
                      <p className="text-xs text-blue-300">per 1 ADA</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(rates).length === 0 && (
              <div className="text-center py-12">
                <p className="text-blue-200">No exchange rates available</p>
                <Button
                  onClick={() => loadExchangeRates(true)}
                  className="mt-4 btn-space glow-effect"
                >
                  Try Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
