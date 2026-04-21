import React from 'react';
import { 
  Palette, Image as ImageIcon, Type, 
  Plus, Check, Briefcase
} from 'lucide-react';

const BrandKit: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Brand <span className="gradient-text">Identity</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Centralize your assets for consistent creation.</p>
        </div>
        <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '12px 32px', borderRadius: '10px', fontWeight: 800, display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
           <Plus size={18} /> New Brand Kit
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
         {/* Sidebar: Kits */}
         <aside className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>ACTIVE KITS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,255,255,0.05)', borderRadius: '10px', border: '1px solid var(--accent-cyan)' }}>
                  <Briefcase size={20} color="var(--accent-cyan)" />
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Main Corporate</span>
                  <Check size={16} color="var(--accent-cyan)" style={{ marginLeft: 'auto' }} />
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--glass)', borderRadius: '10px', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <Briefcase size={20} color="var(--text-secondary)" />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Side Project Alpha</span>
               </div>
            </div>
         </aside>

         {/* Main Config */}
         <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Logos */}
            <section className="glass-panel" style={{ padding: '2rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                     <ImageIcon size={20} color="var(--accent-purple)" />
                     <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Master Logos</h2>
                  </div>
                  <button style={{ color: 'var(--accent-cyan)', background: 'transparent', border: 'none', fontWeight: 800 }}>+ Add Logo</button>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'Primary White', bg: '#111' },
                    { label: 'Primary Black', bg: '#eee' },
                    { label: 'Icon Mark', bg: '#111' }
                  ].map((logo, i) => (
                    <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', background: 'var(--bg-accent)' }}>
                       <div style={{ height: '100px', background: logo.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.6rem', color: logo.bg === '#eee' ? '#000' : '#fff' }}>[LOGO PREVIEW]</span>
                       </div>
                       <div style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-secondary)' }}>{logo.label}</div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Colors */}
            <section className="glass-panel" style={{ padding: '2rem' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <Palette size={20} color="var(--accent-cyan)" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Brand Colors</h2>
               </div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                  {[
                    { hex: '#0D0D0D', label: 'Ebony' },
                    { hex: '#8A2BE2', label: 'Violet' },
                    { hex: '#00FFFF', label: 'Cyan' },
                    { hex: '#FFFFFF', label: 'White' }
                  ].map((color, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ width: '54px', height: '54px', background: color.hex, borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)' }} />
                       <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>{color.hex}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{color.label}</div>
                       </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '54px', height: '54px', border: '1px dashed var(--border)', borderRadius: '12px', cursor: 'pointer' }}>
                     <Plus size={20} />
                  </div>
               </div>
            </section>

            {/* Fonts */}
            <section className="glass-panel" style={{ padding: '2rem' }}>
               <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <Type size={20} color="var(--accent-mint)" />
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Typography</h2>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                     <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>HEADING</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>Outfit - ExtraBold</div>
                     </div>
                     <button style={{ color: 'var(--accent-cyan)', background: 'transparent', border: 'none' }}>Change</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>BODY</div>
                        <div style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}>Inter - Regular</div>
                     </div>
                     <button style={{ color: 'var(--accent-cyan)', background: 'transparent', border: 'none' }}>Change</button>
                  </div>
               </div>
            </section>
         </main>
      </div>
    </div>
  );
};

export default BrandKit;
