"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import "@/app/globals.css";

const links = [
  ["/#work", "Work"],
  ["/#about", "About"],
  ["/#playground", "Playground"],
  ["/writing", "Writing"],
  ["/logs", "Logs"],
  ["/#contact", "Contact"],
];

function subscribeHash(update: () => void) {
  window.addEventListener("hashchange", update);
  window.addEventListener("popstate", update);
  return () => {
    window.removeEventListener("hashchange", update);
    window.removeEventListener("popstate", update);
  };
}

export default function Navbar() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header className="site-header">
      <nav className="frame site-nav" aria-label="Primary" onKeyDown={event => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}>
        <Link href="/" className="brand" aria-label="Prakash L Waddar, home" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">P<span>.</span></span>
          <span className="brand-name">Prakash L Waddar</span>
        </Link>
        <button type="button" className="menu-toggle" aria-controls="site-links" aria-expanded={open} ref={toggle}
          onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"} <span aria-hidden="true">{open ? "−" : "+"}</span></button>
        <div className="nav-links" id="site-links" data-open={open}>
          {links.map(([href, label]) => {
            if (href.startsWith("/#")) {
              return <a key={href} href={pathname === "/" ? href.slice(1) : href} onClick={() => setOpen(false)}
                aria-current={pathname === "/" && href === "/" + hash ? "location" : undefined}>{label}</a>;
            }
            const active = href === pathname || pathname.startsWith(href + "/");
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>;
          })}
        </div>
      </nav>
    </header>
  );
}
