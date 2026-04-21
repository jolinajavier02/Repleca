import React from 'react';
import { 
  TrendingUp, Users, Play, Clock, 
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const AnalyticsDashboard: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Insight <span className="gradient-text">Studio</span></h1>
          <p style={{ color: 'var(--text-secondary)' }}>Performance across your entire creator ecosystem.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-accent)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
           <button style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem' }}>Last 30 Days</button>
           <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.8rem' }}>Lifetime</button>
        </div>
      </header>

      {/* High Level Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
         {[
           { label: 'Total Views', value: '1.2M', growth: '+12.4%', up: true, icon: <Play size={20} color="var(--accent-cyan)" /> },
           { label: 'Watch Time', value: '42.8k hrs', growth: '+5.2%', up: true, icon: <Clock size={20} color="var(--accent-purple)" /> },
           { label: 'Followers', value: '284k', growth: '-1.8%', up: false, icon: <Users size={20} color="var(--accent-mint)" /> },
           { label: 'Engagement', value: '8.4%', growth: '+2.1%', up: true, icon: <TrendingUp size={20} color="#FFD700" /> }
         ].map((stat, i) => (
           <div key={i} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 {stat.icon}
                 <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: stat.up ? 'var(--accent-mint)' : '#FF4B4B' }}>
                    {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.growth}
                 </div>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
           </div>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
         {/* Main Chart Simulation */}
         <div className="glass-panel" style={{ padding: '2rem', height: '400px', position: 'relative' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2rem' }}>Traffic Overview</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '220px', gap: '10px' }}>
               {Array.from({ length: 30 }).map((_, i) => (
                 <div key={i} style={{ flex: 1, background: 'var(--gradient-primary)', height: `${Math.random() * 100}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
               ))}
            </div>
            <div style={{ borderBottom: '1px solid var(--border)', marginTop: '4px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
               <span>Sept 20</span>
               <span>Oct 20</span>
            </div>
         </div>

         {/* Distribution */}
         <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '2rem' }}>Platform Mix</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {[
                 { platform: 'YouTube', val: 55, color: '#f00' },
                 { platform: 'TikTok', val: 25, color: '#00f' },
                 { platform: 'Instagram', val: 15, color: '#f0f' },
                 { platform: 'Other', val: 5, color: '#333' }
               ].map(p => (
                 <div key={p.platform}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                       <span>{p.platform}</span>
                       <span>{p.val}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-dark)', borderRadius: '10px', overflow: 'hidden' }}>
                       <div style={{ width: `${p.val}%`, height: '100%', background: p.color }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
