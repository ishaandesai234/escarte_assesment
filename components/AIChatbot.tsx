import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Minus, Maximize2, Sparkles } from 'lucide-react';
import { askTeachFlowAI } from '../lib/geminiService';
import ReactMarkdown from 'react-markdown';

export const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hello! I am your TeachFlow assistant. Ask me anything about today\'s tasks, students, or demos.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    const aiResponse = await askTeachFlowAI(userMessage);
    setMessages(prev => [...prev, { role: 'ai', content: aiResponse || 'I am sorry, I could not process that.' }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-secondary/90 transition-all active:scale-90 group"
          >
            <Bot size={32} className="group-hover:animate-bounce" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className={`bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden transition-all duration-300 ${
              isMinimized ? 'h-16 w-72' : 'h-[500px] w-[350px] md:w-[400px]'
            }`}
          >
            {/* Header */}
            <div className={`p-4 bg-primary text-white flex items-center justify-between transition-all ${isMinimized ? 'cursor-pointer' : ''}`}
                 onClick={() => isMinimized && setIsMinimized(false)}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <span className="font-bold">TeachFlow AI</span>
                {isTyping && (
                  <div className="flex gap-1 ml-2">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar"
                >
                  {messages.map((m, i) => (
                    <div 
                      key={i} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        m.role === 'user' 
                          ? 'bg-primary text-white rounded-tr-none shadow-md' 
                          : 'bg-white text-slate-800 rounded-tl-none border border-border shadow-sm'
                      }`}>
                        <div className="markdown-body">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-border shadow-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse" />
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse [animation-delay:0.2s]" />
                          <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse [animation-delay:0.4s]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-white">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      className="flex-1 bg-slate-100 border-none px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="Ask TeachFlow AI..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isTyping}
                      className="p-2 bg-secondary text-white rounded-lg hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-muted-foreground mt-2">
                    Powered by Google Gemini API
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
