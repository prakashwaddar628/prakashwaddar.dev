import Navbar from "@/components/navbar/Navbar";
import fs from "fs";
import { MDXRemote } from "next-mdx-remote/rsc";
import path from "path";

const logsDirectory = path.join(process.cwd(), "content/logs");

export default async function LogsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const filePath = path.join(logsDirectory, `${slug}.mdx`);
  const source = fs.readFileSync(filePath, "utf8");

  return (
    <div>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12 prose">
        <MDXRemote source={source} />
      </main>
    </div>
  );
}
