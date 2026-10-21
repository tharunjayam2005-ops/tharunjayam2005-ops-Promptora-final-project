import {
  getSkillCatalog,
  normalizeSkill,
  parseSkillsFromCsv,
  parseSkillsFromJson,
} from "../lib/skills";

const LOCAL_SKILLS = "promptora_ai_skills";

export function loadCustomSkills() {
  try {
    const raw = JSON.parse(localStorage.getItem(LOCAL_SKILLS) || "[]");
    return Array.isArray(raw)
      ? raw.map((item) => normalizeSkill(item, { custom: true })).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export function saveCustomSkills(skills) {
  const cleaned = (skills || [])
    .map((item) => normalizeSkill(item, { custom: true }))
    .filter(Boolean);
  localStorage.setItem(LOCAL_SKILLS, JSON.stringify(cleaned));
  return cleaned;
}

export function addCustomSkill(skill) {
  const next = normalizeSkill(skill, { custom: true });
  if (!next) throw new Error("Skill needs a name and prompt.");
  const current = loadCustomSkills().filter((item) => item.id !== next.id);
  return saveCustomSkills([...current, next]);
}

export function removeCustomSkill(id) {
  return saveCustomSkills(loadCustomSkills().filter((item) => item.id !== id));
}

export function importSkillsFromText(text, format = "json") {
  const parsed =
    format === "csv" ? parseSkillsFromCsv(text) : parseSkillsFromJson(text);
  if (!parsed.length) {
    throw new Error(`No valid skills found in ${format.toUpperCase()} file.`);
  }
  const current = loadCustomSkills();
  const byId = new Map(current.map((item) => [item.id, item]));
  parsed.forEach((item) => byId.set(item.id, item));
  return saveCustomSkills([...byId.values()]);
}

export function listAllSkills() {
  return getSkillCatalog(loadCustomSkills());
}
