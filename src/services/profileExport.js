import { loadLocalLibrary } from "../lib/prompts";
import { loadCustomSkills, listAllSkills } from "./skillsStore";
import { getUsageEvents, getUsageSummary } from "./usageStore";
import { loadLocalApiKeys } from "./apiKeysStore";
import { downloadTextFile } from "./usageStore";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return String(value || "");
  }
}

export function buildProfileReportData({
  user,
  displayName,
  prompts = [],
  days = 30,
}) {
  const usage = getUsageSummary(days);
  const skills = listAllSkills();
  const customSkills = loadCustomSkills();
  const keys = loadLocalApiKeys();
  const localPrompts = prompts.length ? prompts : loadLocalLibrary();

  return {
    exportedAt: new Date().toISOString(),
    profile: {
      name: displayName || user?.name || "User",
      email: user?.email || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatar_url || "",
    },
    programs: {
      promptCount: localPrompts.length,
      prompts: localPrompts.map((item) => ({
        title: item.title,
        model: item.model,
        audience: item.audience,
        style: item.style,
        tone: item.tone,
        idea: item.idea,
        prompt: item.prompt,
        createdAt: item.createdAt || item.created_at || "",
      })),
      skills: skills.map((skill) => ({
        name: skill.name,
        category: skill.category,
        custom: Boolean(skill.custom),
        prompt: skill.prompt,
      })),
      customSkillCount: customSkills.length,
      customModels: (keys.models || []).map((m) => ({
        label: m.label,
        provider: m.provider,
        model: m.model,
      })),
    },
    usage: {
      rangeDays: days,
      totals: usage.totals,
      daily: usage.days,
      recentEvents: getUsageEvents().slice(0, 50),
    },
  };
}

export function exportProfileJson(report) {
  const safeName = (report.profile.name || "profile")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  downloadTextFile(
    `promptora-profile-${safeName}.json`,
    JSON.stringify(report, null, 2),
    "application/json"
  );
}

export function exportProfileTxt(report) {
  const lines = [
    "PROMPTORA PROFILE REPORT",
    "========================",
    "",
    `Name: ${report.profile.name}`,
    `Email: ${report.profile.email}`,
    `Bio: ${report.profile.bio || "-"}`,
    `Exported: ${formatDate(report.exportedAt)}`,
    "",
    "USAGE SUMMARY",
    "-------------",
    `Range: last ${report.usage.rangeDays} days`,
    `Total actions: ${report.usage.totals.total}`,
    `Generate: ${report.usage.totals.generate}`,
    `Enhance: ${report.usage.totals.enhance}`,
    `Save: ${report.usage.totals.save}`,
    `Copy: ${report.usage.totals.copy}`,
    `Chat: ${report.usage.totals.chat}`,
    "",
    "PROGRAMS / PROMPTS",
    "------------------",
    `Saved prompts: ${report.programs.promptCount}`,
  ];

  report.programs.prompts.forEach((item, index) => {
    lines.push("");
    lines.push(`${index + 1}. ${item.title || "Untitled"}`);
    lines.push(`   Type: ${item.model || "-"}`);
    lines.push(`   Audience: ${item.audience || "-"}`);
    lines.push(`   Idea: ${item.idea || "-"}`);
    lines.push("   Prompt:");
    String(item.prompt || "")
      .split("\n")
      .forEach((line) => lines.push(`   ${line}`));
  });

  lines.push("");
  lines.push("SKILLS");
  lines.push("------");
  report.programs.skills.forEach((skill, index) => {
    lines.push(`${index + 1}. ${skill.name} (${skill.category})`);
  });

  lines.push("");
  lines.push("CUSTOM MODELS");
  lines.push("-------------");
  if (!report.programs.customModels.length) {
    lines.push("None");
  } else {
    report.programs.customModels.forEach((model, index) => {
      lines.push(
        `${index + 1}. ${model.label} — ${model.provider}:${model.model}`
      );
    });
  }

  const safeName = (report.profile.name || "profile")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  downloadTextFile(
    `promptora-profile-${safeName}.txt`,
    lines.join("\n"),
    "text/plain;charset=utf-8"
  );
}

