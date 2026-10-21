import { NavLink, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Logo } from "./Icons";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/overview", label: "Overview" },
  { to: "/generator", label: "Generator" },
  { to: "/ai-chat", label: "AI Chat" },
  { to: "/features", label: "Features" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { isAuthenticated, signOut, user, displayName } = useAuth();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleSignOut() {
    try {
      await signOut();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  const initial = (displayName || "C").charAt(0).toUpperCase();

  return (
    <header className="nav">
      <div className="nav-inner container-wide">
        <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
          <Logo size={28} />
          <span className="nav-name">Promptora</span>
        </Link>

        <button
          className={`nav-toggle ${open ? "is-open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "is-open" : ""}`}>
          <div className="nav-main">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className="nav-auth-link"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/library"
                  className="nav-auth-link"
                  onClick={() => setOpen(false)}
                >
                  Library
                </NavLink>
                <NavLink
                  to="/settings"
                  className="nav-auth-link"
                  onClick={() => setOpen(false)}
                >
                  Settings
                </NavLink>
                <NavLink
                  to="/profile"
                  className="nav-auth-link"
                  onClick={() => setOpen(false)}
                >
                  Profile
                </NavLink>
              </>
            ) : null}
          </div>

          <div className="nav-right">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="nav-user-chip"
                  onClick={() => setOpen(false)}
                  title={user?.email || displayName}
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="nav-avatar" />
                  ) : (
                    <span className="nav-avatar nav-avatar-fallback">{initial}</span>
                  )}
                  <span className="nav-user">{displayName}</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="btn btn-primary btn-sm nav-cta"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm nav-signout"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="nav-text-link"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  className="btn btn-primary btn-sm nav-cta"
                  onClick={() => setOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
