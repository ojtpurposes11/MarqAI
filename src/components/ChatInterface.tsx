import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Message } from '../hooks/useMarqAI';

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isTyping }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div 
      ref={scrollRef}
      className="custom-scroll"
      style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem'
      }}
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`chat-bubble ${msg.sender === 'ai' ? 'bubble-ai' : 'bubble-user'}`}
          >
            {msg.text}
          </motion.div>
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-bubble bubble-ai"
            style={{ width: '60px', display: 'flex', gap: '4px', justifyContent: 'center', alignItems: 'center' }}
          >
            <div className="typing-dot" style={{ animationDelay: '0s' }} />
            <div className="typing-dot" style={{ animationDelay: '0.2s' }} />
            <div className="typing-dot" style={{ animationDelay: '0.4s' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
