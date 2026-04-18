import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import VideoEditor from './pages/VideoEditor';
import ExportCenter from './pages/ExportCenter';
import { Home, PlusSquare, Folder, Share2, User } from 'lucide-react';

function App() {
  const [view, setView] = useState('landing');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (view === 'video') {
    return <VideoEditor onBack={() => setView('projects')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Desktop Sidebar */}
      {!isMobile && view !== 'landing' && (
        <Sidebar activePage={view} onNavigate={setView} />
      )}
      
      <main style={{ 
        flex: 1, 
        marginLeft: (!isMobile && view !== 'landing') ? '260px' : 0,
        marginBottom: isMobile && view !== 'landing' ? '80px' : 0,
        minHeight: '100vh'
      }}>
        {view === 'landing' ? (
          <>
            <Header onStart={() => setView('projects')} />
            <div style={{ marginTop: '80px' }}>
              <Hero onStart={() => setView('projects')} />
              <Features />
            </div>
            <footer style={{ padding: '50px 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>&copy; 2026 CreatorFlow Studio. All rights reserved.</p>
            </footer>
          </>
        ) : (
          <>
            {view === 'projects' && <ProjectsPage />}
            {view === 'exports' && <ExportCenter />}
            {/* Placeholder for other pages */}
            {(!['projects', 'video', 'exports'].includes(view)) && (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem' }}>{view.charAt(0).toUpperCase() + view.slice(1)} Studio</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>The Flow is currently being optimized for this section.</p>
                <button 
                  onClick={() => setView('projects')}
                  style={{ marginTop: '2rem', background: 'var(--gradient-primary)', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Back to Workspace
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && view !== 'landing' && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70px',
          background: 'rgba(10, 17, 40, 0.9)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000
        }}>
          {[
            { id: 'projects', icon: <Home size={24} /> },
            { id: 'video', icon: <PlusSquare size={24} /> },
            { id: 'library', icon: <Folder size={24} /> },
            { id: 'publish', icon: <Share2 size={24} /> },
            { id: 'profile', icon: <User size={24} /> },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: view === tab.id ? 'var(--accent-mint)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {tab.icon}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;
