import React from 'react';

export default function Blog({ showToast }) {
  const posts = [
    "📝 How to Get Articleship at Big 4 India",
    "🏢 Top 10 CA Firms for Articleship 2025",
    "🤖 ATS Resume Tips for CA Students",
    "🎯 Write the Perfect CA Career Objective",
    "⚖️ Deloitte vs EY: Best for Articleship?",
    "💰 CA Articleship Stipend Guide 2025"
  ];

  return (
    <div style={{ paddingTop: 120, paddingLeft: 24, paddingRight: 24, maxWidth: 1000, margin: '0 auto', minHeight: '100vh', textAlign:'center' }}>
      <h2 style={{ fontSize: 32, marginBottom: 8 }}>Articles & Insights</h2>
      <p style={{ color: '#aaa', marginBottom: 40 }}>A complete guide to succeeding in your CA articleship journey</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24 }}>
        {posts.map((p,i) => (
          <div key={i} className="card" style={{padding:0, overflow:'hidden', cursor:'pointer'}} onClick={() => showToast('Coming soon!')}>
            <div style={{height:160, background:'var(--t4)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{fontSize:48}}>{p.split(' ')[0]}</div>
            </div>
            <div style={{padding:20, textAlign:'left'}}>
              <h3 style={{fontSize:16, marginBottom:16, lineHeight:1.4}}>{p.replace(/.*?\s/, '')}</h3>
              <div style={{color:'var(--t)', fontWeight:600, fontSize:13}}>Read Article →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
