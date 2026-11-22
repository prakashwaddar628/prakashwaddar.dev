type Project = {
  name: string;
  category: string;
  description: string;
  tags: string[];
  color: string;
  art: string;
  source?: string;
  demo?: string;
};

const github = "https://github.com/prakashwaddar628/";

export const projects: Project[] = [
  { name: "VahanCircle", category: "Marketplace", description: "A marketplace for browsing vehicles and bringing buyers and sellers together.", tags: ["Web platform", "Vehicle listings"], color: "#d8ff70", art: "vehicle" },
  { name: "Project Pulse", category: "Developer tools", description: "An AI tool that turns GitHub activity into sprint summaries teams can review.", tags: ["GitHub", "Generative AI"], color: "#b8a7ff", art: "pulse" },
  { name: "Smart Resume Analyzer", category: "Applied NLP", description: "Compares a resume with a job description, highlights missing skills, and suggests courses to close those gaps.", tags: ["Python", "spaCy", "Streamlit", "Plotly"], color: "#80e9dc", art: "resume", source: github + "smart-resume-analyzer" },
  { name: "JobPulse", category: "Data engineering", description: "A job-market intelligence project designed to stream job data through Kafka, extract skills, and visualize trends.", tags: ["Python", "Kafka", "PostgreSQL", "MongoDB"], color: "#8abaff", art: "stream", source: github + "JobPulse" },
  { name: "LearnFlow", category: "Education", description: "An AI-powered learning platform that brings learning material and AI-assisted study into one experience.", tags: ["Generative AI", "Learning platform"], color: "#f5b6ea", art: "flow" },
  { name: "AI Test Case Generator", category: "Developer tools", description: "An AI tool for drafting test cases and giving developers a starting point for test coverage.", tags: ["Generative AI", "Test automation"], color: "#ffd791", art: "test" },
  { name: "Anime Characterizer", category: "Computer vision", description: "A computer vision project organized around anime character detection, recognition, and vector embeddings.", tags: ["FastAPI", "Computer vision", "Docker"], color: "#ffacbd", art: "vision", source: github + "anime_characterizer" },
  { name: "QuizN Code", category: "Education", description: "Combines multiple-choice questions and live programming exercises with an embedded code editor and immediate feedback.", tags: ["Next.js", "TypeScript", "Monaco", "Piston API"], color: "#b8cbff", art: "quiz", source: github + "QuizNCode" },
];
