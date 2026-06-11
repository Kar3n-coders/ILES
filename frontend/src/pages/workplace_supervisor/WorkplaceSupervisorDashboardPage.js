import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getPlacements, getLogbooks, getEvaluations, createReview } from "../../services/api";
import {
  PageHead,
  Card,
  Stat,
  Btn,
  Chip,
  Bar,
  Av,
} from "../../components/common/Primitives";
import "./WorkplaceSupervisorDashboardPage.css";
import { I } from "../../components/common/Icons";
import "../../components/common/Primitives.css";

const STATUS_KIND = {
  "Awaiting review": "warn",
  "Up to date": "ok",
  Overdue: "danger",
};

export default function WorkplaceSupervisorDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interns, setInterns] = useState([]);
  const [pending, setPending] = useState([]);
  const [evals, setEvals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);
  const [returnForms, setReturnForms] = useState({});

  useEffect(() => {
    Promise.all([getPlacements(), getLogbooks(), getEvaluations()])
      .then(([placementsData, logbooksData, evalsData]) => {
        const placements = placementsData || [];
        const logbooks = logbooksData || [];
        const evaluations = evalsData || [];

        const logsByPlacement = {};
        logbooks.forEach((l) => {
          if (!logsByPlacement[l.placement]) logsByPlacement[l.placement] = [];
          logsByPlacement[l.placement].push(l);
        });

        const internList = placements.map((p) => {
          const pLogs = logsByPlacement[p.id] || [];
          const lastLog = pLogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
          const hasPending = pLogs.some((l) => l.status === "pending");
          return {
            id: p.id,
            name: p.student_full_name || p.student_username || `Student #${p.id}`,
            prog: pLogs.length,
            last: lastLog ? lastLog.start_date?.split("T")[0] : "—",
            status: hasPending ? "Awaiting review" : "Up to date",
            avKind: undefined,
          };
        });

        const pendingList = logbooks
          .filter((l) => l.status === "pending" || l.status === "submitted")
          .map((l) => ({
            who: l.student_fullname || l.student_username || `Student #${l.student}`,
            what: `Week ${l.week_number}`,
            when: l.submitted_at ? l.submitted_at.split("T")[0] : "—",
            id: l.id,
          }));

        setInterns(internList);
        setPending(pendingList);
        setEvals(evaluations);
        setStats({
          activeInterns: placements.length,
          awaitingReview: pendingList.length,
          approvedThisWeek: logbooks.filter((l) => l.status === "approved").length,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleApprove(entryId) {
    setActing(entryId);
    try {
      await createReview({ Logbook: entryId, action: "approved", comment: "" });
      setPending((prev) => prev.filter((e) => e.id !== entryId));
      setStats((s) => s ? { ...s, awaitingReview: s.awaitingReview - 1, approvedThisWeek: s.approvedThisWeek + 1 } : s);
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(null);
    }
  }

  async function handleReturn(entryId) {
    const comment = returnForms[entryId] || "";
    if (!comment.trim()) return;
    setActing(entryId);
    try {
      await createReview({ Logbook: entryId, action: "revision_requested", comment });
      setPending((prev) => prev.filter((e) => e.id !== entryId));
      setStats((s) => s ? { ...s, awaitingReview: s.awaitingReview - 1 } : s);
      setReturnForms((prev) => { const next = { ...prev }; delete next[entryId]; return next; });
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(null);
    }
  }

  function toggleReturn(entryId) {
    setReturnForms((prev) =>
      prev[entryId] !== undefined
        ? (() => { const next = { ...prev }; delete next[entryId]; return next; })()
        : { ...prev, [entryId]: "" }
    );
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p className="muted">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p className="muted">Could not load dashboard: {error}</p>
        </div>
      </div>
    );
  }

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "Supervisor";

  const awaitingCount = stats?.awaitingReview ?? pending.length;

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · My interns"
        title={`Welcome, ${displayName}`}
        sub={`You're supervising ${interns.length} intern${interns.length !== 1 ? "s" : ""} this cohort.`}
      />

      <div className="grid grid--4">
        <Stat
          label="Active interns"
          value={stats ? String(stats.activeInterns) : "—"}
        />
        <Stat
          label="Awaiting review"
          value={stats ? String(stats.awaitingReview) : String(awaitingCount)}
          unit=" entries"
          delta={awaitingCount > 0 ? "action needed" : undefined}
          deltaDown={awaitingCount > 0}
        />
        <Stat
          label="Approved this week"
          value={stats ? String(stats.approvedThisWeek) : "—"}
        />
        <Stat
          label="Total log entries"
          value={String(interns.reduce((sum, i) => sum + i.prog, 0))}
        />
      </div>

      <div className="grid grid--main-narrow">
        <Card label="My interns" padless>
          {interns.length === 0 ? (
            <div className="empty-state">No interns assigned yet.</div>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Entries</th>
                  <th>Last entry</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern) => (
                  <tr key={intern.id}>
                    <td>
                      <div className="row row--center" style={{ gap: 10 }}>
                        <Av name={intern.name} kind={intern.avKind} />
                        <b style={{ fontSize: 13 }}>{intern.name}</b>
                      </div>
                    </td>
                    <td className="muted">{intern.prog}</td>
                    <td className="muted">{intern.last}</td>
                    <td>
                      <Chip kind={STATUS_KIND[intern.status] || ""} dot>
                        {intern.status}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Btn
                        sm
                        kind="ghost"
                        onClick={() => navigate("/supervisor/logs")}
                      >
                        Logs {I.arrow}
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <div className="col">
          <Card kind="warn" label="Pending approvals">
            {pending.length === 0 ? (
              <div className="empty-state">No pending approvals.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {pending.map((entry, i) => {
                  const showReturn = returnForms[entry.id] !== undefined;
                  return (
                    <div key={i}>
                      <div
                        className="row row--between row--center"
                        style={{
                          padding: "10px 0",
                          borderBottom:
                            i < pending.length - 1 && !showReturn
                              ? "1px solid rgba(192,86,33,0.2)"
                              : "none",
                        }}
                      >
                        <div style={{ fontSize: 13 }}>
                          <b>{entry.who}</b> ·{" "}
                          <span className="muted">{entry.what}</span>
                          <div className="muted" style={{ fontSize: 11 }}>
                            {entry.when}
                          </div>
                        </div>
                        <div className="row" style={{ gap: 6 }}>
                          <Btn sm disabled={acting === entry.id} onClick={() => handleApprove(entry.id)}>
                            {acting === entry.id ? "…" : "Approve"}
                          </Btn>
                          <Btn sm kind="ghost" disabled={acting === entry.id} onClick={() => toggleReturn(entry.id)}>
                            {showReturn ? "Cancel" : "Return"}
                          </Btn>
                        </div>
                      </div>
                      {showReturn && (
                        <div style={{ paddingBottom: 10, borderBottom: i < pending.length - 1 ? "1px solid rgba(192,86,33,0.2)" : "none" }}>
                          <textarea
                            rows={2}
                            style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--color-border)", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
                            placeholder="Reason for returning…"
                            value={returnForms[entry.id] || ""}
                            onChange={(e) => setReturnForms((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                          />
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                            <Btn sm kind="primary" disabled={acting === entry.id || !returnForms[entry.id]?.trim()} onClick={() => handleReturn(entry.id)}>
                              Send
                            </Btn>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <Card label="Recent evaluations">
            {evals.length === 0 ? (
              <div className="empty-state">No evaluations yet.</div>
            ) : (
              <ul className="timeline">
                {evals.slice(0, 5).map((ev, i) => (
                  <li key={i}>
                    <b>
                      {ev.student_username} — {ev.criteria_name}
                    </b>
                    <div className="meta">Score: {ev.score} / 5</div>
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
