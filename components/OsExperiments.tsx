"use client";

import { useState } from "react";
import { discover } from "./DiscoveryProgress";

const puzzle = [
  { label: "Read the event", message: "The sample event contains skills: Python, SQL, Python." },
  { label: "Read the contract", message: "The dashboard counts each skill once per posting." },
  { label: "Inspect the transform", message: "The transform forwards the list unchanged, so Python is counted twice." },
];
const fixes = [
  { label: "Drop the posting", message: "That prevents the duplicate, but it also loses valid data." },
  { label: "Deduplicate skills per posting", message: "Correct. Python and SQL each contribute one count." },
  { label: "Deduplicate across all postings", message: "That would undercount skills shared by multiple postings." },
];
const pipeline = [
  { label: "Producer", detail: "A sample data engineer posting enters the pipeline.", output: { title: "Data Engineer", skills: ["Python", "SQL", "Python"] } },
  { label: "Kafka", detail: "The producer publishes the posting to the jobs topic.", output: { topic: "jobs_topic", event: "job-posting" } },
  { label: "ETL", detail: "The consumer extracts and normalizes the sample skills.", output: { skills: ["Python", "SQL"] } },
  { label: "Storage", detail: "The processed posting is available for downstream queries.", output: { target: ["PostgreSQL", "MongoDB"], record: "data-engineer" } },
];

export default function OsExperiments() {
  const [clue, setClue] = useState(0);
  const [fix, setFix] = useState<number | null>(null);
  const [step, setStep] = useState(0);

  return (
    <div className="experiment-grid os-experiments">
      <article className="experiment">
        <h3>Debug the count</h3>
        <p>A simulated dashboard counts one skill twice. Trace the bug and choose a fix.</p>
        <div className="preview-options" role="group" aria-label="Debugging clues">
          {puzzle.map(({ label }, index) => <button type="button" key={label} aria-pressed={clue === index} onClick={() => setClue(index)}>{label}</button>)}
        </div>
        <p className="os-example-output" aria-live="polite">{puzzle[clue].message}</p>
        <div className="preview-options" role="group" aria-label="Proposed fixes">
          {fixes.map(({ label }, index) => <button type="button" key={label} aria-pressed={fix === index} onClick={() => {
            setFix(index);
            if (index === 1) discover("puzzle");
          }}>{label}</button>)}
        </div>
        <p className="os-puzzle-result" aria-live="polite">{fix === null ? "Choose a fix to check it." : fixes[fix].message}</p>
      </article>
      <article className="experiment">
        <h3>Follow a JobPulse event</h3>
        <p>Step through JobPulse’s documented pipeline with an illustrative posting.</p>
        <div className="preview-options" role="group" aria-label="Pipeline stages">
          {pipeline.map(({ label }, index) => <button type="button" key={label} aria-pressed={step === index} onClick={() => {
            setStep(index);
            if (index === pipeline.length - 1) discover("curious");
          }}>{label}</button>)}
        </div>
        <div className="os-example-output" aria-live="polite">
          <p>{pipeline[step].detail}</p>
          <pre><code>{JSON.stringify(pipeline[step].output, null, 2)}</code></pre>
        </div>
      </article>
    </div>
  );
}
