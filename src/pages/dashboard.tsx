import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { WalletService } from "@/lib/walletService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { 
  Send, 
  Wallet, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  MessageCircle, 
  TrendingUp,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  QrCode,
  Users,
  Globe,
  Shield,
  Settings,
  Bell,
  Menu,
  Bot,
  Zap,
  PieChart as PieChartIcon
} from "lucide-react";

const mockTransactions = [
  { id: "1", type: "sent", amount: 250, currency: "USD", to: "+1234567890", status: "completed", time: "2 hours ago", whatsapp: true },
  { id: "2", type: "received", amount: 180, currency: "EUR", from: "+9876543210", status: "completed", time: "1 day ago", whatsapp: true },
  { id: "3", type: "sent", amount: 420, currency: "GBP", to: "+1122334455", status: "pending", time: "2 days ago", whatsapp: true },
  { id: "4", type: "received", amount: 75, currency: "USD", from: "+5566778899", status: "completed", time: "3 days ago", whatsapp: true },
];

const chartData = [
  { name: 'Jan', sent: 1200, received: 800, volume: 2000 },
  { name: 'Feb', sent: 1900, received: 1200, volume: 3100 },
  { name: 'Mar', sent: 3000, received: 2100, volume: 5100 },
  { name: 'Apr', sent: 2800, received: 1800, volume: 4600 },
  { name: 'May', sent: 1890, received: 2400, volume: 4290 },
  { name: 'Jun', sent: 2390, received: 3800, volume: 6190 },
];

const currencyData = [
  { name: 'ADA', value: 45, color: '#0ea5e9' },
  { name: 'USD', value: 30, color: '#22c55e' },
  { name: 'EUR', value: 15, color: '#f59e0b' },
  { name: 'GBP', value: 10, color: '#ef4444' },
];

const countryData = [
  { country: 'United States', transactions: 124, amount: 15420 },
  { country: 'United Kingdom', transactions: 89, amount: 12350 },
  { country: 'Germany', transactions: 76, amount: 9870 },
  { country: 'Canada', transactions: 54, amount: 7650 },
  { country: 'Australia', transactions: 43, amount: 5430 },
];

