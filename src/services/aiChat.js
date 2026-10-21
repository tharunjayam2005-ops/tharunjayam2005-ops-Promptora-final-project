import { isChatCompatibleModel } from "../lib/aiModels";
import { cleanAiText, friendlyModelError } from "../lib/aiResponse";

async function callOpenRouter({ apiKey, model, messages }) {
  if (!isChatCompatibleModel(model)) {
    throw new Error(
      `${model} is not a chat model and cannot be used with chat completions.`
    );
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "Promptora AI Chat",
    },
    body: JSON.stringify({
      model,
      messages: messages.map((item) => ({
        ...item,
        content:
          item.role === "system"
            ? `${item.content}\n\nImportant: Reply in plain text only. Do not use markdown symbols like **, __, or # headings.`
            : item.content,
      })),
      temperature: 0.7,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenRouter error (${response.status})`);
  }

  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("OpenRouter returned an empty response.");
  return cleanAiText(text);
}

async function callGemini({ apiKey, model, messages }) {
  if (!isChatCompatibleModel(model)) {
    throw new Error(
      `${model} is not a chat model and cannot be used with chat completions.`
    );
  }

  const contents = messages
    .filter((item) => item.role !== "system")
    .map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    }));

  const systemInstruction = messages.find((item) => item.role === "system")?.content;
  const plainSystem = systemInstruction
    ? `${systemInstruction}\n\nImportant: Reply in plain text only. Do not use markdown symbols like **, __, or # headings.`
    : "Reply in plain text only. Do not use markdown symbols like **.";

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      systemInstruction: { parts: [{ text: plainSystem }] },
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini error (${response.status})`);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  if (!text) throw new Error("Gemini returned an empty response.");
  return cleanAiText(text);
}

export async function chatWithModel({ modelInfo, messages, keys }) {
  if (!modelInfo) throw new Error("Unknown model selected.");
  if (!isChatCompatibleModel(modelInfo.model)) {
    throw new Error(
      `${modelInfo.label || modelInfo.model} is not a chat model.`
    );
  }

  if (modelInfo.provider === "openrouter") {
    if (!keys.openrouter) {
      throw new Error("Add your OpenRouter API key in Settings first.");
    }
    return callOpenRouter({
      apiKey: keys.openrouter,
      model: modelInfo.model,
      messages,
    });
  }

  if (modelInfo.provider === "gemini") {
    if (!keys.gemini) {
      throw new Error("Add your Gemini API key in Settings first.");
    }
    return callGemini({
      apiKey: keys.gemini,
      model: modelInfo.model,
      messages,
    });
  }

  throw new Error("Unsupported provider.");
}

export async function chatWithManyModels({ modelIds, messages, keys, catalog }) {
  const uniqueIds = [...new Set(modelIds)];
  const byId = new Map((catalog || []).map((item) => [item.id, item]));

  const results = await Promise.allSettled(
    uniqueIds.map(async (modelId) => {
      const modelInfo = byId.get(modelId);
      if (!modelInfo) {
        throw new Error("Model not found in chat catalog.");
      }
      if (!isChatCompatibleModel(modelInfo.model)) {
        throw new Error(`${modelInfo.label} is not a chat model.`);
      }
      const content = await chatWithModel({ modelInfo, messages, keys });
      return { modelId, content };
    })
  );

  return uniqueIds.map((modelId, index) => {
    const modelInfo = byId.get(modelId);
    const label = modelInfo?.label || modelId;
    const result = results[index];
    if (result.status === "fulfilled") {
      return {
        modelId,
        content: cleanAiText(result.value.content),
        error: "",
      };
    }
    return {
      modelId,
      content: "",
      error: friendlyModelError(result.reason?.message, label),
    };
  });
}
