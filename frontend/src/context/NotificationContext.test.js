import React from "react";
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NotificationProvider, useNotifications } from "./NotificationContext";
import * as api from "../services/api";

jest.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { username: "testuser" } }),
}));

jest.mock("../services/api");

const NOTIFS = [
  { id: 1, title: "Notif A", message: "msg a", notification_type: "logbook_submitted", is_read: false, created_at: new Date().toISOString() },
  { id: 2, title: "Notif B", message: "msg b", notification_type: "logbook_reviewed", is_read: true, created_at: new Date().toISOString() },
];

function Consumer() {
  const ctx = useNotifications();
  if (!ctx) return null;
  return (
    <div>
      <span data-testid="count">{ctx.unreadCount}</span>
      <span data-testid="len">{ctx.notifications.length}</span>
      <button onClick={() => ctx.markRead(1)}>markRead</button>
      <button onClick={() => ctx.markAllRead()}>markAll</button>
    </div>
  );
}

function wrap() {
  return render(
    <NotificationProvider>
      <Consumer />
    </NotificationProvider>
  );
}

beforeEach(() => {
  api.getNotifications.mockResolvedValue([...NOTIFS]);
  api.getUnreadCount.mockResolvedValue({ count: 1 });
  api.markNotificationRead.mockResolvedValue({});
  api.markAllNotificationsRead.mockResolvedValue({});
});

afterEach(() => {
  jest.clearAllMocks();
});

test("fetches notifications on mount and provides them", async () => {
  wrap();
  await waitFor(() => expect(screen.getByTestId("len").textContent).toBe("2"));
  expect(screen.getByTestId("count").textContent).toBe("1");
});

test("markRead calls API and decrements unread count", async () => {
  wrap();
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("1"));

  fireEvent.click(screen.getByText("markRead"));
  await waitFor(() => expect(api.markNotificationRead).toHaveBeenCalledWith(1));
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
});

test("markAllRead calls API and sets unread count to 0", async () => {
  wrap();
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("1"));

  fireEvent.click(screen.getByText("markAll"));
  await waitFor(() => expect(api.markAllNotificationsRead).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByTestId("count").textContent).toBe("0"));
});

test("polls unread count on interval", async () => {
  jest.useFakeTimers();
  api.getNotifications.mockResolvedValue([...NOTIFS]);

  await act(async () => {
    wrap();
  });

  const callsBefore = api.getUnreadCount.mock.calls.length;

  await act(async () => {
    jest.advanceTimersByTime(30000);
  });
  const callsAfter = api.getUnreadCount.mock.calls.length;
  expect(callsAfter).toBeGreaterThan(callsBefore);

  jest.useRealTimers();
});
