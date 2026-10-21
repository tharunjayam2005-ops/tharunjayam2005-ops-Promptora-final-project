import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IDEA_EXAMPLES,
  buildPrompt,
  enhancePrompt,
  saveToLocalLibrary,
} from "../lib/prompts";
import { saveCloudPrompt } from "../services/promptStore";
import { USAGE_EVENTS, trackUsage } from "../services/usageStore";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "../components/Icons";
import CopyButton from "../components/CopyButton";
import "./Generator.css";

const MODELS = [
  { id: "text", label: "Text / Story", icon: "text" },
  { id: "image", label: "Image", icon: "image" },
  { id: "video", label: "Video", icon: "video" },
];

export default function Generator() {
  const { isAuthenticated, isConfigured, user, displayName } = useAuth();
  const [idea, setIdea] = useState("");
  const [model, setModel] = useState("text");
  const [audience, setAudience] = useState("students");
  const [style, setStyle] = useState("detailed");
  const [tone, setTone] = useState("friendly");
  const [length, setLength] = useState("medium");
  const [extras, setExtras] = useState("");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // success | error | info

  const livePreview = useMemo(
    () => buildPrompt({ idea, model, audience, style, tone, extras, length }),
    [idea, model, audience, style, tone, extras, length]
  );

  const prompt = generated || livePreview;
  const wordCount = prompt
    ? prompt.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const isFinal = Boolean(generated);

  function notify(message, type = "info") {
    setStatus(message);
    setStatusType(type);
  }

  function resetOutputFlags() {
    setGenerated("");
    setStatus("");
    setStatusType("");
    setSaved(false);
  }

  function applyExample(example) {
    setIdea(example.idea);
    setModel(example.model);
    setExtras(example.extras || "");
    setGenerated("");
    notify(`Loaded example: ${example.label}. Click Generate Prompt.`, "info");
  }

  function handleGenerate(event) {
    event?.preventDefault();
    if (!idea.trim()) {
      notify("Type your idea first, then click Generate Prompt.", "error");
      return;
    }
    const next = buildPrompt({
      idea,
      model,
      audience,
      style,
      tone,
      extras,
      length,
    });
    setGenerated(next);
    trackUsage(USAGE_EVENTS.GENERATE, { model });
    notify("Prompt generated. You can copy, enhance, or save it.", "success");
  }

  function handleEnhance() {
    if (!prompt.trim()) {
      notify("Generate a prompt first.", "error");
      return;
    }
    const source = generated || livePreview;
    const next = enhancePrompt(source, { model });
    setGenerated(next);
    trackUsage(USAGE_EVENTS.ENHANCE, { model });
    notify("Prompt enhanced with clearer details.", "success");
  }

  async function copyPrompt() {
    if (!prompt.trim()) {
      notify("Generate a prompt first.", "error");
      return;
    }
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      trackUsage(USAGE_EVENTS.COPY, { model });
      notify("Prompt copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      notify("Could not copy. Select the prompt and copy manually.", "error");
    }
  }

  async function handleSave() {
    if (!prompt.trim()) {
      notify("Generate a prompt first.", "error");
      return;
    }

    if (!isAuthenticated) {
      notify("Sign in to save prompts to your library.", "error");
      return;
    }

    const entry = {
      title: idea.trim().slice(0, 60) || "Untitled prompt",
      idea: idea.trim(),
      model,
      audience,
      style,
      tone,
      prompt,
    };

    setSaving(true);
    try {
      if (isConfigured) {
        try {
          await saveCloudPrompt(entry);
          trackUsage(USAGE_EVENTS.SAVE, { model, source: "cloud" });
          notify("Saved to your library.", "success");
        } catch (cloudError) {
          saveToLocalLibrary(entry);
          trackUsage(USAGE_EVENTS.SAVE, { model, source: "local-fallback" });
          notify(
            cloudError.message
              ? `Cloud save failed — saved on this device. (${cloudError.message})`
              : "Cloud save failed — saved on this device.",
            "info"
          );
        }
      } else {
        saveToLocalLibrary(entry);
        trackUsage(USAGE_EVENTS.SAVE, { model, source: "local" });
        notify("Saved to your library on this device.", "success");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (error) {
      notify(error.message || "Could not save prompt.", "error");
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    setIdea("");
    setExtras("");
    setGenerated("");
    setStatus("");
    setStatusType("");
    setSaved(false);
  }

  return (
    <main className="gen page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Prompt generator</p>
          <h1 className="section-title">Generate your AI prompt</h1>
          <p className="section-lead">
            Describe your idea, choose text / image / video, then generate a clean prompt
            ready to copy or save.
          </p>
          <p className="gen-status-note">
            {isAuthenticated
              ? `Signed in as ${displayName || user?.email}. Save prompts to your library anytime.`
              : "Generate freely. Sign in to save prompts to your library."}
          </p>
          {!isAuthenticated ? (
            <div className="gen-auth-bar">
              <Link to="/auth" className="btn btn-primary btn-sm">
                Sign in
              </Link>
              <Link to="/ai-chat" className="btn btn-ghost btn-sm">
                Open AI Chat
              </Link>
            </div>
          ) : (
            <div className="gen-auth-bar">
              <Link to="/ai-chat" className="btn btn-ghost btn-sm">
                Use in AI Chat
              </Link>
              <Link to="/library" className="btn btn-ghost btn-sm">
                Open library
              </Link>
            </div>
          )}
        </header>

        <div className="gen-examples fade-up">
          <span className="gen-examples-label">Quick start</span>
          <div className="gen-example-chips">
            {IDEA_EXAMPLES.map((example) => (
              <button
                key={example.id}
                type="button"
                className="gen-example-chip"
                onClick={() => applyExample(example)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="gen-layout fade-up" style={{ animationDelay: "0.06s" }}>
          <form className="gen-form" onSubmit={handleGenerate}>
            <label className="field">
              <span>Your idea</span>
              <textarea
                rows={5}
                placeholder="e.g. A short story about a robot learning to paint with kids..."
                value={idea}
                onChange={(event) => {
                  setIdea(event.target.value);
                  resetOutputFlags();
                }}
              />
            </label>

            <div className="field">
              <span>Content type</span>
              <div className="segmented">
                {MODELS.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    className={model === entry.id ? "active" : ""}
                    onClick={() => {
                      setModel(entry.id);
                      setGenerated("");
                    }}
                  >
                    <Icon name={entry.icon} size={15} />
                    {entry.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="gen-row">
              <label className="field">
                <span>Audience</span>
                <select
                  value={audience}
                  onChange={(event) => {
                    setAudience(event.target.value);
                    setGenerated("");
                  }}
                >
                  <option value="students">Students</option>
                  <option value="teachers">Teachers</option>
                  <option value="kids">Curious kids</option>
                  <option value="general">Everyone</option>
                </select>
              </label>

              <label className="field">
                <span>Style</span>
                <select
                  value={style}
                  onChange={(event) => {
                    setStyle(event.target.value);
                    setGenerated("");
                  }}
                >
                  <option value="simple">Simple</option>
                  <option value="detailed">Detailed</option>
                  <option value="creative">Creative</option>
                  <option value="academic">Academic</option>
                </select>
              </label>

              <label className="field">
                <span>Tone</span>
                <select
                  value={tone}
                  onChange={(event) => {
                    setTone(event.target.value);
                    setGenerated("");
                  }}
                >
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="playful">Playful</option>
                  <option value="calm">Calm</option>
                </select>
              </label>
            </div>

            <div className="gen-row gen-row-2">
              <label className="field">
                <span>Length</span>
                <select
                  value={length}
                  onChange={(event) => {
                    setLength(event.target.value);
                    setGenerated("");
                  }}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </label>

              <label className="field">
                <span>Extra notes (optional)</span>
                <input
                  type="text"
                  placeholder="Length, colors, subject focus..."
                  value={extras}
                  onChange={(event) => {
                    setExtras(event.target.value);
                    setGenerated("");
                  }}
                />
              </label>
            </div>

            {status ? (
              <p className={`gen-feedback is-${statusType || "info"}`}>{status}</p>
            ) : null}

            <div className="gen-actions">
              <button type="submit" className="btn btn-primary" disabled={!idea.trim()}>
                <Icon name="wand" size={15} color="#000" />
                Generate Prompt
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!prompt.trim()}
                onClick={handleEnhance}
              >
                <Icon name="sparkle" size={15} />
                Enhance
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={!prompt.trim()}
                onClick={copyPrompt}
              >
                <Icon name={copied ? "check" : "copy"} size={15} />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                className="btn btn-accent"
                disabled={!prompt.trim() || saving}
                onClick={handleSave}
              >
                <Icon name="save" size={15} color="#fff" />
                {saving ? "Saving…" : saved ? "Saved!" : "Save"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={handleClear}>
                Clear
              </button>
            </div>
          </form>

          <aside className="gen-preview">
            <div className="preview-head">
              <div>
                <h2>{isFinal ? "Generated prompt" : "Live preview"}</h2>
                <p className="preview-meta">
                  {wordCount ? `${wordCount} words` : "Waiting for idea"}
                  {isFinal ? " · ready" : prompt ? " · editing" : ""}
                </p>
              </div>
              <span className="preview-badge">{model}</span>
            </div>
            <div className={`preview-body ${prompt ? "" : "is-empty"}`}>
              {prompt ||
                "Your generated prompt will appear here. Enter an idea and click Generate Prompt."}
            </div>
            <div className="preview-actions">
              <CopyButton
                text={prompt}
                label="Copy prompt"
                copiedLabel="Copied"
                variant="primary"
                size="sm"
                disabled={!prompt.trim()}
                onCopied={() => {
                  setCopied(true);
                  trackUsage(USAGE_EVENTS.COPY, { model });
                  notify("Prompt copied to clipboard.", "success");
                  setTimeout(() => setCopied(false), 1600);
                }}
              />
              <Link to="/ai-chat" className="btn btn-ghost btn-sm">
                Open AI Chat
              </Link>
              <Link to="/library" className="btn btn-ghost btn-sm">
                Library
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
