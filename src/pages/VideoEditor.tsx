import React from 'react';
import { 
  Plus, Play, SkipBack, SkipForward, 
  Scissors, Type, Music, Mic, Layers, Settings, Share2, Video
} from 'lucide-react';

const VideoEditor: React.FC<{ onStart?: () => void }> = ({ onStart }) => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
          style={{ display: 'flex', alignItems: 'center', gap: '14px', fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, cursor: 'pointer' }}
        >
          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Autumn Travel Vlog</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'var(--glass)', padding: '2px 8px', borderRadius: '4px' }}>Draft Saved</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'white', padding: '4px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
             <option>1080p (HQ)</option>
             <option>4K (Ultra)</option>
          </select>
          <button style={{ background: 'var(--gradient-primary)', border: 'none', color: '#0A1128', padding: '6px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}>Export</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Tools Panel */}
        <aside style={{ width: '80px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '2rem', background: 'var(--bg-accent)' }}>
           <Plus size={24} style={{ cursor: 'pointer', color: 'var(--accent-mint)' }} />
           <Scissors size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
           <Type size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
           <Music size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
           <Mic size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
           <Layers size={20} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
        </aside>

        {/* Center Preview Area */}
        <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: '#000' }}>
           <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
              {['16:9', '9:16', '1:1', '4:5'].map(ratio => (
                <button 
                  key={ratio}
                  style={{ 
                    padding: '4px 12px', 
                    background: ratio === '16:9' ? 'var(--accent-mint)' : 'var(--glass)', 
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
              <div style={{ width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '8px', boxShadow: '0 0 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                 {/* Video Content Placeholder */}
                 <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(0,0,0,0.5)', padding: '10px 20px', borderRadius: '100px', backdropFilter: 'blur(10px)' }}>
                    <SkipBack size={20} />
                    <Play size={24} fill="white" />
                    <SkipForward size={20} />
                 </div>
              </div>
           </div>
        </main>

        {/* Right Properties Panel */}
        <aside style={{ width: '300px', borderLeft: '1px solid var(--border)', padding: '1.5rem', background: 'var(--bg-accent)' }}>
           <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>Transform</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Scale</label>
                <input type="range" style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Opacity</label>
                <input type="range" style={{ width: '100%' }} />
              </div>
           </div>
        </aside>
      </div>

      {/* Bottom Timeline */}
      <footer style={{ height: '300px', borderTop: '1px solid var(--border)', background: 'var(--bg-accent)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '40px', borderBottom: '1px solid var(--border)', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem' }}>00:14:18 / 03:14:21</span>
           </div>
           <div style={{ display: 'flex', gap: '1rem' }}>
              <Settings size={16} />
              <Share2 size={16} />
           </div>
        </div>
        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
           <div style={{ height: '40px', background: 'var(--glass)', borderRadius: '4px', marginBottom: '8px', display: 'flex', alignItems: 'center', padding: '0 1rem' }}>
              <Video size={14} style={{ marginRight: '10px' }} />
              <span style={{ fontSize: '0.7rem' }}>Video Track 1</span>
           </div>
           <div style={{ height: '40px', background: 'rgba(0, 255, 194, 0.1)', borderLeft: '3px solid var(--accent-mint)', borderRadius: '4px', marginBottom: '8px' }}></div>
           <div style={{ height: '40px', background: 'var(--glass)', borderRadius: '4px', marginBottom: '8px' }}></div>
        </div>
      </footer>
    </div>
  );
};

export default VideoEditor;
