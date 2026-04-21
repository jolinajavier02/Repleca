import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Globe, Apple, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AuthPageProps {
  onAuthComplete: (isNewUser: boolean) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    workspace: '',
    role: 'creator',
    inviteCode: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onAuthComplete(!isLogin); // If signup, go to onboarding
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Visual Panel - Desktop Only */}
      <div style={{ 
        flex: 1, 
        background: 'var(--bg-accent)', 
        display: window.innerWidth < 1024 ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '5rem',
        borderRight: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'var(--accent-purple)', filter: 'blur(150px)', opacity: 0.2 }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '300px', height: '300px', background: 'var(--accent-cyan)', filter: 'blur(150px)', opacity: 0.2 }} />
        
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '2rem' }}>
          Edit Once. <br />
          <span className="gradient-text">Publish Everywhere.</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
          Join the global studio for modern creators. Precise enough for desktop, fast enough for mobile.
        </p>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem' }}>
           <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-cyan)' }}>1k+</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Templates ready</div>
           </div>
           <div className="glass-panel" style={{ padding: '1.5rem', flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--accent-purple)' }}>Unlimited</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>D1 Cloud Projects</div>
           </div>
        </div>
      </div>

      {/* Form Panel */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem' 
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.5rem' }}>
               REPLECA <span className="gradient-text">STUDIO</span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {isLogin ? 'Welcome back' : 'Create your studio'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {isLogin ? 'Sign in to access your projects' : 'Start your 14-day pro trial today'}
            </p>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  required
                  style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 14px 14px 44px', color: 'white', fontSize: '0.95rem' }}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                placeholder="Email Address"
                required
                style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 14px 14px 44px', color: 'white', fontSize: '0.95rem' }}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Password"
                required
                style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 44px 14px 44px', color: 'white', fontSize: '0.95rem' }}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && (
              <>
                <div style={{ position: 'relative' }}>
                  <Globe size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="text" 
                    placeholder="Workspace Name"
                    required
                    style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 14px 14px 44px', color: 'white', fontSize: '0.95rem' }}
                  />
                </div>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <select 
                    style={{ width: '100%', background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 14px 14px 44px', color: 'white', fontSize: '0.95rem', appearance: 'none' }}
                  >
                    <option value="creator">I am a Creator</option>
                    <option value="student">I am a Student</option>
                    <option value="teacher">I am a Teacher</option>
                    <option value="business">Business / Team</option>
                    <option value="podcaster">Podcaster</option>
                    <option value="agency">Agency</option>
                  </select>
                </div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <input type="checkbox" style={{ accentColor: 'var(--accent-cyan)' }} />
                Keep me signed in
              </label>
              {isLogin && <a href="#" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>Forgot password?</a>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                background: 'var(--gradient-primary)', 
                border: 'none', 
                padding: '16px', 
                borderRadius: '12px', 
                color: '#0A1128', 
                fontWeight: 800, 
                fontSize: '1rem', 
                cursor: 'pointer',
                marginTop: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ flex: 1, background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
               <Globe size={20} /> Google
            </button>
            <button style={{ flex: 1, background: 'var(--bg-accent)', border: '1px solid var(--border)', borderRadius: '10px', padding: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer' }}>
               <Apple size={20} /> Apple
            </button>
          </div>

          <footer style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
             {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
             <button 
               onClick={() => setIsLogin(!isLogin)}
               style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
             >
               {isLogin ? 'Sign Up' : 'Sign In'}
             </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
