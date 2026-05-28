import React, { useState } from 'react';
import PricingEngine from './components/PricingEngine.jsx';
import ZipResolver from './components/ZipResolver.jsx';
import LaneAnchors from './components/LaneAnchors.jsx';
import FreightClusters from './components/FreightClusters.jsx';
import Overrides from './components/Overrides.jsx';
import DataHealth from './components/DataHealth.jsx';
import AdminSettings from './components/AdminSettings.jsx';

export default function App() {
  const [tab, setTab] = useState('engine');
  const tabs = [
    ['engine', 'Test Output'],
    ['zip', 'ZIP Resolver'],
    ['anchors', 'Lane Anchors'],
    ['clusters', 'Freight Clusters'],
    ['settings', 'Admin Settings'],
    ['overrides', 'Overrides'],
    ['health', 'Data Health'],
  ];
  return (
    <div className="app">
      <header className="header"><div><h1>Smart Rate V1 ZIP Resolver Prototype</h1><p>Admin-only tuning system with ZIP-to-cluster mapping and visible pricing pipeline.</p></div><span className="badge">Local Prototype</span></header>
      <nav className="tabs">{tabs.map(([id,label]) => <button key={id} onClick={() => setTab(id)} className={tab === id ? 'active' : ''}>{label}</button>)}</nav>
      {tab === 'engine' && <PricingEngine />}
      {tab === 'zip' && <ZipResolver />}
      {tab === 'anchors' && <LaneAnchors />}
      {tab === 'clusters' && <FreightClusters />}
      {tab === 'settings' && <AdminSettings />}
      {tab === 'overrides' && <Overrides />}
      {tab === 'health' && <DataHealth />}
    </div>
  );
}
