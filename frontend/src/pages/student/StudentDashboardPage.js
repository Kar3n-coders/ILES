import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getPlacements, getLogbooks, createLogbook } from "../../services/api";
import PlacementOnBoardingPage from "./PlacementOnBoardingPage";
import {
  PageHead,
  Card,
  Stat,
  Btn,
  Chip,
  Bar,
  Field,
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
  const [placementPending, setPlacementPending] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ week_number: "", start_date: "", end_date: "", activities: "" });
  const [logSubmitting, setLogSubmitting] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);
  const [logError, setLogError] = useState(null);

  useEffect(() => {
    Promise.all([getPlacements(), getLogbooks()])
      .then(([placementsData, logbooksData]) => {
        const p = placementsData?.results?.[0] || placementsData?.[0] || null;
        if (!p) setNoPlacement(true);
        else {
          setPlacement(p);
          if (p.status === "pending") setPlacementPending(true);
        }
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

  if (placementPending && placement) {
    return (
      <div className="page">
        <PageHead
          crumb={`Welcome back, ${firstName}`}
          title="Placement Pending Approval"
          sub="Your placement has been submitted and is awaiting admin review."
        />
        <Card kind="warn">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>⏳</span>
            <div>
              <b style={{ color: "var(--color-text)" }}>
                {placement.company_name || "Your placement"}
              </b>
              <div className="muted" style={{ fontSize: 13 }}>
                Status: Pending approval · You'll be notified once reviewed.
              </div>
            </div>
          </div>
        </Card>
        <Card label="What you can do">
          <p className="muted" style={{ marginBottom: 16 }}>
            While you wait, you can submit another placement or check back later.
          </p>
          <Btn kind="primary" sm onClick={() => { setNoPlacement(true); setPlacementPending(false); }}>
            Submit another placement
          </Btn>
        </Card>
      </div>
    );
  }

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
            <Btn sm kind="primary" onClick={() => { setShowLogForm((v) => !v); setLogSuccess(false); setLogError(null); }}>
              {I.plus} Log entry
            </Btn>
          </>
        }
      />

      {/* ── Log entry form ── */}
      {showLogForm && (
        <div className="modal-overlay" onClick={() => { setShowLogForm(false); }}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <h3>New log entry</h3>
              <p>Fill in the details for this week's log.</p>
              <button className="modal-close" onClick={() => setShowLogForm(false)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div className="grid grid--2">
                <div>
                  <label>Week number</label>
                  <input type="number" min={1} max={52}
                    value={logForm.week_number}
                    onChange={e => setLogForm(p => ({ ...p, week_number: e.target.value }))}
                    placeholder="e.g. 8" />
                </div>
                <div>
                  <label>Start date</label>
                  <input type="date"
                    value={logForm.start_date}
                    onChange={e => setLogForm(p => ({ ...p, start_date: e.target.value }))} />
                </div>
                <div>
                  <label>End date</label>
                  <input type="date"
                    value={logForm.end_date}
                    onChange={e => setLogForm(p => ({ ...p, end_date: e.target.value }))} />
                </div>
              </div>
              <div>
                <label>Activities</label>
                <textarea rows={4}
                  value={logForm.activities}
                  onChange={e => setLogForm(p => ({ ...p, activities: e.target.value }))}
                  placeholder="Describe what you worked on this week…" />
              </div>
              {logError && <p style={{ color: "var(--color-error)", fontSize: 13 }}>{logError}</p>}
              {logSuccess && <p style={{ color: "var(--color-success)", fontSize: 13 }}>✓ Log entry created.</p>}
              <div className="modal-actions">
                <Btn sm kind="ghost" onClick={() => setShowLogForm(false)}>Cancel</Btn>
                <Btn sm kind="primary"
                  disabled={logSubmitting || !logForm.week_number || !logForm.start_date || !logForm.end_date}
                  onClick={async () => {
                    setLogSubmitting(true); setLogError(null); setLogSuccess(false);
                    try {
                      await createLogbook({ ...logForm, placement: placement.id });
                      setLogForm({ week_number: "", start_date: "", end_date: "", activities: "" });
                      setLogSuccess(true);
                    } catch (err) {
                      setLogError(err.message);
                    } finally { setLogSubmitting(false); }
                  }}
                >
                  {logSubmitting ? "Submitting…" : "Submit entry"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}

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
