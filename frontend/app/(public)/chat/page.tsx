'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Shield, Trash2, AlertTriangle, MessageSquareHeart } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isCrisis?: boolean;
}

const INITIAL_GREETING = "Hello! I'm **JEEWAN**, your AI companion for drug awareness and support. 💙\n\nYou can talk to me about anything — peer pressure, addiction concerns, recovery, or just how you're feeling. I'm here to listen, not judge.\n\nHow can I help you today?";

const QUICK_REPLIES = [
  { text: 'Am I addicted?', icon: '🔍' },
  { text: 'How to say no to friends', icon: '🛡️' },
  { text: 'What is withdrawal?', icon: '💊' },
  { text: 'Legal rights in India', icon: '⚖️' },
  { text: 'I need urgent help', icon: '🆘' },
  { text: 'Take risk assessment quiz', icon: '📋' },
];

const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_URL || 'http://localhost:8003';

export default function ChatPage() {
  const { user } = useAuth();
  const sessionId = user?.uid || `anon-${Date.now()}`;

  const [messages, setMessages] = useState<Message[]>([
    { id: '0', type: 'bot', content: INITIAL_GREETING, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Safe manual scroll to be called exactly when needed, preventing aggressive mid-reading jumps
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load history from backend on mount
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`${CHAT_API_URL}/chat/history?session_id=${sessionId}`);
        const data = await res.json();
        if (data.messages?.length) {
          const historyMsgs: Message[] = data.messages.map((m: any, i: number) => ({
            id: `hist-${i}`,
            type: m.role === 'user' ? 'user' : 'bot',
            content: m.content,
            timestamp: new Date(),
          }));
          setMessages([{ id: '0', type: 'bot', content: INITIAL_GREETING, timestamp: new Date() }, ...historyMsgs]);
          setShowQuickReplies(false);
          // Scroll to bottom only on initial load
          setTimeout(scrollToBottom, 100);
        }
      } catch {}
    }
    loadHistory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowQuickReplies(false);
    
    // Auto-scroll so the user sees their own message appear instantly
    setTimeout(scrollToBottom, 50);

    try {
      const res = await fetch(`${CHAT_API_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, session_id: sessionId }),
      });
      const data = await res.json();
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: data.response || "I'm here for you. Could you tell me more?",
        timestamp: new Date(),
        isCrisis: data.is_crisis,
      };
      
      setMessages((prev) => [...prev, botResponse]);

      // Smart auto-scroll for bot reply: only scroll if user hasn't scrolled up manually
      setTimeout(() => {
        if (chatContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
          const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
          if (isNearBottom) scrollToBottom();
        }
      }, 50);

    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "I'm having trouble connecting right now. If you need immediate help, please call **9152987821** (iCall Helpline).",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    
    setIsLoading(false);
    inputRef.current?.focus();
  };

  const clearChat = async () => {
    try {
      await fetch(`${CHAT_API_URL}/chat/clear?session_id=${sessionId}`, { method: 'POST' });
    } catch {}
    setMessages([{ id: '0', type: 'bot', content: INITIAL_GREETING, timestamp: new Date() }]);
    setShowQuickReplies(true);
  };

  const formatMessage = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-lg flex flex-col" style={{ height: 'calc(100vh - 150px)', minHeight: '600px' }}>
          
          {/* Header */}
          <div className="border-b border-border bg-gradient-to-r from-jeewan-calm/10 to-transparent px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-jeewan-calm flex items-center justify-center text-white shadow-md">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">JEEWAN AI Counsellor</h1>
                <p className="text-sm text-jeewan-nature flex items-center gap-1.5 font-medium mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-jeewan-nature inline-block animate-pulse" />
                  {isLoading ? 'JEEWAN is typing...' : 'Online — Private & Secure'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs bg-muted text-jeewan-muted px-3 py-1.5 rounded-full font-bold shadow-inner">
                <Shield className="w-3.5 h-3.5" /> Confidential
              </span>
              <button 
                onClick={clearChat} 
                className="p-2 rounded-xl hover:bg-red-500/10 hover:text-red-500 text-jeewan-muted transition" 
                title="Clear chat and restart"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-texture-subtle scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-3xl px-5 py-4 shadow-sm ${
                  msg.type === 'user'
                    ? 'bg-jeewan-calm text-white rounded-br-md shadow-jeewan-calm/20'
                    : msg.isCrisis
                      ? 'bg-jeewan-warn-light border-2 border-jeewan-warn/30 text-foreground rounded-bl-md'
                      : 'bg-surface border border-border text-foreground rounded-bl-md shadow-sm backdrop-blur-md'
                }`}>
                  {msg.isCrisis && (
                    <div className="flex items-center gap-2 text-jeewan-warn text-sm font-bold mb-3 border-b border-jeewan-warn/20 pb-2">
                      <AlertTriangle className="w-4 h-4" /> Crisis Protocol Activated
                    </div>
                  )}
                  <div className="text-[15px] leading-relaxed tracking-wide" dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                  <p className={`text-[10px] mt-2 font-medium ${msg.type === 'user' ? 'text-white/60 text-right' : 'text-jeewan-muted text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border rounded-3xl rounded-bl-md px-5 py-5 shadow-sm">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 bg-jeewan-calm/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-jeewan-calm/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-jeewan-calm/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible div for targeted scrolling */}
            <div ref={messagesEndRef} className="h-1" />
          </div>

          {/* Quick Replies */}
          {showQuickReplies && !isLoading && (
            <div className="px-6 pb-4 bg-gradient-to-t from-background to-transparent pt-4">
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((qr) => (
                  <button
                    key={qr.text}
                    onClick={() => sendMessage(qr.text)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-card text-sm font-semibold text-foreground hover:border-jeewan-calm hover:bg-jeewan-calm-light hover:text-jeewan-calm shadow-sm transition-all hover:scale-105"
                  >
                    <span className="text-base">{qr.icon}</span> {qr.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Input Area */}
          <div className="border-t border-border p-5 bg-card">
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex items-center gap-3 relative"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message JEEWAN... (e.g. I need advice about peer pressure)"
                className="flex-1 p-4 pl-6 rounded-full border border-border bg-surface text-foreground text-[15px] focus:border-jeewan-calm focus:ring-4 focus:ring-jeewan-calm/10 transition outline-none shadow-inner"
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-4 rounded-full bg-jeewan-calm text-white shadow-xl shadow-jeewan-calm/20 hover:bg-blue-600 hover:scale-105 transition-all disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none absolute right-1 top-1 bottom-1 flex items-center justify-center my-auto aspect-square"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-1" />}
              </button>
            </form>
            {user && (
              <p className="text-xs text-jeewan-muted mt-3 text-center font-medium">
                Logged in securely as <span className="text-foreground">{user.displayName || user.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
