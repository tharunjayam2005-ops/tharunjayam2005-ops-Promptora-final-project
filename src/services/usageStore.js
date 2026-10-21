const STORAGE_KEY = "promptora_usage_events";
const MAX_EVENTS = 2000;

export const USAGE_EVENTS = {
  GENERATE: "generator_generate",
  ENHANCE: "generator_enhance",
  SAVE: "generator_save",
  COPY: "generator_copy",
  CHAT: "chat_send",
  FEATURES_VIEW: "features_view",
  OVERVIEW_VIEW: "overview_view",
};

function readEvents() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(0, MAX_EVENTS)));
}

export function trackUsage(type, meta = {}) {
  if (!type) return;
  const events = readEvents();
  events.unshift({
    id: crypto.randomUUID(),
    type,
    meta,
    at: new Date().toISOString(),
  });
  writeEvents(events);
}

export function getUsageEvents() {
  return readEvents();
}

export function clearUsageEvents() {
  localStorage.removeItem(STORAGE_KEY);
}

function dayKey(iso) {
  return String(iso || "").slice(0, 10);
}

function lastNDays(n = 7) {
  const days = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function getUsageSummary(days = 7) {
  const events = getUsageEvents();
  const keys = lastNDays(days);
  const byDay = Object.fromEntries(
    keys.map((day) => [
      day,
      {
        day,
        generate: 0,
        enhance: 0,
        save: 0,
        copy: 0,
        chat: 0,
        total: 0,
      },
    ])
  );

  const totals = {
    generate: 0,
    enhance: 0,
    save: 0,
    copy: 0,
    chat: 0,
    total: 0,
    featuresViews: 0,
    overviewViews: 0,
  };

  events.forEach((event) => {
    const day = dayKey(event.at);
    const bucket = byDay[day];
    if (!bucket) return;

    bucket.total += 1;
    totals.total += 1;

    if (event.type === USAGE_EVENTS.GENERATE) {
      bucket.generate += 1;
      totals.generate += 1;
    } else if (event.type === USAGE_EVENTS.ENHANCE) {
      bucket.enhance += 1;
      totals.enhance += 1;
    } else if (event.type === USAGE_EVENTS.SAVE) {
      bucket.save += 1;
      totals.save += 1;
    } else if (event.type === USAGE_EVENTS.COPY) {
      bucket.copy += 1;
      totals.copy += 1;
    } else if (event.type === USAGE_EVENTS.CHAT) {
      bucket.chat += 1;
      totals.chat += 1;
    } else if (event.type === USAGE_EVENTS.FEATURES_VIEW) {
      totals.featuresViews += 1;
    } else if (event.type === USAGE_EVENTS.OVERVIEW_VIEW) {
      totals.overviewViews += 1;
    }
  });

  return {
    days: keys.map((day) => byDay[day]),
    totals,
    rangeDays: days,
  };
}

export function exportUsageCsv(days = 30) {
  const events = getUsageEvents().filter((event) => {
    const age =
      (Date.now() - new Date(event.at).getTime()) / (1000 * 60 * 60 * 24);
    return age <= days;
  });

  const header = "date,time,event,details";
  const rows = events.map((event) => {
    const date = dayKey(event.at);
    const time = String(event.at).slice(11, 19);
    const details = JSON.stringify(event.meta || {}).replace(/"/g, '""');
    return `${date},${time},${event.type},"${details}"`;
  });
  return [header, ...rows].join("\n");
}

export function exportUsageJson(days = 30) {
  const summary = getUsageSummary(Math.min(days, 30));
  const events = getUsageEvents().filter((event) => {
    const age =
      (Date.now() - new Date(event.at).getTime()) / (1000 * 60 * 60 * 24);
    return age <= days;
  });
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      rangeDays: days,
      summary: summary.totals,
      daily: summary.days,
      events,
    },
    null,
    2
  );
}

export function downloadTextFile(filename, content, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
