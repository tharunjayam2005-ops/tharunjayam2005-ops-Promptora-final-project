export const AI_PROVIDERS = {
  openrouter: {
    id: "openrouter",
    label: "OpenRouter",
    keyLabel: "OpenRouter API key",
    docs: "https://openrouter.ai/keys",
    placeholder: "sk-or-v1-...",
  },
  gemini: {
    id: "gemini",
    label: "Gemini",
    keyLabel: "Gemini API key",
    docs: "https://aistudio.google.com/apikey",
    placeholder: "AIza...",
  },
};

/** Models that work with chat/completions only */
export const AI_MODELS = [
  {
    id: "openrouter:openai/gpt-4o-mini",
    provider: "openrouter",
    model: "openai/gpt-4o-mini",
    label: "GPT-4o Mini",
    badge: "OpenRouter",
    modality: "chat",
  },
  {
    id: "openrouter:openai/gpt-4o",
    provider: "openrouter",
    model: "openai/gpt-4o",
    label: "GPT-4o",
    badge: "OpenRouter",
    modality: "chat",
  },
  {
    id: "openrouter:anthropic/claude-3.5-sonnet",
    provider: "openrouter",
    model: "anthropic/claude-3.5-sonnet",
    label: "Claude 3.5 Sonnet",
    badge: "OpenRouter",
    modality: "chat",
  },
  {
    id: "openrouter:google/gemini-2.0-flash-001",
    provider: "openrouter",
    model: "google/gemini-2.0-flash-001",
    label: "Gemini 2.0 Flash",
    badge: "OpenRouter",
    modality: "chat",
  },
  {
    id: "openrouter:meta-llama/llama-3.1-8b-instruct",
    provider: "openrouter",
    model: "meta-llama/llama-3.1-8b-instruct",
    label: "Llama 3.1 8B",
    badge: "OpenRouter",
    modality: "chat",
  },
  {
    id: "openrouter:deepseek/deepseek-chat",
    provider: "openrouter",
    model: "deepseek/deepseek-chat",
    label: "DeepSeek Chat",
    badge: "OpenRouter",
    modality: "chat",
  },
  {
    id: "gemini:gemini-2.0-flash",
    provider: "gemini",
    model: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    badge: "Gemini",
    modality: "chat",
  },
  {
    id: "gemini:gemini-1.5-flash",
    provider: "gemini",
    model: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    badge: "Gemini",
    modality: "chat",
  },
  {
    id: "gemini:gemini-1.5-pro",
    provider: "gemini",
    model: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    badge: "Gemini",
    modality: "chat",
  },
];

const NON_CHAT_HINTS = [
  "video",
  "tts",
  "speech",
  "audio",
  "rerank",
  "reranker",
  "embed",
  "embedding",
  "image",
  "img2",
  "dall-e",
  "dalle",
  "seedream",
  "recraft",
  "hailuo",
  "whisper",
  "flux-3-video",
  "stable-diffusion",
  "midjourney",
  "vector",
  "asr",
  "vocal",
  "vocals",
];

export function isChatCompatibleModel(modelPath) {
  const value = String(modelPath || "").toLowerCase();
  if (!value) return false;
  return !NON_CHAT_HINTS.some((hint) => value.includes(hint));
}

export function normalizeCustomModel(entry) {
  if (!entry || typeof entry !== "object") return null;
  const provider = String(entry.provider || "").trim().toLowerCase();
  const model = String(entry.model || "").trim();
  if (!provider || !model || !AI_PROVIDERS[provider]) return null;

  const label =
    String(entry.label || "").trim() ||
    model.split("/").pop() ||
    model;
  const id = entry.id || `${provider}:${model}`;
  const modality = isChatCompatibleModel(model) ? "chat" : "other";

  return {
    id,
    provider,
    model,
    label,
    badge: AI_PROVIDERS[provider].label,
    custom: true,
    modality,
  };
}

export function getModelCatalog(customModels = []) {
  const customs = (customModels || []).map(normalizeCustomModel).filter(Boolean);
  const seen = new Set(AI_MODELS.map((m) => m.id));
  const uniqueCustoms = customs.filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
  return [...AI_MODELS, ...uniqueCustoms];
}

/** Only models safe for chat/completions */
export function getChatModelCatalog(customModels = []) {
  return getModelCatalog(customModels).filter(
    (item) => item.modality === "chat" && isChatCompatibleModel(item.model)
  );
}

export function getModelById(id, customModels = []) {
  if (!id) return null;
  return getModelCatalog(customModels).find((item) => item.id === id) || null;
}
