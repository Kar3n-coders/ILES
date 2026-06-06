import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getPlacements, getLogbooks } from "../../services/api";
import {
  PageHead,
  Card,
  Stat,
  Btn,
  Chip,
  Bar,
  Av,
} from "../../components/common/Primitives";
import { I } from "../../components/common/Icons";
import "../../components/common/Primitives.css";

export default function AcademicDashboardPage() {
  const { user } = useAuth();

  const [students, setStudents] = useState([]);
  const [todos, setTodos] = useState([]);
  const [visits, setVisits] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [checkedTodos, setCheckedTodos] = useState({});

  useEffect(() => {
    Promise.all([getPlacements(), getLogbooks()])
      .then(([placementsData, logbooksData]) => {
        const placements = placementsData || [];
        const logbooks = logbooksData || [];

        const studentList = placements.map((p) => ({
          id: p.id,
          name: p.student_name || p.student_username || `Student #${p.student}`,
          org: p.company_name || "—",
          prog: 0,
          last: "—",
          flag: p.status === "pending" ? "Pending" : null,
          flagKind: p.status === "pending" ? "warn" : null,
        }));

        setStudents(studentList);
        setTodos([]);
        setVisits([]);
        setStats({
          assigned: placements.length,
          placements: placements.filter((p) => p.status === "approved").length,
          visits: 0,
          visitsTotal: 0,
          grading: logbooks.filter((l) => l.status === "pending").length,
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

  const cohortLabel = user?.cohort || "Cohort 2026-S2";

  const atRiskCount = students.filter((s) => s.flagKind === "warn").length;
  const noPlacementCount = students.filter(
    (s) => s.flagKind === "danger",
  ).length;

  const filteredStudents = students.filter((s) => {
    if (filter === "All") return true;
    if (filter === "On track") return !s.flag;
    if (filter === "At risk") return s.flagKind === "warn";
    if (filter === "No placement") return s.flagKind === "danger";
    return true;
  });

  const toggleTodo = (i) =>
    setCheckedTodos((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="page">
      <PageHead
        crumb="Cohort · Dashboard"
        title="Cohort overview"
        sub={`${cohortLabel} · ${students.length} student${students.length !== 1 ? "s" : ""} assigned`}
        actions={
          <Btn sm kind="ghost">
            {cohortLabel} ▾
          </Btn>
        }
      />

      <div className="grid grid--4">
        <Stat
          label="Students assigned"
          value={stats ? String(stats.assigned) : String(students.length)}
        />
        <Stat
          label="Placements approved"
          value={stats ? String(stats.placements) : "—"}
          delta={
            stats ? `${stats.assigned - stats.placements} pending` : undefined
          }
        />
        <Stat
          label="Visits this month"
          value={stats ? String(stats.visits) : String(visits.length)}
          unit={stats ? ` of ${stats.visitsTotal}` : undefined}
        />
        <Stat
          label="Awaiting grading"
          value={stats ? String(stats.grading) : "—"}
          delta={stats?.grading > 0 ? "action needed" : undefined}
          deltaDown={stats?.grading > 0}
        />
      </div>
      <div className="grid grid--main-narrow">
        <div className="col">
          <Card label="Students at a glance" padless>
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div className="row row--wrap" style={{ gap: 6 }}>
                {[
                  {
                    label: `All · ${students.length}`,
                    key: "All",
                    kind: "accent",
                  },
                  {
                    label: `On track · ${students.length - atRiskCount - noPlacementCount}`,
                    key: "On track",
                    kind: "ok",
                  },
                  {
                    label: `At risk · ${atRiskCount}`,
                    key: "At risk",
                    kind: "warn",
                  },
                  {
                    label: `No placement · ${noPlacementCount}`,
                    key: "No placement",
                    kind: "danger",
                  },
                ].map((chip) => (
                  <Chip
                    key={chip.key}
                    kind={filter === chip.key ? chip.kind : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilter(chip.key)}
                  >
                    {chip.label}
                  </Chip>
                ))}
              </div>
            </div>
            {filteredStudents.length === 0 ? (
              <div className="empty-state">No students match this filter.</div>
            ) : (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Placement</th>
                    <th>Progress</th>
                    <th>Last log</th>
                    <th>Flag</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="row row--center" style={{ gap: 8 }}>
                          <Av name={s.name} />
                          <b style={{ fontSize: 13 }}>{s.name}</b>
                        </div>
                      </td>
                      <td className="muted">{s.org}</td>
                      <td>
                        <div style={{ width: 130 }}>
                          <Bar
                            pct={s.prog}
                            kind={s.flagKind === "danger" ? "warn" : undefined}
                          />
                        </div>
                        <span
                          className="tiny"
                          style={{ display: "block", marginTop: 4 }}
                        >
                          {s.prog}%
                        </span>
                      </td>
                      <td className="muted">{s.last}</td>
                      <td>
                        {s.flag ? (
                          <Chip kind={s.flagKind} dot>
                            {s.flag}
                          </Chip>
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Btn sm kind="ghost">
                          Open
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
        <div className="col">
          <Card kind="warn" label="To-do · this week">
            {todos.length === 0 ? (
              <div className="empty-state">No tasks for this week.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {todos.map((task, i) => (
                  <label
                    key={i}
                    className="row row--center"
                    style={{
                      padding: "8px 0",
                      borderBottom:
                        i < todos.length - 1
                          ? "1px solid rgba(192,86,33,0.2)"
                          : "none",
                      gap: 10,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedTodos[i]}
                      onChange={() => toggleTodo(i)}
                    />
                    <span
                      style={{
                        textDecoration: checkedTodos[i]
                          ? "line-through"
                          : "none",
                        opacity: checkedTodos[i] ? 0.5 : 1,
                      }}
                    >
                      {task}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </Card>
          <Card label="Visit schedule">
            {visits.length === 0 ? (
              <div className="empty-state">No visits scheduled.</div>
            ) : (
              <>
                <ul className="timeline">
                  {visits.map((v, i) => (
                    <li key={i} className={v.warn ? "is-warn" : ""}>
                      <b>{v.name}</b> · {v.org}
                      <div className="meta">{v.time}</div>
                    </li>
                  ))}
                </ul>
                <Btn sm kind="ghost" style={{ marginTop: 6 }}>
                  Open visit calendar {I.arrow}
                </Btn>
              </>
            )}
          </Card>
          <Card label="Active rubric">
            <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
              Set for this cohort
            </div>
            <b style={{ fontSize: 14 }}>Default 5-criteria · 1–5 scale</b>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Btn sm>Edit rubric</Btn>
              <Btn sm kind="ghost">
                Duplicate
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
