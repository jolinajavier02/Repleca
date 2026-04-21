import React from 'react';
import { 
  Heart, Clock
} from 'lucide-react';

const TemplateLibrary: React.FC = () => {
  const categories = ['All', 'TikTok', 'YouTube', 'Reels', 'Presentation', 'Podcast', 'Business'];
  
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Template <span className="gradient-text">Library</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Skip the setup. Start with a professional creator foundation.</p>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map((cat, i) => (
          <button key={i} style={{ padding: '10px 24px', background: i === 0 ? 'var(--accent-cyan)' : 'var(--glass)', border: '1px solid var(--border)', borderRadius: '100px', color: i === 0 ? '#000' : 'white', fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {[1, 2, 3, 4, 5, 6].map((temp) => (
          <div key={temp} className="glass-panel" style={{ overflow: 'hidden', position: 'relative' }}>
             <div style={{ height: '350px', background: 'var(--bg-accent)', position: 'relative' }}>
                <img src={`https://images.unsplash.com/photo-${1500000000000 + temp}?w=400&h=600&fit=crop`} alt="Template" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                <div style={{ position: 'absolute', top: '15px', right: '15px', padding: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', backdropFilter: 'blur(10px)' }}><Heart size={16} /></div>
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '4px' }}>REELS / SHORTS</div>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Cinematic Travel Recap</h3>
                </div>
             </div>
             <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                   <Clock size={14} /> 15s Flow
                </div>
                <button style={{ background: 'white', color: 'black', border: 'none', padding: '8px 20px', borderRadius: '100px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Use Flow</button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary;
