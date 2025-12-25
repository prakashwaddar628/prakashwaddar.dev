import type { NextConfig } from "next"
import nextMDX from "@next/mdx"

const withMDX = nextMDX({
  extension: /\.mdx?$/
})

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
}

export default withMDX(nextConfig)