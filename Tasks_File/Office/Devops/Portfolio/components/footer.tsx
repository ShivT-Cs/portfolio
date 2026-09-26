import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-6">
        <p>{profile.name}</p>
        <p>{profile.role}</p>
        <p>(c) {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
}
