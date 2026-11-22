import { JournalIndex } from "@/components/Journal";

export const metadata = { title: "Writing" };

export default function Page() {
  return <JournalIndex collection="writing" />;
}
