import React from 'react';
import { FileText, Home, MessageCircle, Sparkles, TrendingUp, UserPlus } from 'lucide-react';

export default function Nav({ page, setPage, isPro, user, logout }) {
  const hasBoughtPlan = user && user.plan && user.plan !== 'free';
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'builder', label: 'Builder', icon: FileText },
    { id: 'tools', label: 'Prep AI', icon: MessageCircle },
    { id: 'stipend', label: 'Stipend', icon: TrendingUp },
    { id: 'pricing', label: 'Plans', icon: Sparkles },
  ].filter(tab => tab.id !== 'pricing' || !hasBoughtPlan);

  return (
    <nav className="navbar-shell">
      <div className="navbar-inner">
        <button className="navbar-brand" onClick={() => setPage('home')} aria-label="Go to home">
          <span className="navbar-logo">CA</span>
          <span className="navbar-brand-copy">
            <span>Resume AI</span>
            <small>Articleship toolkit</small>
          </span>
        </button>

        <div className="navbar-links" aria-label="Primary navigation">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                data-label={tab.label}
                className={`navbar-link${page === tab.id ? ' navbar-link-active' : ''}`}
                onClick={() => setPage(tab.id)}
              >
                <Icon size={16} strokeWidth={2.2} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="navbar-actions">
          {isPro && <span className="navbar-pro">Pro</span>}
          {user ? (
            <div className="navbar-user">
              <button
                className={`navbar-profile-btn${page === 'profile' ? ' navbar-profile-btn-active' : ''}`}
                onClick={() => setPage('profile')}
                title="View Profile Dashboard"
              >
                <span className="navbar-avatar-bubble">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
                <span className="navbar-username-text">{user.name}</span>
              </button>
              <button
                className="navbar-ghost-btn"
                onClick={() => {
                  logout();
                  setPage('home');
                }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <>
              <button className="navbar-fill-btn navbar-fill-login" onClick={() => setPage('login')}>
                Log In
              </button>
              <button className="navbar-fill-btn navbar-fill-start" onClick={() => setPage('register')}>
                <UserPlus size={15} strokeWidth={2.4} />
                <span>Start Free</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
