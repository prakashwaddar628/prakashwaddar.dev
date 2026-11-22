import type { CSSProperties } from "react";
import { projects } from "./projects";
import ProjectPreview from "./ProjectPreview";

const diagrams: Record<string, React.ReactNode> = {
  vehicle: <><rect x="19" y="21" width="282" height="138" rx="8" opacity=".48"/><path d="M19 43h282M35 32h19m212 0h18" opacity=".6"/><g transform="translate(0 15)"><path d="M49 104h222l-13-28-30-9-38-32h-63L84 70l-27 7zM108 68l29-23h48l27 23zM62 104v14h21m38 0h77m37 0h25v-14"/><circle cx="102" cy="113" r="18"/><circle cx="217" cy="113" r="18"/><path d="M41 131h110m75 0h49"/></g></>,
  pulse: <><path className="sample-route" pathLength="1" d="M30 89h52l20-31 22 62 33-93 25 78 25-16h83"/><path d="M42 140h236M42 25h236" opacity=".45"/><circle cx="157" cy="27" r="6"/><circle cx="124" cy="120" r="5"/></>,
  resume: <><rect x="88" y="18" width="108" height="135" rx="8"/><path d="M110 45h57m-57 20h63m-63 19h42m-42 20h36"/><circle cx="209" cy="109" r="35"/><path d="m194 109 10 10 20-22"/></>,
  stream: <><path className="sample-route" pathLength="1" d="M33 47h55l29 43h78l26-43h65M33 131h55l29-41m78 0 26 41h65"/><rect x="130" y="70" width="54" height="40" rx="8"/>{[47,131].map(y => <g key={y}><circle cx="33" cy={y} r="9"/><circle cx="286" cy={y} r="9"/></g>)}</>,
  flow: <><path className="sample-route" pathLength="1" d="m160 23 94 43-94 43-94-43zM66 88l94 43 94-43M66 110l94 43 94-43"/><circle cx="160" cy="66" r="15"/></>,
  test: <><rect x="71" y="25" width="179" height="130" rx="10"/><path d="M71 51h179M92 77l6 6 11-12m-17 34 6 6 11-12m-17 34 6 6 11-12m20-49h95m-95 28h73m-73 28h52"/><circle cx="88" cy="38" r="2"/><circle cx="98" cy="38" r="2"/></>,
  vision: <><path d="M104 59V33h28m56 0h28v26m0 62v26h-28m-56 0h-28v-26M82 89h156"/><path d="m122 82 17-22h42l17 22-12 34-26 12-26-12z"/><circle cx="145" cy="93" r="4"/><circle cx="175" cy="93" r="4"/></>,
  quiz: <><rect x="56" y="34" width="208" height="111" rx="10"/><path d="M56 58h208m-118 0v87m-70-65h51m-51 19h37m-37 19h44m52-38-14 16 14 16m53-32 14 16-14 16m-21-38-16 45"/></>,
};

export default function ProjectShowcase() {
  return (
    <section className="frame section" id="work" aria-labelledby="work-title">
      <div className="section-heading" data-reveal>
        <div className="eyebrow">Portfolio</div>
        <h2 id="work-title">Selected work<span>.</span></h2>
      </div>
      <div className="project-grid">
        {projects.map(project => (
          <article key={project.name} className="project-card" data-tilt data-reveal
            style={{ "--project-color": project.color } as CSSProperties}>
            <div className={`project-art art-${project.art}`} aria-hidden="true">
              <svg viewBox="0 0 320 176" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round">
                {diagrams[project.art]}
              </svg>
            </div>
            <div className="project-copy">
              <p className="eyebrow">{project.category}</p>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <ul className="tags" aria-label="Project technologies">
                {project.tags.map(tag => <li key={tag}>{tag}</li>)}
              </ul>
              <ProjectPreview art={project.art} />
              {(project.source || project.demo) && <div className="project-links">
                {project.source && <a href={project.source} aria-label={`${project.name} on GitHub`}>GitHub</a>}
                {project.demo && <a href={project.demo} aria-label={`${project.name} live demo`}>Live demo</a>}
              </div>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
