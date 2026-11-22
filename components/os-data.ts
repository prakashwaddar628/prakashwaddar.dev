export const email = "prakashwaddar628@gmail.com";
export const github = "https://github.com/prakashwaddar628";
export const linkedin = "https://www.linkedin.com/in/prakash-l-waddar";

export const skills = ["React", "Next.js", "TypeScript", "Python", "FastAPI", "PostgreSQL", "Docker", "Applied AI"];

export const architecture: Record<string, { steps: string[]; challenge?: string }> = {
  resume: { steps: ["Streamlit upload", "Document text extraction", "spaCy skill extraction", "Skill comparison and Plotly results"], challenge: "The matching logic filters job-description text against known technical keywords before comparing skills." },
  stream: { steps: ["Python producer", "Kafka jobs topic", "ETL and skill extraction", "PostgreSQL and MongoDB", "Streamlit dashboard"], challenge: "The project architecture separates ingestion from processing, with retry logic listed as a fault-tolerance requirement." },
  vision: { steps: ["FastAPI service", "Character detection", "Recognition and vector embeddings"], challenge: "The repository layout separates raw datasets, labeled data, embeddings, and metadata." },
  quiz: { steps: ["Next.js quiz flow", "Monaco code editor", "Piston code execution", "Immediate feedback"], challenge: "The application combines multiple-choice, descriptive, and coding questions within the same flow." },
};

export const achievements = {
  contact: "First Contact",
  terminal: "Terminal Explorer",
  dossier: "Project Investigator",
  puzzle: "Puzzle Solver",
  curious: "Curious Mind",
};

export type Achievement = keyof typeof achievements;
