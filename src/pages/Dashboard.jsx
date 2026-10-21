import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loadLocalLibrary } from "../lib/prompts";
import { fetchCloudPrompts } from "../services/promptStore";
import {
  downloadTextFile,
  exportUsageCsv,
  exportUsageJson,
  getUsageSummary,
} from "../services/usageStore";
import { BarChart, BreakdownChart } from "../components/UsageChart";
import { Icon } from "../components/Icons";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, displayName, isConfigured, isAuthenticated } = useAuth();
  const [promptCount, setPromptCount] = useState(0);
  const [recent, setRecent] = useState([]);
  const [range, setRange] = useState(7);
  const summary = useMemo(() => getUsageSummary(range), [range, promptCount]);

  useEffect(() => {
    async function load() {
      try {
        if (isConfigured && isAuthenticated) {
          const data = await fetchCloudPrompts();
          setPromptCount(data.length);
          setRecent(data.slice(0, 3));
          return;
        }
        const local = loadLocalLibrary();
        setPromptCount(local.length);
        setRecent(local.slice(0, 3));
      } catch {
        setPromptCount(0);
        setRecent([]);
      }
    }
    load();
  }, [isConfigured, isAuthenticated]);

  const initial = (displayName || "C").charAt(0).toUpperCase();
  const barData = summary.days.map((day) => ({
    label: day.day,
    short: day.day.slice(8),
    value: day.total,
  }));
  const breakdown = [
    { label: "Generate", value: summary.totals.generate, color: "#a78bfa" },
    { label: "Chat", value: summary.totals.chat, color: "#f472b6" },
    { label: "Save", value: summary.totals.save, color: "#2dd4bf" },
    { label: "Copy", value: summary.totals.copy, color: "#60a5fa" },
  ];

  return (
    <main className="dashboard page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Dashboard</p>
          <h1 className="section-title">Welcome, {displayName}</h1>
          <p className="section-lead">
            Track usage with graphs, manage prompts, and export reports.
          </p>
        </header>

        <section className="dash-hero fade-up">
          <div className="dash-identity">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="dash-avatar" />
            ) : (
              <div className="dash-avatar dash-avatar-fallback">{initial}</div>
            )}
            <div>
              <h2>{displayName}</h2>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="dash-hero-actions">
            <Link to="/overview" className="btn btn-primary">
              Usage overview
            </Link>
            <Link to="/generator" className="btn btn-ghost">
              Generate prompt
            </Link>
          </div>
        </section>

        <section className="dash-stats fade-up">
          <article className="dash-stat">
            <Icon name="save" size={18} color="#a78bfa" />
            <strong>{promptCount}</strong>
            <span>Saved prompts</span>
          </article>
          <article className="dash-stat">
            <Icon name="wand" size={18} color="#2dd4bf" />
            <strong>{summary.totals.generate}</strong>
            <span>Generated ({range}d)</span>
          </article>
          <article className="dash-stat">
            <Icon name="chat" size={18} color="#f472b6" />
            <strong>{summary.totals.chat}</strong>
            <span>Chat sends ({range}d)</span>
          </article>
        </section>

        <section className="dash-usage-toolbar fade-up">
          <div className="dash-range">
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
          <div className="dash-export">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                downloadTextFile(
                  `promptora-usage-${range}d.csv`,
                  exportUsageCsv(Math.max(range, 30)),
                  "text/csv;charset=utf-8"
                )
              }
            >
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                downloadTextFile(
                  `promptora-report-${range}d.json`,
                  exportUsageJson(Math.max(range, 30)),
                  "application/json"
                )
              }
            >
              Export report
            </button>
          </div>
        </section>

        <section className="dash-graphs fade-up">
          <BarChart label="Daily usage tracking" data={barData} />
          <BreakdownChart label="Feature usage" items={breakdown} />
        </section>

        <section className="dash-grid fade-up">
          <article className="dash-card">
            <h3>Quick actions</h3>
            <div className="dash-actions">
              <Link to="/generator" className="btn btn-primary btn-sm">
                <Icon name="wand" size={14} color="#000" />
                New prompt
              </Link>
              <Link to="/ai-chat" className="btn btn-ghost btn-sm">
                <Icon name="zap" size={14} />
                AI chat
              </Link>
              <Link to="/features" className="btn btn-ghost btn-sm">
                <Icon name="stack" size={14} />
                Features
              </Link>
              <Link to="/overview" className="btn btn-ghost btn-sm">
                <Icon name="chart" size={14} />
                Overview
              </Link>
              <Link to="/library" className="btn btn-ghost btn-sm">
                <Icon name="library" size={14} />
                Library
              </Link>
            </div>
          </article>

          <article className="dash-card">
            <h3>Recent prompts</h3>
            {recent.length === 0 ? (
              <p className="dash-empty">
                No saved prompts yet. Generate one and save it to your library.
              </p>
            ) : (
              <ul className="dash-recent">
                {recent.map((item) => (
                  <li key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.model}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/library" className="btn-link">
              View all →
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}
