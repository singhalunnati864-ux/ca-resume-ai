import React from 'react';

export default function Templates({ setPage, isPro, setShowPayM }) {
  const tpls = [
    { n: "Standard ATS", tag: "Free", at: 96 },
    { n: "Big 4 Executive", tag: "Pro ₹299", at: 98 },
    { n: "Modern CA", tag: "Pro ₹299", at: 94 },
    { n: "Minimal Clean", tag: "Pro ₹299", at: 95 },
    { n: "Corporate", tag: "Free", at: 93 },
    { n: "CA Creative", tag: "Pro ₹299", at: 91 }
  ];

  return (
    <div style={{ paddingTop: 120, paddingLeft: 24, paddingRight: 24, maxWidth: 1000, margin: '0 auto', minHeight: '100vh', textAlign:'center' }}>
      <h2 style={{ fontSize: 32, marginBottom: 8 }}>📋 Resume Templates</h2>
      <p style={{ color: '#aaa', marginBottom: 40 }}>Select a template optimized for Big 4 ATS parsers</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:24 }}>
        {tpls.map(t => {
          const isFree = t.tag === "Free";
          return (
            <div key={t.n} className="card" style={{padding:24, textAlign:'left'}}>
              <div style={{height:180, background:'rgba(255,255,255,0.02)', border:'1px solid var(--d3)', borderRadius:8, marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center', color:'#555', fontSize:48}}>
                📄
              </div>
              <div className="flex justify-between items-center mb-2">
                <h3 style={{fontSize:18}}>{t.n}</h3>
                <span style={{
                  background: isFree ? 'rgba(255,255,255,0.1)' : 'rgba(0,109,91,0.2)',
                  color: isFree ? '#ddd' : 'var(--l)', padding: '2px 8px', borderRadius:12, fontSize:12, fontWeight:'bold'
                }}>
                  {t.tag}
                </span>
              </div>
              <div style={{fontSize:12, color:'#aaa', marginBottom:16}}>Max ATS Score: {t.at}/100</div>

              <button 
                className={isFree ? "btn-outline w-full" : "btn-primary w-full"} 
                onClick={() => {
                  if (isFree || isPro) setPage('builder');
                  else setShowPayM('pro');
                }}
              >
                Use {t.n}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
