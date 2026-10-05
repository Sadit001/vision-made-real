import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ensureMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string; phone?: string }) => z.object({ email: z.string().email(), phone: z.string().max(30).optional() }).parse(input))
  .handler(async ({ data, context }) => {
    const existing = await context.supabase.from("profiles").select("*").eq("id", context.userId).maybeSingle();
    if (existing.data) return existing.data;
    const created = await context.supabase.from("profiles").insert({ id: context.userId, email: data.email, phone: data.phone ?? null }).select("*").single();
    if (created.error) throw created.error;
    return created.data;
  });

export const getMyLetters = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.from("messages").select("id,message_body,is_read,created_at").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  });

export const markLetterRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.from("messages").update({ is_read: true }).eq("id", data.id).eq("recipient_id", context.userId);
    if (result.error) throw result.error;
    return { ok: true };
  });

export const deleteLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const result = await context.supabase.from("messages").delete().eq("id", data.id).eq("recipient_id", context.userId);
    if (result.error) throw result.error;
    return { ok: true };
  });

export const resolveRecipient = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().regex(/^[a-f0-9]{16}$/) }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const url = process.env['SUPABASE_URL']!;
    const response = await fetch(`${url}/rest/v1/rpc/resolve_letter_recipient`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ slug_input: data.slug }),
    });
    if (!response.ok) throw new Error("ঠিকানাটি খুঁজে পাওয়া গেল না");
    return (await response.json()) as string | null;
  });

export const sendAnonymousLetter = createServerFn({ method: "POST" })
  .inputValidator((input: { slug: string; message: string; website?: string }) => z.object({ slug: z.string().regex(/^[a-f0-9]{16}$/), message: z.string().trim().min(1).max(1200), website: z.string().max(0).optional() }).parse(input))
  .handler(async ({ data }) => {
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']!;
    const url = process.env['SUPABASE_URL']!;
    const headers = { apikey: key, "Content-Type": "application/json" };
    const recipientResponse = await fetch(`${url}/rest/v1/rpc/resolve_letter_recipient`, { method: "POST", headers, body: JSON.stringify({ slug_input: data.slug }) });
    const recipient = recipientResponse.ok ? await recipientResponse.json() as string | null : null;
    if (!recipient) throw new Error("চিঠির ঠিকানাটি সঠিক নয়।");
    const insert = await fetch(`${url}/rest/v1/messages`, { method: "POST", headers: { ...headers, Prefer: "return=minimal" }, body: JSON.stringify({ recipient_id: recipient, message_body: data.message }) });
    if (!insert.ok) throw new Error("চিঠিটি পৌঁছাতে একটু সমস্যা হচ্ছে। আবার চেষ্টা করুন।");
    return { ok: true };
  });