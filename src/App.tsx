import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertTriangle, Shield, Activity, Maximize2 } from 'lucide-react';
import './index.css';
import { useMarqAI } from './hooks/useMarqAI';
import { MarqAvatar } from './components/MarqAvatar';
import { ChatInterface } from './components/ChatInterface';
import { MarqHUD } from './components/MarqHUD';
import { SystemData } from './components/SystemData';

function App() {
  const { 
    messages,
    sendMessage,
    isTyping, 
    isSearching,
    clearChat, 
    triggerSelfDestruct, 
    isSelfDestructing, 
    systemStatus 
  } = useMarqAI();
  const [inputText, setInputText] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  if (isInitializing) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="hud-text"
          style={{ color: 'var(--marq-accent)', fontSize: '1.5rem', textAlign: 'center' }}
        >
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            MARQ-CORE INITIALIZATION...
          </motion.div>
          <div style={{ width: '300px', height: '2px', background: 'rgba(34, 211, 238, 0.1)', marginTop: '1rem', overflow: 'hidden' }}>
            <motion.div 
              style={{ height: '100%', background: 'var(--marq-accent)' }}
              animate={{ x: [-300, 300] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="scanner-overlay" />
      
      {/* Background HUD Layers */}
      <div style={{ position: 'absolute', top: '30%', left: '20%', transform: 'translate(-50%, -50%)' }}>
        <MarqHUD />
      </div>

      <SystemData status={systemStatus} />

      {/* Main UI Container */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '1.5rem 1rem', 
        zIndex: 10, 
        maxWidth: '1400px', 
        margin: '0 auto', 
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <div className="hud-panel" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <MarqAvatar />
              <div>
                <h1 className="glitch-text" style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--marq-accent)' }}>
                  MARQAI<span style={{ opacity: 0.5 }}>-SYSTEM</span>
                </h1>
                <div className="hud-text" style={{ color: 'var(--marq-accent)', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={12} /> SECURE LINK ACTIVE
                </div>
              </div>
            </div>

            <div className="hud-panel" style={{ padding: '1rem', display: 'flex', gap: '1.5rem' }}>
              <div style={{ opacity: 0.5 }}>
                <div className="hud-text">Uptime</div>
                <div className="hud-text" style={{ color: 'white', fontSize: '1rem' }}>04:12:12</div>
              </div>
              <div style={{ width: '1px', background: 'var(--glass-border)' }} />
              <div>
                <div className="hud-text" style={{ color: 'var(--marq-accent)' }}>Core.Ver</div>
                <div className="hud-text">Neural.1.5</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="neon-btn" onClick={clearChat}>Reset_History</button>
            <button 
              className={`neon-btn self-destruct-btn ${isSelfDestructing ? 'flicker' : ''}`}
              onClick={triggerSelfDestruct}
            >
              {isSelfDestructing ? 'TERMINATING...' : 'Neural_Override'}
            </button>
          </div>
        </header>

        {/* Central HUD & Chat */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem', minHeight: '500px' }}>
          
          <div className="hud-panel" style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem', background: 'rgba(15, 23, 42, 0.4)' }}>
            <div style={{ padding: '0.5rem 1rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
              <div className="hud-text">Communications_Relay</div>
              <div className="hud-text" style={{ opacity: 0.4 }}>Encrypted</div>
            </div>
            <ChatInterface messages={messages} isTyping={isTyping} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="hud-panel" style={{ flex: 1, padding: '1.5rem' }}>
              <div className="hud-text" style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Neural_Processing_Visualizer</span>
                {isSearching && (
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    style={{ color: 'var(--marq-accent)' }}
                  >
                    SEARCHING ARCHIVES...
                  </motion.span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', opacity: isSearching ? 0.8 : 0.3 }}>
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    style={{ height: '40px', background: 'var(--marq-accent)' }}
                    animate={isSearching ? { opacity: [0.2, 1, 0.2] } : { opacity: [0.1, 0.5, 0.1] }}
                    transition={{ repeat: Infinity, duration: isSearching ? 0.4 : 1.5, delay: i * 0.05 }}
                  />
                ))}
              </div>
            </div>
            
            <div className="hud-panel" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="flicker">
                <AlertTriangle color="var(--marq-warn)" size={24} />
              </div>
              <div className="hud-text" style={{ fontSize: '0.7rem' }}>
                Manual Override Authorization: <span style={{ color: 'var(--marq-accent)' }}>Sir_Level_Admin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Input */}
        <footer style={{ marginTop: '1.5rem', flexShrink: 0 }}>
          <form onSubmit={handleSend} className="input-hud">
            <Maximize2 size={18} color="var(--marq-accent)" style={{ opacity: 0.5 }} />
            <input
              type="text"
              className="jarvis-input"
              placeholder="Awaiting commands, Sir..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isSelfDestructing}
              autoFocus
            />
            <Activity size={18} color="var(--marq-accent)" className="flicker" />
            <div style={{ width: '1px', height: '24px', background: 'var(--marq-accent)', opacity: 0.3 }} />
            <button type="submit" disabled={!inputText.trim() || isTyping} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <Send color={inputText.trim() ? "var(--marq-accent)" : "rgba(255,255,255,0.1)"} size={20} />
            </button>
          </form>
        </footer>
      </div>

      <AnimatePresence>
        {isSelfDestructing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
              background: 'rgba(239, 68, 68, 0.15)', zIndex: 1000, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none'
            }}
          >
            <div className="hud-text flicker" style={{ fontSize: '4rem', color: 'var(--marq-warn)', fontWeight: 800 }}>
              CRITICAL SYSTEM MELTDOWN
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
