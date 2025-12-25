export const runtime = "nodejs"

import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"

const writingDirectory = path.join(process.cwd(), "content/writing")


export function generateMetadata({ params }: { params: { slug: string } }) {
  const title = params.slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `${title} | Prakash L Waddar`,
    description:
      "Deep technical reasoning on algorithms, systems, and engineering decisions.",
  }
}

export default async function WritingArticlePage({
  params,
}: {
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params 
  const filePath = path.join(writingDirectory, `${slug}.mdx`)
  const source = fs.readFileSync(filePath, "utf8")

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose">
      <MDXRemote source={source} />
    </main>
  )
}