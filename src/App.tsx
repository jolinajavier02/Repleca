import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import VideoEditor from './pages/VideoEditor';
import ExportCenter from './pages/ExportCenter';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import { 
  Home as HomeIcon, 
  Folder, 
  PlusSquare, 
  Share2, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

function App() {
  const [view, setView] = useState('landing');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthComplete = (isNewUser: boolean) => {
    setIsAuthenticated(true);
    if (isNewUser) {
      setView('onboarding');
    } else {
      setView('home');
    }
  };

  if (view === 'auth') {
    return <AuthPage onAuthComplete={handleAuthComplete} />;
  }

  if (view === 'onboarding') {
    return <OnboardingPage onComplete={() => setView('home')} />;
  }

  if (view === 'create' || view === 'video') {
    return <VideoEditor onStart={() => setView('projects')} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Desktop Sidebar Navigation */}
      {!isMobile && !['landing', 'auth', 'onboarding'].includes(view) && (
        <Sidebar activePage={view} onNavigate={setView} />
      )}
      
      <main style={{ 
        flex: 1, 
        marginLeft: (!isMobile && !['landing', 'auth', 'onboarding'].includes(view)) ? '260px' : 0,
        marginBottom: isMobile && !['landing', 'auth', 'onboarding'].includes(view) ? '80px' : 0,
        minHeight: '100vh',
        overflow: 'auto'
      }}>
        {view === 'landing' ? (
          <>
            <Header onStart={() => setView('auth')} />
            <div style={{ marginTop: '80px' }}>
              <Hero onStart={() => setView('auth')} />
              <Features />
            </div>
            <footer style={{ padding: '50px 0', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>&copy; 2026 Repleca Studio. All rights reserved.</p>
            </footer>
          </>
        ) : (
          <div style={{ minHeight: '100vh' }}>
            {/* View Header for Mobile */}
            {isMobile && !['auth', 'onboarding'].includes(view) && (
               <header style={{ padding: '1.5rem', background: 'var(--bg-accent)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                  <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>REPLECA <span className="gradient-text">STUDIO</span></span>
               </header>
            )}

            {view === 'home' && (
              <div style={{ padding: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Welcome back, <span className="gradient-text">Creator</span></h1>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                   <div className="glass-panel" style={{ padding: '2rem', cursor: 'pointer' }} onClick={() => setView('create')}>
                      <PlusSquare size={32} color="var(--accent-cyan)" />
                      <h3 style={{ marginTop: '1rem' }}>Start Fresh Flow</h3>
                   </div>
                   <div className="glass-panel" style={{ padding: '2rem' }}>
                      <TrendingUp size={32} color="var(--accent-purple)" />
                      <h3 style={{ marginTop: '1rem' }}>Last 7 Days: +15.4k Views</h3>
                   </div>
                </div>
              </div>
            )}

            {view === 'projects' && <ProjectsPage />}
            {view === 'exports' && <ExportCenter />}
            
            {/* Catch-all for secondary pages */}
            {!['home', 'projects', 'exports', 'landing', 'auth', 'onboarding'].includes(view) && (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem' }}>{view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ')}</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Our engineers are fine-tuning this studio for cinematic performance.</p>
                <button 
                  onClick={() => setView('home')}
                  style={{ marginTop: '2rem', background: 'var(--gradient-primary)', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 700 }}
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && !['landing', 'auth', 'onboarding'].includes(view) && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '75px',
          background: 'rgba(13, 13, 13, 0.95)',
          backdropFilter: 'blur(32px)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000
        }}>
          {[
            { id: 'home', icon: <HomeIcon size={22} />, label: 'Home' },
            { id: 'projects', icon: <Folder size={22} />, label: 'Projects' },
            { id: 'create', icon: <div style={{ background: 'var(--gradient-primary)', borderRadius: '12px', padding: '10px', display: 'flex', marginTop: '-20px' }}><PlusSquare size={24} color="#000" /></div>, label: '' },
            { id: 'publish', icon: <Share2 size={22} />, label: 'Publish' },
            { id: 'settings', icon: <Settings size={22} />, label: 'More' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setView(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: view === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {tab.icon}
              {tab.label && <span style={{ fontSize: '0.65rem', fontWeight: 600 }}>{tab.label}</span>}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;
