"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { projects } from "./projects";
import { architecture, email, github, linkedin, skills } from "./os-data";
import DiscoveryProgress, { discover } from "./DiscoveryProgress";
import VisitorDiagnostics from "./VisitorDiagnostics";
import OsTerminal from "./OsTerminal";
import OsPalette from "./OsPalette";

type View = "dashboard" | "terminal" | "palette" | "recruiter";
type Screen = { view: View } | { view: "dossier"; project: string };
const ConsoleContext = createContext<(screen: Screen) => void>(() => {});
const titles = { dashboard: "Access Dashboard", terminal: "Developer Terminal", palette: "Command Palette", recruiter: "Recruiter Mode" };

export function ConsoleButton({ screen, children, className = "os-control" }: {
  screen: Screen; children: ReactNode; className?: string;
}) {
  const open = useContext(ConsoleContext);
  return <button type="button" className={className} aria-haspopup="dialog" onClick={() => open(screen)}>{children}</button>;
}

function RecruiterOverview() {
  return (
    <div className="os-recruiter">
      <p className="os-lead">Prakash L Waddar · Software Engineer / Full-Stack Developer / AI Engineer</p>
      <section><h3>Experience</h3><p>Software Developer at HRNeeti. Contributed to enterprise HR software, including Flutter mobile work, organization chart interfaces, PHP modernization, and backend investigation.</p></section>
      <section><h3>Selected projects</h3><ul>{projects.filter(project => project.source).map(project => (
        <li key={project.name}><a href={project.source}>{project.name}</a> <span>— {project.category}</span></li>
      ))}</ul></section>
      <section><h3>Core technologies</h3><p>{skills.join(" · ")}</p></section>
      <section><h3>Education</h3><p>B.Tech in Artificial Intelligence and Data Science, NMAM Institute of Technology, Nitte.</p></section>
      <div className="os-actions"><a className="os-control" href={`mailto:${email}`}>Email Prakash</a><a className="os-control" href={github}>GitHub</a><a className="os-control" href={linkedin}>LinkedIn</a></div>
    </div>
  );
}

function Dossier({ projectId }: { projectId: string }) {
  const project = projects.find(item => item.art === projectId && item.source);
  const details = architecture[projectId];
  if (!project || !details) return null;
  return (
    <div className="os-dossier" style={{ "--dossier-color": project.color } as CSSProperties}>
      <p className="eyebrow">{project.category}</p>
      <p className="os-lead">{project.description}</p>
      <h3>Technologies</h3>
      <ul className="tags">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <h3>Documented architecture</h3>
      <ol className="os-architecture">
        {details.steps.map((step, index) => <li key={step} style={{ "--step-delay": `${index * 65}ms` } as CSSProperties}>{step}</li>)}
      </ol>
      {details.challenge && <><h3>Engineering notes</h3><p>{details.challenge}</p></>}
      <div className="os-actions"><a className="os-control" href={project.source}>Source on GitHub</a>
        {project.demo && <a className="os-control" href={project.demo}>Live demo</a>}</div>
    </div>
  );
}

export default function PortfolioConsole({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const open = useCallback((next: Screen) => {
    if (!dialog.current?.open) opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (next.view === "dashboard") discover("contact");
    if (next.view === "terminal") discover("terminal");
    if (next.view === "dossier") discover("dossier");
    setScreen(next);
  }, []);

  function close(restoreFocus = true) {
    dialog.current?.close();
    setScreen(null);
    if (restoreFocus) opener.current?.focus();
    opener.current = null;
  }

  useEffect(() => {
    const current = dialog.current;
    if (!screen || !current) return;
    if (!current.open) current.showModal();
    current.scrollTop = 0;
    const focusTarget = current.querySelector<HTMLElement>("[data-console-focus]") ?? current.querySelector<HTMLElement>(".os-close");
    focusTarget?.focus();
  }, [screen]);

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.isComposing || event.altKey) return;
      if (event.target instanceof HTMLElement && (event.target.isContentEditable || event.target.closest("input, textarea, select, [role=textbox]"))) return;
      const palette = (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === "k";
      const terminal = !event.ctrlKey && !event.metaKey && (event.key === "~" || event.key === "`");
      if (!palette && !terminal) return;
      event.preventDefault();
      open({ view: palette ? "palette" : "terminal" });
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [open]);

  function navigate(href: string) {
    close(false);
    if (href.startsWith("/#") && pathname === "/") {
      const hash = href.slice(1);
      if (window.location.hash === hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else window.location.assign(hash);
      return;
    }
    router.push(href);
  }

  const actions = [
    { label: "Recruiter Mode", detail: "Professional overview and contact", run: () => open({ view: "recruiter" }) },
    { label: "Access Dashboard", detail: "Local visitor diagnostics", run: () => open({ view: "dashboard" }) },
    { label: "Developer Terminal", detail: "Run portfolio commands", run: () => open({ view: "terminal" }) },
    ...[["Work", "/#work"], ["About", "/#about"], ["Playground", "/#playground"], ["System Lab", "/system-lab"], ["Writing", "/writing"], ["Engineering Logs", "/logs"], ["Contact", "/#contact"]].map(([label, href]) => (
      { label, detail: href, run: () => navigate(href) }
    )),
  ];
  const title = screen?.view === "dossier" ? projects.find(project => project.art === screen.project)?.name : screen ? titles[screen.view] : "";

  return (
    <ConsoleContext.Provider value={open}>
      {children}
      <dialog ref={dialog} className="os-dialog" aria-labelledby="os-title" onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (event.target === event.currentTarget) {
          const box = event.currentTarget.getBoundingClientRect();
          if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close();
        } }}>
        {screen && (
          <div className="os-shell" data-view={screen.view}>
            <header className="os-dialog-header">
              <div><p className="eyebrow">{screen.view === "dossier" ? "Project dossier" : "Prakash.OS"}</p><h2 id="os-title">{title}</h2></div>
              <button type="button" className="os-control os-close" onClick={() => close()}>Close</button>
            </header>
            {screen.view === "dashboard" && <>
              <aside className="os-fiction" aria-label="Fictional console message">
                <p className="eyebrow">Fictional console message</p>
                <p>Unknown visitor detected. Identity: a curious human.</p>
                <p>Access granted. Curiosity is always welcome here.</p>
              </aside>
              <VisitorDiagnostics />
              <div className="os-actions">
                <ConsoleButton screen={{ view: "terminal" }}>Open terminal</ConsoleButton>
                <ConsoleButton screen={{ view: "palette" }}>Command palette</ConsoleButton>
                <ConsoleButton screen={{ view: "recruiter" }}>Recruiter Mode</ConsoleButton>
              </div>
              <DiscoveryProgress />
            </>}
            {screen.view === "terminal" && <OsTerminal close={() => close()} />}
            {screen.view === "palette" && <OsPalette actions={actions} />}
            {screen.view === "recruiter" && <RecruiterOverview />}
            {screen.view === "dossier" && <Dossier projectId={screen.project} />}
          </div>
        )}
      </dialog>
    </ConsoleContext.Provider>
  );
}
