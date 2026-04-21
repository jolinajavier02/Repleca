import React from 'react';
import { 
  Mic, Scissors, 
  Settings, Play, Waves, 
  FileText, Headphones, Sparkles, Volume2
} from 'lucide-react';

const PodcastStudio: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Top Header */}
      <header style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', background: 'var(--bg-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 800 }}>REPLECA <span className="gradient-text">AUDIO</span></span>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>The_Future_of_AI_EP04.mp3</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: 'var(--glass)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem' }}>Enhance Master</button>
          <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Publish</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Toolbar */}
        <aside style={{ width: '80px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem 0', gap: '2rem', background: 'var(--bg-accent)' }}>
           <Mic size={22} color="var(--accent-cyan)" />
           <Headphones size={20} color="var(--text-secondary)" />
           <Waves size={20} color="var(--text-secondary)" />
           <Scissors size={20} color="var(--text-secondary)" />
           <FileText size={20} color="var(--text-secondary)" />
        </aside>

        {/* Center: Waveform & Playback */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
           <div style={{ flex: 1, background: '#000', position: 'relative', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
              <div style={{ width: '100%', height: '200px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                 {/* Visual Waveform Simulation */}
                 {Array.from({ length: 150 }).map((_, i) => (
                   <div key={i} style={{ flex: 1, height: `${Math.random() * 80 + 20}%`, background: 'var(--accent-cyan)', opacity: 0.8, borderRadius: '10px' }} />
                 ))}
                 <div style={{ position: 'absolute', top: 0, left: '400px', height: '100%', width: '1px', background: 'white', zIndex: 10 }} />
              </div>
              
              <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '2rem', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px 30px', borderRadius: '100px', backdropFilter: 'blur(10px)' }}>
                 <Volume2 size={20} />
                 <Play size={24} fill="white" />
                 <Sparkles size={20} color="var(--accent-cyan)" />
              </div>
           </div>
           
           {/* Multi-track Timeline Area */}
           <div style={{ height: '300px', borderTop: '1px solid var(--border)', background: 'var(--bg-accent)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '40px', borderBottom: '1px solid var(--border)', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>TIMELINE</span>
                 <Settings size={14} />
              </div>
              <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                 {[
                   { label: 'Host Vocals', color: 'var(--accent-cyan)' },
                   { label: 'Guest Vocals', color: 'var(--accent-purple)' },
                   { label: 'Background Music', color: 'var(--accent-mint)' }
                 ].map((track, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '10px' }}>
                       <div style={{ width: '150px', padding: '10px', background: 'var(--bg-dark)', borderRadius: '6px', fontSize: '0.7rem' }}>{track.label}</div>
                       <div style={{ flex: 1, background: track.color, opacity: 0.1, borderRadius: '6px', height: '40px', border: `1px solid ${track.color}` }} />
                    </div>
                 ))}
              </div>
           </div>
        </main>

        {/* Right: Transcript & AI Features */}
        <aside style={{ width: '350px', borderLeft: '1px solid var(--border)', background: 'var(--bg-accent)', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem' }}>AI ANALYSIS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                 <button style={{ padding: '10px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.75rem' }}>Clean Noise</button>
                 <button style={{ padding: '10px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.75rem' }}>Remove Silence</button>
              </div>
           </div>
           <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.25rem' }}>TRANSCRIPT</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.8 }}>
                 <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Host [00:14]:</span> So welcome to another episode of Repleca Studio Insights. Today we are talking about the R2 and D1 architecture.
                 </div>
                 <div style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <span style={{ color: 'var(--accent-purple)', fontWeight: 700 }}>Guest [00:28]:</span> Yeah, it's really a game changer for zero-egress asset storage.
                 </div>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default PodcastStudio;
