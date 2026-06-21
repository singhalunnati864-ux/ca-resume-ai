import React, { useState } from 'react';
import { fetchAdminUsers, fetchAdminRevenue } from '../utils/api.js';

export default function AdminDashboard({ showToast }) {
  const [pass, setPass] = useState('');
  const [auth, setAuth] = useState(false);
  const [users, setUsers] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uData = await fetchAdminUsers(pass);
      const rData = await fetchAdminRevenue(pass);
      setUsers(uData);
      setRevenue(rData);
      setAuth(true);
      showToast('✓ Admin access granted');
    } catch (err) {
      showToast('❌ Wrong password');
    }
    setLoading(false);
  };

  if (!auth) {
    return (
      <div style={{ paddingTop: 120, paddingLeft: 24, paddingRight: 24, maxWidth: 400, margin: '0 auto', minHeight: '100vh', textAlign:'center' }}>
        <h2 style={{ fontSize: 32, marginBottom: 8 }}>Admin Login</h2>
        <form onSubmit={login} className="card flex-col gap-4">
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Enter admin password..." />
          <button className="btn-primary" disabled={loading}>{loading ? 'Checking...' : 'Login'}</button>
        </form>
      </div>
    );
  }

  const thStyle = { background: 'var(--d3)', padding: 12, textAlign: 'left', borderBottom: '1px solid var(--t3)', color: '#aaa' };
  const tdStyle = { padding: 12, borderBottom: '1px solid var(--d3)', fontSize: 14 };

  return (
    <div style={{ paddingTop: 120, paddingLeft: 24, paddingRight: 24, maxWidth: 1000, margin: '0 auto', minHeight: '100vh' }}>
      <h2 style={{ fontSize: 32, marginBottom: 32 }}>Admin Dashboard</h2>
      
      <div className="card mb-8">
        <h3 className="mb-4 text-t">Recent Users</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Plan</th>
                <th style={thStyle}>Joined</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={tdStyle}>#{u.id}</td>
                  <td style={tdStyle}>{u.name}<br/><span style={{fontSize:12,color:'#aaa'}}>{u.email}</span></td>
                  <td style={tdStyle}>{u.plan}</td>
                  <td style={tdStyle}>{u.joined}</td>
                  <td style={tdStyle}>
                    <span style={{
                      padding:'2px 8px', borderRadius:12, fontSize:12,
                      background: u.status==='Paid' ? 'rgba(0,109,91,0.2)' : u.status==='Pending' ? 'rgba(232,184,75,0.2)' : 'rgba(255,255,255,0.1)',
                      color: u.status==='Paid' ? 'var(--l)' : u.status==='Pending' ? 'var(--gold)' : '#aaa'
                    }}>{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mb-8">
        <h3 className="mb-4 text-t">Revenue Overview</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Month</th>
                <th style={thStyle}>Revenue</th>
                <th style={thStyle}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map(r => (
                <tr key={r.month}>
                  <td style={tdStyle}>{r.month}</td>
                  <td style={tdStyle} className="text-l">₹{r.amt}</td>
                  <td style={tdStyle}>{r.orders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
