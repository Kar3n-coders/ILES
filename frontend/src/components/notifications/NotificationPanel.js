import React, { useEffect, useRef } from "react";
import { useNotifications } from "../../context/NotificationContext";
import "./NotificationPanel.css";

function timeAgo(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel({ onClose }) {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    function handleOutsideClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  return (
    <div className="notif-panel" ref={panelRef} role="dialog" aria-label="Notifications">
      <div className="notif-panel__header">
        <span className="notif-panel__title">Notifications</span>
        {unreadCount > 0 && (
          <button className="notif-panel__mark-all" onClick={markAllRead} type="button">
            Mark all read
          </button>
        )}
      </div>

      <div className="notif-panel__list">
        {notifications.length === 0 ? (
          <p className="notif-panel__empty">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`notif-panel__item${n.is_read ? "" : " notif-panel__item--unread"}`}
              onClick={() => !n.is_read && markRead(n.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && !n.is_read && markRead(n.id)}
            >
              <div className="notif-panel__item-title">{n.title}</div>
              <div className="notif-panel__item-message">{n.message}</div>
              <div className="notif-panel__item-time">{timeAgo(n.created_at)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
