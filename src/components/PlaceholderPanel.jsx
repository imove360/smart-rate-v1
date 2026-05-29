import React from 'react';

export default function PlaceholderPanel({ title, children }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <p className="muted">{children}</p>
      <div className="notice">This tab is restored so the admin structure stays intact. The next build will wire this tab into the normalized calibration dataset and real model tables.</div>
    </section>
  );
}
