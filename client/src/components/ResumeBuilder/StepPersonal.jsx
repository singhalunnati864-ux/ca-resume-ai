import React, { useEffect, useRef, useState } from 'react';
import { CITIES } from '../../constants/stipend.js';
import { callGeminiWithRetry as callGemini } from '../../utils/api.js';

export default function StepPersonal({ data, setData, setStep, isPro, setShowPayM, showToast }) {
  const [loading, setLoading] = useState(false);
  const [freeObjCount, setFreeObjCount] = useState(0);
  const objectiveRef = useRef(null);

  const resizeObjective = () => {
    const textarea = objectiveRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(textarea.scrollHeight, 140)}px`;
  };

  useEffect(() => {
    resizeObjective();
  }, [data.objective]);

  const genObj = async () => {
    if (!data.name || !data.city) {
      showToast('❌ Please fill Name and City first');
      return;
    }
    if (!isPro && freeObjCount >= 3) {
      setShowPayM('pro');
      return;
    }

    setLoading(true);
    try {
      const prompt = `Write a unique CA articleship career objective for ${data.name} from ${data.city}, targeting Big 4 and top consulting-style audit/tax roles.

Requirements:
- Write 3 to 4 polished sentences
- Keep the total length between 80 and 110 words
- Make it ATS-friendly, professional, and specific to CA articleship goals
- Highlight analytical skills, accounting/audit knowledge, contribution mindset, and career growth intent
- Do not use placeholders, bullet points, quotes, or headings
- Return only the final paragraph text

Variation seed: ${Math.random()}`;

      const res = await callGemini(prompt);
      const cleaned = res.replace(/^"|"$/g, '').trim();
      setData((prev) => ({ ...prev, objective: cleaned }));

      if (!isPro) setFreeObjCount((c) => c + 1);
      showToast('✨ Career objective generated!');
    } catch (e) {
      console.error('Objective generation error:', e);
      showToast('❌ ' + (e.error || 'Failed to generate objective'));
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (!data.name || !data.email || !data.phone || !data.linkedin || !data.city || !data.pincode) {
      showToast('❌ All fields are mandatory to proceed');
      return;
    }
    if (data.phone.length < 10) {
      showToast('❌ Please enter a valid 10-digit phone number');
      return;
    }
    setStep(1);
  };

  const cArr = Object.keys(CITIES).concat(['Other']);

  return (
    <div className="card">
      <h3 className="mb-4" style={{ fontSize: 24 }}>Personal Details</h3>
      <p style={{ fontSize: 11, color: '#777', marginBottom: 16, marginTop: -12 }}>All fields below are mandatory *</p>

      <div className="form-grid-two mb-4">
        <div className="form-field form-field-compact">
          <label className="form-label" style={{ color: '#aaa' }}>Full Name</label>
          <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Rahul Sharma" />
        </div>
        <div className="form-field form-field-compact">
          <label className="form-label" style={{ color: '#aaa' }}>Email</label>
          <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="rahul@ca.com" />
        </div>
        <div className="form-field form-field-compact">
          <label className="form-label" style={{ color: '#aaa' }}>Phone</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10);
              setData({ ...data, phone: val });
            }}
            placeholder="9876543210"
            maxLength={10}
          />
        </div>
        <div className="form-field form-field-compact">
          <label className="form-label" style={{ color: '#aaa' }}>LinkedIn URL</label>
          <input value={data.linkedin} onChange={(e) => setData({ ...data, linkedin: e.target.value })} placeholder="linkedin.com/in/rahul" />
        </div>
        <div className="form-field form-field-compact">
          <label className="form-label" style={{ color: '#aaa' }}>City</label>
          <select value={data.city} onChange={(e) => setData({ ...data, city: e.target.value })}>
            <option value="" disabled>Select City</option>
            {cArr.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-field form-field-compact">
          <label className="form-label" style={{ color: '#aaa' }}>Pincode</label>
          <input value={data.pincode} onChange={(e) => setData({ ...data, pincode: e.target.value })} placeholder="400001" maxLength={6} />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <label className="form-label" style={{ color: '#aaa' }}>Career Objective</label>
          <button className="text-l text-sm" style={{ fontWeight: 600 }} onClick={genObj} disabled={loading}>
            {loading ? <span className="spinner">⟳</span> : `✨ AI Generate ${!isPro ? `(${3 - freeObjCount} left)` : ''}`}
          </button>
        </div>
        <textarea
          ref={objectiveRef}
          value={data.objective}
          onChange={(e) => setData({ ...data, objective: e.target.value })}
          onInput={resizeObjective}
          rows={5}
          placeholder="To secure an articleship at a reputed Big 4 firm..."
          style={{ minHeight: 140, resize: 'vertical', overflow: 'hidden' }}
        />
      </div>

      <div className="flex justify-between">
        <div />
        <button className="btn-primary" onClick={handleNext}>Next Step →</button>
      </div>
    </div>
  );
}
