// Central SVG icon library for Promptora
// Usage: <Icon name="text" size={32} /> or <Icon name="text" className="my-class" />

export function Icon({ name, size = 24, color = "currentColor", className = "", style }) {
  const props = {
    xmlns: "http://www.w3.org/2000/svg",
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    style,
    "aria-hidden": true,
  };

  const icons = {
    // Content types
    text: (
      <svg {...props}>
        <path d="M4 7V4h16v3M9 20h6M12 4v16" />
      </svg>
    ),
    image: (
      <svg {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    ),
    video: (
      <svg {...props}>
        <path d="m22 8-6 4 6 4V8z" />
        <rect x="2" y="6" width="14" height="12" rx="2" />
      </svg>
    ),
    lesson: (
      <svg {...props}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    idea: (
      <svg {...props}>
        <path d="M9 18h6M10 22h4" />
        <path d="M12 2a7 7 0 0 1 7 7 7 7 0 0 1-4 6.32V17H9v-1.68A7 7 0 0 1 5 9a7 7 0 0 1 7-7z" />
      </svg>
    ),
    // Features
    wand: (
      <svg {...props}>
        <path d="M15 4V2m0 2 1 1m-1-1-1 1M3 10l1 1m-1-1-1 1m5-5 1 1m-1-1-1 1" />
        <path d="m3 21 9-9M12.5 8l3.5 3.5" />
      </svg>
    ),
    save: (
      <svg {...props}>
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    ),
    library: (
      <svg {...props}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    shield: (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    users: (
      <svg {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    stack: (
      <svg {...props}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    zap: (
      <svg {...props}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    copy: (
      <svg {...props}>
        <rect x="8" y="8" width="12" height="12" rx="1.5" />
        <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    ),
    check: (
      <svg {...props}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    code: (
      <svg {...props}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    arrow_right: (
      <svg {...props}>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
    sparkle: (
      <svg {...props} fill={color} stroke="none">
        <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
      </svg>
    ),
    globe: (
      <svg {...props}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    database: (
      <svg {...props}>
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    // Nav / branding
    logo: (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} style={style} aria-hidden>
        <rect width="32" height="32" rx="0" fill="#7c3aed" />
        <path d="M8 22V10h5c2.76 0 4.5 1.5 4.5 3.75S15.76 17.5 13 17.5H11V22H8zm3-6.75h1.8c1.1 0 1.7-.55 1.7-1.5s-.6-1.5-1.7-1.5H11v3z" fill="#fff" />
        <circle cx="22" cy="11" r="3.5" fill="#2dd4bf" />
      </svg>
    ),
    // Model-specific  
    script: (
      <svg {...props}>
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    safety: (
      <svg {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    chart: (
      <svg {...props}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    home: (
      <svg {...props}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
      </svg>
    ),
    chat: (
      <svg {...props}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
    settings: (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </svg>
    ),
    user: (
      <svg {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    search: (
      <svg {...props}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    ),
    plus: (
      <svg {...props}>
        <path d="M12 5v14M5 12h14" />
      </svg>
    ),
    chevron_right: (
      <svg {...props}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    ),
    chevron_left: (
      <svg {...props}>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    ),
    chevron_down: (
      <svg {...props}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    ),
    eye: (
      <svg {...props}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    eye_off: (
      <svg {...props}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-6.5 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
    x: (
      <svg {...props}>
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
    arrow_left: (
      <svg {...props}>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    ),
    layout: (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="18" rx="1" />
        <rect x="14" y="3" width="7" height="18" rx="1" />
      </svg>
    ),
  };

  return icons[name] ?? (
    <svg {...props}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

// Standalone logo SVG (used in Navbar, Footer)
export function Logo({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect width="32" height="32" fill="#7c3aed" />
      <path
        d="M8 22V10h5c2.76 0 4.5 1.5 4.5 3.75S15.76 17.5 13 17.5H11V22H8zm3-6.75h1.8c1.1 0 1.7-.55 1.7-1.5s-.6-1.5-1.7-1.5H11v3z"
        fill="#fff"
      />
      <circle cx="22" cy="11" r="3.5" fill="#2dd4bf" />
    </svg>
  );
}

// Stack icon cells — branded SVG icons for each tech
export function StackIcon({ name, size = 40 }) {
  const icons = {
    React: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <g stroke="#61dafb" strokeWidth="1.5" fill="none">
          <ellipse cx="20" cy="20" rx="10" ry="4"/>
          <ellipse cx="20" cy="20" rx="10" ry="4" transform="rotate(60 20 20)"/>
          <ellipse cx="20" cy="20" rx="10" ry="4" transform="rotate(120 20 20)"/>
        </g>
        <circle cx="20" cy="20" r="2" fill="#61dafb"/>
      </svg>
    ),
    Python: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M15 12c0-2 1-3 3-3h4c5 0 6 2 6 5v3H15z" fill="#3b82f6"/>
        <path d="M25 28c0 2-1 3-3 3h-4c-5 0-6-2-6-5v-3h13z" fill="#fbbf24"/>
        <circle cx="17.5" cy="15" r="1.5" fill="#fff"/>
        <circle cx="22.5" cy="25" r="1.5" fill="#fff"/>
      </svg>
    ),
    PostgreSQL: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <ellipse cx="20" cy="14" rx="8" ry="4" fill="none" stroke="#336791" strokeWidth="1.5"/>
        <path d="M12 14v10c0 2.2 3.6 4 8 4s8-1.8 8-4V14" stroke="#336791" strokeWidth="1.5" fill="none"/>
        <line x1="20" y1="18" x2="20" y2="26" stroke="#336791" strokeWidth="1.5"/>
      </svg>
    ),
    Node: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M20 8 L30 14 L30 26 L20 32 L10 26 L10 14 Z" fill="none" stroke="#68a063" strokeWidth="1.5"/>
        <text x="16" y="23" fill="#68a063" fontSize="9" fontFamily="monospace" fontWeight="bold">JS</text>
      </svg>
    ),
    Vite: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M28 9L19 28l-2-8L9 13z" fill="#a855f7" opacity=".9"/>
        <path d="M19 28L14 14l5 4z" fill="#fbbf24"/>
      </svg>
    ),
    OpenAI: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M20 10a10 10 0 1 0 0 20A10 10 0 0 0 20 10zm0 3a7 7 0 1 1 0 14A7 7 0 0 1 20 13z" fill="none" stroke="#fff" strokeWidth="1.2"/>
        <path d="M16 20h8M20 16v8" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    HTML: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M10 10l2 20 8 2 8-2 2-20z" fill="none" stroke="#e34c26" strokeWidth="1.4"/>
        <path d="M15 16h10l-.5 5-4.5 1.5L15.5 21l-.2-2H14" stroke="#e34c26" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
    CSS: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M10 10l2 20 8 2 8-2 2-20z" fill="none" stroke="#264de4" strokeWidth="1.4"/>
        <path d="M14 16h12M14.5 21h10l-1 5-3.5 1-3.5-1" stroke="#264de4" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
    JS: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <rect x="10" y="10" width="20" height="20" fill="none" stroke="#f7df1e" strokeWidth="1.4"/>
        <text x="14" y="26" fill="#f7df1e" fontSize="10" fontFamily="monospace" fontWeight="bold">JS</text>
      </svg>
    ),
    Docker: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M8 22c0-4 3-7 7-7h10c4 0 7 3 7 7" stroke="#2496ed" strokeWidth="1.4" fill="none"/>
        <rect x="15" y="16" width="5" height="4" rx="1" stroke="#2496ed" strokeWidth="1.2" fill="none"/>
        <rect x="20" y="16" width="5" height="4" rx="1" stroke="#2496ed" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
    Git: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <circle cx="14" cy="14" r="3" stroke="#f05032" strokeWidth="1.4" fill="none"/>
        <circle cx="14" cy="26" r="3" stroke="#f05032" strokeWidth="1.4" fill="none"/>
        <circle cx="26" cy="17" r="3" stroke="#f05032" strokeWidth="1.4" fill="none"/>
        <path d="M14 17v6M14 17l12 0" stroke="#f05032" strokeWidth="1.2"/>
      </svg>
    ),
    Flask: (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect width="40" height="40" fill="#0e0e0e"/>
        <path d="M17 10v8l-7 12h20L23 18V10" stroke="#fff" strokeWidth="1.4" fill="none"/>
        <line x1="17" y1="10" x2="23" y2="10" stroke="#fff" strokeWidth="1.4"/>
        <circle cx="15" cy="26" r="1.5" fill="#a78bfa"/>
        <circle cx="19" cy="29" r="1" fill="#a78bfa"/>
      </svg>
    ),
  };
  return icons[name] ?? (
    <svg viewBox="0 0 40 40" width={size} height={size}>
      <rect width="40" height="40" fill="#0e0e0e"/>
      <text x="8" y="26" fill="#a78bfa" fontSize="10" fontFamily="monospace">{name.slice(0,3)}</text>
    </svg>
  );
}

// Feature icons - pixel/angular Render style
export function FeatureIcon({ type, size = 36 }) {
  const icons = {
    generator: (
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#18103a"/>
        <path d="M10 26L18 6l8 20" stroke="#a78bfa" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M12.5 20h11" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round"/>
        <circle cx="26" cy="12" r="3" fill="#2dd4bf"/>
      </svg>
    ),
    multimodel: (
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#18103a"/>
        <rect x="6" y="8" width="10" height="8" rx="1" stroke="#a78bfa" strokeWidth="1.5"/>
        <rect x="20" y="8" width="10" height="8" rx="1" stroke="#2dd4bf" strokeWidth="1.5"/>
        <rect x="13" y="20" width="10" height="8" rx="1" stroke="#f472b6" strokeWidth="1.5"/>
        <path d="M16 16l2 4M20 16l-2 4" stroke="#a78bfa" strokeWidth="1.2"/>
      </svg>
    ),
    beginner: (
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#18103a"/>
        <circle cx="18" cy="15" r="7" stroke="#a78bfa" strokeWidth="1.6"/>
        <path d="M11 27c0-3.86 3.13-7 7-7s7 3.14 7 7" stroke="#a78bfa" strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M16 15l1.5 1.5L20.5 13" stroke="#2dd4bf" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    library: (
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#18103a"/>
        <rect x="7" y="8" width="5" height="20" rx="1" fill="#a78bfa" opacity=".5"/>
        <rect x="14" y="10" width="5" height="18" rx="1" fill="#a78bfa" opacity=".75"/>
        <rect x="21" y="7" width="8" height="21" rx="1" stroke="#a78bfa" strokeWidth="1.5" fill="none"/>
        <line x1="23" y1="12" x2="27" y2="12" stroke="#2dd4bf" strokeWidth="1.4"/>
        <line x1="23" y1="16" x2="27" y2="16" stroke="#2dd4bf" strokeWidth="1.4"/>
      </svg>
    ),
    safe: (
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#18103a"/>
        <path d="M18 5L8 9v9c0 6.08 4.3 11.75 10 13 5.7-1.25 10-6.92 10-13V9z" stroke="#a78bfa" strokeWidth="1.6"/>
        <path d="M13 18l3 3 7-7" stroke="#2dd4bf" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    stack: (
      <svg viewBox="0 0 36 36" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#18103a"/>
        <path d="M7 20l11-6 11 6-11 6z" stroke="#a78bfa" strokeWidth="1.5" fill="none"/>
        <path d="M7 15l11-6 11 6" stroke="#a78bfa" strokeWidth="1.5" fill="none" opacity=".5"/>
        <path d="M7 25l11 6 11-6" stroke="#2dd4bf" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  };
  return icons[type] ?? icons.generator;
}
