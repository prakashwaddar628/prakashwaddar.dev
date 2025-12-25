import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"

const writingDirectory = path.join(process.cwd(), "content/writing")

export default async function WritingArticlePage({
  params,
}: {
  // FIX 1: Update the type to Promise
  params: Promise<{ slug: string }> 
}) {
  // FIX 2: Await the params before using properties
  const { slug } = await params 

  // Now 'slug' is a string (e.g., 'week-1') instead of undefined
  const filePath = path.join(writingDirectory, `${slug}.mdx`)
  const source = fs.readFileSync(filePath, "utf8")

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose">
      <MDXRemote source={source} />
    </main>
  )
}