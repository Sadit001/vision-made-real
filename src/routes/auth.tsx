import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Brand } from "@/components/Brand";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "লগইন — চিঠির বাক্স" },
    { name: "description", content: "আপনার ব্যক্তিগত চিঠির বাক্সে প্রবেশ করুন অথবা নতুন ঠিকানা তৈরি করুন।" },
    { property: "og:title", content: "লগইন — চিঠির বাক্স" },
    { property: "og:description", content: "আপনার ব্যক্তিগত চিঠির বাক্সে প্রবেশ করুন।" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) void navigate({ to: "/dashboard", replace: true }); });
  }, [navigate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage("ইমেইল অথবা পাসওয়ার্ডটি সঠিক নয়।");
      else await navigate({ to: "/dashboard" });
    } else {
      const phone = String(form.get("phone") ?? "");
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { phone } } });
      if (error) setMessage(error.message.includes("registered") ? "এই ইমেইলে ইতিমধ্যে একটি ঠিকানা আছে।" : "অ্যাকাউন্টটি তৈরি করা গেল না। আবার চেষ্টা করুন।");
      else if (!data.session) setMessage("নিশ্চিতকরণ চিঠি পাঠানো হয়েছে। ইমেইলটি দেখে ঠিকানা নিশ্চিত করুন।");
      else await navigate({ to: "/dashboard" });
    }
    setBusy(false);
  }

  async function googleLogin() {
    setBusy(true); setMessage("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setMessage("Google দিয়ে প্রবেশ করা গেল না।"); setBusy(false); return; }
    if (!result.redirected) await navigate({ to: "/dashboard" });
  }

  return (
    <main className="auth-scene">
      <div className="auth-scrim" />
      <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-7"><Brand /></div>
      <section className="auth-paper" aria-labelledby="auth-title">
        <p className="font-hand text-lg text-primary">পুরোনো ঠিকানায় ফিরে আসুন</p>
        <h1 id="auth-title" className="mt-2 font-display text-4xl text-ink">{mode === "login" ? "আপনার চিঠির বাক্স" : "নতুন চিঠির ঠিকানা"}</h1>
        <div className="mt-7 grid grid-cols-2 border-b border-ink/15">
          <button className={`auth-tab ${mode === "login" ? "is-active" : ""}`} onClick={() => { setMode("login"); setMessage(""); }}>লগইন</button>
          <button className={`auth-tab ${mode === "register" ? "is-active" : ""}`} onClick={() => { setMode("register"); setMessage(""); }}>নতুন অ্যাকাউন্ট</button>
        </div>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <label className="paper-field"><Mail /><span>ইমেইল</span><input name="email" type="email" required autoComplete="email" placeholder="আপনার ইমেইল" /></label>
          {mode === "register" && <label className="paper-field"><Phone /><span>মোবাইল নম্বর</span><input name="phone" type="tel" required autoComplete="tel" placeholder="০১XXXXXXXXX" /></label>}
          <label className="paper-field"><span className="font-bold">✦</span><span>পাসওয়ার্ড</span><input name="password" type={showPassword ? "text" : "password"} minLength={6} required autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="অন্তত ৬ অক্ষর" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="পাসওয়ার্ড দেখুন">{showPassword ? <EyeOff /> : <Eye />}</button></label>
          {message && <p className="rounded-sm bg-muted px-3 py-2 text-sm text-ink-faded" role="status">{message}</p>}
          <Button variant="postbox" size="lg" className="w-full" disabled={busy}>{busy ? "একটু অপেক্ষা করুন…" : mode === "login" ? "চিঠির বাক্স খুলুন" : "ঠিকানা তৈরি করুন"}</Button>
        </form>
        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />অথবা<span className="h-px flex-1 bg-border" /></div>
        <Button variant="paper" size="lg" className="w-full" onClick={googleLogin} disabled={busy}>G&nbsp;&nbsp; Google দিয়ে এগিয়ে যান</Button>
      </section>
    </main>
  );
}