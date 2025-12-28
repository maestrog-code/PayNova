
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { generateNovaResponse } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles, Mic, MicOff } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am Nova, your PayNova assistant. How can I help you with your transfers or currency exchanges today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const suggestedPrompts = [
    "How do I transfer money?",
    "What are the exchange fees?",
    "Is PayNova secure?",
    "Supported currencies"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return alert("Speech recognition not supported.");
    if (isListening) recognitionRef.current.stop();
    else { setIsListening(true); recognitionRef.current.start(); }
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const streamResponse = await generateNovaResponse(messages, text);
      let fullResponse = "";
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      for await (const chunk of streamResponse) {
        fullResponse += chunk.text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullResponse;
          return updated;
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a processing error. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-tr from-[#4facfe] to-[#9cff57] rounded-full flex items-center justify-center transition-all ${isTyping ? 'animate-pulse scale-110' : ''}`}>
                <Bot className="w-6 h-6 text-black" />
            </div>
            <div>
                <h2 className="text-lg font-bold">Nova AI</h2>
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-[#4facfe] animate-ping' : 'bg-green-500'}`}></div>
                    <span className="text-xs text-gray-400">Online</span>
                </div>
            </div>
        </div>
        <button className="text-xs text-gray-500 hover:text-white" onClick={() => setMessages([messages[0]])}>Clear</button>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden min-h-0 border-[#4facfe]/20">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
              <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-[#4facfe]" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-[#4facfe] text-black rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none'}`}>
                  {msg.content || <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          {messages.length === 1 && !isTyping && (
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                {suggestedPrompts.map(p => (
                    <button key={p} onClick={() => handleSendMessage(p)} className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#4facfe] whitespace-nowrap">{p}</button>
                ))}
            </div>
          )}
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex gap-2">
            <input 
              type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nova..." disabled={isTyping}
              className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-3 pr-20 text-sm focus:border-[#4facfe] outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <button type="button" onClick={toggleListening} className={`p-2 rounded-lg ${isListening ? 'text-red-500' : 'text-gray-500'}`}><Mic className="w-4 h-4" /></button>
              <button type="submit" disabled={!input.trim() || isTyping} className="p-2 bg-[#4facfe] text-black rounded-lg"><Send className="w-4 h-4" /></button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
