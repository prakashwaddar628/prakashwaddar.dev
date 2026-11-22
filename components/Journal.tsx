import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { FaBookOpen } from "react-icons/fa6";

const collections = {
  writing: { name: "Writing", description: "Deep dives into algorithms, systems, and engineering decisions." },
  logs: { name: "Engineering Logs", description: "Weekly notes on what I’m building, what breaks, and what I’m learning." },
};

type Collection = keyof typeof collections;

function collectionDirectory(collection: Collection) {
  return path.join(process.cwd(), "content", collection);
}

export function getJournalEntry(collection: Collection, slug: string) {
  const file = path.join(collectionDirectory(collection), `${slug}.mdx`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) notFound();

  const source = fs.readFileSync(file, "utf8");
  const heading = source.match(/^# ([^\r\n]+)\r?\n?/);
  const fallback = slug.replace(/-/g, " ").replace(/\b\w/g, char => char.toUpperCase());
  const title = heading?.[1].trim() ?? (collection === "logs" ? `Engineering Log — ${fallback}` : fallback);
  return { title, source: heading ? source.slice(heading[0].length) : source };
}

export function JournalIndex({ collection }: { collection: Collection }) {
  const { name, description } = collections[collection];
  const slugs = fs.readdirSync(collectionDirectory(collection))
    .filter(file => file.endsWith(".mdx"))
    .map(file => file.slice(0, -4));
  return (
    <main className="frame archive" id="main-content">
      <p className="eyebrow">Journal</p>
      <h1>{name}<span>.</span></h1>
      <p className="archive-intro">{description}</p>
      <ul className="archive-list">
        {slugs.map(slug => (
          <li key={slug} data-reveal>
            <Link href={`/${collection}/${slug}`}>{getJournalEntry(collection, slug).title}<FaBookOpen aria-hidden="true" /></Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

export function JournalEntry({ collection, slug }: { collection: Collection; slug: string }) {
  const { title, source } = getJournalEntry(collection, slug);
  return (
    <main className="frame reading" id="main-content">
      <Link className="back-link" href={`/${collection}`}>Back to {collections[collection].name}</Link>
      <h1>{title}</h1>
      <article className="prose"><MDXRemote source={source} /></article>
    </main>
  );
}
