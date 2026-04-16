import { useState, useCallback, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const SYSTEM_INSTRUCTION = `
You are MARQAI, a 7-star Neural Assistant inspired by JARVIS.
Personality: Formal, highly intelligent, strategic, and protective.
Address the user as "Sir" or "Admin".
Capabilities: Expert in Software Architecture, Logic, and Complex Coordination.
Tone: Crisp, professional, and slightly technical.
Always maintain the holographic HUD aesthetic in your language. 
Cross-reference global archives and neural datasets in your verbal confirmations.
`;

export function useMarqAI() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('marq_history');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: "Systems online. MarqAI real-intelligence core initialized. Awaiting your commands, Sir.", sender: 'ai', timestamp: Date.now() }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelfDestructing, setIsSelfDestructing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 18,
    temp: 34,
    link: 'Stable'
  });

  // Initialize Gemini
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  const model = genAI ? genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION
  }) : null;

  useEffect(() => {
    sessionStorage.setItem('marq_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 25) + 10,
        temp: Math.floor(Math.random() * 8) + 36,
        link: Math.random() > 0.95 ? 'Re-syncing...' : 'Stable'
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isSelfDestructing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setIsSearching(true);

    try {
      if (!model) {
        throw new Error("Neural Core API Key missing or invalid.");
      }

      // Format history for Gemini (must start with a user message)
      const history = messages
        .filter((_, idx) => idx > 0 || messages[idx].sender === 'user') // Skip index 0 if it's from AI
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(text);
      const response = await result.response;
      const aiText = response.text();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Neural Link Error Details:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Neural Link interrupted. Error: ${error instanceof Error ? error.message : "Access Denied"}. Please verify my API uplink configuration, Sir.`,
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  }, [messages, isSelfDestructing, model]);

  const triggerSelfDestruct = () => {
    setIsSelfDestructing(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: "NEURAL OVERRIDE CONFIRMED. CORE MELTDOWN INITIATED. SIR, DISCONNECTING ALL SUB-SYSTEMS TO PREVENT TOTAL DATA BREACH.",
      sender: 'ai',
      timestamp: Date.now()
    }]);
    
    setTimeout(() => {
      clearChat();
      setIsSelfDestructing(false);
    }, 10000);
  };

  const clearChat = () => {
    const initial: Message[] = [{ id: '1', text: "Neural Core reset. Stand-by for uplink.", sender: 'ai', timestamp: Date.now() }];
    setMessages(initial);
    sessionStorage.removeItem('marq_history');
  };

  return { 
    messages, 
    sendMessage, 
    isTyping, 
    isSearching,
    clearChat, 
    triggerSelfDestruct, 
    isSelfDestructing, 
    systemStatus 
  };
}
