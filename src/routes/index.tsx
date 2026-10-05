import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import scene from "@/assets/chithir-baksho-scene.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "চিঠির বাক্স — না-বলা কথার ঠিকানা" }, { name: "description", content: "পুরোনো বাংলার চিঠির আবেশে পরিচয় প্রকাশ না করে মনের কথা লিখুন ও গ্রহণ করুন।" },
    { property: "og:title", content: "চিঠির বাক্স — না-বলা কথার ঠিকানা" }, { property: "og:description", content: "কিছু কথা বলা যায় না, শুধু চিঠিতে লেখা যায়।" }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  const [intro, setIntro] = useState(true);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setIntro(false); return; } const timer = window.setTimeout(() => setIntro(false), 5000); return () => window.clearTimeout(timer); }, []);
  return <main className={`landing-scene ${intro ? "intro-playing" : "intro-finished"}`} style={{ backgroundImage: `url(${scene})` }}><div className="landing-shade" /><div className="film-grain" aria-hidden="true" />{Array.from({ length: 12 }).map((_, index) => <i key={index} className={`falling-flower flower-${index + 1}`} aria-hidden="true">✣</i>)}<button className="skip-intro" onClick={() => setIntro(false)}>এড়িয়ে যান</button><section className="landing-copy"><p className="landing-kicker">হারিয়ে যাওয়া কথার ঠিকানা</p><h1>চিঠির বাক্স</h1><p className="landing-verse">কিছু কথা বলা যায় না,<br />শুধু চিঠিতে লেখা যায়।</p><Button variant="postbox" size="lg" asChild><Link to="/auth">আপনার ঠিকানা খুলুন <ArrowRight /></Link></Button></section><div className="landing-note">বাংলার পুরোনো ডাকবাক্সের স্মৃতিতে</div></main>;
}
