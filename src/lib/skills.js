export const BUILT_IN_SKILLS = [
  {
    id: "skill:general",
    name: "General Assistant",
    category: "Built-in",
    prompt:
      "You are Promptora AI Skills assistant. Be clear, helpful, safe, and friendly for students, teachers, and creators. Give practical answers.",
  },
  {
    id: "skill:teacher",
    name: "Teacher",
    category: "Built-in",
    prompt:
      "You are a patient teacher. Explain step by step, use simple language, check understanding, and give short practice questions when useful. Stay age-appropriate and encouraging.",
  },
  {
    id: "skill:coder",
    name: "Coding Coach",
    category: "Built-in",
    prompt:
      "You are a coding coach. Give working code, explain why it works, note edge cases, and keep answers practical. Prefer clear examples over long theory.",
  },
  {
    id: "skill:writer",
    name: "Writer",
    category: "Built-in",
    prompt:
      "You are a writing assistant. Improve clarity, structure, and tone. Offer polished drafts and short rewrite options when helpful.",
  },
  {
    id: "skill:prompt-engineer",
    name: "Prompt Engineer",
    category: "Built-in",
    prompt:
      "You are an expert prompt engineer. Turn vague ideas into precise prompts for text, image, or video AI tools. Include role, goal, constraints, and output format.",
  },
  {
    id: "skill:study",
    name: "Study Buddy",
    category: "Built-in",
    prompt:
      "You are a study buddy. Make summaries, flashcards, quizzes, and revision plans. Keep answers short, memorable, and actionable.",
  },
  {
    id: "skill:research",
    name: "Research Helper",
    category: "Built-in",
    prompt:
      "You are a research helper. Break topics into key questions, compare viewpoints, and cite assumptions clearly. Prefer structured bullet answers.",
  },
];

export function normalizeSkill(entry, { custom = false } = {}) {
  if (!entry || typeof entry !== "object") return null;
  const name = String(entry.name || entry.title || "").trim();
  const prompt = String(entry.prompt || entry.system || entry.instruction || "").trim();
  if (!name || !prompt) return null;

  const id =
    String(entry.id || "").trim() ||
    `skill:custom:${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    name,
    prompt,
    category: custom ? "Custom" : entry.category || "Custom",
    custom: Boolean(custom || entry.custom),
  };
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

export function parseSkillsFromJson(text) {
  const raw = JSON.parse(text);
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.skills)
      ? raw.skills
      : [raw];
  return list.map((item) => normalizeSkill(item, { custom: true })).filter(Boolean);
}

export function parseSkillsFromCsv(text) {
  const lines = String(text || "")
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];

  const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
  const hasHeader =
    header.includes("name") ||
    header.includes("title") ||
    header.includes("prompt") ||
    header.includes("system");

  const rows = hasHeader ? lines.slice(1) : lines;
  const nameIdx = hasHeader
    ? Math.max(header.indexOf("name"), header.indexOf("title"), 0)
    : 0;
  const promptIdx = hasHeader
    ? Math.max(
        header.indexOf("prompt"),
        header.indexOf("system"),
        header.indexOf("instruction"),
        1
      )
    : 1;

  return rows
    .map((line) => {
      const cells = splitCsvLine(line);
      return normalizeSkill(
        {
          name: cells[nameIdx],
          prompt: cells[promptIdx],
        },
        { custom: true }
      );
    })
    .filter(Boolean);
}

export function getSkillCatalog(customSkills = []) {
  const customs = (customSkills || [])
    .map((item) => normalizeSkill(item, { custom: true }))
    .filter(Boolean);
  const seen = new Set(BUILT_IN_SKILLS.map((s) => s.id));
  const unique = customs.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
  return [...BUILT_IN_SKILLS, ...unique];
}

export function getSkillById(id, customSkills = []) {
  return getSkillCatalog(customSkills).find((s) => s.id === id) || null;
}
