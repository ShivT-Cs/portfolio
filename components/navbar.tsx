"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { profile } from "@/content/profile";

const navLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#expertise", label: "Expertise" },
  { href: "/#projects", label: "Projects" },
  { href: "/#experience", label: "Experience" },
  { href: "/consultancy", label: "Consultancy" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="#home" className="text-base font-semibold tracking-wide text-ink">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-1 py-1 text-sm text-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={profile.resumePath}
            className="rounded-full border border-accent/70 px-4 py-2 text-sm font-medium text-ink transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            download
          >
            Download Resume
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-white/20 p-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open ? (
        <nav id="mobile-menu" className="border-t border-white/10 bg-[#090d1a] px-4 py-4 md:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-md px-2 py-3 text-base text-muted transition hover:bg-white/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={profile.resumePath}
                className="inline-flex min-h-[44px] items-center rounded-full border border-accent/70 px-4 py-2 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                download
              >
                Download Resume
              </a>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
