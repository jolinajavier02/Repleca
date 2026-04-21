import React from 'react';
import { 
  Folder, 
  Library, 
  Settings,
  Share2,
  TrendingUp,
  PlusSquare,
  Home,
  Briefcase,
  PlayCircle,
  Image as ImageIcon,
  Presentation,
  Mic,
  FileText,
  Palette
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const menuItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Dashboard' },
    { id: 'projects', icon: <Folder size={20} />, label: 'Projects' },
    { id: 'media', icon: <Library size={20} />, label: 'Media Library' },
    { id: 'templates', icon: <PlayCircle size={20} />, label: 'Templates' },
    { id: 'brand', icon: <Palette size={20} />, label: 'Brand Kit' },
  ];

  const studioItems = [
    { id: 'editor-video', icon: <PlayCircle size={18} />, label: 'Video Studio' },
    { id: 'editor-image', icon: <ImageIcon size={18} />, label: 'Image Studio' },
    { id: 'editor-present', icon: <Presentation size={18} />, label: 'Slide Studio' },
    { id: 'editor-podcast', icon: <Mic size={18} />, label: 'Audio Studio' },
    { id: 'editor-script', icon: <FileText size={18} />, label: 'Script Writer' },
  ];

  const secondaryItems = [
    { id: 'analytics', icon: <TrendingUp size={20} />, label: 'Analytics' },
    { id: 'exports', icon: <Share2 size={20} />, label: 'Exports' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'var(--bg-accent)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 12px',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      <div style={{ padding: '0 12px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '32px', height: '32px', background: 'var(--gradient-primary)', borderRadius: '8px' }} />
        <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
          REPLECA <span className="gradient-text">STUDIO</span>
        </span>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', padding: '12px', letterSpacing: '0.1em' }}>MAIN</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activePage === item.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              color: activePage === item.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activePage === item.id ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
          </button>
        ))}

        <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', padding: '24px 12px 12px', letterSpacing: '0.1em' }}>STUDIOS</p>
        {studioItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              borderRadius: '10px',
              border: 'none',
              background: activePage === item.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              color: activePage === item.id ? 'var(--accent-purple)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: activePage === item.id ? 700 : 500,
              transition: 'all 0.2s'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {secondaryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: activePage === item.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: '24px', padding: '16px', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Workspace</div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Briefcase size={14} /> Repleca_Main
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
