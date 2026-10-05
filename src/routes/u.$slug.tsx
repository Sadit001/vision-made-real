import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/Brand";
import { resolveRecipient, sendAnonymousLetter } from "@/lib/letters.functions";

export const Route = createFileRoute("/u/$slug")({
  loader: async ({ params }) => resolveRecipient({ data: { slug: params.slug } }),
  head: () => ({ meta: [
    { title: "একটি চিঠি লিখুন — চিঠির বাক্স" }, { name: "description", content: "পরিচয় প্রকাশ না করে মনের না-বলা কথাটি চিঠিতে লিখে পাঠান।" },
    { property: "og:title", content: "একটি চিঠি লিখুন — চিঠির বাক্স" }, { property: "og:description", content: "পরিচয় প্রকাশ না করে মনের না-বলা কথাটি লিখে পাঠান।" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ComposerPage,
});

function ComposerPage() {
  const { slug } = Route.useParams(); const recipient = Route.useLoaderData(); const sendLetter = useServerFn(sendAnonymousLetter);
  const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  async function submit(event: FormEvent) { event.preventDefault(); if (!recipient) return; setBusy(true); setError(""); try { await sendLetter({ data: { slug, message, website: "" } }); setSent(true); } catch { setError("চিঠিটি পৌঁছাতে একটু সমস্যা হচ্ছে। আবার চেষ্টা করুন।"); } finally { setBusy(false); } }
  if (!recipient) return <main className="composer-page"><div className="absolute left-5 top-5"><Brand /></div><div className="invalid-address"><h1>এই চিঠির ঠিকানাটি খুঁজে পাওয়া গেল না।</h1><p>চিঠির ঠিকানাটি সঠিক নয়।</p></div></main>;
  return <main className="composer-page"><div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-7"><Brand /></div>{sent ? <div className="sent-letter"><div className="sealed-envelope"><span>চিঠির বাক্স</span></div><h1>চিঠিটি পৌঁছে গেছে।</h1><p>আপনার মনের কথাটি এখন একটি খামের ভেতর নিরাপদে অপেক্ষা করছে।</p></div> : <section className="composer-wrap"><p className="font-hand text-xl text-primary">না-বলা কথাটুকু লিখে রাখুন</p><h1 className="mt-2 font-display text-4xl sm:text-5xl">একটি চিঠি লিখুন</h1><p className="mt-3 text-muted-foreground">আপনার মনের কথাগুলো লিখে পাঠান।<br />আপনার পরিচয় প্রাপকের কাছে প্রকাশ করা হবে না।</p><form onSubmit={submit} className="mt-8"><div className="writing-paper"><textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1200} required aria-label="চিঠির বক্তব্য" placeholder="আপনার মনের কথাগুলো লিখুন..." /><span>{message.length.toLocaleString("bn-BD")} / ১২০০</span><input className="hidden" name="website" tabIndex={-1} autoComplete="off" /></div>{error && <p className="mt-3 text-sm text-destructive">{error}</p>}<Button variant="postbox" size="lg" className="mt-5 w-full sm:w-auto" disabled={busy || !message.trim()}><Send />{busy ? "চিঠি পাঠানো হচ্ছে…" : "চিঠি পাঠান"}</Button></form></section>}</main>;
}