import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AI_PROVIDERS,
  getChatModelCatalog,
  getModelById,
  isChatCompatibleModel,
  normalizeCustomModel,
} from "../lib/aiModels";
import { cleanAiText, summarizeReplies } from "../lib/aiResponse";
import { getSkillById, getSkillCatalog } from "../lib/skills";
import { fetchUserApiKeys, saveLocalApiKeys, saveUserApiKeys } from "../services/apiKeysStore";
import {
  addCustomSkill,
  importSkillsFromText,
  loadCustomSkills,
  removeCustomSkill,
} from "../services/skillsStore";
import { chatWithManyModels } from "../services/aiChat";
import { USAGE_EVENTS, trackUsage } from "../services/usageStore";
import { useAuth } from "../contexts/AuthContext";
import { Icon } from "../components/Icons";
import CopyButton from "../components/CopyButton";
import "./AIChat.css";

const MAX_MODELS = 6;
const SELECTED_MODELS_KEY = "promptora_ai_chat_models";
const providerOptions = Object.values(AI_PROVIDERS);

function loadSavedSelection() {
  try {
    const raw = JSON.parse(localStorage.getItem(SELECTED_MODELS_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function persistSelection(ids) {
  localStorage.setItem(SELECTED_MODELS_KEY, JSON.stringify(ids));
}

export default function AIChat() {
  const { isAuthenticated } = useAuth();
  const [keys, setKeys] = useState({ openrouter: "", gemini: "" });
  const [customModels, setCustomModels] = useState([]);
  const [customSkills, setCustomSkills] = useState([]);
  const [keysLoading, setKeysLoading] = useState(true);
  const [selectedModels, setSelectedModels] = useState(() => {
    const saved = loadSavedSelection();
    return saved.length
      ? saved
      : ["openrouter:openai/gpt-4o-mini", "gemini:gemini-2.0-flash"];
  });
  const [selectedSkillId, setSelectedSkillId] = useState("skill:general");
  const [chooseId, setChooseId] = useState("");
  const [manualDraft, setManualDraft] = useState({
    provider: "openrouter",
    model: "",
    label: "",
  });
  const [skillDraft, setSkillDraft] = useState({ name: "", prompt: "" });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  const catalog = useMemo(
    () => getChatModelCatalog(customModels),
    [customModels]
  );
  const skills = useMemo(
    () => getSkillCatalog(customSkills),
    [customSkills]
  );
  const activeSkill = getSkillById(selectedSkillId, customSkills) || skills[0];

  const selectedModelInfos = selectedModels
    .map((id) => getModelById(id, customModels))
    .filter(Boolean)
    .filter((m) => catalog.some((c) => c.id === m.id));

  const availableToChoose = catalog.filter(
    (model) => !selectedModels.includes(model.id)
  );

  useEffect(() => {
    persistSelection(selectedModels);
  }, [selectedModels]);

  useEffect(() => {
    if (!chooseId && availableToChoose[0]?.id) {
      setChooseId(availableToChoose[0].id);
    }
    if (chooseId && !availableToChoose.some((m) => m.id === chooseId)) {
      setChooseId(availableToChoose[0]?.id || "");
    }
  }, [availableToChoose, chooseId]);

  useEffect(() => {
    async function load() {
      setKeysLoading(true);
      try {
        const saved = await fetchUserApiKeys();
        setKeys({
          openrouter: saved.openrouter || "",
          gemini: saved.gemini || "",
        });
        const chatCustoms = (saved.models || []).filter((m) =>
          isChatCompatibleModel(m.model)
        );
        setCustomModels(chatCustoms);
        setCustomSkills(loadCustomSkills());

        const chatIds = new Set(
          getChatModelCatalog(chatCustoms).map((m) => m.id)
        );
        setSelectedModels((current) => {
          const kept = current.filter((id) => chatIds.has(id));
          if (kept.length) return kept;
          if (chatIds.has("openrouter:openai/gpt-4o-mini")) {
            return ["openrouter:openai/gpt-4o-mini"];
          }
          const first = getChatModelCatalog(chatCustoms)[0]?.id;
          return first ? [first] : [];
        });

        if (!saved.openrouter && !saved.gemini) {
          setStatus("Add your API keys in Settings, then choose models below.");
        } else {
          setStatus("Choose a model and click Set, or enter a model id manually.");
        }
      } catch (error) {
        setStatus(error.message || "Could not load API keys.");
      } finally {
        setKeysLoading(false);
      }
    }
    load();
  }, [isAuthenticated]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  function setModelSelection(id) {
    const model = getModelById(id, customModels);
    if (!model || !isChatCompatibleModel(model.model)) {
      setStatus("Only chat models can be set.");
      return false;
    }
    setSelectedModels((current) => {
      if (current.includes(id)) {
        setStatus(`${model.label} is already selected.`);
        return current;
      }
      if (current.length >= MAX_MODELS) {
        setStatus(`You can set up to ${MAX_MODELS} models.`);
        return current;
      }
      setStatus(`Set: ${model.label}`);
      return [...current, id];
    });
    return true;
  }

  function handleChooseSet(event) {
    event.preventDefault();
    if (!chooseId) {
      setStatus("Choose a model from the list first.");
      return;
    }
    setModelSelection(chooseId);
  }

  async function handleManualSet(event) {
    event.preventDefault();
    const modelId = manualDraft.model.trim();
    if (!modelId) {
      setStatus("Enter a model id, then click Set.");
      return;
    }
    if (!isChatCompatibleModel(modelId)) {
      setStatus(
        "That model is not for chat (video/TTS/rerank/image). Use a chat model id."
      );
      return;
    }

    const next = normalizeCustomModel({
      provider: manualDraft.provider,
      model: modelId,
      label: manualDraft.label.trim(),
      modality: "chat",
    });
    if (!next) {
      setStatus("Enter a valid provider and model id.");
      return;
    }

    const nextCustoms = [
      ...customModels.filter((item) => item.id !== next.id),
      next,
    ];
    setCustomModels(nextCustoms);

    // Keep keys + models in local cache; sync to account when signed in
    try {
      const payload = {
        openrouter: keys.openrouter,
        gemini: keys.gemini,
        models: nextCustoms,
      };
      if (isAuthenticated) {
        const saved = await saveUserApiKeys(payload);
        setKeys({
          openrouter: saved.openrouter || "",
          gemini: saved.gemini || "",
        });
        setCustomModels(saved.models || nextCustoms);
      } else {
        saveLocalApiKeys(payload);
      }
    } catch {
      saveLocalApiKeys({
        openrouter: keys.openrouter,
        gemini: keys.gemini,
        models: nextCustoms,
      });
    }

    setModelSelection(next.id);
    setManualDraft({
      provider: manualDraft.provider,
      model: "",
      label: "",
    });
  }

  function removeModel(id) {
    setSelectedModels((current) =>
      current.length <= 1 ? current : current.filter((item) => item !== id)
    );
  }

  function handleAddSkill(event) {
    event.preventDefault();
    try {
      const next = addCustomSkill(skillDraft);
      setCustomSkills(next);
      const created = next[next.length - 1];
      if (created) setSelectedSkillId(created.id);
      setSkillDraft({ name: "", prompt: "" });
      setStatus(`Skill “${created?.name || "custom"}” added.`);
    } catch (error) {
      setStatus(error.message || "Could not add skill.");
    }
  }

  function handleRemoveSkill(id) {
    const next = removeCustomSkill(id);
    setCustomSkills(next);
    if (selectedSkillId === id) setSelectedSkillId("skill:general");
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const lower = file.name.toLowerCase();
      const format = lower.endsWith(".csv") ? "csv" : "json";
      const next = importSkillsFromText(text, format);
      setCustomSkills(next);
      setStatus(`Imported skills from ${file.name}.`);
    } catch (error) {
      setStatus(error.message || "Import failed. Use CSV or JSON.");
    }
  }

  async function handleSend(event) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    if (selectedModelInfos.length === 0) {
      setStatus("Add at least one chat model with +.");
      return;
    }

    const neededProviders = new Set(
      selectedModelInfos.map((item) => item.provider)
    );

    if (neededProviders.has("openrouter") && !keys.openrouter) {
      setStatus("OpenRouter key is missing. Save it in Settings first.");
      return;
    }
    if (neededProviders.has("gemini") && !keys.gemini) {
      setStatus("Gemini key is missing. Save it in Settings first.");
      return;
    }

    const systemPrompt =
      activeSkill?.prompt ||
      "You are Promptora AI Skills assistant. Be clear, helpful, and practical.";

    const historyForApi = [
      { role: "system", content: systemPrompt },
      ...messages.flatMap((entry) => {
        if (entry.role === "user") {
          return [{ role: "user", content: entry.content }];
        }
        return [];
      }),
      { role: "user", content: text },
    ];

    const modelIds = selectedModelInfos.map((m) => m.id);
    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: Date.now(),
    };

    const pendingId = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      userMessage,
      {
        id: pendingId,
        role: "assistant-group",
        modelIds,
        skillId: activeSkill?.id,
        replies: modelIds.map((modelId) => ({
          modelId,
          content: "",
          error: "",
          loading: true,
        })),
        createdAt: Date.now(),
      },
    ]);
    setInput("");
    setSending(true);
    setStatus(
      `Skill: ${activeSkill?.name || "General"} · sending to ${modelIds.length} model${modelIds.length > 1 ? "s" : ""}…`
    );

    try {
      const replies = await chatWithManyModels({
        modelIds,
        messages: historyForApi,
        keys,
        catalog,
      });

      setMessages((current) =>
        current.map((entry) =>
          entry.id === pendingId
            ? {
                ...entry,
                replies: replies.map((reply) => ({
                  ...reply,
                  content: cleanAiText(reply.content),
                  loading: false,
                })),
              }
            : entry
        )
      );
      setStatus(summarizeReplies(replies));
      trackUsage(USAGE_EVENTS.CHAT, {
        models: modelIds.length,
        skill: activeSkill?.id || "skill:general",
      });
    } catch (error) {
      setMessages((current) =>
        current.map((entry) =>
          entry.id === pendingId
            ? {
                ...entry,
                replies: modelIds.map((modelId) => ({
                  modelId,
                  content: "",
                  error: error.message || "Request failed.",
                  loading: false,
                })),
              }
            : entry
        )
      );
      setStatus(error.message || "Could not get AI responses.");
    } finally {
      setSending(false);
    }
  }

  function clearChat() {
    setMessages([]);
    setStatus("Chat cleared.");
  }

  return (
    <main className="ai-chat page-shell">
      <div className="container-wide ai-chat-shell">
        <header className="page-header fade-up">
          <p className="eyebrow">AI Skills</p>
          <h1 className="section-title">Multi-model chat</h1>
          <p className="section-lead">
            Pick a skill, choose models and click Set, then compare answers.
          </p>
        </header>

        <div className="ai-layout fade-up">
          <aside className="ai-sidebar">
            <section className="ai-panel">
              <h2>API keys</h2>
              <ul className="ai-key-status">
                <li className={keys.openrouter ? "ok" : "missing"}>
                  OpenRouter {keysLoading ? "…" : keys.openrouter ? "ready" : "not set"}
                </li>
                <li className={keys.gemini ? "ok" : "missing"}>
                  Gemini {keysLoading ? "…" : keys.gemini ? "ready" : "not set"}
                </li>
              </ul>
              <Link to="/settings" className="btn btn-primary btn-sm">
                Open Settings
              </Link>
            </section>

            <section className="ai-panel">
              <div className="ai-panel-head">
                <h2>Choose & set models</h2>
                <span className="ai-count">
                  {selectedModelInfos.length}/{MAX_MODELS}
                </span>
              </div>
              <p className="ai-help">
                Choose from the list and click Set, or enter a chat model id manually.
              </p>

              <div className="ai-selected-models">
                {selectedModelInfos.length === 0 ? (
                  <p className="ai-help">No models set yet.</p>
                ) : (
                  selectedModelInfos.map((model) => (
                    <div key={model.id} className="ai-selected-chip">
                      <div>
                        <strong>{model.label}</strong>
                        <span>
                          {model.badge}
                          {model.custom ? " · custom" : ""}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="ai-chip-remove"
                        title="Remove model"
                        aria-label={`Remove ${model.label}`}
                        onClick={() => removeModel(model.id)}
                        disabled={selectedModelInfos.length <= 1}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <form className="ai-model-set-form" onSubmit={handleChooseSet}>
                <label className="ai-field-label">Choose model</label>
                <div className="ai-model-set-row">
                  <select
                    value={chooseId}
                    onChange={(e) => setChooseId(e.target.value)}
                    aria-label="Choose model"
                    disabled={availableToChoose.length === 0}
                  >
                    {availableToChoose.length === 0 ? (
                      <option value="">All models already set</option>
                    ) : (
                      availableToChoose.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.label} ({model.badge})
                        </option>
                      ))
                    )}
                  </select>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm ai-set-btn"
                    disabled={!chooseId || selectedModelInfos.length >= MAX_MODELS}
                  >
                    Set
                  </button>
                </div>
              </form>

              <form className="ai-model-set-form" onSubmit={handleManualSet}>
                <label className="ai-field-label">Enter model id</label>
                <div className="ai-manual-grid">
                  <select
                    value={manualDraft.provider}
                    onChange={(e) =>
                      setManualDraft((d) => ({ ...d, provider: e.target.value }))
                    }
                    aria-label="Provider"
                  >
                    {providerOptions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={manualDraft.model}
                    onChange={(e) =>
                      setManualDraft((d) => ({ ...d, model: e.target.value }))
                    }
                    placeholder={
                      manualDraft.provider === "openrouter"
                        ? "openai/gpt-4o-mini"
                        : "gemini-2.0-flash"
                    }
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    value={manualDraft.label}
                    onChange={(e) =>
                      setManualDraft((d) => ({ ...d, label: e.target.value }))
                    }
                    placeholder="Name (optional)"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="btn btn-accent btn-sm ai-set-btn"
                    disabled={selectedModelInfos.length >= MAX_MODELS}
                  >
                    <Icon name="plus" size={14} color="#fff" />
                    Set
                  </button>
                </div>
                <p className="ai-help">
                  Example: <code>openai/gpt-4o-mini</code> or{" "}
                  <code>gemini-2.0-flash</code>
                </p>
              </form>
            </section>

            <section className="ai-panel">
              <div className="ai-panel-head">
                <h2>Skills</h2>
                <span className="ai-count">{skills.length}</span>
              </div>
              <p className="ai-help">
                Built-in skills + your custom skills. Import CSV / JSON or add manually.
              </p>

              <div className="ai-skill-list">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className={`ai-skill-chip ${selectedSkillId === skill.id ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="ai-skill-select"
                      onClick={() => setSelectedSkillId(skill.id)}
                    >
                      <strong>{skill.name}</strong>
                      <span>{skill.category}</span>
                    </button>
                    {skill.custom ? (
                      <button
                        type="button"
                        className="ai-chip-remove"
                        title="Remove skill"
                        onClick={() => handleRemoveSkill(skill.id)}
                      >
                        <Icon name="x" size={14} />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              <form className="ai-skill-form" onSubmit={handleAddSkill}>
                <input
                  type="text"
                  placeholder="Skill name"
                  value={skillDraft.name}
                  onChange={(e) =>
                    setSkillDraft((d) => ({ ...d, name: e.target.value }))
                  }
                />
                <textarea
                  rows={3}
                  placeholder="Skill instructions / system prompt"
                  value={skillDraft.prompt}
                  onChange={(e) =>
                    setSkillDraft((d) => ({ ...d, prompt: e.target.value }))
                  }
                />
                <button type="submit" className="btn btn-ghost btn-sm ai-skill-add-btn">
                  <Icon name="plus" size={14} />
                  Add skill
                </button>
              </form>

              <div className="ai-import-row">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,.csv,application/json,text/csv"
                  hidden
                  onChange={handleImportFile}
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  Import CSV / JSON
                </button>
              </div>
              <p className="ai-help">
                CSV: <code>name,prompt</code> · JSON:{" "}
                <code>[{`{ "name": "...", "prompt": "..." }`}]</code>
              </p>
            </section>
          </aside>

          <section className="ai-main">
            <div className="ai-toolbar">
              <div>
                <strong>{selectedModelInfos.length}</strong> model
                {selectedModelInfos.length === 1 ? "" : "s"}
                {" · "}
                Skill: <strong>{activeSkill?.name || "General"}</strong>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={clearChat}>
                Clear chat
              </button>
            </div>

            <div className="ai-messages">
              {messages.length === 0 ? (
                <div className="ai-empty">
                  <Icon name="wand" size={28} color="#a78bfa" />
                  <h3>Multi-model + skills ready</h3>
                  <p>
                    Choose a skill, choose a model and click <strong>Set</strong>, then send a
                    message to compare answers.
                  </p>
                </div>
              ) : (
                messages.map((entry) =>
                  entry.role === "user" ? (
                    <article key={entry.id} className="ai-bubble user">
                      <div className="ai-bubble-head">
                        <span className="ai-role">You</span>
                        <CopyButton
                          text={entry.content}
                          label="Copy"
                          size="sm"
                          className="ai-copy-inline"
                        />
                      </div>
                      <p>{entry.content}</p>
                    </article>
                  ) : (
                    <article key={entry.id} className="ai-reply-group">
                      <span className="ai-role">AI responses</span>
                      <div className="ai-reply-grid">
                        {entry.replies.map((reply) => {
                          const model = getModelById(reply.modelId, customModels);
                          const failed = Boolean(reply.error);
                          const clean = cleanAiText(reply.content);
                          return (
                            <div
                              key={reply.modelId}
                              className={`ai-reply-card ${failed ? "is-error" : "is-ok"}`}
                            >
                              <header>
                                <div className="ai-reply-title">
                                  <Icon name="code" size={14} color="#a78bfa" />
                                  <strong>{model?.label || reply.modelId}</strong>
                                  <span className={failed ? "err-badge" : ""}>
                                    {failed ? "Error" : model?.badge || "OK"}
                                  </span>
                                </div>
                                {!failed && !reply.loading && clean ? (
                                  <CopyButton
                                    text={clean}
                                    label="Copy"
                                    size="sm"
                                    className="ai-copy-inline"
                                  />
                                ) : null}
                              </header>
                              {reply.loading ? (
                                <p className="ai-loading">Thinking…</p>
                              ) : failed ? (
                                <div className="ai-error-box">
                                  <p className="ai-error">{reply.error}</p>
                                  <button
                                    type="button"
                                    className="ai-error-action"
                                    onClick={() => removeModel(reply.modelId)}
                                  >
                                    Remove this model
                                  </button>
                                </div>
                              ) : (
                                <p className="ai-reply-text">{clean}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </article>
                  )
                )
              )}
              <div ref={bottomRef} />
            </div>

            {status ? <p className="ai-status">{status}</p> : null}

            <form className="ai-composer" onSubmit={handleSend}>
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask with “${activeSkill?.name || "General"}” skill…`}
                disabled={sending}
              />
              <div className="ai-composer-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={sending || !input.trim()}
                >
                  <Icon name="zap" size={15} color="#000" />
                  {sending ? "Sending…" : "Send to all models"}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
