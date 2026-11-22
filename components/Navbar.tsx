"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/#work", "Work"],
  ["/#about", "About"],
  ["/writing", "Writing"],
  ["/logs", "Logs"],
  ["/#contact", "Contact"],
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <nav className="frame site-nav" aria-label="Primary">
        <Link href="/" className="brand" aria-label="Prakash L Waddar, home">
          <span className="brand-mark" aria-hidden="true">P<span>.</span></span>
          <span className="brand-name">Prakash L Waddar</span>
        </Link>
        <div className="nav-links">
          {links.map(([href, label]) => (
            <Link key={href} href={href} aria-current={href === pathname ? "page" : undefined}
              className={pathname.startsWith(href + "/") ? "active" : undefined}>{label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
