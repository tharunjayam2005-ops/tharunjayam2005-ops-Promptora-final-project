import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon, Logo } from "./Icons";
import { useAuth } from "../contexts/AuthContext";
import "./AppSidebar.css";

const COLLAPSE_KEY = "promptora_sidebar_collapsed";

const railItems = [
  { to: "/", icon: "home", label: "Home", end: true },
  { to: "/overview", icon: "chart", label: "Overview" },
  { to: "/generator", icon: "wand", label: "Generator" },
  { to: "/ai-chat", icon: "chat", label: "AI Chat" },
  { to: "/library", icon: "library", label: "Library", auth: true },
  { to: "/features", icon: "stack", label: "Features" },
  { to: "/about", icon: "idea", label: "About" },
];

const railAccount = [
  { to: "/dashboard", icon: "chart", label: "Dashboard", auth: true },
  { to: "/settings", icon: "settings", label: "Settings", auth: true },
  { to: "/profile", icon: "user", label: "Profile", auth: true },
];

const menuGroups = [
  {
    id: "create",
    title: "Create",
    defaultOpen: true,
    items: [
      { to: "/generator", label: "Prompt Generator", icon: "wand" },
      { to: "/ai-chat", label: "AI Chat", icon: "chat" },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    defaultOpen: true,
    items: [
      { to: "/library", label: "Prompt Library", icon: "library", auth: true },
      { to: "/dashboard", label: "Dashboard", icon: "chart", auth: true },
    ],
  },
  {
    id: "product",
    title: "Product",
    defaultOpen: true,
    items: [
      { to: "/overview", label: "Overview", icon: "chart" },
      { to: "/features", label: "Features", icon: "stack" },
      { to: "/about", label: "About", icon: "idea" },
    ],
  },
  {
    id: "account",
    title: "Account",
    defaultOpen: false,
    items: [
      { to: "/settings", label: "API Settings", icon: "settings", auth: true },
      { to: "/profile", label: "Profile", icon: "user", auth: true },
      { to: "/auth", label: "Sign in", icon: "user", guest: true },
    ],
  },
];

function sectionTitle(pathname) {
  if (pathname.startsWith("/overview")) return "Overview";
  if (pathname.startsWith("/generator")) return "Generator";
  if (pathname.startsWith("/ai-chat")) return "AI Chat";
  if (pathname.startsWith("/library")) return "Library";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/profile")) return "Profile";
  if (pathname.startsWith("/features")) return "Features";
  if (pathname.startsWith("/about")) return "About";
  return "Promptora";
}

export default function AppSidebar() {
  const { isAuthenticated, displayName, signOut } = useAuth();
  const { pathname } = useLocation();
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState(() =>
    Object.fromEntries(menuGroups.map((g) => [g.id, g.defaultOpen])),
  );
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, collapsed ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  const title = sectionTitle(pathname);
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    return menuGroups
      .map((group) => {
        const items = group.items.filter((item) => {
          if (item.auth && !isAuthenticated) return false;
          if (item.guest && isAuthenticated) return false;
          if (q && !item.label.toLowerCase().includes(q)) return false;
          return true;
        });
        return { ...group, items };
      })
      .filter((group) => group.items.length > 0);
  }, [isAuthenticated, q]);

  function toggleGroup(id) {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function expandPanel() {
    setCollapsed(false);
  }

  function collapsePanel() {
    setCollapsed(true);
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
  }

  const visibleRail = [
    ...railItems.filter((item) => !item.auth || isAuthenticated),
    ...(isAuthenticated ? railAccount : []),
  ];

  return (
    <aside
      className={`app-sidebar ${collapsed ? "is-collapsed" : "is-expanded"}`}
    >
      <div className="app-rail">
        <Link to="/" className="app-rail-logo" title="Promptora">
          <Logo size={28} />
        </Link>

        <nav className="app-rail-nav" aria-label="Primary">
          {visibleRail.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `app-rail-link ${isActive ? "is-active" : ""}`
              }
              title={item.label}
              onClick={expandPanel}
            >
              <Icon name={item.icon} size={18} />
            </NavLink>
          ))}
        </nav>

        {collapsed ? (
          <button
            type="button"
            className="app-rail-link app-rail-expand"
            title="Expand menu"
            aria-label="Expand menu"
            onClick={expandPanel}
          >
            <Icon name="chevron_right" size={18} />
          </button>
        ) : null}
      </div>

      <div className="app-side-panel" aria-hidden={collapsed}>
        <div className="app-side-head">
          <h2>{title}</h2>
          <button
            type="button"
            className="app-side-collapse-btn"
            title="Collapse menu"
            aria-label="Collapse menu"
            onClick={collapsePanel}
          >
            <Icon name="chevron_left" size={16} />
          </button>
        </div>

        <div className="app-side-search-row">
          <label className="app-side-search">
            <Icon name="search" size={15} />
            <input
              type="search"
              placeholder="Search menus..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <Link to="/generator" className="app-side-plus" title="New prompt">
            <Icon name="plus" size={16} />
          </Link>
        </div>

        <div className="app-side-groups">
          {groups.map((group) => {
            const open = q ? true : openGroups[group.id];
            return (
              <section key={group.id} className="app-side-group">
                <button
                  type="button"
                  className="app-side-group-toggle"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={open}
                >
                  <span>{group.title}</span>
                  <Icon
                    name={open ? "chevron_down" : "chevron_right"}
                    size={14}
                  />
                </button>
                {open ? (
                  <div className="app-side-items">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to + item.label}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `app-side-item ${isActive ? "is-active" : ""}`
                        }
                      >
                        <Icon name={item.icon} size={15} />
                        <span>{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <div className="app-side-foot">
          {isAuthenticated ? (
            <>
              <p className="app-side-user">{displayName}</p>
              <button
                type="button"
                className="app-side-action"
                onClick={handleSignOut}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/auth" className="app-side-action">
              Sign in / Sign up
            </Link>
          )}
        </div>
      </div>

      {/* Floating edge arrow when collapsed — easy to expand */}
      {collapsed ? (
        <button
          type="button"
          className="app-edge-expand"
          title="Expand menu"
          aria-label="Expand menu"
          onClick={expandPanel}
        >
          <Icon name="chevron_right" size={16} />
        </button>
      ) : null}
    </aside>
  );
}
