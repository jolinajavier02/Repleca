import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  onStart?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <section style={{ 
      paddingTop: '180px', 
      paddingBottom: '120px', 
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60vw',
        height: '60vw',
        background: 'radial-gradient(circle, rgba(0, 255, 194, 0.05) 0%, transparent 70%)',
        zIndex: -1
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            padding: '8px 20px',
            background: 'rgba(0, 255, 194, 0.05)',
            border: '1px solid rgba(0, 255, 194, 0.2)',
            borderRadius: '100px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent-mint)',
            display: 'inline-block',
            marginBottom: '2.5rem'
          }}
        >
          Elevate Your Content Stream
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 6rem)',
            lineHeight: 1,
            marginBottom: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.05em'
          }}
        >
          Master the <span className="gradient-text">Flow.</span><br />
          Command the Feed.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            maxWidth: '650px',
            margin: '0 auto 3.5rem',
            lineHeight: 1.7
          }}
        >
          CreatorFlow Studio is the ultimate cross-platform engine for modern narrative. Edit cinema-grade video, craft viral visuals, and sync professional podcasts in one fluid workspace.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          <button 
            onClick={onStart}
            style={{
              padding: '16px 40px',
              borderRadius: '100px',
              fontWeight: 700,
              background: 'var(--gradient-primary)',
              color: '#0D0D0D',
              border: 'none',
              textDecoration: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(138, 43, 226, 0.2)'
            }}
          >
            Enter the Studio
          </button>
          <a href="#" style={{
            padding: '16px 40px',
            borderRadius: '100px',
            fontWeight: 700,
            background: 'var(--glass)',
            color: 'white',
            border: '1px solid var(--border)',
            textDecoration: 'none',
            fontSize: '1rem'
          }}>
            See Live Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
