'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Shield } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const INITIAL_GREETING = "Hi, I'm JEEWAN. You can talk to me about anything — I'm here to listen, not judge. What's on your mind today?";

const QUICK_REPLIES = [
  'How to say no to friends',
  'Signs of addiction',
  'I need urgent help',
];

const BOT_RESPONSES: Record<string, string[]> = {
  default: [
    "I understand. Tell me more about what you're experiencing.",
    "That sounds challenging. Would you like to talk about it?",
    "I'm here to listen. Take your time.",
  ],
  help: [
    "I'm glad you're reaching out. Here's how I can help:\n\n• Listen to your concerns\n• Provide coping strategies\n• Connect you with professionals\n• Answer questions about addiction\n\nWhat would help most right now?",
  ],
  sad: [
    "It sounds like you're going through a difficult time. These feelings are valid. Would you like to talk about what's making you feel this way?",
  ],
  suicidal: [
    "I care about your safety. If you're having thoughts of harm, please reach out immediately:\n\n📞 Call 112 (Emergency)\n📞 iCall Helpline: 9152987821\n\nYou're not alone. Would you like me to connect you with professional help?",
  ],
  recovery: [
    "That's wonderful! Recovery is a journey, and every step forward counts. Keep celebrating these wins! What's been helping you stay strong?",
  ],
  friends: [
    "Peer pressure is really hard, especially when it feels like everyone is doing it. Here are some strategies:\n\n• Be firm and direct: \"No thanks, I'm good\"\n• Change the subject\n• Suggest an alternative activity\n• Walk away if needed\n\nRemember, real friends respect your choices.",
  ],
  signs: [
    "Common signs of addiction include:\n\n• Increased tolerance (needing more)\n• Withdrawal symptoms when stopping\n• Loss of control over use\n• Neglecting responsibilities\n• Continued use despite problems\n• Changes in behavior or mood\n\nWould you like to take our risk assessment quiz?",
  ],
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', type: 'bot', content: INITIAL_GREETING, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) return BOT_RESPONSES.help[0];
    if (lowerMessage.includes('say no') || lowerMessage.includes('friends') || lowerMessage.includes('peer')) return BOT_RESPONSES.friends[0];
    if (lowerMessage.includes('sign') || lowerMessage.includes('symptom') || lowerMessage.includes('addiction')) return BOT_RESPONSES.signs[0];
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed')) return BOT_RESPONSES.sad[0];
    if (lowerMessage.includes('suicide') || lowerMessage.includes('harm') || lowerMessage.includes('urgent')) return BOT_RESPONSES.suicidal[0];
    if (lowerMessage.includes('recover') || lowerMessage.includes('clean') || lowerMessage.includes('sober')) return BOT_RESPONSES.recovery[0];
    return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const botResponse: Message = { id: (Date.now() + 1).toString(), type: 'bot', content: getBotResponse(text), timestamp: new Date() };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 600 + Math.random() * 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
          {/* Header */}
          <div className="border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-jeewan-calm flex items-center justify-center text-white text-sm font-bold">J</div>
              <div>
                <h1 className="font-bold text-sm text-foreground">JEEWAN Assistant</h1>
                <p className="text-xs text-jeewan-nature flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-jeewan-nature inline-block" />
                  Online — always here for you
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-[10px] bg-muted text-jeewan-muted px-2.5 py-1 rounded-full font-medium">
              <Shield className="w-3 h-3" /> 100% private
            </span>
          </div>

          {/* Messages */}
          <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-float-up`}>
                {msg.type === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-jeewan-calm flex-shrink-0 mr-2 mt-1" />
                )}
                <div className={`max-w-[75%] px-4 py-3 text-sm whitespace-pre-wrap ${
                  msg.type === 'user'
                    ? 'bg-jeewan-calm text-white rounded-[16px_0_16px_16px]'
                    : 'bg-jeewan-calm-light dark:bg-jeewan-calm-light text-jeewan-ink2 dark:text-foreground rounded-[0_16px_16px_16px]'
                }`}>
                  {msg.content}
                  <span className="block text-[10px] opacity-60 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-jeewan-calm flex-shrink-0 mr-2 mt-1" />
                <div className="bg-jeewan-surface dark:bg-muted rounded-[0_16px_16px_16px] px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-jeewan-muted animate-dot-bounce" />
                  <div className="w-2 h-2 rounded-full bg-jeewan-muted animate-dot-bounce" style={{ animationDelay: '0.15s' }} />
                  <div className="w-2 h-2 rounded-full bg-jeewan-muted animate-dot-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {QUICK_REPLIES.map((text, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(text)}
                  className="px-3 py-1.5 rounded-full border border-jeewan-calm-mid text-jeewan-calm text-xs font-medium hover:bg-jeewan-calm-light transition"
                >
                  {text}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-3 flex gap-2">
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage(input))}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-jeewan-surface dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm focus:border-jeewan-calm focus:ring-1 focus:ring-jeewan-calm/20 transition placeholder:text-jeewan-muted"
            />
            <button
              id="chat-send"
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-jeewan-calm hover:bg-jeewan-calm/90 text-white rounded-full flex items-center justify-center transition disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Crisis Note */}
        <div className="mt-4 p-3 bg-jeewan-warn-light border border-jeewan-warn/30 rounded-xl">
          <p className="text-xs text-jeewan-ink2 dark:text-jeewan-muted">
            <strong>Note:</strong> This AI provides support and guidance. For emergencies, call <a href="tel:112" className="font-bold text-jeewan-calm">112</a> or iCall: <a href="tel:9152987821" className="font-bold text-jeewan-calm">9152987821</a>
          </p>
        </div>
      </div>
    </div>
  );
}
