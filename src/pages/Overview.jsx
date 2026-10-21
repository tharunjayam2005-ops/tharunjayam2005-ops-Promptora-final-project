import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart, BreakdownChart } from "../components/UsageChart";
import { Icon } from "../components/Icons";
import {
  USAGE_EVENTS,
  downloadTextFile,
  exportUsageCsv,
  exportUsageJson,
  getUsageSummary,
  trackUsage,
} from "../services/usageStore";
import "./Overview.css";

const PRODUCT_LINKS = [
  {
    to: "/generator",
    icon: "wand",
    title: "Prompt Generator",
    text: "Turn ideas into text, image, and video prompts.",
  },
  {
    to: "/ai-chat",
    icon: "chat",
    title: "AI Chat",
    text: "Compare multi-model answers with skills.",
  },
  {
    to: "/features",
    icon: "stack",
    title: "Features",
    text: "See what Promptora includes and how to use it.",
  },
  {
    to: "/library",
    icon: "library",
    title: "Library",
    text: "Reuse saved prompts anytime.",
  },
];

export default function Overview() {
  const [range, setRange] = useState(7);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    trackUsage(USAGE_EVENTS.OVERVIEW_VIEW, { path: "/overview" });
  }, []);

  const summary = useMemo(() => getUsageSummary(range), [range, tick]);

  const barData = summary.days.map((day) => ({
    label: day.day,
    short: day.day.slice(8),
    value: day.total,
  }));

  const breakdown = [
    { label: "Generate", value: summary.totals.generate, color: "#a78bfa" },
    { label: "Enhance", value: summary.totals.enhance, color: "#c4b5fd" },
    { label: "Save", value: summary.totals.save, color: "#2dd4bf" },
    { label: "Copy", value: summary.totals.copy, color: "#60a5fa" },
    { label: "AI Chat", value: summary.totals.chat, color: "#f472b6" },
  ];

  function refresh() {
    setTick((value) => value + 1);
  }

  function exportCsv() {
    const csv = exportUsageCsv(Math.max(range, 30));
    downloadTextFile(
      `promptora-usage-${range}d.csv`,
      csv,
      "text/csv;charset=utf-8"
    );
  }

  function exportJson() {
    const json = exportUsageJson(Math.max(range, 30));
    downloadTextFile(
      `promptora-usage-report-${range}d.json`,
      json,
      "application/json"
    );
  }

  return (
    <main className="overview page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Product</p>
          <h1 className="section-title">Overview</h1>
          <p className="section-lead">
            Track how you use Promptora — generate, chat, save — and export a clear usage
            report.
          </p>
        </header>

        <section className="overview-links fade-up">
          {PRODUCT_LINKS.map((item) => (
            <Link key={item.to} to={item.to} className="overview-link-card">
              <Icon name={item.icon} size={18} color="#a78bfa" />
              <div>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </div>
            </Link>
          ))}
        </section>

        <section className="overview-toolbar fade-up">
          <div className="overview-range">
            <span>Graph range</span>
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                className={range === days ? "active" : ""}
                onClick={() => setRange(days)}
              >
                {days}d
              </button>
            ))}
          </div>
          <div className="overview-export">
            <button type="button" className="btn btn-ghost btn-sm" onClick={refresh}>
              Refresh
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={exportCsv}>
              Export CSV
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={exportJson}>
              Export report JSON
            </button>
          </div>
        </section>

        <section className="overview-stats fade-up">
          <article>
            <strong>{summary.totals.total}</strong>
            <span>Total actions</span>
          </article>
          <article>
            <strong>{summary.totals.generate}</strong>
            <span>Prompts generated</span>
          </article>
          <article>
            <strong>{summary.totals.chat}</strong>
            <span>Chat sends</span>
          </article>
          <article>
            <strong>{summary.totals.save}</strong>
            <span>Library saves</span>
          </article>
        </section>

        <section className="overview-graphs fade-up">
          <BarChart
            label="Daily usage (clicks & actions)"
            data={barData}
            color="#a78bfa"
          />
          <BreakdownChart label="Action breakdown" items={breakdown} />
        </section>

        <section className="overview-help fade-up">
          <h2>How to read the graphs</h2>
          <ul>
            <li>
              <strong>Daily usage</strong> — total tracked actions each day (generate, enhance,
              save, copy, chat).
            </li>
            <li>
              <strong>Action breakdown</strong> — which features you use most in this range.
            </li>
            <li>
              <strong>Export CSV / JSON</strong> — download a report for sharing or review.
            </li>
          </ul>
          <div className="overview-help-actions">
            <Link to="/features" className="btn btn-primary">
              Explore Features
            </Link>
            <Link to="/generator" className="btn btn-ghost">
              Start generating
            </Link>
            <Link to="/dashboard" className="btn btn-ghost">
              Open dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
