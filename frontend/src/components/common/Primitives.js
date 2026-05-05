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
