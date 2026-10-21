import { useState } from "react";
import { Icon } from "./Icons";
import "./CopyButton.css";

export default function CopyButton({
  text = "",
  label = "Copy",
  copiedLabel = "Copied",
  className = "",
  size = "md",
  variant = "ghost",
  disabled = false,
  onCopied,
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const value = String(text || "");
    if (!value || disabled) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.(value);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className={`copy-btn copy-btn-${variant} copy-btn-${size} ${copied ? "is-copied" : ""} ${className}`.trim()}
      onClick={handleCopy}
      disabled={disabled || !String(text || "").trim()}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
    >
      <Icon
        name={copied ? "check" : "copy"}
        size={size === "sm" ? 13 : 15}
        color={variant === "primary" ? "#000" : "currentColor"}
      />
      <span>{copied ? copiedLabel : label}</span>
    </button>
  );
}
