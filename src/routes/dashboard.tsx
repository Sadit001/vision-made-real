import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Copy, Inbox, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProtectedPage } from "@/components/ProtectedPage";
import { useServerFn } from "@tanstack/react-start";
import { ensureMyProfile, getMyLetters } from "@/lib/letters.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "আমার চিঠির ঠিকানা — চিঠির বাক্স" }, { name: "description", content: "নিজের গোপন চিঠির ঠিকানা শেয়ার করুন এবং নতুন চিঠির অপেক্ষায় থাকুন।" },
    { property: "og:title", content: "আমার চিঠির ঠিকানা — চিঠির বাক্স" }, { property: "og:description", content: "নিজের গোপন চিঠির ঠিকানা শেয়ার করুন।" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: DashboardRoute,
});

function DashboardRoute() { return <ProtectedPage>{(user) => <Dashboard userEmail={user.email ?? ""} phone={String(user.user_metadata.phone ?? "")} />}</ProtectedPage>; }

function Dashboard({ userEmail, phone }: { userEmail: string; phone: string }) {
  const ensure = useServerFn(ensureMyProfile); const loadLetters = useServerFn(getMyLetters);
  const [slug, setSlug] = useState(""); const [counts, setCounts] = useState({ total: 0, unread: 0 }); const [copied, setCopied] = useState(false);
  useEffect(() => { Promise.all([ensure({ data: { email: userEmail, phone } }), loadLetters()]).then(([profile, letters]) => { setSlug(profile.unique_slug); setCounts({ total: letters.length, unread: letters.filter((letter) => !letter.is_read).length }); }); }, [ensure, loadLetters, phone, userEmail]);
  const url = typeof window === "undefined" || !slug ? "" : `${window.location.origin}/u/${slug}`;
  async function copy() { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  async function share() { if (navigator.share) await navigator.share({ title: "আমাকে একটি চিঠি লিখুন", text: "মনের না-বলা কথাটি লিখে পাঠান।", url }); else await copy(); }
  return <main className="desk-page"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16"><p className="font-hand text-xl text-primary">আপনার ব্যক্তিগত ডাকঘর</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">আপনার চিঠির বাক্স</h1><div className="mt-9 grid gap-8 lg:grid-cols-[1.25fr_.75fr]"><section className="address-paper"><p className="text-sm text-muted-foreground">এটাই আপনার চিঠির ঠিকানা</p><p className="mt-4 break-all font-display text-2xl text-ink">{url || "ঠিকানা তৈরি হচ্ছে…"}</p><div className="mt-7 flex flex-wrap gap-3"><Button variant="postbox" onClick={copy} disabled={!url}><Copy />{copied ? "কপি হয়েছে" : "লিংক কপি করুন"}</Button><Button variant="paper" onClick={share} disabled={!url}><Share2 /> শেয়ার করুন</Button></div><p className="mt-8 max-w-lg text-sm leading-7 text-muted-foreground">এই ঠিকানাটি যাকে ইচ্ছা পাঠান। তিনি পরিচয় প্রকাশ না করেই আপনাকে একটি চিঠি লিখতে পারবেন।</p></section><aside className="letter-stats"><div><strong>{counts.unread}</strong><span>নতুন চিঠি</span></div><div><strong>{counts.total}</strong><span>সব চিঠি</span></div><Button variant="postbox" size="lg" className="mt-4 w-full" asChild><Link to="/inbox"><Inbox /> ইনবক্স খুলুন</Link></Button></aside></div></div></main>;
}