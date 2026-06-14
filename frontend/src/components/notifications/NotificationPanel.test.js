import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NotificationPanel from "./NotificationPanel";

const mockMarkRead = jest.fn();
const mockMarkAllRead = jest.fn();

jest.mock("../../context/NotificationContext", () => ({
  useNotifications: () => mockCtx,
}));

let mockCtx;

const NOTIFS = [
  { id: 1, title: "Log approved", message: "Your log was approved.", notification_type: "logbook_reviewed", is_read: false, created_at: new Date().toISOString() },
  { id: 2, title: "Already read", message: "Something happened.", notification_type: "placement_created", is_read: true, created_at: new Date().toISOString() },
];

beforeEach(() => {
  jest.clearAllMocks();
  mockCtx = {
    notifications: [...NOTIFS],
    unreadCount: 1,
    markRead: mockMarkRead,
    markAllRead: mockMarkAllRead,
  };
});

function renderPanel() {
  return render(<NotificationPanel onClose={jest.fn()} />);
}

test("renders empty state when no notifications", () => {
  mockCtx.notifications = [];
  mockCtx.unreadCount = 0;
  renderPanel();
  expect(screen.getByText("No notifications yet.")).toBeInTheDocument();
});

test("renders notification list", () => {
  renderPanel();
  expect(screen.getByText("Log approved")).toBeInTheDocument();
  expect(screen.getByText("Already read")).toBeInTheDocument();
});

test("unread notification has unread CSS class", () => {
  renderPanel();
  const items = document.querySelectorAll(".notif-panel__item--unread");
  expect(items.length).toBe(1);
});

test("mark all read button shows when unreadCount > 0", () => {
  renderPanel();
  expect(screen.getByText("Mark all read")).toBeInTheDocument();
});

test("mark all read button hidden when unreadCount is 0", () => {
  mockCtx.unreadCount = 0;
  renderPanel();
  expect(screen.queryByText("Mark all read")).not.toBeInTheDocument();
});

test("clicking unread item calls markRead with correct id", () => {
  renderPanel();
  const unreadItem = document.querySelector(".notif-panel__item--unread");
  fireEvent.click(unreadItem);
  expect(mockMarkRead).toHaveBeenCalledWith(1);
});

test("clicking read item does not call markRead", () => {
  renderPanel();
  // second item is is_read: true — clicking should not call markRead
  const items = document.querySelectorAll(".notif-panel__item");
  fireEvent.click(items[1]);
  expect(mockMarkRead).not.toHaveBeenCalled();
});

test("clicking mark all read button calls markAllRead", () => {
  renderPanel();
  fireEvent.click(screen.getByText("Mark all read"));
  expect(mockMarkAllRead).toHaveBeenCalled();
});
