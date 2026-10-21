import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { normalizeCustomModel } from "../lib/aiModels";

const LOCAL_KEYS = "promptora_ai_keys";

function emptyPayload() {
  return { openrouter: "", gemini: "", models: [] };
}

export function loadLocalApiKeys() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_KEYS) || "{}");
    return {
      openrouter: raw.openrouter || "",
      gemini: raw.gemini || "",
      models: Array.isArray(raw.models)
        ? raw.models.map(normalizeCustomModel).filter(Boolean)
        : [],
      source: "local",
    };
  } catch {
    return emptyPayload();
  }
}

export function saveLocalApiKeys(keys) {
  const payload = {
    openrouter: keys.openrouter?.trim() || "",
    gemini: keys.gemini?.trim() || "",
    models: Array.isArray(keys.models)
      ? keys.models.map(normalizeCustomModel).filter(Boolean)
      : [],
  };
  localStorage.setItem(LOCAL_KEYS, JSON.stringify(payload));
  return payload;
}

export async function fetchUserApiKeys() {
  if (!isSupabaseConfigured || !supabase) {
    return loadLocalApiKeys();
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return loadLocalApiKeys();
  }

  const { data, error } = await supabase
    .from("user_api_keys")
    .select("openrouter_key, gemini_key, custom_models")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error) {
    // Older DB without custom_models column — fall back
    if (String(error.message || "").includes("custom_models")) {
      const fallback = await supabase
        .from("user_api_keys")
        .select("openrouter_key, gemini_key")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (fallback.error) throw fallback.error;
      const local = loadLocalApiKeys();
      return {
        openrouter: fallback.data?.openrouter_key || "",
        gemini: fallback.data?.gemini_key || "",
        models: local.models || [],
        source: fallback.data ? "cloud" : "empty",
      };
    }
    throw error;
  }

  const local = loadLocalApiKeys();

  return {
    openrouter: data?.openrouter_key || local.openrouter || "",
    gemini: data?.gemini_key || local.gemini || "",
    models:
      Array.isArray(data?.custom_models) && data.custom_models.length
        ? data.custom_models.map(normalizeCustomModel).filter(Boolean)
        : local.models || [],
    source: data
      ? "cloud"
      : local.openrouter || local.gemini || local.models?.length
        ? "local"
        : "empty",
  };
}

export async function saveUserApiKeys({ openrouter, gemini, models }) {
  const payload = {
    openrouter: openrouter?.trim() || "",
    gemini: gemini?.trim() || "",
    models: Array.isArray(models)
      ? models.map(normalizeCustomModel).filter(Boolean)
      : [],
  };

  if (!isSupabaseConfigured || !supabase) {
    saveLocalApiKeys(payload);
    return { ...payload, source: "local" };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Please sign in to save API keys to your account.");
  }

  const row = {
    user_id: session.user.id,
    openrouter_key: payload.openrouter,
    gemini_key: payload.gemini,
    custom_models: payload.models,
    updated_at: new Date().toISOString(),
  };

  let { data, error } = await supabase
    .from("user_api_keys")
    .upsert(row, { onConflict: "user_id" })
    .select("openrouter_key, gemini_key, custom_models")
    .single();

  if (error && String(error.message || "").includes("custom_models")) {
    // Column missing — save keys only, keep models local
    const retry = await supabase
      .from("user_api_keys")
      .upsert(
        {
          user_id: session.user.id,
          openrouter_key: payload.openrouter,
          gemini_key: payload.gemini,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select("openrouter_key, gemini_key")
      .single();
    if (retry.error) throw retry.error;
    saveLocalApiKeys(payload);
    return {
      openrouter: retry.data.openrouter_key || "",
      gemini: retry.data.gemini_key || "",
      models: payload.models,
      source: "cloud+local-models",
    };
  }

  if (error) throw error;

  saveLocalApiKeys(payload);

  return {
    openrouter: data.openrouter_key || "",
    gemini: data.gemini_key || "",
    models: Array.isArray(data.custom_models)
      ? data.custom_models.map(normalizeCustomModel).filter(Boolean)
      : payload.models,
    source: "cloud",
  };
}
