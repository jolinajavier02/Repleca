import React, { useState } from 'react';
import { 
  Check, ChevronRight, ChevronLeft, Video, 
  Users, User, GraduationCap, Mic, BarChart, 
  Youtube, Smartphone, Instagram, Facebook, Send, Linkedin,
  Layers, Presentation, Palette, Upload
} from 'lucide-react';

interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 8;

  const nextStep = () => {
    if (step === totalSteps) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Progress Indicator */}
      <div style={{ width: '100%', maxWidth: '600px', padding: '3rem 2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <span>Step {step} of {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}% Complete</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
          <div style={{ width: `${(step / totalSteps) * 100}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <main style={{ flex: 1, width: '100%', maxWidth: '600px', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>👋 Welcome to <span className="gradient-text">Repleca Studio</span></h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Let's personalize your workspace to help you create content faster. This only takes a minute.
            </p>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem' }}>
               <h3 style={{ marginBottom: '1rem' }}>Instant Studio Setup</h3>
               <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['Personalized Templates', 'Platform-aware Ratios', 'Brand Kit Integration'].map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <div style={{ background: 'var(--accent-cyan)', borderRadius: '50%', padding: '4px' }}><Check size={14} color="#000" /></div>
                       <span style={{ fontSize: '0.9rem' }}>{item}</span>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>What do you create?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We'll recommend templates based on your role.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               {[
                 { icon: <Video />, label: 'Video Creator' },
                 { icon: <Users />, label: 'Influencer' },
                 { icon: <User />, label: 'Individual' },
                 { icon: <GraduationCap />, label: 'Student / Teacher' },
                 { icon: <Mic />, label: 'Podcaster' },
                 { icon: <BarChart />, label: 'Marketer' }
               ].map((type, i) => (
                 <button key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', background: i === 0 ? 'rgba(0,255,255,0.05)' : 'var(--glass)', borderColor: i === 0 ? 'var(--accent-cyan)' : 'var(--border)', color: 'white', cursor: 'pointer' }}>
                    {type.icon}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{type.label}</span>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Where do you publish?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Choose your primary platforms.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
               {[
                 { icon: <Youtube />, label: 'YouTube' },
                 { icon: <Smartphone />, label: 'TikTok' },
                 { icon: <Instagram />, label: 'Instagram' },
                 { icon: <Facebook />, label: 'Facebook' },
                 { icon: <Send />, label: 'X (Twitter)' },
                 { icon: <Linkedin />, label: 'LinkedIn' },
                 { icon: <Mic />, label: 'Podcast Platforms' }
               ].map((platform, i) => (
                 <button key={i} className="glass-panel" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', cursor: 'pointer' }}>
                    {platform.icon}
                    <span style={{ fontSize: '0.9rem' }}>{platform.label}</span>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Content categories</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>What styles do you focus on?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               {[
                 { icon: <Layers />, label: 'Short-form Video' },
                 { icon: <Video />, label: 'Long-form Video' },
                 { icon: <Presentation />, label: 'Presentations' },
                 { icon: <Palette />, label: 'Social Graphics' },
                 { icon: <Mic />, label: 'Audiograms' },
                 { icon: <Presentation />, label: 'School Reports' }
               ].map((pref, i) => (
                 <button key={i} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', gap: '15px', alignItems: 'center', color: 'white', cursor: 'pointer', textAlign: 'left' }}>
                    <div style={{ padding: '8px', background: 'var(--bg-accent)', borderRadius: '8px' }}>{pref.icon}</div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{pref.label}</span>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Default Aspect Ratios</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We'll set these as your quick-start presets.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
               {[
                 { label: '9:16', desc: 'Mobile/Social' },
                 { label: '16:9', desc: 'Widescreen' },
                 { label: '1:1', desc: 'Square' },
                 { label: '4:5', desc: 'Portrait' },
                 { label: '21:9', desc: 'Cinematic' }
               ].map((ratio, i) => (
                 <button key={i} className="glass-panel" style={{ padding: '1.5rem 1rem', position: 'relative', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '30px', height: ratio.label === '16:9' ? '18px' : '40px', border: '1px solid white', borderRadius: '2px', opacity: 0.5, marginBottom: '10px' }} />
                    <span style={{ fontWeight: 800 }}>{ratio.label}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{ratio.desc}</span>
                 </button>
               ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Brand Identity</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Upload your logo or brand colors to your Brand Kit.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
                  <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                  <div style={{ fontWeight: 600 }}>Drop your logo here</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>PNG, SVG or JPG supported</div>
               </div>
               <div>
                  <h4 style={{ marginBottom: '1rem' }}>Brand Colors</h4>
                  <div style={{ display: 'flex', gap: '10px' }}>
                     {['#8A2BE2', '#00FFFF', '#00FFC2', '#FFD700', '#FF3366', '#0D0D0D'].map((color) => (
                       <div key={color} style={{ width: '40px', height: '40px', background: color, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', cursor: 'pointer' }} />
                     ))}
                  </div>
               </div>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="animate-fade-in">
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Import First Media</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Start your first project right away or start with a template.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <button className="glass-panel" style={{ padding: '2rem', textAlign: 'center', background: 'rgba(138, 43, 226, 0.1)', borderColor: 'var(--accent-purple)' }}>
                  <Video size={32} color="var(--accent-purple)" style={{ marginBottom: '10px' }} />
                  <div style={{ fontWeight: 800 }}>Upload Video / Image</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>We'll analyze it for smart captions</div>
               </button>
               <button onClick={nextStep} style={{ background: 'transparent', border: '1px solid var(--border)', padding: '1rem', borderRadius: '12px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                  Skip for now, show me templates
               </button>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="animate-fade-in" style={{ textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', background: 'var(--gradient-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
               <Check size={40} color="#000" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>You're all set!</h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '3rem' }}>
              Your workspace is personalized. We've added some starter templates to your dashboard.
            </p>
            <button 
              onClick={onComplete}
              style={{ width: '100%', background: 'var(--gradient-primary)', border: 'none', padding: '18px', borderRadius: '12px', color: '#0A1128', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}
            >
              Open My Studio
            </button>
          </div>
        )}

        {/* Footer Controls */}
        {step < totalSteps && (
          <div style={{ marginTop: 'auto', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
               onClick={prevStep} 
               disabled={step === 1}
               style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', visibility: step === 1 ? 'hidden' : 'visible' }}
            >
              <ChevronLeft size={20} /> Back
            </button>
            
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
               <button onClick={nextStep} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                  Skip
               </button>
               <button 
                onClick={nextStep}
                style={{ background: 'white', color: '#000', border: 'none', padding: '12px 32px', borderRadius: '100px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
               >
                Continue <ChevronRight size={20} />
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OnboardingPage;
