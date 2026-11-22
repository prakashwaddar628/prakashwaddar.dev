"use client";

import { useState } from "react";

export type PaletteAction = { label: string; detail: string; run: () => void };

export default function OsPalette({ actions }: { actions: PaletteAction[] }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const filtered = actions.filter(action => `${action.label} ${action.detail}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="os-palette">
      <label htmlFor="os-search">Find a command or page</label>
      <input id="os-search" data-console-focus role="combobox" aria-controls="os-search-results" aria-expanded="true"
        aria-autocomplete="list" aria-activedescendant={filtered.length ? `os-action-${index}` : undefined}
        value={query} autoComplete="off" onChange={event => { setQuery(event.target.value); setIndex(0); }}
        onKeyDown={event => {
          if (event.nativeEvent.isComposing || !filtered.length) return;
          if (event.key === "Enter") {
            event.preventDefault();
            filtered[index].run();
          }
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            const next = (index + (event.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length;
            setIndex(next);
            document.getElementById(`os-action-${next}`)?.scrollIntoView({ block: "nearest" });
          }
        }} />
      <ul id="os-search-results" role="listbox" aria-label="Commands and pages">
        {filtered.map((action, option) => (
          <li id={`os-action-${option}`} key={action.label} role="option" aria-selected={option === index}
            onMouseMove={() => setIndex(option)} onClick={action.run}>
            <span>{action.label}</span><small>{action.detail}</small>
          </li>
        ))}
      </ul>
      {!filtered.length && <p role="status">No matching commands.</p>}
    </div>
  );
}
