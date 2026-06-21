import React, { useState } from 'react';
import { GOOGLE_AUTH_URL, registerUser } from '../../utils/api.js';

export default function RegisterPage({ setUser, setPage, showToast, onVerifyNeeded }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strength = pwStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return showToast('❌ Passwords do not match');
    if (password.length < 8) return showToast('❌ Password must be at least 8 characters');

    setLoading(true);
    try {
      const res = await registerUser({ name, email, phone, password });
      if (res.requiresVerification) {
        showToast('✓ Account created! Check your email for OTP');
        onVerifyNeeded?.({ email: res.email || email });
      } else {
        setUser(res.user);
        setPage('home');
        showToast('✓ Successfully registered');
      }
    } catch (err) {
      showToast('❌ ' + (err.error || 'Registration failed'));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-loader" aria-hidden="true">
        <span className="circle" />
        <span className="circle" />
        <span className="circle" />
        <span className="circle" />
      </div>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
        border: '2px solid rgba(99,102,241,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 24
      }}>✨</div>

      <h2 className="auth-heading">Start Free</h2>
      <p className="auth-subheading">Sign up to build your Big 4 resume powered by AI.</p>

      <form onSubmit={handleSubmit} className="card auth-card flex-col gap-4 text-left">
        <div className="form-field">
          <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Rahul Sharma" required />
        </div>

        <div className="form-field">
          <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="rahul@example.com" required />
        </div>

        <div className="form-field">
          <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone <span style={{ color: '#475569' }}>(optional)</span></label>
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />
        </div>

        <div className="form-field">
          <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              style={{ paddingRight: 44 }}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 14 }}
            >
              {showPw ? '🙈' : '👁️'}
            </button>
          </div>
          {strength > 0 && (
            <div style={{ display: 'flex', gap: 4, marginTop: 8, alignItems: 'center' }}>
              {[1, 2, 3, 4].map(n => (
                <div key={n} style={{
                  height: 3, flex: 1, borderRadius: 2,
                  background: n <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.1)',
                  transition: 'background 0.2s'
                }} />
              ))}
              <span style={{ fontSize: 11, color: strengthColors[strength], marginLeft: 4, fontWeight: 600 }}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}
        </div>

        <div className="form-field">
          <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter password"
            required
            style={{ borderColor: confirm && password !== confirm ? 'rgba(239,68,68,0.5)' : undefined }}
          />
          {confirm && password !== confirm && (
            <p style={{ fontSize: 11, color: '#ef4444', margin: '4px 0 0' }}>Passwords don't match</p>
          )}
        </div>

        <button className="btn-primary w-full" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? <span className="spinner">⟳</span> : 'Create Account'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ color: '#475569', fontSize: 12 }}>or continue with</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <button
        onClick={() => { window.location.href = GOOGLE_AUTH_URL; }}
        style={{
          width: '100%', padding: '12px 16px',
          borderRadius: 10,
          border: '1.5px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.04)',
          color: '#e2e8f0', fontSize: 14, fontWeight: 600,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#64748b' }}>
        Already have an account?{' '}
        <span className="text-t2" style={{ cursor: 'pointer', fontWeight: 600 }} onClick={() => setPage('login')}>Log In</span>
      </div>
    </div>
  );
}
