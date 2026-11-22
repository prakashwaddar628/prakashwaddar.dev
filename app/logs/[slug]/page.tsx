import { getJournalEntry, JournalEntry } from "@/components/Journal";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: getJournalEntry("logs", slug).title };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <JournalEntry collection="logs" slug={slug} />;
}
