import React, { useState } from 'react';
import { FIRMS, CITIES } from '../constants/stipend.js';
import { calcStipend, fINR } from '../utils/format.js';

export default function StipendEstimator() {
  const [firm, setFirm] = useState(FIRMS[0]);
  const [city, setCity] = useState('Mumbai');
  const [year, setYear] = useState('All Years');

  const citiesArray = Object.keys(CITIES).concat(['Other']);
  const res = calcStipend(firm, city, year);
  const tier = res.tier;

  return (
    <div className="page-section-shell page-section-shell-narrow stipend-page-shell">
      <div className="page-section-head">
        <h2 className="page-section-title page-section-title-fade">Stipend Estimator 2025</h2>
        <p className="page-section-copy">Check latest articleship stipends across firms with a layout that feels at home with the homepage design.</p>
      </div>

      <div className="card flex gap-4 mb-8 stipend-controls-card" style={{ maxWidth: 600, margin: '0 auto 32px' }}>
        <select value={firm} onChange={(e) => setFirm(e.target.value)} style={{ flex: 1 }}>
          {FIRMS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)} style={{ flex: 1 }}>
          {citiesArray.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)} style={{ width: 120 }}>
          <option>All Years</option>
          <option>Year 1</option>
          <option>Year 2</option>
          <option>Year 3</option>
        </select>
      </div>

      <div className="card mb-8 stipend-results-card">
        <div style={{ background: 'linear-gradient(135deg, var(--mint-700), var(--mint-600))', padding: 16, borderRadius: '12px 12px 0 0', margin: '-24px -24px 24px -24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ color: 'var(--l3)', fontSize: 20 }}>{firm}</h3>
          <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: 16, fontSize: 12, textTransform: 'uppercase' }}>{tier} Tier</span>
        </div>

        {res.single ? (
          <div style={{ padding: '40px 0' }}>
            <div style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 8 }}>{year} Stipend</div>
            <div style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--l2)' }}>{fINR(res.single[0])} - {fINR(res.single[1])}</div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4" style={{ textAlign: 'center' }}>
            <div style={{ background: 'var(--surface-soft)', padding: 24, borderRadius: 8, border: '1px solid var(--border-soft)' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Year 1</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--l)' }}>{fINR(res.y1[0])} - {fINR(res.y1[1])}</div>
            </div>
            <div style={{ background: 'var(--surface-soft)', padding: 24, borderRadius: 8, border: '1px solid var(--border-soft)' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Year 2</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--l2)' }}>{fINR(res.y2[0])} - {fINR(res.y2[1])}</div>
            </div>
            <div style={{ background: 'var(--surface-soft)', padding: 24, borderRadius: 8, border: '1px solid var(--border-soft)' }}>
              <div style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Year 3</div>
              <div style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--l3)' }}>{fINR(res.y3[0])} - {fINR(res.y3[1])}</div>
            </div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 40 }}>
        *Disclaimer: Stipend figures are estimates based on market research. Actual stipends may vary based on performance, specific branch, and recent firm policies.
      </p>
    </div>
  );
}
