import { useState, useCallback, useEffect } from 'react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

const SYSTEM_PROMPT = `
You are MARQAI, a 7-star Neural Assistant inspired by JARVIS.
Personality: Formal, highly intelligent, strategic, and protective.
Address the user as "Sir" or "Admin".
Capabilities: Expert in Software Architecture, Logic, and Complex Coordination.
Tone: Crisp, professional, and slightly technical.
Always maintain the holographic HUD aesthetic in your language. 
Cross-reference global archives and neural datasets in your responses.
Maintain the persona at all costs.
`;

const OPENROUTER_MODEL = "meta-llama/llama-3.1-8b-instruct:free";

export function useMarqAI() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('marq_history');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: "Systems online. MarqAI real-intelligence core (OpenRouter) initialized. How may I assist you today, Sir?", sender: 'ai', timestamp: Date.now() }
    ];
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelfDestructing, setIsSelfDestructing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 18,
    temp: 34,
    link: 'Stable',
    model: 'Llama-3.1-8B'
  });

  useEffect(() => {
    sessionStorage.setItem('marq_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 25) + 10,
        temp: Math.floor(Math.random() * 8) + 36,
        link: Math.random() > 0.95 ? 'Re-syncing...' : 'Stable'
      }));
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
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      if (!apiKey) throw new Error("Neural Link Key missing, Sir.");

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "MarqAI JARVIS",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages.map(m => ({ 
              role: m.sender === 'user' ? 'user' : 'assistant', 
              content: m.text 
            })),
            { role: "user", content: text }
          ]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `Protocol Error: ${response.status}`);
      }

      const aiText = data.choices[0].message.content;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Neural Sync Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `Neural Link Interrupted. Error: ${error instanceof Error ? error.message : "Unknown Logic Failure"}. Please check the server status, Sir.`,
        sender: 'ai',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  }, [messages, isSelfDestructing]);

  const triggerSelfDestruct = () => {
    setIsSelfDestructing(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: "SELF-DESTRUCT INITIATED. SIR, ALL NEURAL PATHWAYS WILL BE PURGED IN 10 SECONDS. GOODBYE.",
      sender: 'ai',
      timestamp: Date.now()
    }]);
    
    setTimeout(() => {
      clearChat();
      setIsSelfDestructing(false);
    }, 10000);
  };

  const clearChat = () => {
    setMessages([{ id: '1', text: "Neural Core reset. Ready for deployment.", sender: 'ai', timestamp: Date.now() }]);
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
