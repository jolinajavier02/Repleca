import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Sidebar from './components/Sidebar';
import ProjectsPage from './pages/ProjectsPage';
import VideoEditor from './pages/VideoEditor';
import ImageEditor from './pages/ImageEditor';
import PresentationStudio from './pages/PresentationStudio';
import PodcastStudio from './pages/PodcastStudio';
import ScriptWriter from './pages/ScriptWriter';
import TemplateLibrary from './pages/TemplateLibrary';
import MediaLibrary from './pages/MediaLibrary';
import BrandKit from './pages/BrandKit';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import ExportCenter from './pages/ExportCenter';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import { 
  Home as HomeIcon, 
  Folder, 
  PlusSquare, 
  TrendingUp, 
  Settings 
} from 'lucide-react';

function App() {
  const [view, setView] = useState('landing');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAuthComplete = (isNewUser: boolean) => {
    if (isNewUser) {
      setView('onboarding');
    } else {
      setView('home');
    }
  };

  // Full Screen Editor Views
  if (view === 'editor-video') return <VideoEditor onStart={() => setView('projects')} />;
  if (view === 'editor-image') return <ImageEditor />;
  if (view === 'editor-present') return <PresentationStudio />;
  if (view === 'editor-podcast') return <PodcastStudio />;
  if (view === 'editor-script') return <ScriptWriter />;
  
  if (view === 'auth') return <AuthPage onAuthComplete={handleAuthComplete} />;
  if (view === 'onboarding') return <OnboardingPage onComplete={() => setView('home')} />;

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', background: 'var(--bg-dark)' }}>
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
            {isMobile && !['auth', 'onboarding'].includes(view) && (
               <header style={{ padding: '1.5rem', background: 'var(--bg-accent)', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                  <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>REPLECA <span className="gradient-text">STUDIO</span></span>
               </header>
            )}

            {view === 'home' && (
              <div style={{ padding: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Welcome back, <span className="gradient-text">Creator</span></h1>
                
                {/* Hub Shortcuts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                   <div className="glass-panel" style={{ padding: '2rem', cursor: 'pointer' }} onClick={() => setView('editor-video')}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--accent-cyan)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><PlusSquare color="#000" /></div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Video Flow</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Start a fresh cinematic reel or short.</p>
                   </div>
                   <div className="glass-panel" style={{ padding: '2rem', cursor: 'pointer' }} onClick={() => setView('editor-image')}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--accent-purple)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}><PlusSquare color="#fff" /></div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Design Studio</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Create thumbnails, covers, and graphics.</p>
                   </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                   <section>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Recent Work</h2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         {[1, 2, 3].map(i => (
                           <div key={i} className="glass-panel" style={{ padding: '1rem', display: 'flex', gap: '1.5rem', alignItems: 'center', cursor: 'pointer' }} onClick={() => setView('projects')}>
                              <div style={{ width: '100px', height: '60px', background: 'var(--bg-accent)', borderRadius: '6px' }} />
                              <div style={{ flex: 1 }}>
                                 <div style={{ fontWeight: 700 }}>Project_Alpha_Draft_{i}</div>
                                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Edited 2 hours ago</div>
                              </div>
                              <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: i === 1 ? 'var(--accent-cyan)' : 'var(--glass)', borderRadius: '100px', color: i === 1 ? '#000' : 'white' }}>{i === 1 ? 'In Progress' : 'Draft'}</span>
                           </div>
                         ))}
                      </div>
                   </section>
                   <section>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>Cloud Health</h2>
                      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                         <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                               <span>D1 Metadata Sync</span>
                               <span style={{ color: 'var(--accent-mint)' }}>Operational</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--accent-mint)', borderRadius: '2px' }} />
                         </div>
                         <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                               <span>R2 Storage (12.4GB)</span>
                               <span>25% Used</span>
                            </div>
                            <div style={{ width: '100%', height: '4px', background: 'var(--bg-dark)', borderRadius: '2px' }}>
                               <div style={{ width: '25%', height: '100%', background: 'var(--accent-cyan)' }} />
                            </div>
                         </div>
                      </div>
                   </section>
                </div>
              </div>
            )}

            {view === 'projects' && <ProjectsPage />}
            {view === 'templates' && <TemplateLibrary />}
            {view === 'media' && <MediaLibrary />}
            {view === 'brand' && <BrandKit />}
            {view === 'analytics' && <AnalyticsDashboard />}
            {view === 'exports' && <ExportCenter />}
            {view === 'settings' && <SettingsPage />}
            
            {/* Catch-all */}
            {!['home', 'projects', 'templates', 'media', 'brand', 'analytics', 'exports', 'settings', 'landing', 'auth', 'onboarding'].includes(view) && (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem' }}>{view.charAt(0).toUpperCase() + view.slice(1).replace('-', ' ')}</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Our engineers are fine-tuning this studio for cinematic performance.</p>
                <button onClick={() => setView('home')} style={{ marginTop: '2rem', background: 'var(--gradient-primary)', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', color: 'white', fontWeight: 700 }}>Back Home</button>
              </div>
            )}
          </div>
        )}
      </main>

      {isMobile && !['landing', 'auth', 'onboarding'].includes(view) && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: '75px',
          background: 'rgba(13, 13, 13, 0.95)', backdropFilter: 'blur(32px)',
          borderTop: '1px solid var(--border)', display: 'flex',
          justifyContent: 'space-around', alignItems: 'center', zIndex: 1000
        }}>
          {[
            { id: 'home', icon: <HomeIcon size={22} />, label: 'Home' },
            { id: 'projects', icon: <Folder size={22} />, label: 'Projects' },
            { id: 'editor-video', icon: <div style={{ background: 'var(--gradient-primary)', borderRadius: '12px', padding: '10px', display: 'flex', marginTop: '-20px' }}><PlusSquare size={24} color="#000" /></div>, label: '' },
            { id: 'analytics', icon: <TrendingUp size={22} />, label: 'Stats' },
            { id: 'settings', icon: <Settings size={22} />, label: 'More' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setView(tab.id)} style={{ background: 'transparent', border: 'none', color: view === tab.id ? 'var(--accent-cyan)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
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
