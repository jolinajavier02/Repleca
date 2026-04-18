import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section style={{ 
      paddingTop: '160px', 
      paddingBottom: '100px', 
      textAlign: 'center',
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            padding: '8px 16px',
            background: 'var(--glass)',
            border: '1px solid var(--border)',
            borderRadius: '100px',
            fontSize: '0.8rem',
            color: 'var(--accent-cyan)',
            display: 'inline-block',
            marginBottom: '2rem'
          }}
        >
          Next Generation Creator Tool
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            lineHeight: 1.1,
            marginBottom: '1.5rem'
          }}
        >
          Create Once.<br />
          <span className="gradient-text">Replicate Everywhere.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 3rem',
            lineHeight: 1.6
          }}
        >
          Repleca Studio is the first multi-dimensional editing engine designed for the social-first world. One canvas, infinite exports.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          <a href="#" style={{
            padding: '12px 32px',
            borderRadius: '12px',
            fontWeight: 600,
            background: 'var(--gradient-primary)',
            color: 'black',
            textDecoration: 'none'
          }}>
            Start Creating Free
          </a>
          <a href="#" style={{
            padding: '12px 32px',
            borderRadius: '12px',
            fontWeight: 600,
            background: 'var(--glass)',
            color: 'white',
            border: '1px solid var(--border)',
            textDecoration: 'none'
          }}>
            Watch Demo
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
