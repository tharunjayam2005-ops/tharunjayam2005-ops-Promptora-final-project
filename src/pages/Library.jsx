import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { removeFromLocalLibrary, loadLocalLibrary } from "../lib/prompts";
import { deleteCloudPrompt, fetchCloudPrompts } from "../services/promptStore";
import { useAuth } from "../contexts/AuthContext";
import CopyButton from "../components/CopyButton";
import "./Library.css";

export default function Library() {
  const { isAuthenticated, isConfigured, loading, user } = useAuth();
  const [items, setItems] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Loading prompts...");

  useEffect(() => {
    async function loadItems() {
      try {
        if (isConfigured && isAuthenticated) {
          const data = await fetchCloudPrompts();
          setItems(data);
          setStatusMessage(
            data.length
              ? `Synced for ${user?.email}.`
              : "No prompts saved yet. Generate one and save it."
          );
          return;
        }

        const localItems = loadLocalLibrary();
        setItems(localItems);
        setStatusMessage(
          localItems.length
            ? `Showing saved prompts for ${user?.email}.`
            : "No prompts saved yet. Generate a prompt and click Save to library."
        );
      } catch (error) {
        setStatusMessage(error.message || "Could not load prompts.");
      }
    }

    if (!loading && isAuthenticated) {
      loadItems();
    }
  }, [isAuthenticated, isConfigured, loading, user?.email]);

  async function removeItem(id) {
    try {
      if (isConfigured && isAuthenticated) {
        await deleteCloudPrompt(id);
        setItems((current) => current.filter((item) => item.id !== id));
        return;
      }
      setItems(removeFromLocalLibrary(id));
    } catch (error) {
      setStatusMessage(error.message || "Could not remove prompt.");
    }
  }

  return (
    <main className="library page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Saved ideas</p>
          <h1 className="section-title">Your prompt library</h1>
          <p className="section-lead">
            Come back to your best prompts anytime — no starting from scratch.
          </p>
          <p className="library-status">{statusMessage}</p>
        </header>

        {items.length === 0 ? (
          <div className="empty-state fade-up">
            <h2>No prompts saved yet</h2>
            <p>Generate a prompt, then click Save to library.</p>
            <div className="lib-actions-empty">
              <Link to="/generator" className="btn btn-primary">
                Generate prompt
              </Link>
            </div>
          </div>
        ) : (
          <div className="library-grid fade-up">
            {items.map((item) => (
              <article key={item.id} className="library-card">
                <div className="library-meta">
                  <span className="lib-badge">{item.model}</span>
                  <time>
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <h3>{item.title}</h3>
                <p className="lib-prompt">{item.prompt}</p>
                <div className="lib-actions">
                  <CopyButton
                    text={item.prompt}
                    label="Copy"
                    copiedLabel="Copied!"
                    variant="primary"
                    size="sm"
                  />
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
