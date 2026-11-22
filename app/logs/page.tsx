import { JournalIndex } from "@/components/Journal";

export const metadata = { title: "Engineering Logs" };

export default function Page() {
  return <JournalIndex collection="logs" />;
}
