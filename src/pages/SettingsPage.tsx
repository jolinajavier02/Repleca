import React from 'react';
import { 
  Settings as SettingsIcon, User, Briefcase, 
  CreditCard, Bell, Shield, 
  Database, Globe, Moon, Sun, 
  Trash2, LogOut
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Studio <span className="gradient-text">Configuration</span></h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your workspace, billing, and team permissions.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
         {/* Navigation */}
         <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'General', icon: <SettingsIcon size={18} />, active: true },
              { label: 'Profile', icon: <User size={18} /> },
              { label: 'Workspace', icon: <Briefcase size={18} /> },
              { label: 'Billing', icon: <CreditCard size={18} /> },
              { label: 'Notifications', icon: <Bell size={18} /> },
              { label: 'Privacy & Security', icon: <Shield size={18} /> },
              { label: 'Integrations', icon: <Globe size={18} /> },
              { label: 'Storage', icon: <Database size={18} /> }
            ].map((item, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: item.active ? 'rgba(0,255,255,0.05)' : 'transparent', border: 'none', color: item.active ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontWeight: item.active ? 800 : 500, textAlign: 'left', cursor: 'pointer' }}>
                 {item.icon}
                 <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </button>
            ))}
            <div style={{ margin: '1.5rem 0', height: '1px', background: 'var(--border)' }} />
            <button style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: 'transparent', border: 'none', color: '#FF4B4B', fontWeight: 600, textAlign: 'left', cursor: 'pointer' }}>
               <LogOut size={18} />
               <span style={{ fontSize: '0.9rem' }}>Sign Out</span>
            </button>
         </nav>

         {/* Content Area */}
         <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <section className="glass-panel" style={{ padding: '2rem' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Interface Settings</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 700 }}>Appearance</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Choose your studio theme</div>
                     </div>
                     <div style={{ display: 'flex', background: 'var(--bg-accent)', borderRadius: '10px', padding: '4px', border: '1px solid var(--border)' }}>
                        <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', display: 'flex', gap: '8px' }}><Moon size={16} /> Dark</button>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '8px 12px', borderRadius: '6px' }}><Sun size={16} /></button>
                     </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 700 }}>Autosave Stability</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sync frequency to D1 Cloud</div>
                     </div>
                     <select style={{ background: 'var(--bg-accent)', border: '1px solid var(--border)', padding: '8px 16px', borderRadius: '8px', color: 'white' }}>
                        <option>Every 30 seconds</option>
                        <option>Real-time</option>
                        <option>Manual only</option>
                     </select>
                  </div>
               </div>
            </section>

            <section className="glass-panel" style={{ padding: '2rem' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem' }}>Workspace Management</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 700 }}>Workspace Name</div>
                        <div style={{ fontSize: '0.95rem', marginTop: '4px' }}>Repleca_Main_Studio</div>
                     </div>
                     <button style={{ color: 'var(--accent-cyan)', background: 'transparent', border: 'none', fontWeight: 800 }}>Edit</button>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 700 }}>Storage Retention</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>How long to keep R2 cache assets</div>
                     </div>
                     <div style={{ fontWeight: 700 }}>30 Days</div>
                  </div>
               </div>
            </section>

            <section className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(255, 75, 75, 0.2)' }}>
               <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#FF4B4B' }}>Danger Zone</h2>
               <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Once you delete a workspace, all files in R2 and metadata in D1 will be permanently erased.</p>
               <button style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid #FF4B4B', padding: '12px 24px', borderRadius: '10px', color: '#FF4B4B', fontWeight: 800, display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                  <Trash2 size={18} /> Delete Workspace
               </button>
            </section>
         </main>
      </div>
    </div>
  );
};

export default SettingsPage;
