import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getPlacements, getLogbooks } from "../../services/api";
import PlacementOnBoardingPage from "./PlacementOnBoardingPage";
import {
  PageHead,
  Card,
  Stat,
  Btn,
  Chip,
  Bar,
} from "../../components/common/Primitives";
import { I } from "../../components/common/Icons";

const DEMO_USERNAMES = [
  "maria.reyes",
  "john.doe",
  "dr.santos",
  "prof.torres",
  "admin",
];

const DEMO_DATA = {
  "maria.reyes": {
    firstName: "Karen",
    company: "Acme Telecoms Ltd.",
    position: "Software Engineering Intern",
    location: "Kampala",
    startDate: "12 May 2026",
    endDate: "12 Aug 2026",
    workplaceSup: "Mr. Okello",
    academicSup: "Dr. Nakato",
    weeksCompleted: 6,
    totalWeeks: 12,
    logbookPct: 83,
    hoursLogged: 248,
    hoursThisWeek: 40,
    evalScore: 4.3,
    currentWeek: 7,
    currentWeekDue: "Friday · 2 days left",
    entryProgress: 40,
    activity: [
      {
        done: true,
        warn: false,
        text: "Week 6 entry approved",
        meta: "2 days ago — Mr. Okello",
      },
      {
        done: true,
        warn: false,
        text: "Midterm report uploaded",
        meta: "3 days ago",
      },
      {
        done: false,
        warn: true,
        text: "Visit scheduled with Dr. Nakato",
        meta: "next Tuesday · 2pm",
      },
      {
        done: false,
        warn: false,
        text: "New skill tagged · REST APIs",
        meta: "last week",
      },
    ],
    upcoming: [
      { warn: true, text: "Midterm review", meta: "in 5 days" },
      {
        warn: false,
        text: "Workplace visit · Dr. Nakato",
        meta: "12 May · 2pm",
      },
      { warn: false, text: "Final report due", meta: "12 Aug" },
    ],
  },
};

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [placement, setPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noPlacement, setNoPlacement] = useState(false);

  const isDemo = DEMO_USERNAMES.includes(user?.username);
  const demo = isDemo ? DEMO_DATA[user.username] : null;

  useEffect(() => {
    if (isDemo) {
      // john.doe has no placement in demo data
      if (user.username === "john.doe") setNoPlacement(true);
      setLoading(false);
      return;
    }
    getPlacements()
      .then((data) => {
        const p = data?.results?.[0] || data?.[0] || null;
        if (!p) setNoPlacement(true);
        else setPlacement(p);
      })
      .catch(() => setNoPlacement(true))
      .finally(() => setLoading(false));
  }, [isDemo, user]);

  if (loading) {
    return (
      <div className="panel">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p className="muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (noPlacement) return <PlacementOnBoardingPage />;

  // ── Derive display values ────────────────────────────────────────
  const firstName =
    demo?.firstName ?? user?.first_name ?? user?.username ?? "there";
  const company = demo?.company ?? placement?.company_name ?? "your company";
  const position = demo?.position ?? placement?.position ?? "";
  const weeksCompleted = demo?.weeksCompleted ?? 0;
  const totalWeeks = demo?.totalWeeks ?? 15;
  const logbookPct = demo?.logbookPct ?? 0;
  const hoursLogged = demo?.hoursLogged ?? 0;
  const evalScore = demo?.evalScore ?? "—";
  const currentWeek = demo?.currentWeek ?? 1;
  const currentWeekDue = demo?.currentWeekDue ?? "—";
  const entryProgress = demo?.entryProgress ?? 0;
  const activity = demo?.activity ?? [];
  const upcoming = demo?.upcoming ?? [];
  const workplaceSup = demo?.workplaceSup ?? "—";
  const academicSup = demo?.academicSup ?? "—";
  const startDate = demo?.startDate ?? placement?.start_date ?? "—";
  const endDate = demo?.endDate ?? placement?.end_date ?? "—";

  return (
    <div className="panel">
      <PageHead
        crumb="Workspace · Dashboard"
        title={`Welcome back, ${firstName} 👋`}
        sub={`Here's what's happening with your internship at ${company}.`}
        actions={
          <>
            <Btn sm kind="ghost">
              This week ▾
            </Btn>
            <Btn sm kind="primary" onClick={() => navigate("/student/logbook")}>
              {I.plus} Log entry
            </Btn>
          </>
        }
      />

      {/* ── 4-stat row ── */}
      <div className="grid grid--4">
        <Stat
          label="Weeks completed"
          value={weeksCompleted}
          unit={` / ${totalWeeks}`}
          delta="on track"
        />
        <Stat label="Logbook" value={`${logbookPct}%`} delta="+12% this week" />
        <Stat
          label="Hours logged"
          value={hoursLogged}
          unit=" hrs"
          delta={`${demo?.hoursThisWeek ?? 0} this week`}
        />
        <Stat
          label="Eval score"
          value={evalScore}
          unit=" / 5"
          delta="midterm · workplace"
        />
      </div>

      {/* ── Main 2-col grid ── */}
      <div className="grid grid--main-narrow">
        {/* Left col */}
        <div className="col">
          {/* Current week entry card */}
          <Card kind="accent">
            <div className="row row--between row--center">
              <div>
                <div className="tiny" style={{ color: "var(--color-primary)" }}>
                  This week · Week {currentWeek}
                </div>
                <h3 className="section-title" style={{ marginTop: 4 }}>
                  Weekly logbook entry
                </h3>
                <div className="section-sub">Due {currentWeekDue}</div>
              </div>
              <Btn kind="primary" onClick={() => navigate("/student/logbook")}>
                Open weekly entry {I.arrow}
              </Btn>
            </div>
            <div style={{ marginTop: 14 }}>
              <Bar pct={entryProgress} />
              <div className="row row--between" style={{ marginTop: 8 }}>
                <span className="tiny">3 of 5 sections drafted</span>
                <span className="tiny">last edit · today 09:14</span>
              </div>
            </div>
          </Card>

          {/* Recent activity */}
          <Card label="Recent activity">
            {activity.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>
                No activity yet — submit your first log entry.
              </p>
            ) : (
              <ul className="timeline">
                {activity.map((item, i) => (
                  <li
                    key={i}
                    className={
                      item.done ? "is-done" : item.warn ? "is-warn" : ""
                    }
                  >
                    <b>{item.text}</b>
                    <div className="meta">{item.meta}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Quick actions */}
          <Card label="Quick actions">
            <div className="row row--wrap" style={{ gap: 8 }}>
              <Btn onClick={() => navigate("/student/logbook")}>
                {I.plus} New log entry
              </Btn>
              <Btn>{I.upload} Upload document</Btn>
              <Btn>{I.cal} Request visit</Btn>
              <Btn>{I.pencil} Update CV</Btn>
            </div>
          </Card>
        </div>

        {/* Right col */}
        <div className="col">
          {/* Placement card */}
          <Card label="Placement">
            <h3 className="section-title">{company}</h3>
            <div className="section-sub">
              {position} · {demo?.location ?? ""}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginTop: 14,
              }}
            >
              <div className="row row--between">
                <span className="muted">Start date</span>
                <b>{startDate}</b>
              </div>
              <div className="row row--between">
                <span className="muted">End date</span>
                <b>{endDate}</b>
              </div>
              <div className="row row--between">
                <span className="muted">Workplace sup.</span>
                <b>{workplaceSup}</b>
              </div>
              <div className="row row--between">
                <span className="muted">Academic sup.</span>
                <b>{academicSup}</b>
              </div>
            </div>
            <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
              <Chip kind="ok" dot>
                Active
              </Chip>
              <Chip kind="accent">Approved</Chip>
            </div>
          </Card>

          {/* Upcoming card */}
          <Card label="Upcoming">
            {upcoming.length === 0 ? (
              <p className="muted" style={{ fontSize: 13 }}>
                No upcoming events.
              </p>
            ) : (
              <ul className="timeline">
                {upcoming.map((item, i) => (
                  <li key={i} className={item.warn ? "is-warn" : ""}>
                    <b>{item.text}</b>
                    <div className="meta">{item.meta}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
