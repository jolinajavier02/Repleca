import React from 'react';
import { Search, Plus, Filter, LayoutGrid, List, MoreVertical } from 'lucide-react';

import { api } from '../services/api';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return '#00FFFF';
    case 'exported': return '#8A2BE2';
    case 'scheduled': return '#FFD700';
    default: return 'var(--text-secondary)';
  }
};

const ProjectsPage: React.FC = () => {
  const [projectList, setProjectList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      const data = await api.getProjects();
      if (data && data.length > 0) {
        setProjectList(data);
      } else {
        // Fallback to static dummy data if DB is empty
        setProjectList([
          { id: 1, name: 'Autumn Travel Vlog', type: 'Video', status: 'published', date: '2h ago', preview: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=250&fit=crop' },
          { id: 2, name: 'Q4 Business Pitch', type: 'Presentation', status: 'draft', date: '1d ago', preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop' },
        ]);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Your Workspaces</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage and organize your creative flows.</p>
        </div>
        <button style={{
          padding: '12px 24px',
          background: 'var(--gradient-primary)',
          color: '#0A1128',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer'
        }}>
          <Plus size={20} />
          New Project
        </button>
      </header>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        background: 'var(--bg-accent)',
        padding: '12px 20px',
        borderRadius: '16px',
        border: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
           <div style={{ position: 'relative', width: '300px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                style={{
                  width: '100%',
                  background: 'var(--bg-dark)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '10px 10px 10px 40px',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              />
           </div>
           <button style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0 12px', color: 'var(--text-secondary)' }}><Filter size={18}/></button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', color: 'var(--accent-mint)' }}><LayoutGrid size={18}/></button>
          <button style={{ background: 'transparent', border: 'none', padding: '8px', color: 'var(--text-secondary)' }}><List size={18}/></button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '2rem' 
      }}>
        {projectList.map((project) => (
          <div key={project.id} className="glass-panel" style={{ overflow: 'hidden' }}>
            <div style={{ height: '160px', position: 'relative' }}>
               <img src={project.preview} alt={project.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
               <div style={{
                 position: 'absolute',
                 top: '12px',
                 right: '12px',
                 padding: '4px 10px',
                 borderRadius: '6px',
                 background: 'rgba(0,0,0,0.6)',
                 backdropFilter: 'blur(4px)',
                 fontSize: '0.7rem',
                 fontWeight: 700,
                 textTransform: 'uppercase',
                 color: getStatusColor(project.status),
                 border: `1px solid ${getStatusColor(project.status)}`
               }}>
                 {project.status}
               </div>
            </div>
            <div style={{ padding: '1.25rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{project.name}</h3>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><MoreVertical size={18}/></button>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{project.type}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{project.date}</span>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
