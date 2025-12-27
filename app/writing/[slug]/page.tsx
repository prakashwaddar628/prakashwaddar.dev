export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";

const writingDirectory = path.join(process.cwd(), "content/writing");

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(writingDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`MDX file not found: ${filePath}`);
  }

  const source = fs.readFileSync(filePath, "utf8");

  // Derive title from slug for the page header
  const title = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-blue-500/30">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Back Link */}
        <Link
          href="/writing"
          className="inline-flex items-center text-sm text-neutral-500 hover:text-blue-400 transition-colors mb-8 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to writing
        </Link>

        {/* Article Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-12">
          {title}
        </h1>

        {/* Prose Styling for MDX 
            - prose-invert: Optimizes text for dark backgrounds
            - prose-lg: Slightly larger text for better readability
            - prose-blue: Accents (links) are blue
        */}
        <article
          className="prose prose-invert prose-lg prose-neutral max-w-none 
          prose-headings:text-white prose-headings:font-bold
          prose-p:text-neutral-300 prose-p:leading-relaxed
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-code:text-blue-300 prose-code:bg-neutral-900 
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal
          prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
          prose-table:text-neutral-300
          prose-th:text-white prose-th:border-b prose-th:border-neutral-700 prose-th:p-2
          prose-td:border-b prose-td:border-neutral-800 prose-td:p-2
        "
        >
          <MDXRemote source={source} />
        </article>
      </main>
    </div>
  );
}
