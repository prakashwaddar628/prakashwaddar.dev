"use client";

import { useSyncExternalStore } from "react";
import type { Challenge } from "@/lib/system-lab/load-balancing";

const key = "system-lab-progress";
const event = "system-lab-progress-change";
let fallback = "";

function read() {
  try { return localStorage.getItem(key) ?? ""; } catch { return fallback; }
}

function write(value: string) {
  fallback = value;
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch { /* Local storage may be unavailable. */ }
  window.dispatchEvent(new Event(event));
}

export function markProgress(value: "launched" | Challenge) {
  const milestones = read().split(",").filter(Boolean);
  if (!milestones.includes(value)) write([...milestones, value].join(","));
}

function subscribe(callback: () => void) {
  window.addEventListener(event, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(event, callback);
    window.removeEventListener("storage", callback);
  };
}

export default function Progress() {
  const milestones = useSyncExternalStore(subscribe, read, () => "").split(",");
  const challenges = ["throughput", "latency", "failure"].filter(key => milestones.includes(key)).length;
  return (
    <div className="lab-progress">
      <p>{milestones.includes("launched") ? "Load Balancing opened" : "No experiments opened"} · {challenges}/3 challenges cleared</p>
      <button type="button" className="os-control" onClick={() => write("")} disabled={!milestones[0]}>Reset local progress</button>
    </div>
  );
}
