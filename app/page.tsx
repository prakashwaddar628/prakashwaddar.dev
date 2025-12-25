import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center
     justify-center bg-zinc-50 font-sans dark:bg-black">
      <nav className="text-white flex justify-between">
        <Link href="/writing" className="mx-4">Writing</Link>
        <Link href="/logs">Logs</Link>
      </nav>
    </div>
  );
}
