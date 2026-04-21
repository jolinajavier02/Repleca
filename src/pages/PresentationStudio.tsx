import React from 'react';
import { 
  Plus, Layout, Play, 
  Type, Image as ImageIcon, Video, 
  BarChart, Mic
} from 'lucide-react';

const PresentationStudio: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Top Bar */}
      <header style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', background: 'var(--bg-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 800 }}>REPLECA <span className="gradient-text">PRESENT</span></span>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Q4_Marketing_Pitch.rpp</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: 'var(--glass)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Play size={16} /> Present
          </button>
          <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Export Video</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Slides Sidebar */}
        <aside style={{ width: '220px', borderRight: '1px solid var(--border)', background: 'var(--bg-accent)', overflowY: 'auto', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SLIDES</span>
             <Plus size={18} style={{ cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[1, 2, 3, 4].map(s => (
               <div key={s} style={{ width: '100%', height: '100px', background: s === 1 ? 'rgba(0,255,255,0.05)' : 'var(--bg-dark)', border: s === 1 ? '1px solid var(--accent-cyan)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '4px', left: '6px', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{s}</span>
               </div>
             ))}
          </div>
        </aside>

        {/* Main Workspace */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#000', padding: '2rem', position: 'relative' }}>
          <div style={{ flex: 1, width: '100%', maxWidth: '900px', margin: '0 auto', background: 'white', aspectRatio: '16/9', borderRadius: '4px', position: 'relative', overflow: 'hidden', padding: '4rem' }}>
             <h1 style={{ color: 'black', fontSize: '3rem', fontWeight: 800 }}>Repleca Studio Strategy</h1>
             <p style={{ color: '#666', fontSize: '1.2rem', marginTop: '1rem' }}>The future of creator-first content systems.</p>
             
             {/* Slide Content Icons Simulation */}
             <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', display: 'flex', gap: '1rem' }}>
               <div style={{ width: '40px', height: '40px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center' }}><Video size={18} color="#000" style={{ margin: '0 auto' }} /></div>
               <div style={{ width: '40px', height: '40px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center' }}><ImageIcon size={18} color="#000" style={{ margin: '0 auto' }} /></div>
             </div>
          </div>

          {/* Quick Add floating tools */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', padding: '10px', background: 'var(--glass)', borderRadius: '12px', border: '1px solid var(--border)', backdropFilter: 'blur(20px)' }}>
             {[
               { icon: <Type size={18} />, label: 'Text' },
               { icon: <ImageIcon size={18} />, label: 'Media' },
               { icon: <Layout size={18} />, label: 'Layout' },
               { icon: <BarChart size={18} />, label: 'Chart' },
               { icon: <Mic size={18} />, label: 'Voice' }
             ].map((tool, i) => (
               <button key={i} style={{ background: 'transparent', border: 'none', color: 'white', padding: '10px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  {tool.icon}
                  <span style={{ fontSize: '0.6rem' }}>{tool.label}</span>
               </button>
             ))}
          </div>
        </main>

        {/* Properties/Notes Sidebar */}
        <aside style={{ width: '300px', borderLeft: '1px solid var(--border)', background: 'var(--bg-accent)', padding: '1.5rem' }}>
           <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>PRESENTER NOTES</h3>
           <textarea 
             placeholder="Add your talking points here..."
             style={{ width: '100%', height: '200px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', color: 'white', fontSize: '0.85rem', resize: 'none' }}
           />
           
           <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>TRANSITIONS</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <select style={{ width: '100%', background: 'var(--bg-dark)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: 'white' }}>
                 <option>Smooth Crossfade</option>
                 <option>Push Left</option>
                 <option>Glitch Transition</option>
              </select>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default PresentationStudio;
