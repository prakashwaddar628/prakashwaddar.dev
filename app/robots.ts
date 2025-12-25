/*
    this robots.ts file is used to configure the robots.txt for the website.
    It specifies the rules for web crawlers and search engines on how to index the site.
*/

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://localhost:3000/sitemap.xml", // Replace with your actual sitemap URL
  }
}