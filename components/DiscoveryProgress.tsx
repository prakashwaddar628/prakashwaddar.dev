"use client";

import { useSyncExternalStore } from "react";
import { achievements } from "./os-data";
import type { Achievement } from "./os-data";

const key = "prakash-os-discovery";
const changed = "prakash-os-discovery-change";
let fallback = "";

function read() {
  try { return localStorage.getItem(key) ?? ""; } catch { return fallback; }
}

function write(value: string) {
  fallback = value;
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch { /* Storage can be disabled by browser settings. */ }
  window.dispatchEvent(new Event(changed));
}

export function discover(achievement: Achievement) {
  const progress = read().split(",").filter(Boolean);
  if (!progress.includes(achievement)) write([...progress, achievement].join(","));
}

function subscribe(update: () => void) {
  window.addEventListener(changed, update);
  window.addEventListener("storage", update);
  return () => {
    window.removeEventListener(changed, update);
    window.removeEventListener("storage", update);
  };
}

export default function DiscoveryProgress() {
  const earned = useSyncExternalStore(subscribe, read, () => "").split(",");
  return (
    <section className="os-discovery" aria-labelledby="discovery-title">
      <h3 id="discovery-title">Discovery log</h3>
      <p>Optional milestones saved in this browser.</p>
      <ul>
        {Object.entries(achievements).map(([id, label]) => (
          <li key={id} data-earned={earned.includes(id)}>
            <span aria-hidden="true">{earned.includes(id) ? "●" : "○"}</span> {label}
            <span className="sr-only"> {earned.includes(id) ? "discovered" : "undiscovered"}</span>
          </li>
        ))}
      </ul>
      <button className="os-control" type="button" onClick={() => write("")}>Reset discoveries</button>
    </section>
  );
}