function buildProfilePdfHtml(report) {
  const promptsHtml = report.programs.prompts.length
    ? report.programs.prompts
        .map(
          (item, index) => `
      <article class="card">
        <h3>${index + 1}. ${escapeHtml(item.title || "Untitled")}</h3>
        <p class="meta">
          <span>Type: ${escapeHtml(item.model || "-")}</span>
          <span>Audience: ${escapeHtml(item.audience || "-")}</span>
          <span>Style: ${escapeHtml(item.style || "-")}</span>
        </p>
        <p><strong>Idea</strong></p>
        <p class="body">${escapeHtml(item.idea || "-")}</p>
        <p><strong>Prompt</strong></p>
        <pre class="prompt">${escapeHtml(item.prompt || "")}</pre>
      </article>`
        )
        .join("")
    : `<p class="empty">No saved prompts yet.</p>`;

  const skillsHtml = report.programs.skills
    .map(
      (skill) => `
      <tr>
        <td>${escapeHtml(skill.name)}</td>
        <td>${escapeHtml(skill.category)}</td>
        <td>${skill.custom ? "Custom" : "Built-in"}</td>
      </tr>`
    )
    .join("");

  const dailyHtml = report.usage.daily
    .map(
      (day) => `
      <tr>
        <td>${escapeHtml(day.day)}</td>
        <td class="num">${day.total}</td>
        <td class="num">${day.generate}</td>
        <td class="num">${day.chat}</td>
        <td class="num">${day.save}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Promptora Profile Report — ${escapeHtml(report.profile.name)}</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #111;
      background: #fff;
      font-family: "Segoe UI", Arial, Helvetica, sans-serif;
      font-size: 11.5pt;
      line-height: 1.55;
    }
    .wrap {
      max-width: 780px;
      margin: 0 auto;
    }
    h1, h2, h3 {
      margin: 0 0 8px;
      line-height: 1.25;
      text-align: left;
    }
    h1 {
      font-size: 22pt;
      letter-spacing: -0.02em;
    }
    h2 {
      font-size: 14pt;
      margin-top: 22px;
      padding-bottom: 6px;
      border-bottom: 1px solid #ddd;
    }
    h3 { font-size: 12pt; }
    p { margin: 0 0 8px; text-align: left; }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      margin-bottom: 18px;
    }
    .brand {
      font-size: 10pt;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 4px;
    }
    .muted { color: #555; }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 16px;
      color: #444;
      font-size: 10pt;
      margin-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 12px 0 8px;
    }
    .stat {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    .stat strong {
      display: block;
      font-size: 16pt;
      margin-bottom: 2px;
    }
    .stat span {
      font-size: 9pt;
      color: #555;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 4px;
      font-size: 10pt;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 7px 8px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f5f5f5;
      font-weight: 700;
    }
    td.num, th.num { text-align: right; }
    .card {
      border: 1px solid #ddd;
      padding: 12px;
      margin: 10px 0;
      page-break-inside: avoid;
    }
    .prompt, .body {
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: anywhere;
      text-align: left;
      margin: 0;
    }
    pre.prompt {
      font-family: Consolas, "Courier New", monospace;
      font-size: 9.5pt;
      line-height: 1.45;
      background: #fafafa;
      border: 1px solid #eee;
      padding: 10px;
    }
    .empty { color: #777; }
    .footer {
      margin-top: 24px;
      padding-top: 8px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #666;
      text-align: left;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
    .actions {
      margin: 0 0 16px;
      display: flex;
      gap: 8px;
    }
    .actions button {
      border: 1px solid #333;
      background: #111;
      color: #fff;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 10pt;
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="actions no-print">
      <button onclick="window.print()">Print / Save as PDF</button>
      <button onclick="window.close()">Close</button>
    </div>

    <div class="header">
      <div>
        <div class="brand">Promptora</div>
        <h1>Profile Report</h1>
        <p class="muted">Particular profile export with programs and usage</p>
      </div>
      <div class="muted" style="text-align:right">
        <div>${escapeHtml(formatDate(report.exportedAt))}</div>
        <div>Range: ${report.usage.rangeDays} days</div>
      </div>
    </div>

    <h2>Profile</h2>
    <p><strong>Name:</strong> ${escapeHtml(report.profile.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(report.profile.email || "-")}</p>
    <p><strong>Bio:</strong> ${escapeHtml(report.profile.bio || "No bio yet.")}</p>

    <h2>Usage Summary</h2>
    <div class="stats">
      <div class="stat"><strong>${report.usage.totals.total}</strong><span>Total actions</span></div>
      <div class="stat"><strong>${report.usage.totals.generate}</strong><span>Generate</span></div>
      <div class="stat"><strong>${report.usage.totals.chat}</strong><span>AI Chat</span></div>
      <div class="stat"><strong>${report.usage.totals.save}</strong><span>Saves</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th class="num">Total</th>
          <th class="num">Generate</th>
          <th class="num">Chat</th>
          <th class="num">Save</th>
        </tr>
      </thead>
      <tbody>
        ${dailyHtml}
      </tbody>
    </table>

    <h2>Programs / Saved Prompts (${report.programs.promptCount})</h2>
    ${promptsHtml}

    <h2>Skills</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        ${skillsHtml}
      </tbody>
    </table>

    <h2>Custom Models</h2>
    ${
      report.programs.customModels.length
        ? `<table>
            <thead><tr><th>Label</th><th>Provider</th><th>Model ID</th></tr></thead>
            <tbody>
              ${report.programs.customModels
                .map(
                  (m) => `<tr>
                    <td>${escapeHtml(m.label)}</td>
                    <td>${escapeHtml(m.provider)}</td>
                    <td>${escapeHtml(m.model)}</td>
                  </tr>`
                )
                .join("")}
            </tbody>
          </table>`
        : `<p class="empty">No custom models saved.</p>`
    }

    <div class="footer">
      Generated by Promptora for ${escapeHtml(report.profile.name)}. Use Print → Save as PDF for a PDF copy.
    </div>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`;
}

export function exportProfilePdf(report) {
  const html = buildProfilePdfHtml(report);
  const popup = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!popup) {
    throw new Error("Popup blocked. Allow popups to export PDF.");
  }
  popup.document.open();
  popup.document.write(html);
  popup.document.close();
}
