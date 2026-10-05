import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3 text-foreground" aria-label="চিঠির বাক্স — প্রচ্ছদ">
      <span className="grid size-9 place-items-center rounded-full border border-primary/35 bg-primary/10 text-primary transition-transform group-hover:-rotate-6">
        <Mail className="size-4" />
      </span>
      <span className={compact ? "font-display text-xl" : "font-display text-2xl"}>চিঠির বাক্স</span>
    </Link>
  );
}