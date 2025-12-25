export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://localhost:3000/sitemap.xml", // Replace with your actual sitemap URL
  }
}