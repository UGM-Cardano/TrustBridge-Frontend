import Head from "next/head";
import { useState, useEffect } from "react";
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
  AlertCircle
} from "lucide-react";

const mockTransactions = [
  { id: "1", type: "sent", amount: 250, currency: "USD", to: "+1234567890", status: "completed", time: "2 hours ago", whatsapp: true },
  { id: "2", type: "received", amount: 180, currency: "EUR", from: "+9876543210", status: "completed", time: "1 day ago", whatsapp: true },
  { id: "3", type: "sent", amount: 420, currency: "GBP", to: "+1122334455", status: "pending", time: "2 days ago", whatsapp: true },
  { id: "4", type: "received", amount: 75, currency: "USD", from: "+5566778899", status: "completed", time: "3 days ago", whatsapp: true },
];

export default function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const [sendAmount, setSendAmount] = useState("");
  const [recipientWalletId, setRecipientWalletId] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD");

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
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-green-500/20 text-green-400 bg-green-500/10">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                  Connected
                </Badge>
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    U
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        <div className={`relative z-10 container mx-auto px-6 py-8 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Balance
                </CardTitle>
                <Wallet className="h-4 w-4 text-blue-400 group-hover:animate-glow" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-glow">$2,847.50</div>
                <div className="flex items-center text-xs text-green-400 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5.2% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Month
                </CardTitle>
                <Send className="h-4 w-4 text-purple-400 group-hover:animate-glow" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-glow">$1,235.80</div>
                <div className="text-xs text-muted-foreground mt-1">
                  12 transactions sent
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect hover:glow-effect transition-all duration-300 group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Contacts
                </CardTitle>
                <MessageCircle className="h-4 w-4 text-green-400 group-hover:animate-glow" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-glow">47</div>
                <div className="text-xs text-muted-foreground mt-1">
                  WhatsApp verified
                </div>
              </CardContent>
            </Card>
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
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-glow">
                        <TrendingUp className="w-5 h-5" />
                        Payment Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="text-center p-6 glass-effect rounded-lg">
                            <div className="text-3xl font-bold text-blue-400">$5,420</div>
                            <div className="text-muted-foreground">Total Volume</div>
                          </div>
                          <div className="text-center p-6 glass-effect rounded-lg">
                            <div className="text-3xl font-bold text-green-400">28</div>
                            <div className="text-muted-foreground">Transactions</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="text-center p-6 glass-effect rounded-lg">
                            <div className="text-3xl font-bold text-purple-400">$23.50</div>
                            <div className="text-muted-foreground">Avg. Transaction</div>
                          </div>
                          <div className="text-center p-6 glass-effect rounded-lg">
                            <div className="text-3xl font-bold text-cyan-400">12</div>
                            <div className="text-muted-foreground">Countries</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}