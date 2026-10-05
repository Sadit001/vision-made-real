import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AppNav } from "./AppNav";

export function ProtectedPage({ children }: { children: (user: User) => ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (!data.user) void navigate({ to: "/auth", replace: true });
      else setUser(data.user);
      setChecking(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) void navigate({ to: "/auth", replace: true });
      else setUser(session.user);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  if (checking || !user) {
    return <div className="postal-loader"><span>চিঠির ঠিকানা খোঁজা হচ্ছে…</span></div>;
  }

  return <div className="min-h-screen bg-background"><AppNav />{children(user)}</div>;
}