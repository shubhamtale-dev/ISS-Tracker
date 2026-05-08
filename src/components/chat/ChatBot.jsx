import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Trash2, Bot, User, Sparkles } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useISS } from '../../context/ISSContext';
import { useNews } from '../../context/NewsContext';
import { format } from 'date-fns';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="chat-bubble-ai flex items-center gap-1.5 py-3 px-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser
          ? 'bg-primary-600'
          : 'bg-gradient-to-br from-primary-500 to-violet-600'
      }`}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-white" />
          : <Bot className="w-3.5 h-3.5 text-white" />
        }
      </div>
      <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p className={`text-[10px] mt-1 ${isUser ? 'text-primary-200' : 'text-slate-400 dark:text-slate-500'}`}>
          {format(new Date(message.timestamp), 'HH:mm')}
        </p>
      </div>
    </motion.div>
  );
}

const SUGGESTIONS = [
  'Where is the ISS right now?',
  'How fast is the ISS going?',
  'Who is in space right now?',
  'Show me the latest news',
];

export default function ChatBot() {
  const { messages, isOpen, setIsOpen, isTyping, sendMessage, clearChat, updateISSData, updateNewsData } = useChat();
  const { position, speed, astronauts } = useISS();
  const { articles } = useNews();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Keep context fresh
  useEffect(() => { updateISSData({ position, speed, astronauts }); }, [position, speed, astronauts, updateISSData]);
  useEffect(() => { updateNewsData({ articles }); }, [articles, updateNewsData]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleSend = () => {
    if (input.trim() && !isTyping) {
      sendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        id="chat-toggle-btn"
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-violet-600 text-white shadow-glow-blue flex items-center justify-center"
        aria-label="Toggle AI chatbot"
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X className="w-6 h-6" />
              </motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <MessageSquare className="w-6 h-6" />
              </motion.div>
          }
        </AnimatePresence>
        {messages.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {messages.length > 9 ? '9+' : messages.length}
          </span>
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] flex flex-col
              bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-700
              overflow-hidden"
            style={{ maxHeight: '560px', height: '80vh' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-violet-600 text-white flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Dashboard AI</h3>
                <p className="text-[11px] text-primary-200">Powered by Mistral-7B · Dashboard data only</p>
              </div>
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center mx-auto">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hi! I'm your Dashboard AI</p>
                    <p className="text-xs text-slate-400 mt-1">Ask me about the ISS position, speed, astronauts, or current news.</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-3">
                    {SUGGESTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-dark-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors border border-slate-200 dark:border-dark-600"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-slate-200 dark:border-dark-700 flex-shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  id="chat-input"
                  rows={1}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about ISS or news…"
                  disabled={isTyping}
                  className="input resize-none py-2.5 text-sm flex-1"
                  style={{ minHeight: '40px', maxHeight: '100px' }}
                />
                <button
                  id="chat-send-btn"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="btn-primary p-2.5 rounded-xl flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                Answers are based only on live dashboard data
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
