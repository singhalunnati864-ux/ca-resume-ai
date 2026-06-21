import React from 'react';

export default function Pricing({ startPay, setPage }) {
  const PricingButton = ({ children, onClick, variant = 'mint' }) => (
    <button
      className={`pricing-bubbles-btn pricing-bubbles-${variant}`}
      onClick={onClick}
      type="button"
    >
      <span className="text">{children}</span>
    </button>
  );


  return (
    <div className="page-section-shell plans-page-shell">
      <div className="page-section-head">
        <h2 className="page-section-title">Simple, Transparent Pricing</h2>
        <p className="page-section-copy">One-time payment for lifetime articleship success, with cleaner spacing and a stronger visual rhythm.</p>
      </div>

      <div className="flex gap-6 justify-center flex-wrap plans-card-grid">
        <div className="pricing-card text-left" style={{ flex: 1, minWidth: 280, maxWidth: 340 }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>Free</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 16 }}>₹0</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, minHeight: 40 }}>Perfect for starting your CA resume.</p>
          <ul style={{ flex: 1, listStyle: 'none', color: 'var(--text-main)', fontSize: 14, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li>✓ 1 Resume</li>
            <li>✓ Standard ATS Template</li>
            <li>✓ AI Objective (3 uses)</li>
            <li>✓ PDF Download</li>
            <li>✓ Basic ATS Score</li>
            <li>✓ Stipend Estimator</li>
          </ul>
          <button className="pricing-bubbles-btn" onClick={() => setPage('builder')}>
            <span className="text">Get Started Free</span>
          </button>
        </div>

        <div className="pricing-card text-left" style={{ flex: 1, minWidth: 280, maxWidth: 340, borderColor: 'var(--gold)', position: 'relative' }}>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: 'var(--gold)' }}>Tools Pack</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 16 }}>₹50</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, minHeight: 40 }}>Perfect for your Big 4 interviews.</p>
          <ul style={{ flex: 1, listStyle: 'none', color: 'var(--text-main)', fontSize: 14, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li>✓ Interview Q&A Prep (AI)</li>
            <li>✓ 8 firms × 8 topics</li>
            <li>✓ AI model answers</li>
            <li>✓ Key points + expert tips</li>
            <li>✓ Difficulty badges</li>
            <li>✓ Stipend Estimator</li>
          </ul>
          <PricingButton variant="gold" onClick={() => startPay('tools')}>
            Unlock Tools — ₹50
          </PricingButton>
        </div>

        <div className="pricing-card text-left" style={{ flex: 1, minWidth: 280, maxWidth: 340, borderColor: 'var(--t)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--t)', padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 'bold' }}>
            Popular
          </div>
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: 'var(--l)' }}>Pro</div>
          <div style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 16 }}>₹299</div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, minHeight: 40 }}>Everything you need to secure a Big 4 articleship.</p>
          <ul style={{ flex: 1, listStyle: 'none', color: 'var(--text-main)', fontSize: 14, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <li><strong style={{ color: 'var(--l2)' }}>✓ Everything in Tools Pack</strong></li>
            <li>✓ Unlimited Resumes & Edits</li>
            <li>✓ All 6 Big 4 Templates</li>
            <li>✓ Unlimited AI Writing</li>
            <li>✓ Full ATS Analysis</li>
            <li>✓ AI Articleship Duties</li>
            <li>✓ LinkedIn + Cover Letter AI</li>
          </ul>
          <PricingButton variant="deep" onClick={() => startPay('pro')}>
            Upgrade to Pro — ₹299
          </PricingButton>
        </div>
      </div>

      <div style={{ marginTop: 80, color: 'var(--text-muted)', fontSize: 14 }}>
        Payment verified by Razorpay • UPI / Card / NetBanking • For support: <a href="mailto:cabuzz54@gmail.com" className="text-t2">cabuzz54@gmail.com</a>
      </div>
    </div>
  );
}
