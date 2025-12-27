import fs from "fs";
import path from "path";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const logsDirectory = path.join(process.cwd(), "content/logs");

export default function LogsPage() {
    const files = fs.readdirSync(logsDirectory)

    const logs = files.map((file) => {
        const slug = file.replace(".mdx", "");
        const title = slug
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

        return { slug, title };
    });

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-blue-500/30">
            <Navbar />
            
            {/* pt-32 ensures content clears the floating navbar */}
            <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-4">
                        Engineering Logs
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        Weekly notes on what I&lsquo;m building, what breaks, and what I&lsquo;m learning.
                    </p>
                </div>

                <ul className="flex flex-col">
                    {logs.map((log) => (
                        <li key={log.slug}>
                            <Link 
                                href={`/logs/${log.slug}`}
                                className="group flex items-center justify-between py-5 border-b border-neutral-800 hover:border-neutral-700 transition-colors duration-300"
                            >
                                <span className="text-lg font-medium text-neutral-300 group-hover:text-blue-400 transition-colors">
                                    {log.title}
                                </span>

                                {/* Arrow Icon - Slides in on hover */}
                                <svg 
                                    className="w-5 h-5 text-neutral-600 group-hover:text-blue-400 transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    )
}