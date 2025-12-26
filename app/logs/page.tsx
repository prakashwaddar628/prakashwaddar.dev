import fs from "fs";
import path from "path";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";

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
        <div>
            <Navbar />
        <main className="max-w-3xl mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-4">Engineering Logs</h1>

            <p className="text-gray-600 mb-8">
                Weekly notes on what I&lsquo;m building, what breaks, and what I&lsquo;m learning.
            </p>

            <ul className="space-y-4">
                {logs.map((log) => (
                    <li key={log.slug}>
                        <Link 
                        className="text-blue-600 hover:underline"
                        href={`/logs/${log.slug}`}>
                            {log.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
        </div>
    )
}