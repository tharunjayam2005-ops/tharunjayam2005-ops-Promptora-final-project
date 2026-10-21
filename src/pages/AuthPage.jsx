import { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Icon, Logo } from "../components/Icons";
import "./AuthPage.css";

function friendlyAuthError(message = "") {
  const text = String(message).toLowerCase();

  if (text.includes("invalid login credentials")) {
    return "Email or password is incorrect. Please try again.";
  }
  if (text.includes("email not confirmed")) {
    return "Please check your inbox and confirm your email before signing in.";
  }
  if (text.includes("user already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  if (text.includes("password")) {
    return "Please choose a stronger password (at least 6 characters).";
  }
  if (text.includes("rate limit") || text.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (text.includes("network") || text.includes("fetch")) {
    return "Connection issue. Please check your internet and try again.";
  }

  return message || "Something went wrong. Please try again.";
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, displayName, signInWithPassword, signUpWithPassword } = useAuth();
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const title = useMemo(
    () =>
      mode === "signin"
        ? "Sign in to Promptora"
        : "Create your Promptora account",
    [mode]
  );

  if (isAuthenticated && !success) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signin") {
        await signInWithPassword(email, password);
        setMessage("You’re signed in successfully.");
        setPendingEmail("");
        setSuccess(true);
      } else {
        const result = await signUpWithPassword({ name, email, password });

        if (result?.needsEmailConfirmation) {
          setPendingEmail(result.email || email);
          setMessage(
            `Thanks ${name.trim() || "there"}! We sent a confirmation link to your email.`
          );
          setSuccess(true);
          setMode("signup");
        } else {
          setPendingEmail("");
          setMessage("Your account is ready.");
          setSuccess(true);
        }
      }
    } catch (err) {
      setError(friendlyAuthError(err.message));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    const waitingForEmail = Boolean(pendingEmail);

    return (
      <main className="auth-page">
        <div className="auth-wrap">
          <section className="auth-card auth-success fade-up">
            <Link to="/" className="auth-brand">
              <Logo size={32} />
              <span>Promptora</span>
            </Link>
            <div className={`success-icon ${waitingForEmail ? "is-email" : ""}`} aria-hidden="true">
              <Icon name={waitingForEmail ? "globe" : "check"} size={28} color={waitingForEmail ? "#a78bfa" : "#4ade80"} />
            </div>
            <p className="eyebrow">{waitingForEmail ? "Check your email" : "Success"}</p>
            <h1 className="section-title">
              {waitingForEmail
                ? "Confirm your email"
                : mode === "signup"
                  ? "Welcome aboard!"
                  : "Welcome back!"}
            </h1>
            <p className="section-lead auth-lead">
              {waitingForEmail ? (
                <>
                  {message}
                  <br />
                  Open the link we sent to <strong>{pendingEmail}</strong>, then come back and sign in.
                </>
              ) : (
                <>
                  {message} Your dashboard is ready
                  {displayName ? `, ${displayName}` : ""}.
                </>
              )}
            </p>

            {waitingForEmail ? (
              <ol className="email-steps">
                <li>Open your email inbox</li>
                <li>Click the confirmation link from Promptora</li>
                <li>Return here and sign in</li>
              </ol>
            ) : null}

            <div className="success-actions">
              {waitingForEmail ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setSuccess(false);
                      setMode("signin");
                      setMessage("");
                      setError("");
                    }}
                  >
                    Go to sign in
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate("/generator")}
                  >
                    Explore generator
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to dashboard
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate("/profile")}
                  >
                    Set up profile
                  </button>
                </>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-wrap">
        <section className="auth-card fade-up">
          <Link to="/" className="auth-brand">
            <Logo size={32} />
            <span>Promptora</span>
          </Link>
          <p className="eyebrow">Account access</p>
          <h1 className="section-title">{title}</h1>
          <p className="section-lead auth-lead">
            Sign up with your name to unlock dashboard, profile, and saved prompts.
          </p>

          <div className="auth-switch">
            <button
              type="button"
              className={`auth-tab ${mode === "signin" ? "active" : ""}`}
              onClick={() => {
                setMode("signin");
                setError("");
                setMessage("");
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "signup" ? "active" : ""}`}
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
            >
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label className="field">
                <span>Full name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
              </label>
            ) : null}

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
            </label>

            {message ? <p className="auth-message success">{message}</p> : null}
            {error ? <p className="auth-message error">{error}</p> : null}

            <button type="submit" className="btn btn-primary auth-submit" disabled={submitting}>
              {submitting
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/generator" className="btn-link">
              Continue as guest →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
