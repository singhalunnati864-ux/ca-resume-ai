import React, { useState } from 'react';

export default function StepSkills({ data, setData, setStep }) {
  const addTag = (field, e, inputVal, setInputVal) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputVal.trim().replace(/,$/, '');
      if (val && !data[field].includes(val)) {
        setData({...data, [field]: [...data[field], val]});
      }
      setInputVal('');
    }
  };

  const removeTag = (field, idx) => {
    const newArr = [...data[field]];
    newArr.splice(idx, 1);
    setData({...data, [field]: newArr});
  };

  const TagInput = ({ label, field, placeholder }) => {
      const [val, setVal] = useState('');
      return (
      <div className="form-field form-field-compact mb-4">
        <label className="form-label" style={{color:'#aaa'}}>{label}</label>
        <div style={{
          display:'flex', flexWrap:'wrap', gap:8, 
          background:'rgba(255,255,255,0.05)', border:'1px solid var(--t3)', 
          padding:'6px 8px', borderRadius:6, minHeight:40, alignItems:'center'
        }}>
          {data[field].map((t,i) => (
            <div key={i} style={{
              background:'var(--t)', color:'#fff', padding:'2px 8px', 
              borderRadius:16, fontSize:12, display:'flex', alignItems:'center', gap:6
            }}>
              {t}
              <button onClick={()=>removeTag(field, i)} style={{color:'var(--t4)', fontWeight:'bold', fontSize:14}}>&times;</button>
            </div>
          ))}
          <input 
            style={{border:'none', background:'transparent', flex:1, padding:0, minWidth:120}} 
            value={val} 
            onChange={e=>setVal(e.target.value)} 
            onKeyDown={e=>addTag(field, e, val, setVal)} 
            placeholder={placeholder} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <h3 className="mb-4" style={{fontSize:24}}>Skills & Extras</h3>
      
      <div className="form-grid-two">
        <div><TagInput label="Technical Skills" field="technicalSkills" placeholder="e.g. IND-AS, Tax, GST... (Press Enter)"/></div>
        <div><TagInput label="IT Skills" field="itSkills" placeholder="e.g. SAP, Tally..."/></div>
        <div><TagInput label="Soft Skills" field="softSkills" placeholder="e.g. Communication..."/></div>
        <div><TagInput label="ICAI Courses" field="courses" placeholder="e.g. Advanced ITT..."/></div>
      </div>
      
      <TagInput label="Achievements & Awards" field="achievements" placeholder="e.g. AIR 45..."/>

      <div className="flex justify-between mt-8">
        <button className="btn-outline" onClick={() => setStep(2)}>← Back</button>
        <button className="btn-primary" onClick={() => {
          if (data.technicalSkills.length === 0 || data.itSkills.length === 0 || data.softSkills.length === 0) {
            alert('❌ Technical, IT, and Soft Skills are all mandatory');
          } else {
            setStep(4);
          }
        }}>Finish & Preview →</button>
      </div>
    </div>
  );
}
