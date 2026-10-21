import { Link } from "react-router-dom";
import { Logo } from "./Icons";
import "./Footer.css";

const columns = [
  {
    title: "Features",
    links: [
      { to: "/overview", label: "Overview" },
      { to: "/features", label: "Features" },
      { to: "/generator", label: "Prompt Generator" },
      { to: "/ai-chat", label: "AI Chat" },
      { to: "/library", label: "Prompt Library" },
      { to: "/settings", label: "API Settings" },
    ],
  },
  {
    title: "Models",
    links: [
      { to: "/generator", label: "Text & stories" },
      { to: "/generator", label: "Image prompts" },
      { to: "/generator", label: "Video scenes" },
      { to: "/features", label: "Learning aids" },
    ],
  },
  {
    title: "Platform",
    links: [
      { to: "/about", label: "About" },
      { to: "/overview", label: "Usage graphs" },
      { to: "/#safety", label: "Safety" },
      { to: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/generator", label: "Get started" },
      { to: "/library", label: "Your library" },
      { to: "/features", label: "Features" },
      { to: "/#usecases", label: "Use cases" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/about", label: "Mission" },
      { to: "/about", label: "Who it's for" },
      { to: "/features", label: "Capabilities" },
    ],
  },
  {
    title: "Socials",
    links: [
      { to: "/about", label: "Community" },
      { to: "/about", label: "Updates" },
      { to: "/generator", label: "Try free" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="footer grid-bg">
      <div className="footer-pixels footer-pixels-l" aria-hidden="true" />
      <div className="footer-pixels footer-pixels-r" aria-hidden="true" />

      <div className="container-wide footer-grid">
        {columns.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            {col.links.map((link) => (
              <Link key={link.label} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="container-wide footer-bottom">
        <div className="footer-brand-mini">
          <Logo size={20} />
          <span>Promptora</span>
        </div>
        <p>© {new Date().getFullYear()} Promptora</p>
      </div>
    </footer>
  );
}
