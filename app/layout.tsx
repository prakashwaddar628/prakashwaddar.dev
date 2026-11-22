import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PortfolioMotion from "@/components/PortfolioMotion";
import "./globals.css";

const name = "Prakash L Waddar";
const title = `${name} | Software & AI Engineer`;
const description = "Prakash L Waddar builds full-stack applications and AI-powered tools, and writes about systems, algorithms, and engineering decisions.";

export const metadata: Metadata = {
  metadataBase: new URL("https://prakash-l-waddar.vercel.app"),
  title: { default: title, template: `%s | ${name}` },
  description,
  openGraph: { title, description, siteName: name, locale: "en_US", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Navbar />
        {children}
        <footer className="frame site-footer">
          <Link href="/">{name}</Link>
          <Link href="/#contact">Contact</Link>
        </footer>
        <PortfolioMotion />
      </body>
    </html>
  );
}
