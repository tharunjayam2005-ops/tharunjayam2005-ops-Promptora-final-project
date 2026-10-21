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

/** Clean markdown markers like **bold** for readable chat UI */
export function cleanAiText(text) {
  return String(text || "")
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, (match) => match.replace(/\s+/g, " "))
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}

export function friendlyModelError(message, modelLabel = "This model") {
  const msg = String(message || "").trim();
  const lower = msg.toLowerCase();
  const name = modelLabel || "This model";

  if (!msg) return `${name} failed to reply. Try another chat model.`;

  if (lower.includes("rerank")) {
    return `${name} is a rerank model, not for chat. Remove it and add a chat model.`;
  }
  if (lower.includes("video")) {
    return `${name} is a video model, not for chat. Remove it and add a chat model.`;
  }
  if (lower.includes("tts") || lower.includes("speech") || lower.includes("audio")) {
    return `${name} is an audio/TTS model, not for chat. Remove it and add a chat model.`;
  }
  if (lower.includes("not a chat") || lower.includes("cannot be used with the chat")) {
    return `${name} cannot be used for chat. Pick a chat model instead.`;
  }
  if (lower.includes("internal server error") || lower.includes("provider returned error")) {
    return `${name} had a provider error. Try again or choose another model.`;
  }
  if (lower.includes("rate limit") || lower.includes("429")) {
    return `${name} hit a rate limit. Wait a moment and try again.`;
  }
  if (lower.includes("api key") || lower.includes("unauthorized") || lower.includes("401")) {
    return `${name} needs a valid API key in Settings.`;
  }

  // Strip raw endpoint noise for cleaner UI
  return msg
    .replace(/Use the \/api\/v1\/\S+ endpoint instead\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function summarizeReplies(replies = []) {
  const ok = replies.filter((r) => !r.error && r.content).length;
  const failed = replies.filter((r) => r.error).length;
  if (failed === 0) return `${ok} response${ok === 1 ? "" : "s"} ready.`;
  if (ok === 0) return `All ${failed} model${failed === 1 ? "" : "s"} failed. Check models and keys.`;
  return `${ok} succeeded · ${failed} failed.`;
}
