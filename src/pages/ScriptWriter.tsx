import React from 'react';
import { 
  Monitor, History, 
  Clipboard
} from 'lucide-react';

const ScriptWriter: React.FC = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      {/* Header */}
      <header style={{ height: '60px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', background: 'var(--bg-accent)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontWeight: 800 }}>REPLECA <span className="gradient-text">SCRIPT</span></span>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vlog_Script_Draft_V4.txt</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ background: 'var(--glass)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Monitor size={16} /> Teleprompter
          </button>
          <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>Save & Sync</button>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Workspace Panels */}
        <main style={{ flex: 1, display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
           <div style={{ width: '100%', maxWidth: '800px', padding: '4rem 2rem', background: 'var(--bg-accent)', minHeight: '150vh', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
              <div style={{ marginBottom: '3rem' }}>
                 <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Autumn Travel Vlog</h1>
                 <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>842 Words</span>
                    <span>~6 min reading time</span>
                 </div>
              </div>
              
              <div style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-primary)', outline: 'none' }} contentEditable>
                 <strong>[SCENE 1: CINEMATIC INTRO]</strong> <br />
                 (Drone shot of the landscape. Fade in music slowly.) <br /><br />
                 "They say the best stories are found between the pages of a passport. Today, we're not just traveling; we're exploring the heart of the valley." <br /><br />
                 <strong>[SCENE 2: HOST ON CAMERA]</strong> <br />
                 (Host walks through the market. Lively atmosphere.) <br /><br />
                 "Wait until you see what I found here. The colors, the textures... it's a creator's dream."
              </div>
           </div>
        </main>

        {/* Right Tools & Feedback */}
        <aside style={{ width: '320px', background: 'var(--bg-accent)', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
           <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>HASHTAGS & SEO</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                 {['#travel', '#vlog', '#cinematic', '#editing'].map(tag => (
                   <div key={tag} style={{ background: 'var(--glass)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{tag}</div>
                 ))}
                 <button style={{ background: 'transparent', border: '1px dashed var(--border)', padding: '6px 12px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>+ Suggest</button>
              </div>
           </section>

           <section style={{ flex: 1 }}>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>COLLABORATOR COMMENTS</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div className="glass-panel" style={{ padding: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', fontWeight: 800, marginBottom: '4px' }}>Alex P.</div>
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>Let's simplify Scene 1's hook. Maybe start with the market shot instead?</p>
                 </div>
              </div>
           </section>

           <div style={{ display: 'flex', gap: '10px', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: 'white' }}><History size={16} style={{ margin: '0 auto' }} /></button>
              <button style={{ flex: 1, background: 'var(--bg-dark)', border: '1px solid var(--border)', padding: '10px', borderRadius: '8px', color: 'white' }}><Clipboard size={16} style={{ margin: '0 auto' }} /></button>
           </div>
        </aside>
      </div>
    </div>
  );
};

export default ScriptWriter;
