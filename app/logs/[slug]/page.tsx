export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import path from "path";
import { FaArrowLeft } from "react-icons/fa6";

const logsDirectory = path.join(process.cwd(), "content/logs");

export default async function LogsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(logsDirectory, `${slug}.mdx`);
  
  // Basic error handling if file doesn't exist
  if (!fs.existsSync(filePath)) {
    throw new Error(`Log file not found: ${slug}`);
  }
  
  const source = fs.readFileSync(filePath, "utf8");

  // Format title from slug for the display header
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-blue-500/30 font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back Link */}
        <Link 
          href="/logs"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-blue-400 transition-colors mb-8 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to logs
        </Link>

        {/* Log Title */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-10">
          {title}
        </h1>

        {/* Prose Configuration:
            - prose-invert: Dark mode text colors
            - prose-neutral: Neutral gray scale
            - prose-lg: Larger font size for reading comfort
        */}
        <article className="prose prose-invert prose-lg prose-neutral max-w-none 
          prose-headings:text-white prose-headings:font-semibold
          prose-p:text-neutral-300 prose-p:leading-relaxed
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-code:text-blue-300 prose-code:bg-neutral-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
          prose-hr:border-neutral-800
          prose-blockquote:border-l-blue-500 prose-blockquote:text-neutral-400
        ">
          <MDXRemote source={source} />
        </article>
      </main>
    </div>
  );
}