import React from 'react';
import { Video, Image as ImageIcon, Presentation, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Video size={32} />,
    title: 'Omni-Motion Video',
    desc: 'Fluid timelines with AI subjects-tracking. Trim, crop, filter, and add animated captions in seconds.'
  },
  {
    icon: <ImageIcon size={32} />,
    title: 'Static Craft Graphics',
    desc: 'Universal canvas for thumbnails, covers, and posts. Auto-adapt design to any social ratio.'
  },
  {
    icon: <Presentation size={32} />,
    title: 'Pitch-Flow Slides',
    desc: 'Bridge the gap between video and presentations. Motion-native slides that wow the boardroom.'
  },
  {
    icon: <Mic size={32} />,
    title: 'Pulse-Audio Podcast',
    desc: 'Script-to-voice workflow with studio-grade cleanup and automated social audiograms.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" style={{ padding: '100px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            One Studio. <span className="gradient-text">Four Powerhouses.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>Everything you need to create at the speed of thought.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}>
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="glass-panel"
              style={{ padding: '2.5rem' }}
            >
              <div style={{ color: 'var(--accent-cyan)', marginBottom: '1.5rem' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
