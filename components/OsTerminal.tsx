"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from "react";
import { projects } from "./projects";
import { email, github, linkedin, skills } from "./os-data";
import { discover } from "./DiscoveryProgress";

const commands: Record<string, ReactNode> = {
  help: "help · whoami · about · projects · skills · experience · contact · clear · exit · mission",
  whoami: "Unknown Explorer. In this console, that means a curious human.",
  about: "Prakash L Waddar is a software, full-stack, and AI engineer. He studied Artificial Intelligence and Data Science at NMAM Institute of Technology, Nitte.",
  projects: <ul>{projects.map(project => <li key={project.name}>{project.source ? <a href={project.source}>{project.name}</a> : project.name}</li>)}</ul>,
  skills: skills.join(" · "),
  experience: "Software Developer at HRNeeti. Worked across Flutter, organization chart interfaces, PHP modernization, and backend investigation.",
  contact: <><a href={`mailto:${email}`}>Email</a> · <a href={github}>GitHub</a> · <a href={linkedin}>LinkedIn</a></>,
  mission: "Explore how a request becomes a product. Follow a project dossier, then debug a sample event in the Playground.",
};

type Line = { id: number; command: string; result: ReactNode };

export default function OsTerminal({ close }: { close: () => void }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const draft = useRef("");
  const nextLine = useRef(0);
  const output = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);

  function run(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const original = input.trim();
    if (!original) return;
    const command = original.toLowerCase().replace(/\s+/g, " ");
    history.current = [...history.current, original].slice(-50);
    historyIndex.current = history.current.length;
    draft.current = "";
    setInput("");
    if (command === "exit") {
      close();
      return;
    }
    if (command === "clear") {
      setLines([]);
      return;
    }
    let result = Object.hasOwn(commands, command) ? commands[command] : "Unknown command. Type help to see what’s available.";
    if (command === "sudo hire prakash") {
      discover("curious");
      result = <div className="os-recruitment"><strong>Recruitment request: awaiting coffee.</strong><br />
        <a href={`mailto:${email}`}>Email Prakash</a></div>;
    }
    const id = nextLine.current++;
    setLines(previous => [...previous.slice(-49), { id, command: original, result }]);
  }

  function review(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const list = history.current;
    if (!list.length) return;
    if (historyIndex.current === list.length && event.key === "ArrowUp") draft.current = input;
    const index = Math.max(0, Math.min(list.length, historyIndex.current + (event.key === "ArrowUp" ? -1 : 1)));
    historyIndex.current = index;
    setInput(list[index] ?? draft.current);
  }

  return (
    <>
      <div className="os-terminal-output" ref={output} role="log" aria-label="Terminal output">
        <p>Prakash.OS portfolio console. Type <strong>help</strong> to begin.</p>
        {lines.map(line => (
          <div key={line.id} className="os-terminal-line">
            <p><span aria-hidden="true">› </span>{line.command}</p>
            <div>{line.result}</div>
          </div>
        ))}
      </div>
      <form className="os-terminal-form" onSubmit={run}>
        <label htmlFor="os-command">Command</label>
        <div>
          <input id="os-command" data-console-focus value={input} onChange={event => setInput(event.target.value)}
            onKeyDown={review} maxLength={160} spellCheck={false} autoComplete="off" autoCapitalize="off" />
          <button type="submit" className="os-control">Run</button>
        </div>
      </form>
    </>
  );
}
