import Link from "next/link";
import { FaCode, FaDatabase, FaCloud, FaLayerGroup, FaMicrochip } from "react-icons/fa6";
import ProjectShowcase from "@/components/ProjectShowcase";

const stack = [
  { title: "Frontend", icon: FaLayerGroup, tools: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Flutter"] },
  { title: "Backend", icon: FaCode, tools: ["Python", "FastAPI", "Node.js", "NestJS", "PHP", "REST APIs"] },
  { title: "AI / ML", icon: FaMicrochip, tools: ["TensorFlow", "scikit-learn", "NLP", "Generative AI"] },
  { title: "Databases", icon: FaDatabase, tools: ["PostgreSQL", "MySQL", "MongoDB", "Redis"] },
  { title: "Cloud / DevOps", icon: FaCloud, tools: ["AWS", "Google Cloud", "Docker", "Git", "GitHub"] },
];

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero" aria-labelledby="hero-title">
        <div className="frame hero-inner">
          <div className="hero-art" aria-hidden="true">
            <svg viewBox="0 0 560 560" fill="none">
              <defs>
                <linearGradient id="orbit-line" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
                  <stop stopColor="#edffb0"/><stop offset="1" stopColor="#537831" stopOpacity=".25"/>
                </linearGradient>
              </defs>
              <g stroke="url(#orbit-line)">
                {Array.from({ length: 20 }, (_, index) => (
                  <ellipse key={index} cx="280" cy="280" rx="216" ry={47 + index * 5.5} transform={`rotate(${index * 9} 280 280)`} />
                ))}
                <circle cx="280" cy="280" r="248" strokeDasharray="2 8" opacity=".5"/>
                <circle cx="280" cy="280" r="228" opacity=".2"/>
              </g>
              <circle cx="280" cy="280" r="8" fill="#d8ff70"/>
              <path d="M280 17v24m0 478v24M17 280h24m478 0h24" stroke="#d8ff70" opacity=".6"/>
            </svg>
          </div>
          <div className="hero-content">
            <p className="eyebrow hero-name">Prakash L Waddar</p>
            <h1 id="hero-title"><span>I build what’s</span><span>next<span className="hero-period">.</span></span></h1>
            <p className="hero-role">Software Engineer / Full-Stack Developer / AI Engineer</p>
            <p className="hero-summary">I build scalable applications and AI-powered tools that turn complex ideas into products people can use.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work" data-magnetic><span>Explore projects</span></a>
              <a className="button" href="#contact" data-magnetic><span>Get in touch</span></a>
            </div>
          </div>
          <a className="scroll-cue" href="#work"><span aria-hidden="true" />Scroll to projects</a>
        </div>
      </section>

      <ProjectShowcase />

      <section id="about" className="frame section split" aria-labelledby="about-title">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">About</p>
          <h2 id="about-title">The engineer<br />behind the work<span>.</span></h2>
        </div>
        <div className="about-copy" data-reveal>
          <p>I’m Prakash, a software engineer working across full-stack development, backend architecture, and applied AI. I enjoy tracing a problem from the interface through the API and data model, then choosing the simplest approach that holds up in practice.</p>
          <p>I work with cloud and development tools and write about the trade-offs I encounter along the way.</p>
          <div className="education">
            <p className="eyebrow">Education</p>
            <h3>B.Tech in Artificial Intelligence and Data Science</h3>
            <p>NMAM Institute of Technology, Nitte</p>
          </div>
        </div>
      </section>

      <section className="frame section split" aria-labelledby="experience-title">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Experience</p>
          <h2 id="experience-title">Industry work<span>.</span></h2>
        </div>
        <ol className="timeline" data-reveal>
          <li>
            <p className="eyebrow">HRNeeti</p>
            <h3>Software Developer</h3>
            <p>Worked on enterprise HR software across web, mobile, and backend development.</p>
            <ul>
              <li>Contributed to the Flutter mobile application and organization chart interface.</li>
              <li>Worked on PHP application modernization and investigated backend and infrastructure issues.</li>
            </ul>
          </li>
        </ol>
      </section>

      <section className="frame section" aria-labelledby="stack-title">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Technologies</p>
          <h2 id="stack-title">My toolkit<span>.</span></h2>
        </div>
        <div className="stack-grid">
          {stack.map(({ title, icon: Icon, tools }) => (
            <section className="stack-group" key={title} data-reveal>
              <Icon aria-hidden="true" />
              <h3>{title}</h3>
              <ul className="tags">{tools.map(tool => <li key={tool}>{tool}</li>)}</ul>
            </section>
          ))}
        </div>
      </section>

      <section className="frame section split" aria-labelledby="journal-title">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Journal</p>
          <h2 id="journal-title">Notes from<br />the build<span>.</span></h2>
        </div>
        <div className="journal-links" data-reveal>
          <Link href="/writing"><strong>Writing</strong><span>Algorithms, systems, and engineering decisions</span></Link>
          <Link href="/logs"><strong>Engineering Logs</strong><span>Progress, problems, and lessons from ongoing work</span></Link>
        </div>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="frame section" data-reveal>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">Have something<br />ambitious in mind<span>?</span></h2>
          <a className="button button-primary" href="mailto:prakashwaddar628@gmail.com" data-magnetic><span>prakashwaddar628@gmail.com</span></a>
          <div className="social-links">
            <a href="https://github.com/prakashwaddar628">GitHub</a>
            <a href="https://www.linkedin.com/in/prakash-l-waddar">LinkedIn</a>
          </div>
        </div>
      </section>
    </main>
  );
}
