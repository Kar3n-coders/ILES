import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getPlacements, getLogbooks, getEvaluations } from "../../services/api";
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

  useEffect(() => {
    Promise.all([getPlacements(), getLogbooks(), getEvaluations()])
      .then(([placementsData, logbooksData, evalsData]) => {
        const placements = placementsData || [];
        const logbooks = logbooksData || [];
        const evaluations = evalsData || [];

        const internList = placements.map((p) => ({
          id: p.id,
          name: p.student_name || p.student_username || `Student #${p.id}`,
          prog: 0,
          last: "—",
          hrs: "—",
          status: "Up to date",
          avKind: undefined,
        }));

        const pendingList = logbooks
          .filter((l) => l.status === "pending")
          .map((l) => ({
            who: l.student_username || `Student #${l.student}`,
            what: `Week ${l.week_number} logbook`,
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
          avgScore: 0,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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

  const org = user?.organization || "Your Organisation";

  const awaitingCount = stats?.awaitingReview ?? pending.length;

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · My interns"
        title={`Welcome, ${displayName}`}
        sub={`You're supervising ${interns.length} intern${interns.length !== 1 ? "s" : ""} at ${org} this cohort.`}
        actions={
          <Btn sm kind="ghost">
            {org} ▾
          </Btn>
        }
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
          label="Avg score given"
          value={stats ? String(stats.avgScore) : "—"}
          unit=" / 5"
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
                  <th>Progress</th>
                  <th>Last entry</th>
                  <th>Hrs</th>
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
                    <td>
                      <div style={{ width: 140 }}>
                        <Bar pct={intern.prog} />
                      </div>
                      <span
                        className="tiny"
                        style={{ display: "block", marginTop: 4 }}
                      >
                        {intern.prog}%
                      </span>
                    </td>
                    <td className="muted">{intern.last}</td>
                    <td>{intern.hrs}</td>
                    <td>
                      <Chip kind={STATUS_KIND[intern.status] || ""} dot>
                        {intern.status}
                      </Chip>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Btn
                        sm
                        kind="ghost"
                        onClick={() =>
                          navigate(`/supervisor/intern/${intern.id}`)
                        }
                      >
                        Open {I.arrow}
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
                {pending.map((entry, i) => (
                  <div
                    key={i}
                    className="row row--between row--center"
                    style={{
                      padding: "10px 0",
                      borderBottom:
                        i < pending.length - 1
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
                      <Btn sm>Approve</Btn>
                      <Btn sm kind="ghost">
                        Return
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card label="Upcoming evaluations">
            {evals.length === 0 ? (
              <div className="empty-state">No upcoming evaluations.</div>
            ) : (
              <ul className="timeline">
                {evals.map((ev, i) => (
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

      {pending.length > 0 && (
        <Card
          label="Drill-in preview · clicking a row opens →"
          style={{ marginTop: 20 }}
        >
          <div className="row row--between row--center">
            <div>
              <b style={{ fontSize: 14 }}>
                {pending[0].who} — {pending[0].what}
              </b>
              <div className="muted" style={{ fontSize: 12 }}>
                Submitted {pending[0].when} · awaiting your signature
              </div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <Btn sm kind="ghost">
                View entry
              </Btn>
              <Btn sm kind="ghost">
                Return with comment
              </Btn>
              <Btn sm kind="primary">
                {I.check} Approve & sign
              </Btn>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
