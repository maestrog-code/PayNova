
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Send, Bot, User, Loader2, Sparkles, MessageCircle, ArrowRight, Mic, MicOff } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Add Speech Recognition types
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

  // Initialize Speech Recognition
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

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const streamResponse = await ai.models.generateContentStream({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text }] }
        ],
        config: {
          systemInstruction: "You are Nova, the intelligent AI assistant for the PayNova fintech app. PayNova is a futuristic platform for instant money transfers and currency exchange (1.5% flat fee). Your goal is to help users navigate the app, explain how to send money or swap currencies, and answer general financial questions. Keep your tone professional, tech-savvy, and concise. Always focus on PayNova's ease of use and security.",
        }
      });

      let fullResponse = "";
      // Initialize assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      for await (const chunk of streamResponse) {
        const chunkText = chunk.text;
        fullResponse += chunkText;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = fullResponse;
          return updated;
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] flex flex-col gap-4 md:gap-6 animate-fadeIn">
      <div className="flex items-center justify-between px-2 shrink-0">
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-tr from-[#4facfe] to-[#9cff57] rounded-full flex items-center justify-center transition-all duration-500 ${isTyping ? 'shadow-[0_0_20px_rgba(79,172,254,0.6)] scale-110' : 'shadow-[0_0_15px_rgba(79,172,254,0.4)]'}`}>
                <Bot className={`w-5 h-5 md:w-6 md:h-6 text-black ${isTyping ? 'animate-pulse' : ''}`} />
            </div>
            <div>
                <h2 className="text-lg md:text-xl font-bold">Nova AI</h2>
                <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-[#4facfe] animate-ping' : 'bg-green-500 animate-pulse'}`}></div>
                    <span className="text-[10px] md:text-xs text-gray-400">
                      {isTyping ? 'Nova is thinking...' : isListening ? 'Nova is listening...' : 'Intelligent Assistant Online'}
                    </span>
                </div>
            </div>
        </div>
        <button className="text-[10px] md:text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1" onClick={() => setMessages([messages[0]])}>
            Clear Chat
        </button>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border-[#4facfe]/20 min-h-0">
        {/* Chat Area - min-h-0 and flex-1 are key for correct scrolling inside a flex container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1;
            const isStreaming = isTyping && isLast && msg.role === 'assistant';
            const isEmpty = msg.content === "";

            return (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                <div className={`flex gap-3 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border transition-all duration-300 ${
                    msg.role === 'user' 
                    ? 'bg-white/5 border-white/10' 
                    : `bg-[#4facfe]/10 border-[#4facfe]/30 ${isStreaming ? 'shadow-[0_0_8px_rgba(79,172,254,0.4)]' : ''}`
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-gray-400" /> : <Sparkles className={`w-4 h-4 text-[#4facfe] ${isStreaming ? 'animate-pulse' : ''}`} />}
                  </div>
                  
                  {/* Message Bubble or Typing Indicator */}
                  {!isEmpty ? (
                    <div className={`p-3 md:p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.role === 'user'
                      ? 'bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-black font-medium rounded-tr-none'
                      : 'bg-[#1e2a5e]/40 border border-white/5 text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-[#1e2a5e]/40 border border-white/5 p-3 md:p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                       <div className="flex gap-1.5 items-center">
                          <div className="w-1.5 h-1.5 bg-[#4facfe] rounded-full animate-[bounce_1s_infinite_0ms] shadow-[0_0_5px_rgba(79,172,254,0.5)]"></div>
                          <div className="w-1.5 h-1.5 bg-[#4facfe] rounded-full animate-[bounce_1s_infinite_200ms] shadow-[0_0_5px_rgba(79,172,254,0.5)]"></div>
                          <div className="w-1.5 h-1.5 bg-[#4facfe] rounded-full animate-[bounce_1s_infinite_400ms] shadow-[0_0_5px_rgba(79,172,254,0.5)]"></div>
                       </div>
                       <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Nova is processing</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {/* Dummy element to anchor the scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - shrink-0 ensures it stays visible */}
        <div className="p-3 md:p-4 border-t border-white/5 bg-black/20 shrink-0">
          {messages.length === 1 && !isTyping && (
            <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto scrollbar-hide">
                {suggestedPrompts.map(prompt => (
                    <button 
                        key={prompt}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[10px] md:text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:border-[#4facfe] hover:text-[#4facfe] transition-all whitespace-nowrap"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="relative flex items-center gap-2"
          >
            <div className="relative flex-1">
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isTyping ? "Nova is busy..." : isListening ? "Listening..." : "Ask Nova anything..."}
                    disabled={isTyping}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-xl p-3 md:p-4 pr-16 text-sm text-white focus:border-[#4facfe] focus:outline-none focus:ring-1 focus:ring-[#4facfe] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 md:gap-2">
                    <button 
                        type="button"
                        onClick={toggleListening}
                        disabled={isTyping}
                        className={`p-1.5 md:p-2 rounded-lg transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-400 hover:text-[#4facfe] hover:bg-white/5'}`}
                        title={isListening ? "Stop listening" : "Start voice-to-text"}
                    >
                        {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                    <button 
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="p-1.5 md:p-2 bg-[#4facfe] text-black rounded-lg hover:shadow-[0_0_15px_rgba(79,172,254,0.6)] disabled:opacity-50 disabled:hover:shadow-none transition-all"
                    >
                        {isTyping ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Send className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </Card>
      
      <p className="text-center text-[8px] md:text-[10px] text-gray-600 mb-2">
        Nova can make mistakes. Check important financial info. Powered by Gemini.
      </p>
    </div>
  );
};
