import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Prakash L Waddar | AI & Software Engineer",
  description:
    "AI and Software Engineer building proof-driven systems. Writing about algorithms, machine learning, and real-world engineering trade-offs.",
  openGraph: {
    title: "Prakash L Waddar | AI & Software Engineer",
    description:
      "Public engineering work, deep technical writing, and real-world system design.",
    // url: "https://your-domain.dev",
    siteName: "Prakash L Waddar",
    locale: "en_US",
    type: "website",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
