import React from "react";
import "./Primitives.css";

export function Card({
  kind,
  label,
  children,
  style,
  className = "",
  padless,
}) {
  const cls = [
    "card",
    kind && `card--${kind}`,
    padless && "card--padless",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={cls} style={style}>
      {label ? <span className="card__label">{label}</span> : null}
      {children}
    </div>
  );
}

export function Stat({ label, value, unit, delta, deltaDown, kind }) {
  return (
    <Card kind={kind} label={label}>
      <div className="stat__num">
        {value}
        {unit ? <em>{unit}</em> : null}
      </div>
      {delta ? (
        <div className={`stat__delta ${deltaDown ? "stat__delta--down" : ""}`}>
          {deltaDown ? "▾" : "▴"} {delta}
        </div>
      ) : null}
    </Card>
  );
}

export function Btn({
  children,
  kind,
  sm,
  icon,
  onClick,
  type = "button",
  ...rest
}) {
  const cls = [
    "btn",
    kind && `btn--${kind}`,
    sm && "btn--sm",
    icon && "btn--icon",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

export function Chip({ children, kind, dot }) {
  return (
    <span className={`chip ${kind ? `chip--${kind}` : ""}`}>
      {dot ? <i className="chip__dot"></i> : null}
      {children}
    </span>
  );
}

export function Field({ label, placeholder, hint, kind, children }) {
  const cls = [
    "ctl",
    !children && placeholder && "ctl--placeholder",
    kind === "ta" && "ctl--ta",
    kind === "file" && "ctl--file",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <div className="field">
      {label ? <label>{label}</label> : null}
      <div className={cls}>{children || <span>{placeholder}</span>}</div>
      {hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}

export function Bar({ pct = 50, kind }) {
  return (
    <div className={`bar ${kind ? `bar--${kind}` : ""}`}>
      <i style={{ width: `${pct}%` }}></i>
    </div>
  );
}

export function Placeholder({ label, h = 120, w = "auto" }) {
  return (
    <div className="ph" style={{ height: h, width: w }}>
      {label}
    </div>
  );
}

export function Av({ name, kind, lg }) {
  const ini = name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={["av", lg && "av--lg", kind && `av--${kind}`]
        .filter(Boolean)
        .join(" ")}
    >
      {ini}
    </div>
  );
}

export function PageHead({ crumb, title, sub, actions }) {
  return (
    <div className="page-head">
      <div>
        {crumb ? <div className="page-head__crumb">{crumb}</div> : null}
        <h1>{title}</h1>
        {sub ? <div className="page-head__sub">{sub}</div> : null}
      </div>
      {actions ? <div className="page-head__actions">{actions}</div> : null}
    </div>
  );
}

export function Lines({ count = 3 }) {
  const widths = ["100%", "94%", "88%", "76%", "60%", "48%"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          style={{
            display: "block",
            height: 8,
            width: widths[i % widths.length],
            borderRadius: 4,
            background: "#e2e8f0",
          }}
        ></span>
      ))}
    </div>
  );
}
