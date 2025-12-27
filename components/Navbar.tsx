'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <nav className="flex items-center gap-2 rounded-full border border-gray-200/50 bg-white/70 px-4 py-2 shadow-lg shadow-gray-200/20 backdrop-blur-xl transition-all hover:border-gray-300/50 hover:shadow-xl">
        
        {/* Logo Area */}
        <Link 
          href="/" 
          className="mr-4 flex items-center gap-1 px-2 text-lg font-bold tracking-tight text-gray-900 transition-opacity hover:opacity-70"
        >
          Prakash<span className="text-blue-600">.</span>
        </Link>

        {/* Separator */}
        <div className="h-5 w-[1px] bg-gray-200" />

        {/* Links Area */}
        <div className="flex items-center gap-1 pl-2">
          <NavLink href="/writing" active={pathname === '/writing'}>
            Writing
          </NavLink>
          <NavLink href="/logs" active={pathname === '/logs'}>
            Logs
          </NavLink>
        </div>

        {/* Optional: CTA Button (Trends often include a small action button) */}
        <div className="ml-2 pl-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white transition-transform hover:scale-110 active:scale-95">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
        </div>
      </nav>
    </div>
  );
}

// Helper component for links with "Pill" active state
function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-4 py-1.5 text-sm font-medium transition-all duration-300 ease-out rounded-full ${
        active
          ? 'text-gray-900 bg-white shadow-sm ring-1 ring-gray-200' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
      }`}
    >
      {children}
    </Link>
  );
}