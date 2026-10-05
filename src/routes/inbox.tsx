import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { ProtectedPage } from "@/components/ProtectedPage";
import { Envelope, type Letter } from "@/components/Envelope";
import { LetterViewer } from "@/components/LetterViewer";
import { deleteLetter, getMyLetters, markLetterRead } from "@/lib/letters.functions";

export const Route = createFileRoute("/inbox")({
  head: () => ({ meta: [
    { title: "ইনবক্স — চিঠির বাক্স" }, { name: "description", content: "আপনার কাছে আসা নামহীন চিঠিগুলো খুলে পড়ুন।" },
    { property: "og:title", content: "ইনবক্স — চিঠির বাক্স" }, { property: "og:description", content: "আপনার কাছে আসা নামহীন চিঠিগুলো খুলে পড়ুন।" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: () => <ProtectedPage>{() => <InboxPage />}</ProtectedPage>,
});

function InboxPage() {
  const fetchLetters = useServerFn(getMyLetters); const readLetter = useServerFn(markLetterRead); const removeLetter = useServerFn(deleteLetter);
  const [letters, setLetters] = useState<Letter[]>([]); const [loading, setLoading] = useState(true); const [selected, setSelected] = useState<Letter | null>(null);
  useEffect(() => { fetchLetters().then((data) => setLetters(data)).finally(() => setLoading(false)); }, [fetchLetters]);
  async function open(letter: Letter) { setSelected(letter); if (!letter.is_read) { await readLetter({ data: { id: letter.id } }); setLetters((items) => items.map((item) => item.id === letter.id ? { ...item, is_read: true } : item)); } }
  async function remove() { if (!selected) return; await removeLetter({ data: { id: selected.id } }); setLetters((items) => items.filter((item) => item.id !== selected.id)); setSelected(null); }
  return <main className="inbox-page"><div className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><p className="font-hand text-xl text-primary">আপনার নামে জমে থাকা কথা</p><div className="mt-2 flex items-end justify-between gap-4"><h1 className="font-display text-4xl sm:text-5xl">ইনবক্স</h1><p className="text-sm text-muted-foreground">{letters.filter((item) => !item.is_read).length}টি অপঠিত</p></div>{loading ? <div className="postal-loader min-h-72"><span>খামগুলো সাজানো হচ্ছে…</span></div> : letters.length === 0 ? <div className="empty-inbox"><Mail /><h2>আপনার চিঠির বাক্স এখনো খালি।</h2><p>আপনার চিঠির ঠিকানাটি শেয়ার করুন।<br />হয়তো কোথাও কেউ আপনার জন্য কিছু লিখে রেখেছে।</p></div> : <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">{letters.map((letter, index) => <Envelope key={letter.id} letter={letter} index={index} onOpen={() => open(letter)} />)}</div>}</div>{selected && <LetterViewer letter={selected} onClose={() => setSelected(null)} onDelete={remove} />}</main>;
}