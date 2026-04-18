import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      background: 'rgba(10, 17, 40, 0.7)',
      backdropFilter: 'blur(32px)',
      borderBottom: '1px solid var(--border)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800 }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: 'var(--gradient-primary)', 
            borderRadius: '10px',
            position: 'relative',
            boxShadow: '0 4px 15px rgba(0, 255, 194, 0.3)'
          }}>
             <div style={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               width: '18px',
               height: '4px',
               background: 'white',
               borderRadius: '2px',
               boxShadow: '0 8px 0 white, 0 -8px 0 white'
             }} />
          </div>
          <span style={{ letterSpacing: '-0.04em' }}>CREATOR<span className="gradient-text">FLOW</span></span>
        </div>
        
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '2.5rem' }}>
            <li><a href="#features" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.3s' }}>Studio</a></li>
            <li><a href="#workflows" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Workflow</a></li>
            <li><a href="#platforms" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Enterprise</a></li>
          </ul>
        </nav>

        <button style={{
          padding: '10px 28px',
          background: 'var(--gradient-primary)',
          color: '#0A1128',
          border: 'none',
          borderRadius: '100px',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: '0.9rem'
        }}>
          Join the Flow
        </button>
      </div>
    </header>
  );
};

export default Header;
