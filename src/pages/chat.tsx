import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft,
  Bot,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  Paperclip,
  Smile,
  Mic
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { aiService } from "@/lib/aiService";
import { useWallet } from "@/contexts/WalletContext";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'contact' | 'ai';
  timestamp: Date;
  type: 'text' | 'payment' | 'payment_request' | 'system';
  paymentData?: {
    amount: string;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    txHash?: string;
  };
}

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export default function Chat() {
  const router = useRouter();
  const { wallet } = useWallet();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock contacts data
  useEffect(() => {
    setContacts([
      {
        id: 'contact_1',
        name: 'John Doe',
        walletAddress: 'addr1qxy2lm3dx4ehrnq6g8yp8zx4rrqq3z3qg8yp8zx4rrqq',
        isOnline: true,
      },
      {
        id: 'contact_2', 
        name: 'Alice Smith',
        walletAddress: 'addr1qxy2lm3dx4ehrnq6g8yp8zx4rrqq3z3qg8yp8zx4rrqq',
        isOnline: false,
        lastSeen: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        id: 'ai_assistant',
        name: 'TrustBridge AI',
        walletAddress: '',
        isOnline: true,
      }
    ]);

    // Set default selected contact
    setSelectedContact({
      id: 'contact_1',
      name: 'John Doe',
      walletAddress: 'addr1qxy2lm3dx4ehrnq6g8yp8zx4rrqq3z3qg8yp8zx4rrqq',
      isOnline: true,
    });

    // Mock initial messages
    setMessages([
      {
        id: '1',
        text: 'Hey! How are you doing?',
        sender: 'contact',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        type: 'text'
      },
      {
        id: '2',
        text: 'Good! I just set up TrustBridge. Want to try a quick payment?',
        sender: 'user',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        type: 'text'
      },
      {
        id: '3',
        text: 'Sure! Send me 25 ADA for the lunch we shared yesterday.',
        sender: 'contact',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        type: 'text'
      },
      {
        id: '4',
        text: '',
        sender: 'user',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        type: 'payment',
        paymentData: {
          amount: '25',
          currency: 'ADA',
          status: 'completed',
          txHash: 'tx_abc123...'
        }
      }
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
    setIsTyping(true);

    // Check if it's a payment command
    if (newMessage.toLowerCase().includes('/pay') || newMessage.toLowerCase().includes('send')) {
      await handlePaymentCommand(newMessage);
    }
    // Check if talking to AI assistant
    else if (selectedContact?.id === 'ai_assistant') {
      await handleAIResponse(newMessage);
    }
    // Simulate contact response
    else {
      setTimeout(() => {
        const responses = [
          "Thanks for the payment!",
          "Got it, looks good!",
          "Perfect, transaction confirmed.",
          "Sounds good to me!",
          "No problem at all."
        ];
        
        const response: Message = {
          id: Date.now().toString(),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'contact',
          timestamp: new Date(),
          type: 'text'
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handlePaymentCommand = async (command: string) => {
    // Parse payment command (e.g., "/pay 50 USD" or "send 25 ADA")
    const paymentRegex = /(?:pay|send)\s+(\d+(?:\.\d+)?)\s*([A-Z]{3})?/i;
    const match = command.match(paymentRegex);
    
    if (match && selectedContact) {
      const amount = match[1];
      const currency = match[2] || 'ADA';
      
      const paymentMessage: Message = {
        id: Date.now().toString(),
        text: `Payment sent: ${amount} ${currency}`,
        sender: 'user',
        timestamp: new Date(),
        type: 'payment',
        paymentData: {
          amount,
          currency,
          status: 'pending'
        }
      };
      
      setMessages(prev => [...prev, paymentMessage]);
      
      // Simulate payment processing
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === paymentMessage.id 
            ? { ...msg, paymentData: { ...msg.paymentData!, status: 'completed', txHash: 'tx_' + Date.now() } }
            : msg
        ));
        setIsTyping(false);
      }, 3000);   
    } else {
      setIsTyping(false);
    }
  };

  const handleAIResponse = async (userMessage: string) => {
    try {
      const aiResponse = await aiService.generateResponse(userMessage, { wallet: !!wallet });
      
      const response: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (message: Message) => {
    const isOwnMessage = message.sender === 'user';
    const isAI = message.sender === 'ai';
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-end gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isOwnMessage && (
            <Avatar className="w-8 h-8">
              <AvatarFallback className={isAI ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-blue-500"}>
                {isAI ? <Bot className="w-4 h-4" /> : selectedContact?.name[0]}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`${isOwnMessage ? 'bg-blue-600' : isAI ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'glass-effect'} rounded-lg p-3 shadow-sm`}>
            {message.type === 'payment' && message.paymentData ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-medium">
                    {message.paymentData.amount} {message.paymentData.currency}
                  </span>
                  {message.paymentData.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  )}
                  {message.paymentData.status === 'pending' && (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                  {message.paymentData.status === 'failed' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: {message.paymentData.status}
                  {message.paymentData.txHash && (
                    <div className="mt-1">Tx: {message.paymentData.txHash.substring(0, 12)}...</div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            )}
            
            <div className="text-xs text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="h-screen w-full dark flex">
      <Head>
        <title>Chat - TrustBridge</title>
        <meta name="description" content="WhatsApp-style messaging for crypto payments" />
      </Head>

      {/* Animated Background */}
      <div className="fixed inset-0 cyber-grid opacity-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />

      {/* Contacts Sidebar */}
      <div className="w-80 glass-effect border-r border-border/50 flex flex-col">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold text-glow">Chats</h2>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:glow-effect ${
                  selectedContact?.id === contact.id ? 'bg-blue-500/20' : ''
                }`}
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className={contact.id === 'ai_assistant' ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-blue-500"}>
                    {contact.id === 'ai_assistant' ? <Bot className="w-6 h-6" /> : contact.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium truncate">{contact.name}</h3>
                    {contact.isOnline && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {contact.id === 'ai_assistant' 
                      ? 'Your AI Assistant' 
                      : contact.walletAddress.substring(0, 20) + '...'
                    }
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="glass-effect border-b border-border/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={selectedContact.id === 'ai_assistant' ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-blue-500"}>
                      {selectedContact.id === 'ai_assistant' ? <Bot className="w-5 h-5" /> : selectedContact.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.isOnline ? 'Online' : 
                        selectedContact.lastSeen ? `Last seen ${selectedContact.lastSeen.toLocaleTimeString()}` : 'Offline'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-2">
                <AnimatePresence>
                  {messages.map((message) => renderMessage(message))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start mb-4"
                  >
                    <div className="glass-effect rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="glass-effect border-t border-border/50 p-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message... (Try: /pay 50 ADA)"
                    className="glass-effect border-blue-500/20 focus:border-blue-500/50 pr-20"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-effect"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {selectedContact.id === 'ai_assistant' && (
                <div className="mt-2 text-xs text-muted-foreground">
                  💡 Ask me about payments, wallet setup, fees, security, or any TrustBridge questions!
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-glow">Welcome to TrustBridge Chat</h3>
              <p className="text-muted-foreground">Select a contact to start messaging and sending payments</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}