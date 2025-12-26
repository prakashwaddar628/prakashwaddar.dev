import Link from "next/link"
import fs from "fs"
import path from "path"
import Navbar from "@/components/navbar/Navbar"

const writingDirectory = path.join(process.cwd(), "content/writing")

export default function WritingPage() {
  const files = fs.readdirSync(writingDirectory)

  const articles = files.map((file) => {
    const slug = file.replace(".mdx", "")
    const title = slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())

    return { slug, title }
  })

  return (
    <div>
      <Navbar />
    
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Writing</h1>

      <p className="text-gray-600 mb-8">
        Deep dives into algorithms, systems, and engineering decisions.
      </p>

      <ul className="space-y-4">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/writing/${article.slug}`}
              className="text-blue-600 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
    </div>
  )
}
