import React from 'react';
import { 
  Search, Folder, 
  Video, Image as ImageIcon, 
  Upload, Cloud, Grid, List, 
  Trash2, MoreVertical
} from 'lucide-react';

const MediaLibrary: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Media <span className="gradient-text">Studio</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>All your R2 assets in one unified organization.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button style={{ background: 'var(--glass)', border: '1px solid var(--border)', color: 'white', padding: '12px 24px', borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
             <Folder size={18} /> New Folder
           </button>
           <button style={{ background: 'var(--gradient-primary)', border: 'none', color: 'white', padding: '12px 32px', borderRadius: '10px', fontWeight: 800, display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
             <Upload size={18} /> Upload Media
           </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            placeholder="Search assets by name or tag..." 
            style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 14px 14px 50px', color: 'white', fontSize: '0.95rem' }} 
          />
        </div>
        <div style={{ display: 'flex', background: 'var(--bg-accent)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
           <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px' }}><Grid size={20} /></button>
           <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '8px' }}><List size={20} /></button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {/* Folders first */}
        {[
          { label: 'Q4 Marketing', count: 12 },
          { label: 'Raw Footage', count: 48 },
          { label: 'Client Approvals', count: 5 }
        ].map(folder => (
           <div key={folder.label} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                 <Folder size={32} color="var(--accent-purple)" />
                 <MoreVertical size={16} color="var(--text-secondary)" />
              </div>
              <div>
                 <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{folder.label}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{folder.count} items</div>
              </div>
           </div>
        ))}
        
        {/* Files */}
        {[1, 2, 3, 4, 5].map(file => (
          <div key={file} className="glass-panel" style={{ overflow: 'hidden' }}>
             <div style={{ height: '140px', background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {file % 2 === 0 ? <Video size={32} /> : <ImageIcon size={32} />}
                <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', padding: '4px', fontSize: '0.65rem' }}>{file % 2 === 0 ? 'MP4' : 'JPG'}</div>
             </div>
             <div style={{ padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Asset_{file}.{file % 2 === 0 ? 'mp4' : 'jpg'}</div>
                <Trash2 size={14} color="var(--text-secondary)" style={{ cursor: 'pointer' }} />
             </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--border)', borderRadius: '16px', background: 'rgba(0,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <Cloud size={32} color="var(--accent-cyan)" />
            <div>
               <div style={{ fontWeight: 800 }}>R2 Cloud Storage</div>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>12.4 GB used of 50 GB</div>
            </div>
         </div>
         <div style={{ width: '300px', height: '8px', background: 'var(--bg-dark)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: '25%', height: '100%', background: 'var(--accent-cyan)' }} />
         </div>
         <button style={{ color: 'var(--accent-cyan)', background: 'transparent', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Upgrade Store</button>
      </div>
    </div>
  );
};

export default MediaLibrary;
