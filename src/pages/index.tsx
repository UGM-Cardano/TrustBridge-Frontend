import Head from "next/head";
import { Button } from "@/components/ui/button";
import { CreditCard, ArrowRight, MessageCircle, Zap, Shield, Globe, BookOpen } from "lucide-react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Head>
        <title>TrustBridge - Cross-Border Payments via WhatsApp</title>
        <meta name="description" content="Send money across borders instantly using WhatsApp and Cardano blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="glass border-0 border-b border-blue-500/20 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center glow-blue">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-glow">TrustBridge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.open('https://tera-finance.gitbook.io/trustbridge', '_blank')}
                className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 font-semibold px-4 py-2"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
              <Button
                onClick={() => router.push('/login')}
                className="btn-space font-semibold px-6 py-2"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Single Landing Section */}
      <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Documentation Highlight Banner */}
          <div className="mb-6">
            <div className="inline-flex items-center px-8 py-4 rounded-2xl glass border border-purple-400/40 text-purple-200 text-base font-semibold glow-purple bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 transition-all duration-300 cursor-pointer group"
                 onClick={() => window.open('https://tera-finance.gitbook.io/trustbridge', '_blank')}>
              <BookOpen className="w-5 h-5 mr-3 text-purple-300 group-hover:text-purple-200 transition-colors" />
              <span className="text-glow bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
                📚 Read our product documentation
              </span>
              <ArrowRight className="w-4 h-4 ml-3 text-purple-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="inline-flex items-center px-6 py-3 rounded-full glass border border-blue-400/30 text-blue-300 text-sm font-medium mb-8 glow-blue">
            <span className="text-glow">⚡ Powered by Cardano Blockchain</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 leading-tight">
            Send Money Via
            <br />
            <span className="gradient-text-cosmic">WhatsApp</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Revolutionary cross-border payments using WhatsApp messages and Cardano blockchain.
            Send money to anyone, anywhere, instantly and securely.
          </p>

          {/* Key Stats Inline */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-12 text-sm sm:text-lg text-blue-200">
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Globe className="w-6 h-6 text-blue-400" />
              <span><span className="font-bold text-white">180+</span> Countries</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Zap className="w-6 h-6 text-green-400" />
              <span><span className="font-bold text-white">1.5%</span> Fee</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Shield className="w-6 h-6 text-purple-400" />
              <span><span className="font-bold text-white">2-5min</span> Speed</span>
            </div>
          </div>

          {/* Main CTA */}
          <div className="space-y-6">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="btn-space text-lg sm:text-xl md:text-2xl px-8 sm:px-12 md:px-16 py-6 sm:py-8 rounded-2xl group glow-effect"
            >
              <MessageCircle className="mr-2 sm:mr-4 h-6 w-6 sm:h-8 sm:w-8" />
              Start Sending Money
              <ArrowRight className="ml-2 sm:ml-4 h-6 w-6 sm:h-8 sm:w-8 group-hover:translate-x-1 transition-transform" />
            </Button>

            <p className="text-blue-300 text-sm">
              🔒 Bank-grade security • ⚡ Lightning fast • 🌍 Global reach
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass border-t border-blue-500/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-blue-300">
          <p>&copy; 2024 TrustBridge. Powered by Cardano Blockchain Technology.</p>
        </div>
      </footer>
    </div>
  );
}