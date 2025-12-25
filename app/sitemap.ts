import fs from "fs"
import path from "path"

export default function sitemap() {
  const baseUrl = "https://localhost:3000" // Replace with your actual base URL

  const writingDir = path.join(process.cwd(), "content/writing")
  const logsDir = path.join(process.cwd(), "content/logs")

  const writingPages = fs
    .readdirSync(writingDir)
    .map((file) => ({
      url: `${baseUrl}/writing/${file.replace(".mdx", "")}`,
      lastModified: new Date(),
    }))

  const logPages = fs
    .readdirSync(logsDir)
    .map((file) => ({
      url: `${baseUrl}/logs/${file.replace(".mdx", "")}`,
      lastModified: new Date(),
    }))

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/writing`, lastModified: new Date() },
    { url: `${baseUrl}/logs`, lastModified: new Date() },
    ...writingPages,
    ...logPages,
  ]
}
