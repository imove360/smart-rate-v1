import React, { useState } from 'react';
import initialAnchors from '../data/anchors.json';

export default function LaneAnchors() {
  const [anchors, setAnchors] = useState(initialAnchors);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(initialAnchors.map(a => [a.id, { ...a, checked: false }])));
  const [reviewedBy, setReviewedBy] = useState('Travis');
  const [lastSaved, setLastSaved] = useState('Not saved this session');
  const selectAll = e => e.currentTarget.select();
  const updateDraft = (id, field, value) => setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value, checked: field === 'checked' ? value : true } }));
  const save = () => {
    const now = new Date().toLocaleString([], { month:'numeric', day:'numeric', year:'2-digit', hour:'numeric', minute:'2-digit' });
    let count = 0;
    setAnchors(prev => prev.map(a => {
      const d = drafts[a.id];
      const changed = Number(d.carrierPay) !== Number(a.carrierPay) || Number(d.confidence) !== Number(a.confidence) || d.note !== a.note;
      if (!d.checked && !changed) return a;
      count++;
      return { ...a, carrierPay: Number(d.carrierPay), confidence: Number(d.confidence), note: d.note, updated:'Today', lastReviewedAt: now, lastReviewedBy: reviewedBy || 'Unknown' };
    }));
    setDrafts(prev => Object.fromEntries(Object.entries(prev).map(([id, d]) => [id, { ...d, checked:false }])));
    setLastSaved(`${count} row${count === 1 ? '' : 's'} saved ${now} by ${reviewedBy || 'Unknown'}`);
  };
  const markChangedOnly = () => setDrafts(prev => Object.fromEntries(anchors.map(a => {
    const d = prev[a.id];
    const changed = Number(d.carrierPay) !== Number(a.carrierPay) || Number(d.confidence) !== Number(a.confidence) || d.note !== a.note;
    return [a.id, { ...d, checked: changed }];
  })));
  return (
    <section className="card">
      <div className="between topbar"><div><h2>Lane Anchors</h2><p className="muted">Editable cluster anchors. CD/iM links are placeholders until real endpoints are connected.</p><p className="muted">{lastSaved}</p></div>
      <div className="actions"><label className="reviewer">Reviewed By <input value={reviewedBy} onChange={e => setReviewedBy(e.target.value)} onFocus={selectAll} /></label><button onClick={save}>Save Edits</button><button className="secondary" onClick={markChangedOnly}>Mark Changed Only</button></div></div>
      <div className="tableWrap"><table><thead><tr><th>ID</th><th>Lane</th><th>Updated?</th><th>Carrier Pay</th><th>Confidence</th><th>Strength</th><th>Last Reviewed</th><th>Status</th><th>Market Note</th><th>Tools</th></tr></thead><tbody>
      {anchors.map(a => { const d = drafts[a.id] || { ...a, checked:false }; const pending = d.checked; return <tr key={a.id} className={pending ? 'pending' : ''}>
        <td><strong>{a.id}</strong></td><td><strong>{a.lane}</strong></td><td><input type="checkbox" checked={!!d.checked} onChange={e => updateDraft(a.id, 'checked', e.target.checked)} /></td>
        <td><input className="moneyInput" value={d.carrierPay} onFocus={selectAll} onClick={selectAll} onChange={e => updateDraft(a.id, 'carrierPay', e.target.value.replace(/[^0-9]/g,''))} /></td>
        <td><select value={d.confidence} onChange={e => updateDraft(a.id, 'confidence', Number(e.target.value))}><option value={90}>High</option><option value={70}>Medium</option><option value={45}>Low</option></select></td>
        <td><span className={a.strength === 'Hard Anchor' ? 'pill green' : 'pill orange'}>{a.strength}</span></td>
        <td><strong>{a.lastReviewedAt || a.updated}</strong><br/><span className="muted">By {a.lastReviewedBy || 'Not recorded'}</span></td>
        <td><span className={pending ? 'pill blue' : a.updated === 'Today' ? 'pill green' : 'pill orange'}>{pending ? 'Pending' : a.updated === 'Today' ? 'Fresh' : 'Review'}</span></td>
        <td><input className="noteInput" value={d.note} onFocus={selectAll} onClick={selectAll} onChange={e => updateDraft(a.id, 'note', e.target.value)} /></td>
        <td><button className="tiny">CD</button><button className="tiny">iM</button></td>
      </tr>})}</tbody></table></div>
    </section>
  );
}
