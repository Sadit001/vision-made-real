import { Link, useNavigate } from "@tanstack/react-router";
import { Inbox, Link2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Brand } from "./Brand";

export function AppNav() {
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="relative z-20 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Brand compact />
        <nav className="flex items-center gap-1" aria-label="প্রধান নেভিগেশন">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard"><Link2 /> <span className="hidden sm:inline">আমার ঠিকানা</span></Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/inbox"><Inbox /> <span className="hidden sm:inline">ইনবক্স</span></Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={signOut} title="লগআউট" aria-label="লগআউট">
            <LogOut />
          </Button>
        </nav>
      </div>
    </header>
  );
}