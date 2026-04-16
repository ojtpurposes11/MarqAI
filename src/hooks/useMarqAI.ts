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

// Verified Working Free Neural Cores (as of April 2026)
const NEURAL_CORES = [
  { id: "meta-llama/llama-3.3-70b-instruct:free", label: "Llama-3.3-70B" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", label: "Nemotron-120B" },
  { id: "z-ai/glm-4.5-air:free", label: "GLM-4.5-Air" },
  { id: "mistralai/mistral-7b-instruct:free", label: "Mistral-7B" }
];

// Offline Wisdom Database (Jarvis Persona Fallback)
const SAFE_MODE_RESPONSES = [
  "Sir, I am currently operating on internal archives due to a global uplink instability. While my neural capacity is restricted, I can still assist with architectural logic and basic inquiries.",
  "Atmospheric interference is disrupting the primary relay, Sir. Accessing secondary cached datasets. How may I assist in this limited capacity?",
  "Neural protocols remain active, though global connectivity is offline. I am currently running on my local core simulation, Sir.",
  "Records indicate a temporary outage in the global intelligence grid. I have switched to 'Archives Only' mode to maintain system stability."
];

export function useMarqAI() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('marq_history');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: "Systems online. MarqAI Adaptive Core V3.5 initialized. Awaiting your commands, Sir.", sender: 'ai', timestamp: Date.now() }
    ];
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSelfDestructing, setIsSelfDestructing] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    cpu: 18,
    temp: 34,
    link: 'Stable',
    model: 'Core_Init'
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
      
      let aiText = "";
      
      if (apiKey) {
        // Adaptive Neural Routing
        for (const core of NEURAL_CORES) {
          setSystemStatus(prev => ({ ...prev, model: core.label }));
          
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://marqai.vercel.app", // Verified referer
                "X-Title": "MarqAI JARVIS",
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                model: core.id,
                messages: [
                  { role: "system", content: SYSTEM_PROMPT },
                  ...messages.slice(-10).map(m => ({ // Only send last 10 for speed
                    role: m.sender === 'user' ? 'user' : 'assistant', 
                    content: m.text 
                  })),
                  { role: "user", content: text }
                ]
              })
            });

            const data = await response.json();
            
            if (response.ok && data.choices?.[0]?.message) {
              aiText = data.choices[0].message.content;
              break;
            }
          } catch (e) {
            console.error(`Link failure on ${core.label}`);
            continue;
          }
        }
      }

      // LOCAL SAFE MODE FALLBACK
      if (!aiText) {
        setSystemStatus(prev => ({ ...prev, model: 'Archives_Only', link: 'Restricted' }));
        const randomFallback = SAFE_MODE_RESPONSES[Math.floor(Math.random() * SAFE_MODE_RESPONSES.length)];
        aiText = randomFallback;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Critical System Failure:", error);
    } finally {
      setIsTyping(false);
      setIsSearching(false);
    }
  }, [messages, isSelfDestructing]);

  const triggerSelfDestruct = () => {
    setIsSelfDestructing(true);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      text: "SYSTEM MELTDOWN INITIATED. GOODBYE, SIR.",
      sender: 'ai',
      timestamp: Date.now()
    }]);
    setTimeout(() => {
      clearChat();
      setIsSelfDestructing(false);
    }, 10000);
  };

  const clearChat = () => {
    setMessages([{ id: '1', text: "Neural Core reset. Stand-by.", sender: 'ai', timestamp: Date.now() }]);
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
