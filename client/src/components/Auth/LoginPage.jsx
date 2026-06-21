import React, { useState } from 'react';
import { GOOGLE_AUTH_URL, loginUser } from '../../utils/api.js';

export default function LoginPage({ setUser, setPage, showToast, onVerifyNeeded }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      setUser(res.user);
      setPage('home');
      showToast('✓ Successfully logged in');
    } catch (err) {
      if (err.requiresVerification) {
        showToast('⚠️ Please verify your email first');
        onVerifyNeeded?.({ email: err.email || email });
      } else {
        showToast('❌ ' + (err.error || 'Authentication failed'));
      }
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
      {/* Header */}
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
        border: '2px solid rgba(99,102,241,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 24
      }}>👤</div>

      <h2 className="auth-heading">Welcome Back</h2>
      <p className="auth-subheading">Log in to access your CA Resume AI dashboard.</p>

      <form onSubmit={handleSubmit} className="card auth-card flex-col gap-4 text-left">
        <div className="form-field">
          <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="rahul@example.com"
            required
          />
        </div>

        <div className="form-field">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <label className="form-label" style={{ color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
            <span
              onClick={() => setPage('forgot-password')}
              style={{ fontSize: 12, color: '#a78bfa', cursor: 'pointer', fontWeight: 500 }}
            >
              Forgot password?
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
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
        </div>

        <button className="pulsating-login-btn w-full" style={{ marginTop: 8 }} disabled={loading}>
          {loading ? <span className="spinner">⟳</span> : 'Log In'}
        </button>
      </form>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ color: '#475569', fontSize: 12 }}>or continue with</span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
      </div>

      {/* Google Login */}
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
          transition: 'background 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.04)'; e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
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
        Don't have an account?{' '}
        <span className="text-t2" style={{ cursor: 'pointer', fontWeight: 600 }} onClick={() => setPage('register')}>
          Sign Up
        </span>
      </div>
    </div>
  );
}
