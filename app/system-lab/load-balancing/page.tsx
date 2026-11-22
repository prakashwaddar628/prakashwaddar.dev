import type { Metadata } from "next";
import Link from "next/link";
import LoadBalancing from "./LoadBalancing";
import "../system-lab.css";

export const metadata: Metadata = {
  title: "Load Balancing Lab",
  description: "Compare load-balancing policies and observe real simulated throughput, queueing, tail latency, and server failures.",
};

export default function LoadBalancingPage() {
  return (
    <main className="frame lab-page" id="main-content">
      <Link className="back-link" href="/system-lab">Back to System Lab</Link>
      <header className="lab-masthead">
        <div>
          <p className="eyebrow">Experiment 001 / Foundations</p>
          <h1>Load Balancing<span>.</span></h1>
          <p className="lab-intro">Change how requests reach your fleet. Then take a server offline and see where the pressure goes.</p>
        </div>
        <p className="lab-sim-label">Client-side simulation</p>
      </header>
      <LoadBalancing />
    </main>
  );
}
