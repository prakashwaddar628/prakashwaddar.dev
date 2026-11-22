"use client";

import { useState } from "react";

const previews: Record<string, { title: string; steps: [string, string][] }> = {
  vehicle: { title: "Marketplace preview", steps: [["Browse", "Compare sample vehicle listings by body style."], ["Inspect", "Open a listing to review its details."], ["Connect", "The marketplace brings buyers and sellers together."]] },
  pulse: { title: "Sample sprint", steps: [["Activity", "Open: Update the service README."], ["Review", "In review: Clarify setup instructions."], ["Summary", "Documentation changes are in review."]] },
  resume: { title: "Sample skills comparison", steps: [["Resume", "Skills found: Python and SQL."], ["Job description", "Skills requested: Python, SQL, and Docker."], ["Match", "Python and SQL match. Docker is a skill gap."]] },
  stream: { title: "Illustrative job event", steps: [["Ingest", "Read a sample posting for a data engineer."], ["Process", "Stream the posting through Kafka and extract Python and SQL."], ["Store", "Send processed data to storage for dashboard queries."]] },
  flow: { title: "Sample learning path", steps: [["Read", "Start with an explanation of how functions work."], ["Practice", "Write a function that doubles a number."], ["Review", "Discuss your solution with an AI study assistant."]] },
  test: { title: "Sample test draft", steps: [["Input", "A function that doubles a number."], ["Typical case", "Given 4, check that the result is 8."], ["Edge case", "Given 0, check that the result is 0."]] },
  vision: { title: "Recognition concept", steps: [["Detect", "Locate a character in a sample image."], ["Embed", "Represent the detected region as a vector."], ["Compare", "Compare the vector with known character embeddings."]] },
};

export default function ProjectPreview({ art }: { art: string }) {
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  if (art === "quiz") {
    return (
      <details className="project-preview">
        <summary>Try a sample quiz</summary>
        <div className="preview-body">
          <p>What does <code>[2, 3].map(n =&gt; n * 2)</code> return?</p>
          <div className="preview-options" role="group" aria-label="Quiz answers">
            {["[2, 3]", "[4, 6]", "[2, 9]"].map((option, index) => (
              <button key={option} type="button" aria-pressed={answer === index} onClick={() => setAnswer(index)}>{option}</button>
            ))}
          </div>
          <p className="preview-result" aria-live="polite">{answer === null ? "Choose an answer." : answer === 1 ? "Correct. Each element is doubled." : "Try again. The callback runs once for each element."}</p>
        </div>
      </details>
    );
  }

  const preview = previews[art];
  return (
    <details className="project-preview">
      <summary>{preview.title}</summary>
      <div className="preview-body">
        <div className="preview-options" role="group" aria-label={preview.title}>
          {preview.steps.map(([label],index) => (
            <button key={label} type="button" aria-pressed={step === index} onClick={() => setStep(index)}>{label}</button>
          ))}
        </div>
        <p className="preview-result" aria-live="polite">{preview.steps[step][1]}</p>
      </div>
    </details>
  );
}
