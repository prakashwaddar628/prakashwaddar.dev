import type { Metadata } from "next";
import Link from "next/link";
import { experiments } from "./experiments";
import Progress from "./Progress";
import "./system-lab.css";

export const metadata: Metadata = {
  title: "System Lab",
  description: "Build, break, and observe deterministic system design simulations in the browser.",
};

export default function SystemLab() {
  return (
    <main className="frame lab-page" id="main-content">
      <header className="lab-masthead">
        <div>
          <p className="eyebrow">Interactive engineering notebook</p>
          <h1>System Lab<span>.</span></h1>
          <p className="lab-intro">Build it. Break it. Scale it. Understand it.</p>
        </div>
        <Progress />
      </header>
      <div className="lab-directory">
        {experiments.map(experiment => (
          <article className={`lab-experiment ${"href" in experiment ? "lab-feature" : ""}`} key={experiment.number}>
            <div className="lab-experiment-copy">
              <p className="eyebrow">{experiment.number} / {experiment.difficulty}</p>
              <h2>{experiment.title}</h2>
              <p>{experiment.description}</p>
              <ul className="tags" aria-label="Engineering concepts">{experiment.concepts.map(concept => <li key={concept}>{concept}</li>)}</ul>
              {"href" in experiment
                ? <Link className="button button-primary" href={experiment.href} data-magnetic><span>Launch experiment</span></Link>
                : <p className="lab-upcoming">Planned experiment</p>}
            </div>
            <details className="lab-preview" open={"href" in experiment || undefined}>
              <summary>Architecture preview</summary>
              <ol>{experiment.nodes.map(node => <li key={node}>{node}</li>)}</ol>
            </details>
          </article>
        ))}
      </div>
    </main>
  );
}
