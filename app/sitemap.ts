/*
    this sitemap.ts file is used to generate the sitemap for the website.
    It dynamically reads the content from the writing and logs directories
    and constructs the sitemap entries accordingly.
*/

import fs from "fs"
import path from "path"

export default function sitemap() {
  const baseUrl = "https://prakash-l-waddar.vercel.app/" // Replace with your actual base URL

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
