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
      background: 'rgba(13, 13, 13, 0.8)',
      backdropFilter: 'blur(20px)',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'var(--gradient-primary)', 
            borderRadius: '8px',
            position: 'relative'
          }}>
             <div style={{
               position: 'absolute',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%) rotate(45deg)',
               width: '15px',
               height: '15px',
               border: '2px solid white'
             }} />
          </div>
          <span>REPLECA <span className="gradient-text">STUDIO</span></span>
        </div>
        
        <nav>
          <ul style={{ display: 'flex', listStyle: 'none', gap: '2rem' }}>
            <li><a href="#features" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Features</a></li>
            <li><a href="#workflows" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Workflows</a></li>
            <li><a href="#platforms" style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontWeight: 500 }}>Platforms</a></li>
          </ul>
        </nav>

        <button style={{
          padding: '8px 24px',
          background: 'var(--glass)',
          color: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;
