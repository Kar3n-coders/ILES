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

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [placement, setPlacement] = useState(null);
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noPlacement, setNoPlacement] = useState(false);

  useEffect(() => {
    Promise.all([getPlacements(), getLogbooks()])
      .then(([placementsData, logbooksData]) => {
        const p = placementsData?.results?.[0] || placementsData?.[0] || null;
        if (!p) setNoPlacement(true);
        else setPlacement(p);
        setLogbooks(logbooksData || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="panel">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p className="muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p className="muted">Could not load dashboard: {error}</p>
        </div>
      </div>
    );
  }

  if (noPlacement) return <PlacementOnBoardingPage />;

  // ── Derive display values ────────────────────────────────────────
  const firstName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username ?? "there";
  const company = placement?.company_name ?? "your company";
  const position = placement?.position ?? "";
  const approvedLogbooks = logbooks.filter((l) => l.status === "approved");
  const pendingLogbooks = logbooks.filter((l) => l.status === "pending");
  const weeksCompleted = approvedLogbooks.length;
  const totalWeeks = 12;
  const logbookPct =
    totalWeeks > 0 ? Math.round((weeksCompleted / totalWeeks) * 100) : 0;
  const startDate = placement?.start_date ?? "—";
  const endDate = placement?.end_date ?? "—";
  const workplaceSup = placement?.supervisor_name ?? "—";
  const academicSup = "—";
  const currentWeek = Math.min(weeksCompleted + 1, totalWeeks);
  const lastEntry = logbooks.sort((a, b) => b.week_number - a.week_number)[0];
  const activity = pendingLogbooks.map((l) => ({
    done: false,
    warn: true,
    text: `Week ${l.week_number} logbook awaiting review`,
    meta: l.submitted_at ? l.submitted_at.split("T")[0] : "submitted",
  }));
  const upcoming = [];

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
        <Stat label="Logbook" value={`${logbookPct}%`} delta={`${logbooks.length} entries`} />
        <Stat
          label="Pending review"
          value={pendingLogbooks.length}
          unit=" entries"
          delta={pendingLogbooks.length > 0 ? "awaiting approval" : undefined}
        />
        <Stat
          label="Eval score"
          value="—"
          unit=" / 5"
          delta="not yet evaluated"
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
                <div className="section-sub">Log your activities for this week</div>
              </div>
              <Btn kind="primary" onClick={() => navigate("/student/logbook")}>
                Open weekly entry {I.arrow}
              </Btn>
            </div>
            <div style={{ marginTop: 14 }}>
              <Bar pct={logbookPct} />
              <div className="row row--between" style={{ marginTop: 8 }}>
                <span className="tiny">{weeksCompleted} of {totalWeeks} weeks approved</span>
                <span className="tiny">{logbooks.length} total entries</span>
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
            <div className="section-sub">{position}</div>
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
              <Chip kind="accent">{placement?.status ?? "Pending"}</Chip>
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
