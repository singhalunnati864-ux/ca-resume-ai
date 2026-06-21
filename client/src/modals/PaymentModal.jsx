import React from 'react';

export default function PaymentModal({ type, onClose, startPay }) {
  const isPro = type === 'pro';
  const color = isPro ? 'var(--t)' : 'var(--gold)';
  
  const proFeatures = [
    "Unlimited Resumes & Edits",
    "All 6 Big 4 Templates",
    "Unlimited AI Writing Features",
    "Full ATS Analysis Tool",
    "LinkedIn Summary & Cover Letter AI"
  ];
  const toolsFeatures = [
    "Interview Q&A Prep (AI)",
    "8 firms × 8 topics",
    "AI generated model answers",
    "Key points + expert tips",
    "Difficulty badges & insights"
  ];

  const features = isPro ? proFeatures : toolsFeatures;
  const price = isPro ? "₹299" : "₹50";

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      <div 
        className="card max-w-md w-full relative"
        style={{ 
          boxShadow: `0 0 40px ${isPro ? 'rgba(0,109,91,0.3)' : 'rgba(232,184,75,0.2)'}`,
          border: `1px solid ${color}` 
        }}
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} style={{position:'absolute', top:16, right:16, color:'#aaa'}}>×</button>
        <h2 className="mb-2" style={{color}}>{isPro ? '⭐ Upgrade to Pro' : '🎙️ Unlock Tools Pack'}</h2>
        <p style={{color:'#aaa', marginBottom:24}}>Unlock premium features to boost your articleship chances.</p>
        
        <div style={{background:'rgba(255,255,255,0.05)', padding:16, borderRadius:8, marginBottom:24}}>
          {features.map((f,i) => (
            <div key={i} className="flex items-center gap-2 mb-2" style={{fontSize:14}}>
              <span style={{color}}>✓</span> {f}
            </div>
          ))}
        </div>

        <button 
          className="btn-primary w-full"
          style={!isPro ? {background: 'linear-gradient(135deg, var(--gold), #f39c12)'} : {}}
          onClick={() => startPay(type)}
        >
          Pay {price} Now
        </button>
        
        <p style={{fontSize:11, color:'#666', marginTop:16, textAlign:'center'}}>
          🔒 Razorpay · UPI / Card / NetBanking<br/>Instant activation
        </p>
      </div>
    </div>
  );
}
