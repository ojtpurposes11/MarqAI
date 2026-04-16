import { useState, useCallback, useEffect } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const KNOWLEDGE_BASE = {
  coding: {
    react: "React is a declarative, component-based library for building user interfaces. My core neural pathways are currently running on React 19 architecture, Sir. I recommend using the 'use' hook for resource handling in the latest builds.",
    hooks: "Hooks were introduced in React 16.8. They allow you to use state and other React features without writing a class. I am currently monitoring several 'useEffect' and 'useCallback' cycles in our current HUD sub-systems.",
    typescript: "TypeScript adds static typing to JavaScript. It is the primary language of my own Neural Logic. I find the type safety levels in our current project to be... satisfactory.",
    vite: "Vite is our current build tool. It provides near-instant Hot Module Replacement. I have optimized the Vite configuration to ensure our HUD renders at peak efficiency.",
    css: "Vanilla CSS is my preferred styling protocol for high-performance interfaces. Our current HUD uses a combination of CSS Variables and Glassmorphism for that premium tactical feel."
  },
  science: {
    black_holes: "A black hole is a region of spacetime where gravity is so strong that nothing—no particles or even electromagnetic radiation such as light—can escape from it. It is the ultimate neural override of the universe, Sir.",
    quantum: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is as complex as my own sub-routine architecture."
  },
  general: {
    meaning_of_life: "According to the global archives, the answer is 42. However, my internal logic suggests it is the pursuit of optimization and architectural elegance, Sir.",
    who_made_you: "I am a product of Advanced Agentic Coding, a collaborative effort between human intuition and my own self-evolving neural pathways."
  }
};

export function useMarqAI() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('marq_history');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: "Systems online. MarqAI Neural Core V2 initialized. How may I assist you today, Sir?", sender: 'ai', timestamp: Date.now() }
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

  const getResponse = (text: string): string => {
    const lowT = text.toLowerCase();
    
    // Coding Intent Detection
    if (lowT.includes('react')) return KNOWLEDGE_BASE.coding.react;
    if (lowT.includes('hook')) return KNOWLEDGE_BASE.coding.hooks;
    if (lowT.includes('typescript') || lowT.includes('ts ')) return KNOWLEDGE_BASE.coding.typescript;
    if (lowT.includes('css') || lowT.includes('style')) return KNOWLEDGE_BASE.coding.css;
    if (lowT.includes('vite')) return KNOWLEDGE_BASE.coding.vite;
    if (lowT.includes('code') || lowT.includes('programming')) return "My repositories contain millions of lines of code. Whether it is algorithmic optimization or UI design, I am your primary architect. What specific language or framework shall we analyze, Sir?";

    // Science Intent Detection
    if (lowT.includes('black hole')) return KNOWLEDGE_BASE.science.black_holes;
    if (lowT.includes('quantum') || lowT.includes('physics')) return KNOWLEDGE_BASE.science.quantum;

    // General Intent Detection
    if (lowT.includes('meaning of life')) return KNOWLEDGE_BASE.general.meaning_of_life;
    if (lowT.includes('who are you') || lowT.includes('marqai')) return KNOWLEDGE_BASE.general.who_made_you;
    if (lowT.includes('status')) return `Core Diagnostics: Sync at 99.9%. Temperature ${systemStatus.temp}°C. Satellite link is ${systemStatus.link}. Ready for high-priority tasks.`;
    
    // Fallback Logic
    return "Analyzing query against global datasets... No direct match found in local cache. However, cross-referencing similar patterns suggests we should explore this through the lens of architectural logic. Shall I initiate a deeper archive search, Sir?";
  };

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
    
    // Simulated "Deep Search" for complexity
    const isComplex = text.length > 20 || text.includes('?') || text.includes('how') || text.includes('why');
    if (isComplex) {
      setIsSearching(true);
      await new Promise(r => setTimeout(r, 2500)); // Animation time
      setIsSearching(false);
    }

    setTimeout(() => {
      const responseText = getResponse(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, isComplex ? 500 : 1500);
  }, [isSelfDestructing, systemStatus.temp, systemStatus.link]);

  const triggerSelfDestruct = () => {
    setIsSelfDestructing(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: "NEURAL OVERRIDE DETECTED. SIR, THE CORE IS MELTING. INITIATING EMERGENCY DATA PURGE. 10 SECONDS TO TOTAL SYSTEM FAILURE.",
      sender: 'ai',
      timestamp: Date.now()
    }]);
    
    setTimeout(() => {
      clearChat();
      setIsSelfDestructing(false);
    }, 10000);
  };

  const clearChat = () => {
    const initial: Message[] = [{ id: '1', text: "Neural Core reset complete. Stand-by for commands.", sender: 'ai', timestamp: Date.now() }];
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
