import React from 'react';
import { PlayCircle, Palette, Presentation, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <PlayCircle size={32} />,
    title: 'Adaptive Video Hub',
    desc: 'Cinema-grade precision with AI smart-reframing. Move from 16:9 to vertical social feeds instantly.'
  },
  {
    icon: <Palette size={32} />,
    title: 'Static Craft Graphics',
    desc: 'Professional image suite with preset platform-safe ratios for YouTube, Instagram, and LinkedIn.'
  },
  {
    icon: <Presentation size={32} />,
    title: 'PitchFlow Slides',
    desc: 'Bridge the gap between deck building and motion design. Slides that move like modern films.'
  },
  {
    icon: <Waves size={32} />,
    title: 'Pulse Audio Pulse',
    desc: 'AI-native script-to-sync workflow for podcasters. Noise reduction and social audiogram generation.'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" style={{ padding: '120px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '-0.04em' }}>
            Unified Power. <span className="gradient-text">Zero Friction.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>The engine designed to scale with your imagination.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel"
              style={{ padding: '3rem' }}
            >
              <div style={{ color: 'var(--accent-mint)', marginBottom: '1.5rem' }}>{f.icon}</div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.6rem', fontWeight: 700 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
