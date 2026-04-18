import React from 'react';
import { Download, CheckCircle, Video, Smartphone, Camera, Send } from 'lucide-react';

const ExportCenter: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Export Center</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Finalize and deliver your high-quality content stream.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Download size={20} className="gradient-text" /> 
              Resolution & Format
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
               <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Output Resolution</label>
                  <select style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: 'white' }}>
                     <option>4K Ultra HD (3840 x 2160)</option>
                     <option>1080p Full HD (1920 x 1080)</option>
                  </select>
               </div>
               <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>File Format</label>
                  <select style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', color: 'white' }}>
                     <option>MP4 (H.264)</option>
                     <option>MOV (ProRes)</option>
                  </select>
               </div>
            </div>
          </section>

          <section className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Social Platform Presets</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
               {[
                 { icon: <Video size={20} />, label: 'YouTube 16:9' },
                 { icon: <Smartphone size={20} />, label: 'TikTok 9:16' },
                 { icon: <Camera size={20} />, label: 'Reels 9:16' },
                 { icon: <Send size={20} />, label: 'X Post 16:9' },
               ].map((preset, i) => (
                 <button key={i} style={{ 
                   display: 'flex', 
                   flexDirection: 'column', 
                   alignItems: 'center', 
                   gap: '10px', 
                   padding: '1.5rem', 
                   background: 'var(--bg-dark)', 
                   border: i === 0 ? '1px solid var(--accent-cyan)' : '1px solid var(--border)', 
                   borderRadius: '12px',
                   color: i === 0 ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                   cursor: 'pointer'
                 }}>
                   {preset.icon}
                   <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{preset.label}</span>
                 </button>
               ))}
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <section className="glass-panel" style={{ padding: '1.5rem' }}>
              <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Recent Exports</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--glass)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                       <CheckCircle size={18} style={{ color: 'var(--accent-cyan)', margin: '0 auto' }} />
                    </div>
                    <div>
                       <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Autumn_Travel.mp4</div>
                       <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Exported 5m ago</div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                       <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Rendering... 64%</div>
                       <div style={{ width: '100%', height: '4px', background: 'var(--bg-dark)', borderRadius: '10px', marginTop: '4px' }}>
                          <div style={{ width: '64%', height: '100%', background: 'var(--gradient-primary)', borderRadius: '10px' }} />
                       </div>
                    </div>
                 </div>
              </div>
           </section>
           <button style={{
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
            }}>
             Enter the Studio
           </button>
        </div>
      </div>
    </div>
  );
};

export default ExportCenter;
