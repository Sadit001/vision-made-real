import { useEffect, useState } from "react";
import { Copy, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Letter } from "./Envelope";

export function LetterViewer({ letter, onClose, onDelete }: { letter: Letter; onClose: () => void; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setOpened(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  async function share() {
    const text = `${letter.message_body}\n\n— চিঠির বাক্স`;
    if (navigator.share) await navigator.share({ title: "আমার পাওয়া একটি চিঠি", text });
    else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    }
  }

  return (
    <div className="letter-overlay" role="dialog" aria-modal="true" aria-label="খোলা চিঠি">
      <Button variant="ghostLight" size="icon" className="absolute right-4 top-4 z-30" onClick={onClose} aria-label="বন্ধ করুন"><X /></Button>
      <div className={`opening-stage ${opened ? "is-open" : ""}`}>
        <div className="opening-envelope"><div className="opening-flap" /><div className="opening-letter" /></div>
        <article className="letter-paper">
          <p className="mb-8 font-hand text-lg text-ink-faded">প্রিয় তুমি,</p>
          <div className="letter-message">{letter.message_body}</div>
          <p className="mt-10 text-right font-hand text-lg text-ink-faded">— নাম না জানা কেউ</p>
          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-ink/10 pt-5">
            <Button variant="paper" onClick={share}>{copied ? <Copy /> : <Share2 />}{copied ? "কপি হয়েছে" : "শেয়ার করুন"}</Button>
            <Button variant="ghost" onClick={onDelete}><Trash2 /> মুছে ফেলুন</Button>
          </div>
        </article>
      </div>
    </div>
  );
}