import React, { useState } from 'react';
import ClusterEngine from './components/ClusterEngine.jsx';
import PlaceholderPanel from './components/PlaceholderPanel.jsx';
import './styles.css';

const tabs = [
  ['test', 'Test Output'],
  ['resolver', 'ZIP Resolver'],
  ['anchors', 'Lane Anchors'],
  ['clusters', 'Freight Clusters'],
  ['admin', 'Admin Settings'],
  ['overrides', 'Overrides'],
  ['health', 'Data Health']
];

export default function App() {
  const [active, setActive] = useState('resolver');

  return (
    <div>
      <header className="topbar">
        <div>
          <h1>Smart Rate V1 ZIP Resolver Prototype</h1>
          <p>Admin-only tuning system with ZIP-to-cluster mapping and visible pricing pipeline.</p>
        </div>
        <span className="badge">Local Prototype</span>
      </header>

      <nav className="tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={active === id ? 'active' : ''} onClick={() => setActive(id)}>{label}</button>
        ))}
      </nav>

      <main>
        {active === 'resolver' && <ClusterEngine />}
        {active === 'test' && <PlaceholderPanel title="Test Output">Next: this will show carrier pay, broker margin, customer price, confidence, and adjustment breakdown from the engine.</PlaceholderPanel>}
        {active === 'anchors' && <PlaceholderPanel title="Lane Anchors">Next: this will load anchor lane pairs and allow manager-reviewed updates with last-reviewed tracking.</PlaceholderPanel>}
        {active === 'clusters' && <ClusterEngine />}
        {active === 'admin' && <PlaceholderPanel title="Admin Settings">Next: this will expose vehicle tiers, enclosed behavior, non-running logic, date buckets, confidence rules, and save/export controls.</PlaceholderPanel>}
        {active === 'overrides' && <PlaceholderPanel title="Overrides">Next: this will support manual ZIP, cluster, lane, and temporary market overrides.</PlaceholderPanel>}
        {active === 'health' && <PlaceholderPanel title="Data Health">Next: this will show mapped ZIP coverage, unmapped ZIPs, duplicate captures, stale anchors, and confidence gaps.</PlaceholderPanel>}
      </main>
    </div>
  );
}
