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
