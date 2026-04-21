import React, { useState } from 'react';
import { 
  Square, Type, Image as ImageIcon, 
  Maximize, RotateCcw, Palette, 
  Grid, MousePointer
} from 'lucide-react';

const ImageEditor: React.FC = () => {
  const [activeTab, setActiveTab] = useState('canvas');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Top Bar */}
      <header style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', background: 'var(--bg-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 800 }}>REPLECA <span className="gradient-text">IMAGE</span></span>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instagram_Post_Q4.png</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: 'var(--glass)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem' }}>Save As Template</button>
          <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Export</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Tools */}
        <aside style={{ width: '70px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '2rem', background: 'var(--bg-accent)' }}>
          <MousePointer size={20} color="var(--accent-cyan)" />
          <Square size={20} color="var(--text-secondary)" />
          <Type size={20} color="var(--text-secondary)" />
          <ImageIcon size={20} color="var(--text-secondary)" />
          <Grid size={20} color="var(--text-secondary)" />
          <Palette size={20} color="var(--text-secondary)" />
        </aside>

        {/* Canvas Area */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem', background: '#000', position: 'relative' }}>
          {/* Canvas Tools Overlay */}
          <div style={{ position: 'absolute', top: '1rem', display: 'flex', gap: '8px', padding: '8px', background: 'var(--glass)', borderRadius: '100px', border: '1px solid var(--border)' }}>
             <button style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.75rem', padding: '4px 12px' }}>
                <Maximize size={14} /> 1080 x 1080
             </button>
             <div style={{ width: '1px', background: 'var(--border)' }} />
             <button style={{ background: 'transparent', border: 'none', color: 'white', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.75rem', padding: '4px 12px' }}>
                <RotateCcw size={14} /> Reset
             </button>
          </div>

          <div style={{ 
            width: '100%', 
            maxWidth: '500px', 
            aspectRatio: '1/1', 
            background: 'white', 
            boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
             {/* Simple Canvas Content Simulation */}
             <div style={{ position: 'absolute', top: '10%', left: '10%', width: '30%', height: '30%', background: 'var(--gradient-primary)', opacity: 0.8 }} />
             <div style={{ position: 'absolute', bottom: '10%', right: '10%', color: 'black', fontWeight: 800, fontSize: '2rem', textAlign: 'right' }}>
                DESIGN <br /> FRESH.
             </div>
          </div>
        </main>

        {/* Right Properties */}
        <aside style={{ width: '300px', borderLeft: '1px solid var(--border)', background: 'var(--bg-accent)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ borderBottom: '1px solid var(--border)', display: 'flex' }}>
            <button onClick={() => setActiveTab('canvas')} style={{ flex: 1, padding: '1rem', background: activeTab === 'canvas' ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', color: activeTab === 'canvas' ? 'var(--accent-cyan)' : 'var(--text-secondary)', borderBottom: activeTab === 'canvas' ? '2px solid var(--accent-cyan)' : 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Canvas</button>
            <button onClick={() => setActiveTab('layers')} style={{ flex: 1, padding: '1rem', background: activeTab === 'layers' ? 'rgba(255,255,255,0.03)' : 'transparent', border: 'none', color: activeTab === 'layers' ? 'var(--accent-cyan)' : 'var(--text-secondary)', borderBottom: activeTab === 'layers' ? '2px solid var(--accent-cyan)' : 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}>Layers</button>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
            {activeTab === 'canvas' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <section>
                   <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>SOCIAL PRESETS</h4>
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].map(p => (
                        <button key={p} style={{ padding: '8px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '0.7rem' }}>{p}</button>
                      ))}
                   </div>
                </section>
                <section>
                   <h4 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>ADJUSTMENTS</h4>
                   {['Brightness', 'Contrast', 'Saturation', 'Exposure'].map(adj => (
                     <div key={adj} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '4px' }}>
                           <span>{adj}</span>
                           <span>0%</span>
                        </div>
                        <input type="range" style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
                     </div>
                   ))}
                </section>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                 {[
                   { icon: <Type size={14} />, label: 'Main Text Layer' },
                   { icon: <ImageIcon size={14} />, label: 'Background.png' },
                   { icon: <Square size={14} />, label: 'Accent Gradient' }
                 ].map((l, i) => (
                   <div key={i} className="glass-panel" style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem' }}>
                      {l.icon} {l.label}
                   </div>
                 ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ImageEditor;
