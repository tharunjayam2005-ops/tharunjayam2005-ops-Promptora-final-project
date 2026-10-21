import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { fetchUserApiKeys, saveUserApiKeys } from "../services/apiKeysStore";
import { AI_PROVIDERS, isChatCompatibleModel, normalizeCustomModel } from "../lib/aiModels";
import { Icon } from "../components/Icons";
import "./Settings.css";

const providerOptions = Object.values(AI_PROVIDERS);

function maskKey(value) {
  const key = String(value || "");
  if (!key) return "Not set";
  if (key.length <= 10) return "••••••••";
  return `${key.slice(0, 6)}…${key.slice(-4)}`;
}

export default function Settings() {
  const { isAuthenticated, isConfigured, displayName } = useAuth();
  const [openrouter, setOpenrouter] = useState("");
  const [gemini, setGemini] = useState("");
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [source, setSource] = useState("");
  const [showOpenrouter, setShowOpenrouter] = useState(false);
  const [showGemini, setShowGemini] = useState(false);

  const [modelDraft, setModelDraft] = useState({
    provider: "openrouter",
    model: "",
    label: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const keys = await fetchUserApiKeys();
        setOpenrouter(keys.openrouter || "");
        setGemini(keys.gemini || "");
        setModels(
          Array.isArray(keys.models)
            ? keys.models.filter(
                (m) => m.modality === "chat" || isChatCompatibleModel(m.model)
              )
            : []
        );
        setSource(keys.source || (isConfigured ? "cloud" : "local"));
      } catch (err) {
        // Still show key fields even if cloud load fails — try local
        const local = (() => {
          try {
            return JSON.parse(localStorage.getItem("promptora_ai_keys") || "{}");
          } catch {
            return {};
          }
        })();
        setOpenrouter(local.openrouter || "");
        setGemini(local.gemini || "");
        setModels(Array.isArray(local.models) ? local.models : []);
        setSource("local");
        setError(err.message || "Could not load from account — showing local keys.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isConfigured, isAuthenticated]);

  function addModel() {
    setError("");
    setMessage("");
    const modelId = modelDraft.model.trim();
    if (!modelId) {
      setError("Enter a model id before clicking +.");
      return;
    }
    if (!isChatCompatibleModel(modelId)) {
      setError(
        "That model is not for chat (video / TTS / rerank / image). Use a chat model like openai/gpt-4o-mini."
      );
      return;
    }
    const next = normalizeCustomModel({
      provider: modelDraft.provider,
      model: modelId,
      label: modelDraft.label.trim(),
      modality: "chat",
    });
    if (!next) {
      setError("Enter a valid provider and model id before clicking +.");
      return;
    }
    setModels((current) => {
      const without = current.filter((item) => item.id !== next.id);
      return [...without, next];
    });
    setModelDraft({
      provider: modelDraft.provider,
      model: "",
      label: "",
    });
    setMessage(`Model “${next.label}” added. Click Save to store it.`);
  }

  function removeModel(id) {
    setModels((current) => current.filter((item) => item.id !== id));
  }

  async function handleSave(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (!isAuthenticated) {
        throw new Error("Please sign in to save API keys to your account.");
      }

      let nextModels = [...models];
      if (modelDraft.model.trim()) {
        const drafted = normalizeCustomModel({
          provider: modelDraft.provider,
          model: modelDraft.model.trim(),
          label: modelDraft.label.trim(),
        });
        if (drafted) {
          nextModels = [
            ...nextModels.filter((item) => item.id !== drafted.id),
            drafted,
          ];
        }
      }

      const saved = await saveUserApiKeys({
        openrouter,
        gemini,
        models: nextModels,
      });

      setOpenrouter(saved.openrouter || "");
      setGemini(saved.gemini || "");
      setModels(saved.models || []);
      setSource(saved.source);
      setModelDraft((d) => ({ ...d, model: "", label: "" }));
      setMessage(
        saved.source?.startsWith("cloud")
          ? "API keys and models saved to your account."
          : "API keys and models saved on this device."
      );
    } catch (err) {
      setError(err.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="settings page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Settings</p>
          <h1 className="section-title">API keys & models</h1>
          <p className="section-lead">
            Paste your OpenRouter and Gemini keys below, add custom models with +, then Save.
            {displayName ? ` Signed in as ${displayName}.` : ""}
          </p>
        </header>

        <section className="settings-card fade-up">
          {!isAuthenticated ? (
            <div className="settings-note">
              <Icon name="users" size={18} color="#a78bfa" />
              <div>
                <strong>Sign in required</strong>
                <p>Create an account or sign in to store keys and models in your profile.</p>
                <Link to="/auth" className="btn btn-primary btn-sm" style={{ marginTop: "0.85rem" }}>
                  Sign in
                </Link>
              </div>
            </div>
          ) : null}

          {loading ? (
            <p className="settings-loading">Loading saved settings…</p>
          ) : (
            <form onSubmit={handleSave}>
              <div className="settings-block">
                <div className="settings-block-head">
                  <h2>API keys</h2>
                  <p>These keys are always shown here. Paste each key, then click Save.</p>
                </div>

                <div className="settings-key-cards">
                  <div className="settings-key-card">
                    <div className="settings-key-card-top">
                      <strong>OpenRouter</strong>
                      <span className={openrouter ? "ok" : "missing"}>
                        {openrouter ? `Saved · ${maskKey(openrouter)}` : "Not set"}
                      </span>
                    </div>
                    <div className="settings-key-input-row">
                      <div className="settings-key-field">
                        <input
                          type={showOpenrouter ? "text" : "password"}
                          value={openrouter}
                          onChange={(e) => setOpenrouter(e.target.value)}
                          placeholder="sk-or-v1-..."
                          autoComplete="off"
                          name="openrouter_api_key"
                        />
                        <button
                          type="button"
                          className="settings-eye-btn"
                          onClick={() => setShowOpenrouter((v) => !v)}
                          title={showOpenrouter ? "Hide key" : "Show key"}
                          aria-label={showOpenrouter ? "Hide OpenRouter key" : "Show OpenRouter key"}
                        >
                          <Icon
                            name={showOpenrouter ? "eye_off" : "eye"}
                            size={18}
                          />
                        </button>
                      </div>
                      {openrouter ? (
                        <button
                          type="button"
                          className="settings-clear-btn"
                          title="Clear OpenRouter key"
                          aria-label="Clear OpenRouter key"
                          onClick={() => setOpenrouter("")}
                        >
                          <Icon name="x" size={16} />
                        </button>
                      ) : null}
                    </div>
                    <a
                      className="settings-docs"
                      href={AI_PROVIDERS.openrouter.docs}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get OpenRouter key →
                    </a>
                  </div>

                  <div className="settings-key-card">
                    <div className="settings-key-card-top">
                      <strong>Gemini</strong>
                      <span className={gemini ? "ok" : "missing"}>
                        {gemini ? `Saved · ${maskKey(gemini)}` : "Not set"}
                      </span>
                    </div>
                    <div className="settings-key-input-row">
                      <div className="settings-key-field">
                        <input
                          type={showGemini ? "text" : "password"}
                          value={gemini}
                          onChange={(e) => setGemini(e.target.value)}
                          placeholder="AIza..."
                          autoComplete="off"
                          name="gemini_api_key"
                        />
                        <button
                          type="button"
                          className="settings-eye-btn"
                          onClick={() => setShowGemini((v) => !v)}
                          title={showGemini ? "Hide key" : "Show key"}
                          aria-label={showGemini ? "Hide Gemini key" : "Show Gemini key"}
                        >
                          <Icon
                            name={showGemini ? "eye_off" : "eye"}
                            size={18}
                          />
                        </button>
                      </div>
                      {gemini ? (
                        <button
                          type="button"
                          className="settings-clear-btn"
                          title="Clear Gemini key"
                          aria-label="Clear Gemini key"
                          onClick={() => setGemini("")}
                        >
                          <Icon name="x" size={16} />
                        </button>
                      ) : null}
                    </div>
                    <a
                      className="settings-docs"
                      href={AI_PROVIDERS.gemini.docs}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Get Gemini key →
                    </a>
                  </div>
                </div>
              </div>

              <div className="settings-block">
                <div className="settings-block-head">
                  <h2>Custom models</h2>
                  <p>
                    Chat models only (example: <code>openai/gpt-4o</code> or{" "}
                    <code>gemini-2.0-flash</code>). Video / TTS / rerank models are blocked.
                  </p>
                </div>

                {models.length ? (
                  <ul className="settings-list">
                    {models.map((item) => (
                      <li key={item.id} className="settings-list-item">
                        <div>
                          <strong>{item.label}</strong>
                          <span>
                            {item.badge} · {item.model}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="settings-icon-btn"
                          title="Remove model"
                          onClick={() => removeModel(item.id)}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="settings-empty">
                    No custom models yet. Built-in models still work in AI Chat.
                  </p>
                )}

                <div className="settings-add-row settings-add-row-model">
                  <select
                    value={modelDraft.provider}
                    onChange={(e) =>
                      setModelDraft((d) => ({ ...d, provider: e.target.value }))
                    }
                    aria-label="Model provider"
                  >
                    {providerOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={modelDraft.model}
                    onChange={(e) =>
                      setModelDraft((d) => ({ ...d, model: e.target.value }))
                    }
                    placeholder={
                      modelDraft.provider === "openrouter"
                        ? "openai/gpt-4o-mini"
                        : "gemini-2.0-flash"
                    }
                    autoComplete="off"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addModel();
                      }
                    }}
                  />
                  <input
                    type="text"
                    value={modelDraft.label}
                    onChange={(e) =>
                      setModelDraft((d) => ({ ...d, label: e.target.value }))
                    }
                    placeholder="Display name (optional)"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="settings-plus-btn"
                    title="Add model"
                    aria-label="Add model"
                    onClick={addModel}
                  >
                    <Icon name="plus" size={18} />
                  </button>
                </div>
              </div>

              <p className="settings-help">
                Storage:{" "}
                <strong>
                  {source?.startsWith("cloud")
                    ? "Your account database"
                    : source === "local"
                      ? "This device only"
                      : "Not saved yet"}
                </strong>
                . Keys stay private to your account.
              </p>

              {message ? <p className="settings-message success">{message}</p> : null}
              {error ? <p className="settings-message error">{error}</p> : null}

              <div className="settings-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || !isAuthenticated}
                >
                  {saving ? "Saving…" : "Save keys & models"}
                </button>
                <Link to="/ai-chat" className="btn btn-ghost">
                  Open AI Chat
                </Link>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
