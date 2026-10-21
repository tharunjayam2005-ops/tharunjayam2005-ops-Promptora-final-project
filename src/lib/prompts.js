const STORAGE_KEY = "promptora_library";

export const STYLE_MAP = {
  simple: "Keep language clear and beginner-friendly.",
  detailed: "Include rich detail, structure, constraints, and concrete examples.",
  creative: "Lean into imaginative, vivid, and unexpected ideas.",
  academic: "Use precise, educational, and structured wording.",
};

export const TONE_MAP = {
  friendly: "warm and approachable",
  professional: "polished and professional",
  playful: "playful and light",
  calm: "calm and reassuring",
};

export const AUDIENCE_MAP = {
  students: "students learning a topic",
  teachers: "teachers preparing lessons",
  kids: "curious kids (ages 8–12), safe and simple",
  general: "a general audience of all ages",
};

export const LENGTH_MAP = {
  short: "Keep the result concise.",
  medium: "Aim for a balanced medium length.",
  long: "Provide a thorough, longer result.",
};

export const IDEA_EXAMPLES = [
  {
    id: "story",
    label: "Robot story",
    model: "text",
    idea: "A short story about a robot learning to paint with kids in an art classroom",
    extras: "About 300 words, hopeful ending",
  },
  {
    id: "lesson",
    label: "Lesson plan",
    model: "text",
    idea: "A beginner lesson explaining photosynthesis for grade 6 students",
    extras: "Include warm-up, activity, and 3 quiz questions",
  },
  {
    id: "poster",
    label: "Poster image",
    model: "image",
    idea: "A bright educational poster about recycling for a school hallway",
    extras: "Clean vector look, teal and violet accents, readable title space",
  },
  {
    id: "scene",
    label: "Night library",
    model: "image",
    idea: "A magical floating night library with soft violet lanterns and books drifting in the air",
    extras: "Cinematic lighting, wide composition, child-safe fantasy mood",
  },
  {
    id: "video",
    label: "Science video",
    model: "video",
    idea: "A 30-second explainer video about the water cycle for middle school",
    extras: "Friendly narration tone, simple motion graphics style",
  },
];

export function loadLocalLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToLocalLibrary(entry) {
  const list = loadLocalLibrary();
  const next = [
    { ...entry, id: crypto.randomUUID(), createdAt: Date.now() },
    ...list,
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeFromLocalLibrary(id) {
  const next = loadLocalLibrary().filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function normalizePromptRow(row) {
  return {
    id: row.id,
    title: row.title,
    idea: row.idea,
    model: row.model,
    audience: row.audience,
    style: row.style,
    tone: row.tone,
    prompt: row.prompt,
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  };
}

function modelIntro(model) {
  if (model === "image") {
    return "Create a detailed image-generation prompt";
  }
  if (model === "video") {
    return "Create a detailed video / storyboard prompt";
  }
  return "Write high-quality text content";
}

export function buildPrompt({
  idea,
  model = "text",
  audience = "students",
  style = "detailed",
  tone = "friendly",
  extras = "",
  length = "medium",
}) {
  const trimmed = idea.trim();
  if (!trimmed) return "";

  const audienceLabel = AUDIENCE_MAP[audience] || audience;
  const toneLabel = TONE_MAP[tone] || tone;
  const styleLine = STYLE_MAP[style] || STYLE_MAP.detailed;
  const lengthLine = LENGTH_MAP[length] || LENGTH_MAP.medium;

  const lines = [
    `${modelIntro(model)} based on this idea: "${trimmed}".`,
    `Audience: ${audienceLabel}.`,
    `Tone: ${toneLabel}.`,
    styleLine,
    lengthLine,
  ];

  if (model === "text") {
    lines.push(
      "Structure: clear opening, organized body, and a useful ending.",
      "Prefer plain readable text. Avoid heavy markdown symbols."
    );
  }

  if (model === "image") {
    lines.push(
      "Include subject, setting, lighting, mood, color palette, composition, and art style.",
      "Describe camera framing if useful (wide / close-up / isometric).",
      "Avoid logos, watermarks, unsafe content, or real-person likeness requests."
    );
  }

  if (model === "video") {
    lines.push(
      "Include scene-by-scene flow, camera movement, pacing, visual mood, and sound feel.",
      "Keep shots clear and age-appropriate.",
      "End with a simple closing beat."
    );
  }

  if (extras.trim()) {
    lines.push(`Additional requirements: ${extras.trim()}.`);
  }

  lines.push("Keep the result safe, friendly, and suitable for all ages.");

  return lines.join("\n");
}

/** Second-pass enhancement for already generated prompts */
export function enhancePrompt(prompt, { model = "text" } = {}) {
  const base = String(prompt || "").trim();
  if (!base) return "";

  const boost = {
    text: "Enhance clarity, add concrete details, and improve structure while keeping the same goal.",
    image: "Tighten visual specifics: subject focus, lighting, materials, and composition.",
    video: "Improve scene timing, camera notes, and emotional arc while keeping it concise.",
  }[model];

  return `${base}\n\nEnhancement pass: ${boost} Keep it safe and beginner-friendly.`;
}
