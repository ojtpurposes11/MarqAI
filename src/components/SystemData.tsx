import React from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Wifi, Cpu } from 'lucide-react';

interface SystemDataProps {
  status: {
    cpu: number;
    temp: number;
    link: string;
  };
}

export const SystemData: React.FC<SystemDataProps> = ({ status }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem',
      alignItems: 'flex-end',
      pointerEvents: 'none',
      width: '100%'
    }}>
      {/* CPU Widget */}
      <div className="hud-panel" style={{ padding: '0.75rem 1rem', width: '180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hud-text" style={{ color: 'var(--marq-accent)' }}>
            <Cpu size={14} style={{ marginRight: '0.5rem' }} /> Neural Load
          </div>
          <div className="hud-text">{status.cpu}%</div>
        </div>
        <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem', overflow: 'hidden' }}>
          <motion.div 
            style={{ height: '100%', background: 'var(--marq-accent)' }}
            animate={{ width: `${status.cpu}%` }}
          />
        </div>
      </div>

      {/* Temp Widget */}
      <div className="hud-panel" style={{ padding: '0.75rem 1rem', width: '180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hud-text">
            <Thermometer size={14} style={{ marginRight: '0.5rem' }} /> Core Temp
          </div>
          <div className="hud-text" style={{ color: status.temp > 35 ? 'var(--marq-warn)' : 'var(--marq-accent)' }}>
            {status.temp}°C
          </div>
        </div>
      </div>

      {/* Link Widget */}
      <div className="hud-panel" style={{ padding: '0.75rem 1rem', width: '180px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="hud-text">
            <Wifi size={14} style={{ marginRight: '0.5rem' }} /> Satellite
          </div>
          <div className="hud-text" style={{ color: 'var(--marq-accent)' }}>{status.link}</div>
        </div>
      </div>

      {/* Waveform Visualization */}
      <div className="hud-panel" style={{ padding: '1rem', width: '180px', height: '60px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{ flex: 1, background: 'var(--marq-accent)', minHeight: '4px' }}
            animate={{ height: [10, Math.random() * 40 + 10, 10] }}
            transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
};
