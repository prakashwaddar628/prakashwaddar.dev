"use client";

import { useEffect, useState } from "react";

function readDiagnostics() {
  const { userAgent: ua, language } = navigator;
  const browser =
    /Edg(?:A|iOS)?\//.test(ua) ? "Edge" :
    /(?:OPR|OPiOS)\//.test(ua) ? "Opera" :
    /SamsungBrowser\//.test(ua) ? "Samsung Internet" :
    /(?:Firefox|FxiOS)\//.test(ua) ? "Firefox" :
    /(?:Chrome|CriOS)\//.test(ua) ? "Chrome or Chromium" :
    /Safari\//.test(ua) ? "Safari" : "Undetermined";
  const os =
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "iOS or iPadOS" :
    /Chrome OS|CrOS/.test(ua) ? "ChromeOS" :
    /Windows/.test(ua) ? "Windows" :
    /Macintosh/.test(ua) ? "macOS" :
    /Linux/.test(ua) ? "Linux" : "Undetermined";
  const { width, height } = window.screen;
  return [
    ["Browser family", browser],
    ["Operating system", os],
    ["Language", language || "Undetermined"],
    ["Time zone", Intl.DateTimeFormat().resolvedOptions().timeZone || "Undetermined"],
    ["Approx. screen", `${Math.round(width / 100) * 100} × ${Math.round(height / 100) * 100} CSS px`],
  ];
}

export default function VisitorDiagnostics() {
  const [data, setData] = useState<ReturnType<typeof readDiagnostics> | null>(() => typeof window === "undefined" ? null : readDiagnostics());
  const [time, setTime] = useState(() => typeof window === "undefined" ? "" : new Date().toLocaleTimeString());
  const visible = data !== null;

  useEffect(() => {
    if (!visible) return;
    const clock = window.setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => window.clearInterval(clock);
  }, [visible]);

  return (
    <section className="os-diagnostics" aria-labelledby="diagnostic-title">
      <h3 id="diagnostic-title">Browser diagnostics</h3>
      <p>Read locally from your browser. No IP lookup, analytics, or transmission.</p>
      {data && (
        <dl className="os-diagnostic-grid">
          <div><dt>Visitor alias</dt><dd>Unknown Explorer</dd></div>
          {data.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          <div><dt>Local time</dt><dd>{time}</dd></div>
        </dl>
      )}
      <button className="os-control" type="button" onClick={() => {
        if (data) setData(null);
        else {
          setData(readDiagnostics());
          setTime(new Date().toLocaleTimeString());
        }
      }}>{data ? "Reset diagnostics" : "Read diagnostics"}</button>
    </section>
  );
}