export default function Dashboard() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientWalletId, setRecipientWalletId] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [showQR, setShowQR] = useState(false);
  const [currentWalletAddress] = useState("addr1qxy2lm3dx4ehrnq6g8yp8zx4rrqq3z3qg8yp8zx4rrqq3z");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSendMoney = () => {
    if (!WalletService.validateWalletId(recipientWalletId)) {
      alert("Invalid wallet ID format");
      return;
    }

    try {
      const whatsappLink = WalletService.generateWhatsAppLink(recipientWalletId, sendAmount, selectedCurrency);
      window.open(whatsappLink, '_blank');
    } catch {
      alert("Wallet ID not found in contacts. Please add contact first.");
    }
  };

  return (
    <div className="min-h-screen w-full dark">
      <Head>
        <title>Dashboard - CardanoPay</title>
        <meta name="description" content="Manage your cross-border payments" />
      </Head>

      <main className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 cyber-grid opacity-20" />
        <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        
        {/* Header */}
        <header className="relative z-10 glass-effect border-b border-border/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-glow">CardanoPay</h1>
                  <p className="text-sm text-muted-foreground">Dashboard</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => router.push('/chat')}
                  className="hover:glow-effect"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowQR(!showQR)}
                  className="hover:glow-effect"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button 
                  variant="ghost"
                  className="hover:glow-effect"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Contacts
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="relative hover:glow-effect">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Button>
                
                <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  Connected
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          U
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass-effect">
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/security')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Security
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/')}>
                      <ArrowUpRight className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* QR Code Modal */}
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="glass-effect rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-glow">Your Wallet Address</h3>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <QRCode value={currentWalletAddress} size={200} />
                </div>
                <p className="text-sm text-muted-foreground mb-4 break-all">
                  {currentWalletAddress}
                </p>
                <Button 
                  onClick={() => navigator.clipboard.writeText(currentWalletAddress)}
                  className="w-full"
                >
                  Copy Address
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <div className={`relative z-10 container mx-auto px-6 py-8 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* AI Assistant FAB */}
          <motion.div 
            className="fixed bottom-6 right-6 z-40"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => router.push('/chat?contact=ai_assistant')}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 glow-effect shadow-lg group"
            >
              <Bot className="w-6 h-6 group-hover:animate-glow" />
            </Button>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button 
                onClick={() => router.push('/chat')}
                className="w-full h-20 glass-effect hover:glow-effect flex flex-col gap-2 transition-all duration-300"
                variant="ghost"
              >
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <span className="text-sm">Chat & Pay</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button 
                onClick={() => setShowQR(true)}
                className="w-full h-20 glass-effect hover:glow-effect flex flex-col gap-2 transition-all duration-300"
                variant="ghost"
              >
                <QrCode className="w-6 h-6 text-purple-400" />
                <span className="text-sm">QR Code</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button 
                className="w-full h-20 glass-effect hover:glow-effect flex flex-col gap-2 transition-all duration-300"
                variant="ghost"
              >
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-sm">Contacts</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button 
                className="w-full h-20 glass-effect hover:glow-effect flex flex-col gap-2 transition-all duration-300"
                variant="ghost"
              >
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-sm">Quick Send</span>
              </Button>
            </motion.div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Balance
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-blue-400 group-hover:animate-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-glow">$2,847.50</div>
                  <div className="flex items-center text-xs text-green-400 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5.2% from last month
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Volume
                  </CardTitle>
                  <Send className="h-4 w-4 text-purple-400 group-hover:animate-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-glow">$6,190</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    28 transactions
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Global Reach
                  </CardTitle>
                  <Globe className="h-4 w-4 text-cyan-400 group-hover:animate-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-glow">12</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Countries reached
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }}>
              <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Contacts
                  </CardTitle>
                  <MessageCircle className="h-4 w-4 text-green-400 group-hover:animate-glow" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-glow">47</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    WhatsApp verified
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Send Money Form */}
            <div className="lg:col-span-1">
              <Card className="glass-effect hover:glow-effect transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-glow">
                    <Send className="w-5 h-5" />
                    Send Money
                  </CardTitle>
                  <CardDescription>
                    Send money instantly via WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="walletId">Recipient Wallet ID</Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="walletId"
                        placeholder="addr1qxy2...4d7f8"
                        value={recipientWalletId}
                        onChange={(e) => setRecipientWalletId(e.target.value)}
                        className="pl-10 glass-effect border-blue-500/20 focus:border-blue-500/50 hover:glow-effect"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="amount"
                          placeholder="0.00"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="pl-10 glass-effect border-blue-500/20 focus:border-blue-500/50 hover:glow-effect"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger className="glass-effect border-blue-500/20 hover:glow-effect">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-effect">
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="ADA">ADA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Exchange Rate:</span>
                      <span className="font-medium">1 USD = 2.85 ADA</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee:</span>
                      <span className="font-medium text-green-400">~0.5 ADA</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSendMoney}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect group transition-all duration-300"
                    disabled={!sendAmount || !recipientWalletId}
                  >
                    <MessageCircle className="w-4 h-4 mr-2 group-hover:animate-glow" />
                    Send via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="recent" className="space-y-6">
                <TabsList className="glass-effect">
                  <TabsTrigger value="recent" className="data-[state=active]:bg-blue-500/20">
                    Recent Activity
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-blue-500/20">
                    Pending
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500/20">
                    Analytics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="recent">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-glow">
                        <History className="w-5 h-5" />
                        Recent Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockTransactions.map((tx, index) => (
                          <div 
                            key={tx.id} 
                            className={`flex items-center justify-between p-4 rounded-lg glass-effect hover:glow-effect transition-all duration-300 group cursor-pointer ${
                              isVisible ? 'animate-fade-in' : 'opacity-0'
                            }`}
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.type === 'sent' 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'bg-green-500/20 text-green-400'
                              } group-hover:animate-glow`}>
                                {tx.type === 'sent' ? (
                                  <ArrowUpRight className="w-5 h-5" />
                                ) : (
                                  <ArrowDownRight className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium group-hover:text-primary transition-colors">
                                    {tx.type === 'sent' ? `To ${tx.to}` : `From ${tx.from}`}
                                  </span>
                                  {tx.whatsapp && (
                                    <MessageCircle className="w-4 h-4 text-green-400" />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {tx.time}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold group-hover:text-primary transition-colors">
                                {tx.type === 'sent' ? '-' : '+'}${tx.amount} {tx.currency}
                              </div>
                              <div className="flex items-center gap-1">
                                {tx.status === 'completed' ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    <span className="text-sm text-green-400">Completed</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm text-yellow-400">Pending</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="pending">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-glow">
                        <Clock className="w-5 h-5" />
                        Pending Transactions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockTransactions.filter(tx => tx.status === 'pending').map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg glass-effect">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                                <AlertCircle className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">{tx.type === 'sent' ? `To ${tx.to}` : `From ${tx.from}`}</div>
                                <div className="text-sm text-muted-foreground">{tx.time}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${tx.amount} {tx.currency}</div>
                              <Progress value={65} className="w-20 h-2 mt-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Transaction Volume Chart */}
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-glow">
                          <TrendingUp className="w-5 h-5" />
                          Transaction Volume
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="name" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                  border: '1px solid #374151',
                                  borderRadius: '8px' 
                                }}
                              />
                              <Line type="monotone" dataKey="sent" stroke="#3B82F6" strokeWidth={3} />
                              <Line type="monotone" dataKey="received" stroke="#10B981" strokeWidth={3} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Currency Distribution */}
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-glow">
                          <PieChartIcon className="w-5 h-5" />
                          Currency Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={currencyData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                              >
                                {currencyData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Global Transactions */}
                    <Card className="glass-effect lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-glow">
                          <Globe className="w-5 h-5" />
                          Global Transactions
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countryData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis dataKey="country" stroke="#9CA3AF" />
                              <YAxis stroke="#9CA3AF" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                                  border: '1px solid #374151',
                                  borderRadius: '8px' 
                                }}
                              />
                              <Bar dataKey="amount" fill="#8B5CF6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="glass-effect lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-glow">Quick Statistics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          <div className="text-center p-4 glass-effect rounded-lg">
                            <div className="text-2xl font-bold text-blue-400">$6,190</div>
                            <div className="text-sm text-muted-foreground">Total Volume</div>
                          </div>
                          <div className="text-center p-4 glass-effect rounded-lg">
                            <div className="text-2xl font-bold text-green-400">28</div>
                            <div className="text-sm text-muted-foreground">Transactions</div>
                          </div>
                          <div className="text-center p-4 glass-effect rounded-lg">
                            <div className="text-2xl font-bold text-purple-400">$221</div>
                            <div className="text-sm text-muted-foreground">Avg. Transaction</div>
                          </div>
                          <div className="text-center p-4 glass-effect rounded-lg">
                            <div className="text-2xl font-bold text-cyan-400">5</div>
                            <div className="text-sm text-muted-foreground">Countries</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}