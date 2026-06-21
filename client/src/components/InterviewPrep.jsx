import React, { useState } from 'react';
import { FIRMS, TOPICS } from '../constants/stipend.js';
import { getQuestions } from '../constants/questionBank.js';
import { getLocalAnswer } from '../constants/answerBank.js';
import { callGroq, callGeminiWithRetry } from '../utils/api.js';

export default function InterviewPrep({ hasTool, isPro, setShowPayM, showToast }) {
  const [iFirm, setIFirm] = useState(FIRMS[0]);
  const [iTopic, setITopic] = useState(TOPICS[0]);
  const [ld, setLd] = useState({});
  const [iQs, setIQs] = useState([]);
  const [iAns, setIAns] = useState({});
  const [iOpen, setIOpen] = useState({});
  const [firmContext, setFirmContext] = useState('');
  const [ansSource, setAnsSource] = useState({}); // track 'local' | 'groq' | 'gemini'

  const sl = (k, v) => setLd(p => ({ ...p, [k]: v }));

  const genQs = () => {
    if (!hasTool && !isPro) { setShowPayM('tools'); return; }
    setIQs([]);
    setIAns({});
    setIOpen({});
    setAnsSource({});
    const questions = getQuestions(iFirm, iTopic);
    setIQs(questions);
    if (questions[0]?.firm_context) setFirmContext(questions[0].firm_context);
    showToast('✨ 6 questions ready!');
  };

  const getAns = async (q) => {
    // Toggle if already loaded
    if (iAns[q.id]) {
      setIOpen(p => ({ ...p, [q.id]: !p[q.id] }));
      return;
    }

    // 1️⃣ Try local answer bank first (instant)
    const localAns = getLocalAnswer(iTopic, q.id);
    if (localAns) {
      setIAns(p => ({ ...p, [q.id]: localAns }));
      setIOpen(p => ({ ...p, [q.id]: true }));
      setAnsSource(p => ({ ...p, [q.id]: 'local' }));
      showToast('✨ Answer ready!');
      return;
    }

    // Try Groq first, Gemini as auto-fallback (via callGeminiWithRetry)
    sl('a' + q.id, true);
    const prompt = `You are preparing a CA Articleship candidate for an interview at ${iFirm}.
Topic: ${iTopic}
Question: "${q.question}"

Return ONLY a raw JSON object. No markdown, no code fences, no explanation.
{
  "model_answer": "A strong 3-4 sentence first-person answer",
  "key_points": ["point 1", "point 2", "point 3"],
  "common_mistake": "The most common mistake candidates make",
  "expert_tip": "One tip specific to ${iFirm}'s culture or work"
}`;
    const sys = 'You are a CA interview coach. Return only valid raw JSON. No markdown. No backticks.';

    let raw = null;
    try {
      raw = await callGeminiWithRetry(prompt, sys);
    } catch (err) {
      console.error('AI answer failed:', err.message);
      sl('a' + q.id, false);
      showToast('⏳ AI is busy. Please try again in a moment.');
      return;
    }

    try {
      const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
      const answer = JSON.parse(clean);
      setIAns(p => ({ ...p, [q.id]: answer }));
      setIOpen(p => ({ ...p, [q.id]: true }));
      setAnsSource(p => ({ ...p, [q.id]: 'groq' }));
      showToast('✨ AI answer ready!');
    } catch {
      showToast('❌ Answer format error. Try again.');
    }
    sl('a' + q.id, false);
  };

  const diffStyle = {
    Easy:   { color: 'var(--l2)',   border: '1px solid var(--l2)',   bg: 'rgba(126,200,50,0.08)' },
    Medium: { color: 'var(--gold)', border: '1px solid var(--gold)', bg: 'rgba(255,200,0,0.08)' },
    Hard:   { color: 'var(--red)',  border: '1px solid var(--red)',  bg: 'rgba(224,92,92,0.08)' },
  };

  const sourceLabel = { local: '📚 Local', groq: '⚡ Groq AI', gemini: '✨ Gemini AI' };
  const sourceBg    = { local: 'rgba(126,200,50,0.1)', groq: 'rgba(99,179,237,0.1)', gemini: 'rgba(192,132,252,0.1)' };
  const sourceColor = { local: 'var(--l2)', groq: '#63b3ed', gemini: '#c084fc' };

  return (
    <div style={{ paddingTop: 120, paddingLeft: 24, paddingRight: 24, maxWidth: 820, margin: '0 auto', minHeight: '100vh', paddingBottom: 60 }}>
      <h2 style={{ fontSize: 32, marginBottom: 6 }}>🎙️ AI Interview Prep</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Practice firm-specific CA Articleship questions</p>

      {/* Controls */}
      <div className="card flex gap-4 mb-6 prep-controls-card" style={{ alignItems: 'center' }}>
        <select value={iFirm} onChange={e => setIFirm(e.target.value)} style={{ flex: 1 }}>
          {FIRMS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select value={iTopic} onChange={e => setITopic(e.target.value)} style={{ flex: 1 }}>
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button onClick={genQs} className="btn-primary" style={{ width: 200, whiteSpace: 'nowrap' }}>
          ✨ Generate 6 Questions
        </button>
      </div>


      {/* Firm context banner */}
      {firmContext && iQs.length > 0 && (
        <div style={{
          background: 'var(--surface-soft)', border: '1px solid var(--border-soft)',
          borderRadius: 10, padding: '12px 16px', marginBottom: 20,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <span style={{ fontSize: 18, marginTop: 1 }}>🏢</span>
          <div>
            <span style={{ fontWeight: 700, color: 'var(--l2)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
              {iFirm} — Interview Tips
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{firmContext}</p>
          </div>
        </div>
      )}

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {iQs.map(q => {
          const ans = iAns[q.id];
          const isOpen = iOpen[q.id];
          const ds = diffStyle[q.difficulty] || diffStyle.Easy;
          const src = ansSource[q.id];

          return (
            <div key={q.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {/* Number + Difficulty */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 32 }}>
                  <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--d3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, border: '1px solid var(--t)', color: 'var(--t)', flexShrink: 0 }}>
                    {q.id}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, color: ds.color, border: ds.border, background: ds.bg, whiteSpace: 'nowrap' }}>
                    {q.difficulty}
                  </span>
                </div>

                {/* Question + Why asked */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{q.question}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.5 }}>
                    💡 <em>{q.why_asked}</em>
                  </p>
                </div>

                {/* Get Answer button */}
                <button
                  className="btn-outline"
                  style={{ padding: '6px 14px', fontSize: 12, flexShrink: 0, marginTop: 2 }}
                  onClick={() => getAns(q)}
                  disabled={ld['a' + q.id]}
                >
                  {ld['a' + q.id] ? (
                    <><span className="spin">⟳</span> Loading...</>
                  ) : ans ? (
                    isOpen ? '▲ Hide' : '▼ Show Answer'
                  ) : (
                    '✨ Get Answer'
                  )}
                </button>
              </div>

              {/* Answer panel */}
              {ans && isOpen && (
                <div style={{ borderTop: '1px solid var(--border-soft)', padding: '16px 16px 16px 58px', background: 'var(--surface-soft)' }}>

                  {/* Source badge */}
                  {src && (
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: sourceBg[src], color: sourceColor[src], border: `1px solid ${sourceColor[src]}40`, fontWeight: 600 }}>
                        {sourceLabel[src]}
                      </span>
                    </div>
                  )}

                  {/* Model Answer */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--t)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                      ✍️ Model Answer
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: 14, lineHeight: 1.7, background: 'var(--surface)', padding: '10px 14px', borderRadius: 8, borderLeft: '3px solid var(--t)' }}>
                      {ans.model_answer}
                    </p>
                  </div>

                  {/* Key Points */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--l2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                      📌 Key Points to Cover
                    </div>
                    <ul style={{ paddingLeft: 20, margin: 0 }}>
                      {ans.key_points?.map((k, i) => (
                        <li key={i} style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.7 }}>{k}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Mistake + Expert Tip */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div style={{ background: 'rgba(224,92,92,0.08)', border: '1px solid rgba(224,92,92,0.25)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>⚠️ Common Mistake</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{ans.common_mistake}</p>
                    </div>
                    <div style={{ background: 'rgba(126,200,50,0.08)', border: '1px solid rgba(126,200,50,0.25)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--l2)', marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1 }}>🏆 {iFirm} Tip</div>
                      <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{ans.expert_tip}</p>
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
