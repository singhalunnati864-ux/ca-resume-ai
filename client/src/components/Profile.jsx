import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Award, Activity, Check, Sparkles } from 'lucide-react';
import { updateProfile } from '../utils/api.js';

export default function Profile({ user, setUser, setPage, showToast, ats }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return 'June 2026';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await updateProfile({ name, phone });
      if (res.success && res.user) {
        setUser(res.user);
        showToast('Profile updated successfully!');
      }
    } catch (err) {
      setError(err.error || 'Failed to update profile details');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Current password is required');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await updateProfile({ password, newPassword });
      if (res.success) {
        setPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        showToast('Password changed successfully!');
      }
    } catch (err) {
      setError(err.error || 'Failed to change password');
    } finally {
      setSubmitting(false);
    }
  };

  // Determine active plan tier details
  const getTierDetails = () => {
    const plan = user?.plan || 'free';
    switch (plan) {
      case 'pro':
        return {
          name: 'Pro Lifetime',
          badgeClass: 'profile-badge-pro',
          desc: 'Everything you need to secure a Big 4 articleship is unlocked. Lifetime access to premium templates, resume building, and all AI features.',
          features: [
            'Unlimited resumes & PDF downloads',
            'Full ATS resume check & rating system',
            'Access to all 6 Big 4 resume templates',
            'Unlimited AI Resume Writing assistant',
            'Interview Prep AI (All 8 firms & 8 topics)',
            'Stipend Estimator tool'
          ]
        };
      case 'tools':
        return {
          name: 'Tools Pack',
          badgeClass: 'profile-badge-tools',
          desc: 'Perfect for Big 4 interview preparation. Includes full access to the AI interview Q&A prep for 8 major firms.',
          features: [
            'Interview Prep AI (All 8 firms & 8 topics)',
            'AI-generated expert model answers',
            'Difficulty badges & expert tips',
            'Stipend Estimator tool',
          ]
        };
      default:
        return {
          name: 'Free Trial',
          badgeClass: 'profile-badge-free',
          desc: 'Get started with building a standard resume for free. Upgrade to unlock interview prep and full resume capabilities.',
          features: [
            '1 Resume with standard template',
            'Objective statement generator (3 uses)',
            'Basic ATS score check',
            'Stipend Estimator'
          ]
        };
    }
  };

  const tier = getTierDetails();

  return (
    <div className="page-section-shell page-profile">
      <div className="profile-shell">
        
        {/* Header Section */}
        <div className="profile-header-card">
          <div className="profile-avatar-large">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="profile-header-info">
            <h2>Hello, {user?.name || 'User'}!</h2>
            <p>Member Since: {formatDate(user?.createdAt)} • Plan: {tier.name}</p>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="card text-red" style={{ padding: '12px 18px', marginBottom: '24px', borderColor: 'var(--red)', background: 'rgba(224, 92, 92, 0.05)' }}>
            <strong>Error: </strong> {error}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="profile-main-grid">
          
          {/* Navigation Sidebar */}
          <div className="profile-sidebar-card card">
            <h3 style={{ fontSize: 18, borderBottom: '1px solid var(--border-soft)', paddingBottom: 10 }}>Navigation</h3>
            <div className="profile-nav-menu">
              <button 
                className={`profile-nav-item${activeTab === 'overview' ? ' profile-nav-item-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <Activity size={16} />
                <span>Overview</span>
              </button>
              <button 
                className={`profile-nav-item${activeTab === 'edit' ? ' profile-nav-item-active' : ''}`}
                onClick={() => setActiveTab('edit')}
              >
                <User size={16} />
                <span>Edit Profile</span>
              </button>
              {!user?.isGoogleUser && (
                <button 
                  className={`profile-nav-item${activeTab === 'security' ? ' profile-nav-item-active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <Shield size={16} />
                  <span>Account Security</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Main Content */}
          <div className="profile-content-card card">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="profile-section-title">Account Overview</h3>
                
                {/* User Info Data Boxes */}
                <div className="profile-info-grid">
                  <div className="profile-info-box">
                    <label><Mail size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Email</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="profile-info-box">
                    <label><Phone size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} /> Phone</label>
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>
                </div>

                {/* Subscription Panel */}
                <div className={`profile-tier-panel profile-tier-${user?.plan || 'free'}`}>
                  <div className="profile-tier-header">
                    <h4>{tier.name} Account</h4>
                    <span className={tier.badgeClass}>{tier.name}</span>
                  </div>
                  <p className="profile-tier-desc">{tier.desc}</p>
                  
                  <ul className="profile-tier-features">
                    {tier.features.map((feat, i) => (
                      <li key={i}>
                        <Check size={14} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {user?.plan !== 'pro' && (
                    <button 
                      className="profile-tier-upgrade-btn button" 
                      onClick={() => setPage('pricing')}
                    >
                      <Sparkles size={16} style={{ marginRight: 8 }} />
                      Upgrade Plan
                    </button>
                  )}
                </div>

                {/* Dashboard Stats */}
                <div className="profile-stats-section">
                  <h3>Articleship Readiness Dashboard</h3>
                  <div className="profile-stats-row">
                    <div className="profile-stat-card">
                      <div className="profile-stat-card-val">{ats || '0'}%</div>
                      <div className="profile-stat-card-label">ATS Score</div>
                    </div>
                    <div className="profile-stat-card">
                      <div className="profile-stat-card-val">
                        {user?.plan === 'pro' ? 'Unlimited' : '1'}
                      </div>
                      <div className="profile-stat-card-label">Resume Slots</div>
                    </div>
                    <div className="profile-stat-card">
                      <div className="profile-stat-card-val">
                        {user?.plan === 'free' ? 'Lock' : 'Active'}
                      </div>
                      <div className="profile-stat-card-label">Prep AI Tools</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Profile Details Tab */}
            {activeTab === 'edit' && (
              <form onSubmit={handleProfileSave}>
                <h3 className="profile-section-title">Edit Details</h3>
                
                <div className="profile-form-grid">
                  <div className="profile-form-field">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  
                  <div className="profile-form-field">
                    <label>Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      placeholder="Your phone number"
                    />
                  </div>

                  <div className="profile-form-field">
                    <label>Email Address (Cannot change)</label>
                    <input 
                      type="email" 
                      value={user?.email || ''} 
                      disabled
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="profile-submit-btn button"
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && !user?.isGoogleUser && (
              <form onSubmit={handlePasswordChange}>
                <h3 className="profile-section-title">Change Password</h3>
                
                <div className="profile-form-grid">
                  <div className="profile-form-field">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      placeholder="Verify current password"
                      required
                    />
                  </div>
                  
                  <div className="profile-form-field">
                    <label>New Password (min 8 chars)</label>
                    <input 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  <div className="profile-form-field">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      value={confirmNewPassword} 
                      onChange={(e) => setConfirmNewPassword(e.target.value)} 
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="profile-submit-btn button"
                  disabled={submitting}
                >
                  {submitting ? 'Changing...' : 'Update Password'}
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
