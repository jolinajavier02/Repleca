import React from 'react';
import { 
  Folder, 
  Library, 
  Smile, 
  Settings,
  Share2,
  TrendingUp,
  PlusSquare,
  Home,
  Briefcase
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home' },
    { id: 'projects', icon: <Folder size={20} />, label: 'Projects' },
    { id: 'create', icon: <PlusSquare size={20} />, label: 'Create New' },
    { id: 'templates', icon: <Smile size={20} />, label: 'Templates' },
    { id: 'library', icon: <Library size={20} />, label: 'Media Library' },
    { id: 'brand', icon: <Briefcase size={20} />, label: 'Brand Kit' },
    { id: 'publish', icon: <Share2 size={18} />, label: 'Publish' },
    { id: 'analytics', icon: <TrendingUp size={20} />, label: 'Analytics' },
    { id: 'team', icon: <Share2 size={20} />, label: 'Team / Share' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-accent)',
      borderRight: '1px solid var(--border)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
         <div style={{ width: '28px', height: '28px', background: 'var(--gradient-primary)', borderRadius: '6px' }} />
         <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>CREATOR<span className="gradient-text">FLOW</span></span>
      </div>

      <nav style={{ flex: 1 }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: activePage === item.id ? 'var(--glass)' : 'transparent',
              border: activePage === item.id ? '1px solid var(--border)' : '1px solid transparent',
              color: activePage === item.id ? 'var(--accent-mint)' : 'var(--text-secondary)',
              cursor: 'pointer',
              marginBottom: '4px',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            {item.icon}
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '12px',
          color: 'var(--text-secondary)',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}>
          <Settings size={20} />
          <span style={{ fontSize: '0.9rem' }}>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
