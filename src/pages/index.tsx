import Head from "next/head";
import { WalletConnect } from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Zap, Shield, Globe, ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen w-full dark">
      <Head>
        <title>CardanoPay - Cross-Border Payments via WhatsApp</title>
        <meta name="description" content="Send money across borders instantly using WhatsApp and Cardano blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Hero Section */}
      <main className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 cyber-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
        
        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between p-6 glass-effect">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-glow">CardanoPay</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#security" className="text-muted-foreground hover:text-primary transition-colors">Security</a>
            <Button 
              variant="outline" 
              className="hover:glow-effect transition-all duration-300"
              onClick={() => router.push('/dashboard')}
            >
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className={`relative z-10 container mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="mb-8">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 animate-glow">
              Powered by Cardano Blockchain
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-glow">
              Send Money Via
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                WhatsApp
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Revolutionary cross-border payments using WhatsApp messages and Cardano blockchain. 
              Send money to anyone, anywhere, instantly and securely.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect text-lg px-8 py-3 group transition-all duration-300"
              onClick={() => router.push('/dashboard')}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 hover:glow-effect transition-all duration-300"
            >
              Watch Demo
            </Button>
          </div>

          <div className="mb-16 flex justify-center">
            <WalletConnect />
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Why Choose CardanoPay?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of cross-border payments with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: MessageCircle,
                title: "WhatsApp Integration",
                description: "Send payments directly through WhatsApp messages. No new apps to download.",
                gradient: "from-green-500 to-emerald-600"
              },
              {
                icon: Zap,
                title: "Instant Transfers",
                description: "Lightning-fast transactions powered by Cardano's efficient blockchain technology.",
                gradient: "from-yellow-500 to-orange-600"
              },
              {
                icon: Shield,
                title: "Bank-Grade Security",
                description: "Multi-signature wallets and smart contracts ensure your money is always safe.",
                gradient: "from-purple-500 to-pink-600"
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Send money to over 180 countries with competitive exchange rates.",
                gradient: "from-blue-500 to-cyan-600"
              },
              {
                icon: Sparkles,
                title: "Low Fees",
                description: "Save up to 90% on traditional remittance fees with blockchain technology.",
                gradient: "from-indigo-500 to-purple-600"
              },
              {
                icon: ArrowRight,
                title: "Easy Setup",
                description: "Get started in minutes with just your WhatsApp number and a Cardano wallet.",
                gradient: "from-teal-500 to-green-600"
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className={`glass-effect hover:glow-effect transition-all duration-300 hover:-translate-y-2 group cursor-pointer ${
                  isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center group-hover:animate-glow`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to send money anywhere in the world
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Connect Wallet",
                description: "Link your Cardano wallet to get started with secure transactions."
              },
              {
                step: "02", 
                title: "Send via WhatsApp",
                description: "Type your payment command in WhatsApp and confirm the transaction."
              },
              {
                step: "03",
                title: "Money Delivered",
                description: "Recipient receives instant notification and can claim their funds."
              }
            ].map((step, index) => (
              <div 
                key={index} 
                className={`text-center group transition-all duration-500 hover:-translate-y-2 ${
                  isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white group-hover:animate-glow transition-all duration-300">
                    {step.step}
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 animate-shimmer" 
                         style={{ transform: 'translateX(50%)' }} />
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 container mx-auto px-6 py-20 text-center">
          <div className="glass-effect rounded-2xl p-12 hover:glow-effect transition-all duration-300">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-glow">
              Ready to Transform Your Payments?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users already sending money seamlessly across borders
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect text-lg px-12 py-4 group transition-all duration-300"
              onClick={() => router.push('/dashboard')}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-border/50 py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>&copy; 2024 CardanoPay. Powered by Cardano Blockchain.</p>
        </div>
      </footer>
    </div>
  );
}
