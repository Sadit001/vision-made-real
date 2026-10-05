import { MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Letter = {
  id: string;
  message_body: string;
  is_read: boolean;
  created_at: string;
};

export function Envelope({ letter, index, onOpen }: { letter: Letter; index: number; onOpen: () => void }) {
  const date = new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(new Date(letter.created_at));
  return (
    <article className={`envelope-card envelope-variation-${index % 3}`}>
      <div className="envelope-border" aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-hand text-lg text-ink-faded">প্রাপক: আপনার চিঠির বাক্স</p>
          <p className="mt-8 text-sm text-muted-foreground">{date}</p>
        </div>
        <span className="postal-stamp">বাংলা<br />ডাক</span>
      </div>
      {!letter.is_read && <span className="new-seal">নতুন</span>}
      <Button variant="paper" className="mt-5 w-full" onClick={onOpen}>
        <MailOpen /> চিঠিটি খুলুন
      </Button>
    </article>
  );
}