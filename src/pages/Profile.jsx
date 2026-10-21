import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { loadLocalLibrary } from "../lib/prompts";
import { fetchCloudPrompts } from "../services/promptStore";
import {
  buildProfileReportData,
  exportProfileJson,
  exportProfilePdf,
  exportProfileTxt,
} from "../services/profileExport";
import { Icon } from "../components/Icons";
import "./Profile.css";

export default function Profile() {
  const { user, displayName, updateProfile, isConfigured, isAuthenticated } =
    useAuth();
  const fileRef = useRef(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [preview, setPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState("");
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    setName(user?.name || "");
    setBio(user?.bio || "");
    setPreview(user?.avatar_url || "");
  }, [user]);

  useEffect(() => {
    async function loadPrompts() {
      try {
        if (isConfigured && isAuthenticated) {
          setPrompts(await fetchCloudPrompts());
          return;
        }
        setPrompts(loadLocalLibrary());
      } catch {
        setPrompts(loadLocalLibrary());
      }
    }
    if (isAuthenticated) loadPrompts();
  }, [isConfigured, isAuthenticated]);

  function onPickFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, or WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    setError("");
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({ name, bio, avatarFile });
      setAvatarFile(null);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  function getReport() {
    return buildProfileReportData({
      user: {
        ...user,
        name: name || user?.name,
        bio: bio || user?.bio,
      },
      displayName: name || displayName,
      prompts,
      days: 30,
    });
  }

  function handleExport(type) {
    setError("");
    setMessage("");
    setExporting(type);
    try {
      const report = getReport();
      if (type === "pdf") exportProfilePdf(report);
      if (type === "txt") exportProfileTxt(report);
      if (type === "json") exportProfileJson(report);
      setMessage(
        type === "pdf"
          ? "PDF preview opened. Use Print → Save as PDF for aligned export."
          : `Profile ${type.toUpperCase()} exported successfully.`
      );
    } catch (err) {
      setError(err.message || "Could not export profile report.");
    } finally {
      setExporting("");
    }
  }

  const initial = (displayName || "C").charAt(0).toUpperCase();

  return (
    <main className="profile page-shell">
      <div className="container">
        <header className="page-header fade-up">
          <p className="eyebrow">Profile</p>
          <h1 className="section-title">Update your profile</h1>
          <p className="section-lead">
            Edit your profile, then export this particular profile’s content and programs as
            PDF, text, or JSON.
          </p>
        </header>

        <div className="profile-layout fade-up">
          <aside className="profile-preview-card">
            {preview ? (
              <img src={preview} alt="" className="profile-photo" />
            ) : (
              <div className="profile-photo profile-photo-fallback">{initial}</div>
            )}
            <h2>{name || displayName}</h2>
            <p>{user?.email}</p>
            <p className="profile-bio-preview">{bio || "No bio yet."}</p>

            <div className="profile-export">
              <h3>Export this profile</h3>
              <p>
                Includes profile details, saved prompts/programs, skills, custom models, and
                usage summary. PDF text is left-aligned for clean printing.
              </p>
              <div className="profile-export-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  disabled={Boolean(exporting)}
                  onClick={() => handleExport("pdf")}
                >
                  {exporting === "pdf" ? "Opening…" : "Export PDF"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={Boolean(exporting)}
                  onClick={() => handleExport("txt")}
                >
                  Export TXT
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={Boolean(exporting)}
                  onClick={() => handleExport("json")}
                >
                  Export JSON
                </button>
              </div>
            </div>

            <Link to="/dashboard" className="btn-link">
              Back to dashboard →
            </Link>
          </aside>

          <form className="profile-form" onSubmit={handleSubmit}>
            <div className="profile-upload">
              <div>
                <h3>Profile image</h3>
                <p>JPG, PNG, or WebP. Max 2MB.</p>
              </div>
              <div className="profile-upload-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Icon name="image" size={14} />
                  Upload image
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={onPickFile}
                />
              </div>
            </div>

            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input type="email" value={user?.email || ""} disabled />
            </label>

            <label className="field">
              <span>Bio</span>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others what you like to create..."
              />
            </label>

            {message ? <p className="profile-message success">{message}</p> : null}
            {error ? <p className="profile-message error">{error}</p> : null}

            <div className="profile-actions">
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save profile"}
              </button>
              <Link to="/dashboard" className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
