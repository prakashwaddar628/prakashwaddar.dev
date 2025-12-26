'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo Area */}
        <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 hover:opacity-75 transition-opacity">
          Prakash<span className="text-blue-600">.</span>
        </Link>

        {/* Links Area */}
        <div className="flex gap-8 text-sm font-medium">
          <NavLink href="/writing" active={pathname === '/writing'}>Writing</NavLink>
          <NavLink href="/logs" active={pathname === '/logs'}>Logs</NavLink>
        </div>
      </div>
    </nav>
  );
}

// Helper component for links
function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={`transition-colors duration-200 ${
        active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  );
}