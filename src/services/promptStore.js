import { supabase } from "../lib/supabase";
import { normalizePromptRow } from "../lib/prompts";

const TABLE = "prompts";

async function requireSessionUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user?.id) {
    throw new Error("Please sign in again before saving prompts.");
  }

  return session.user.id;
}

export async function fetchCloudPrompts() {
  await requireSessionUserId();

  const { data, error } = await supabase
    .from(TABLE)
    .select("id, title, idea, model, audience, style, tone, prompt, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(normalizePromptRow);
}

export async function saveCloudPrompt(entry) {
  const userId = await requireSessionUserId();

  const payload = {
    user_id: userId,
    title: entry.title,
    idea: entry.idea,
    model: entry.model,
    audience: entry.audience,
    style: entry.style,
    tone: entry.tone,
    prompt: entry.prompt,
  };

  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("id, title, idea, model, audience, style, tone, prompt, created_at")
    .single();

  if (error) throw error;
  return normalizePromptRow(data);
}

export async function deleteCloudPrompt(id) {
  await requireSessionUserId();

  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}
