import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <Features />
        
        {/* Workflow Section */}
        <section id="workflows" style={{ padding: '100px 0', background: 'var(--bg-accent)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Omni-Publish <span className="gradient-text">Engine</span></h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.8 }}>
                Tired of resizing the same video five times? With Repleca, your Master Canvas fluidly projects to every safe-zone at once.
                Edit once, and watch your content optimize itself for TikTok, YouTube, and LinkedIn in real-time.
              </p>
            </div>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>REPLICATION STATUS: 100%</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ height: '40px', background: 'var(--gradient-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'black', fontWeight: 700 }}>YouTube Optimized</div>
                <div style={{ height: '40px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--accent-purple)', display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--accent-purple)' }}>TikTok Ready</div>
                <div style={{ height: '40px', background: 'var(--glass)', borderRadius: '8px', border: '1px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--accent-cyan)' }}>Instagram Safe</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer style={{ padding: '50px 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p>&copy; 2026 Repleca Studio. All rights reserved. Designed for the infinite stream.</p>
      </footer>
    </div>
  );
}

export default App;
