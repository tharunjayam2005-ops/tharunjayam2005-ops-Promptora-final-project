import { NavLink } from "react-router-dom";
import { Icon } from "./Icons";
import { useAuth } from "../contexts/AuthContext";
import "./MobileBottomNav.css";

const items = [
  { to: "/", label: "Home", icon: "home", end: true },
  { to: "/generator", label: "Generate", icon: "wand" },
  { to: "/ai-chat", label: "Chat", icon: "chat" },
  { to: "/library", label: "Library", icon: "library", auth: true },
  { to: "/dashboard", label: "Dash", icon: "chart", auth: true },
  { to: "/auth", label: "Sign in", icon: "user", guest: true },
];

export default function MobileBottomNav() {
  const { isAuthenticated } = useAuth();

  const visible = items.filter((item) => {
    if (item.auth && !isAuthenticated) return false;
    if (item.guest && isAuthenticated) return false;
    return true;
  });

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile">
      {visible.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            `mobile-bottom-link ${isActive ? "is-active" : ""}`
          }
        >
          <Icon name={item.icon} size={18} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
