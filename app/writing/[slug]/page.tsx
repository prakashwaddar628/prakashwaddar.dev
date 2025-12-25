export const runtime = "nodejs"

import fs from "fs"
import path from "path"
import { MDXRemote } from "next-mdx-remote/rsc"

const writingDirectory = path.join(process.cwd(), "content/writing")

export default function WritingArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const filePath = path.join(writingDirectory, `${params.slug}.mdx`)
  const source = fs.readFileSync(filePath, "utf8")

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 prose">
      <MDXRemote source={source} />
    </main>
  )
}