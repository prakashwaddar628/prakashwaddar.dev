"use client";

import { useState } from "react";

const stages = [
  { name: "Interface", detail: "A person makes a request." },
  { name: "Service", detail: "The API validates it and applies the rules." },
  { name: "Data", detail: "Storage returns the result." },
];

export default function HeroSignal() {
  const [stage, setStage] = useState(0);
  return (
    <div className="hero-instrument">
      <div className="hero-art" aria-hidden="true">
        <svg viewBox="0 0 560 560" fill="none">
          <g stroke="#d8ff70" opacity=".33">
            {[72, 145, 218].map(radius => <circle key={radius} cx="280" cy="280" r={radius} />)}
            <circle cx="280" cy="280" r="248" strokeDasharray="2 8" />
            <path d="M280 32v496M32 280h496M105 105l350 350m0-350L105 455" strokeDasharray="3 8" />
          </g>
          <path d="M125 355H210L280 280L344 199H433" stroke="#d8ff70" strokeWidth="2" opacity=".65"/>
          {[[125,355],[280,280],[433,199]].map(([x,y],index) => (
            <g key={x} className={stage === index ? "signal-active" : ""}>
              <circle className="signal-halo" cx={x} cy={y} r="20" stroke="#d8ff70"/>
              <circle cx={x} cy={y} r="7" fill={stage === index ? "#d8ff70" : "#70864e"}/>
              <text x={x} y={y - 31} textAnchor="middle" fill="#d8ff70">{stages[index].name}</text>
            </g>
          ))}
        </svg>
      </div>
      <div className="signal-controls">
        <button type="button" className="signal-button" onClick={() => setStage((stage + 1) % stages.length)}>Trace a request <span aria-hidden="true">↳</span></button>
        <p aria-live="polite"><strong>{stages[stage].name}</strong> / {stages[stage].detail}</p>
      </div>
    </div>
  );
}
