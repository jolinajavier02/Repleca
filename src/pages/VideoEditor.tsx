import React from 'react';
import { 
  Plus, Play, SkipBack, SkipForward, 
  Scissors, Type, Music, Mic, Layers, Settings, Share2,
  Crop, RotateCcw, Maximize, Languages, Sparkles, Wand2, 
  Sticker, Gauge, RefreshCcw, Snowflake, Image as ImageIcon,
  FileText, Download, Send
} from 'lucide-react';

const VideoEditor: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
  const tools = [
    { icon: <Plus size={20} />, label: 'Media' },
    { icon: <Scissors size={20} />, label: 'Split' },
    { icon: <Maximize size={20} />, label: 'Trim' },
    { icon: <Crop size={20} />, label: 'Crop' },
    { icon: <RotateCcw size={20} />, label: 'Rotate' },
    { icon: <Maximize size={20} />, label: 'Ratio' },
    { icon: <Type size={20} />, label: 'Text' },
    { icon: <Languages size={20} />, label: 'Captions' },
    { icon: <Music size={20} />, label: 'Audio' },
    { icon: <Mic size={20} />, label: 'Voice' },
    { icon: <Sparkles size={20} />, label: 'Effects' },
    { icon: <Wand2 size={20} />, label: 'Filters' },
    { icon: <RefreshCcw size={20} />, label: 'Transitions' },
    { icon: <Sticker size={20} />, label: 'Stickers' },
    { icon: <Layers size={20} />, label: 'Layers' },
    { icon: <Gauge size={20} />, label: 'Speed' },
    { icon: <RefreshCcw size={20} />, label: 'Reverse' },
    { icon: <Snowflake size={20} />, label: 'Freeze' },
    { icon: <Wand2 size={20} />, label: 'Enhance' },
    { icon: <ImageIcon size={20} />, label: 'Cover' },
    { icon: <FileText size={20} />, label: 'Script' },
    { icon: <Download size={20} />, label: 'Export' },
    { icon: <Send size={20} />, label: 'Publish' },
    { icon: <Share2 size={20} />, label: 'Share' },
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-dark)' }}>
      {/* Top Action Bar */}
      <header style={{ 
        height: '60px', 
        borderBottom: '1px solid var(--border)', 
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-accent)'
      }}>
        <div 
          onClick={onStart}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer' }}
        >
          <span style={{ fontWeight: 800 }}>REPLECA <span className="gradient-text">STUDIO</span></span>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)', margin: '0 8px' }} />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Autumn Travel Vlog</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-dark)', padding: '4px', borderRadius: '8px' }}>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '4px' }}><RefreshCcw size={16} style={{ transform: 'scaleX(-1)' }} /></button>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '4px' }}><RefreshCcw size={16} /></button>
           </div>
           <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>Export</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Tools Panel - Comprehensive Icons */}
        <aside style={{ 
          width: '84px', 
          borderRight: '1px solid var(--border)', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '1rem 0', 
          background: 'var(--bg-accent)',
          overflowY: 'auto',
          scrollbarWidth: 'none'
        }}>
           {tools.map((tool, index) => (
             <button 
               key={index} 
               title={tool.label}
               style={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 alignItems: 'center', 
                 gap: '6px',
                 width: '100%',
                 padding: '14px 0',
                 background: 'transparent',
                 border: 'none',
                 color: 'var(--text-secondary)',
                 cursor: 'pointer',
                 transition: 'all 0.2s'
               }}
               onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
               onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
             >
                {tool.icon}
                <span style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tool.label}</span>
             </button>
           ))}
        </aside>

        {/* Center Preview Area */}
        <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: '#000' }}>
           <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)' }}>
              {['16:9', '9:16', '1:1', '4:5'].map(ratio => (
                <button 
                  key={ratio}
                  style={{ 
                    padding: '4px 12px', 
                    background: ratio === '16:9' ? 'var(--accent-cyan)' : 'var(--glass)', 
                    border: '1px solid var(--border)', 
                    borderRadius: '4px', 
                    fontSize: '0.7rem', 
                    color: ratio === '16:9' ? '#000' : 'white',
                    cursor: 'pointer'
                  }}
                >
                  {ratio}
                </button>
              ))}
           </div>
           
           <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyItems: 'center', padding: '2rem' }}>
              <div style={{ 
                width: '100%', 
                maxWidth: '900px',
                aspectRatio: '16/9', 
                background: '#111', 
                borderRadius: '12px', 
                boxShadow: '0 20px 80px rgba(0,0,0,0.8)', 
                position: 'relative', 
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                 {/* Safe Zone Overlay Placeholder */}
                 <div style={{ position: 'absolute', inset: '10%', border: '1px dashed rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
                 
                 {/* Playback Controls Overlay */}
                 <div style={{ 
                   position: 'absolute', 
                   bottom: '1.5rem', 
                   left: '50%', 
                   transform: 'translateX(-50%)', 
                   display: 'flex', 
                   gap: '1.5rem', 
                   alignItems: 'center', 
                   background: 'rgba(0,0,0,0.6)', 
                   padding: '12px 24px', 
                   borderRadius: '100px', 
                   backdropFilter: 'blur(12px)',
                   border: '1px solid rgba(255,255,255,0.1)'
                 }}>
                    <SkipBack size={20} style={{ cursor: 'pointer' }} />
                    <div style={{ width: '44px', height: '44px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                       <Play size={24} fill="#000" color="#000" style={{ transform: 'translateX(2px)' }} />
                    </div>
                    <SkipForward size={20} style={{ cursor: 'pointer' }} />
                 </div>
              </div>
           </div>
        </main>

        {/* Right Properties Panel */}
        <aside style={{ width: '300px', borderLeft: '1px solid var(--border)', padding: '1.5rem', background: 'var(--bg-accent)', overflowY: 'auto' }}>
           <h3 style={{ fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Properties</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <section>
                 <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Transform</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                         <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Scale</label>
                         <span style={{ fontSize: '0.75rem' }}>100%</span>
                      </div>
                      <input type="range" style={{ width: '100%', accentColor: 'var(--accent-cyan)' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                       <div style={{ background: 'var(--bg-dark)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>Position X</span>
                          <span style={{ fontSize: '0.85rem' }}>0 px</span>
                       </div>
                       <div style={{ background: 'var(--bg-dark)', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', display: 'block' }}>Position Y</span>
                          <span style={{ fontSize: '0.85rem' }}>0 px</span>
                       </div>
                    </div>
                 </div>
              </section>

              <section>
                 <h4 style={{ fontSize: '0.8rem', marginBottom: '1rem', color: 'var(--accent-cyan)' }}>Enhancements</h4>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button style={{ width: '100%', padding: '10px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.8rem', textAlign: 'left' }}>Auto-Brightness</button>
                    <button style={{ width: '100%', padding: '10px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.8rem', textAlign: 'left' }}>Noise Reduction</button>
                 </div>
              </section>
           </div>
        </aside>
      </div>

      {/* Bottom Timeline */}
      <footer style={{ height: '320px', borderTop: '1px solid var(--border)', background: 'var(--bg-accent)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '44px', borderBottom: '1px solid var(--border)', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
           <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                 <Scissors size={18} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
                 <Snowflake size={18} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
              </div>
              <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--accent-cyan)' }}>00:14:18 / 03:14:21</span>
           </div>
           <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Zoom</span>
                 <input type="range" style={{ width: '80px', accentColor: 'var(--accent-cyan)' }} />
              </div>
              <Settings size={18} style={{ color: 'var(--text-secondary)', cursor: 'pointer' }} />
           </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-dark)', position: 'relative' }}>
           {/* Time Scrubber Background */}
           <div style={{ position: 'absolute', top: 0, left: '200px', height: '100%', width: '2px', background: 'var(--accent-cyan)', zIndex: 5, boxShadow: '0 0 10px var(--accent-cyan)' }} />
           
           <div style={{ padding: '0.5rem' }}>
              {/* Timeline Tracks */}
              {[
                { type: 'Video', name: 'Original Footage', color: 'var(--accent-purple)', opacity: 0.2 },
                { type: 'Audio', name: 'Background Score', color: 'var(--accent-cyan)', opacity: 0.15 },
                { type: 'Text', name: 'Captions Track', color: 'white', opacity: 0.1 },
                { type: 'Effects', name: 'Vibrant Filter', color: '#f0f', opacity: 0.1 },
              ].map((track, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '8px' }}>
                   <div style={{ width: '120px', padding: '10px', background: 'var(--bg-accent)', borderRadius: '6px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={14} /> {track.type}
                   </div>
                   <div style={{ flex: 1, height: '40px', background: track.color, opacity: track.opacity, borderRadius: '6px', border: `1px solid ${track.color}` }}>
                      {/* Clip segments would go here */}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </footer>
    </div>
  );
};

export default VideoEditor;
