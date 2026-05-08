import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  PageHead,
  Card,
  Stat,
  Btn,
  Chip,
  Av,
} from "../../components/common/Primitives";
import { I } from "../../components/common/Icons";
import "../../components/common/Primitives.css";
import "./AdminDashboardPage.css";

const DEMO_USERNAMES = [
  "maria.reyes",
  "john.doe",
  "dr.santos",
  "prof.torres",
  "admin",
];

const DEMO_USERS = [
  {
    id: 1,
    name: "Karen Kawooya",
    role: "Student",
    org: "Cohort 2026-S2",
    status: "Active",
    seen: "now",
  },
  {
    id: 2,
    name: "John Okello",
    role: "Workplace sup.",
    org: "Acme Telecoms",
    status: "Active",
    seen: "2h ago",
  },
  {
    id: 3,
    name: "Sarah Nakato",
    role: "Academic sup.",
    org: "Cohort 2026-S2",
    status: "Active",
    seen: "1d ago",
  },
  {
    id: 4,
    name: "Eric Walusimbi",
    role: "Student",
    org: "Cohort 2026-S2",
    status: "Pending placement",
    seen: "3d ago",
  },
  {
    id: 5,
    name: "System Admin",
    role: "System admin",
    org: "—",
    status: "Active",
    seen: "5m ago",
  },
];

const DEMO_COHORTS = [
  { name: "Cohort 2026-S2 · BSc SE", count: "126 students", status: "Active" },
  { name: "Cohort 2026-S2 · BSc IT", count: "88 students", status: "Active" },
  {
    name: "Cohort 2026-S1 · archived",
    count: "104 students",
    status: "Archived",
  },
];

const DEMO_AUDIT = [
  { who: "System Admin", what: "reset password for Eric W.", when: "5m ago" },
  { who: "Dr. Nakato", what: "updated rubric.", when: "2h ago" },
  { who: "Mr. Okello", what: "approved 3 entries.", when: "3h ago" },
  { who: "System", what: "sent 18 reminder emails.", when: "today 06:00" },
];

const DEMO_STATS = {
  totalUsers: 2415,
  activeInterns: 318,
  supervisors: 64,
  openIssues: 12,
};

const ROLE_FILTERS = ["All", "Students", "Workplace", "Academic", "Admins"];

const ROLE_MAP = {
  Students: ["Student"],
  Workplace: ["Workplace sup."],
  Academic: ["Academic sup."],
  Admins: ["System admin"],
};

function AdminDashboardPage() {
  const { user } = useAuth();
  const isDemo = DEMO_USERNAMES.includes(user?.username);

  const [users, setUsers] = useState(isDemo ? DEMO_USERS : []);
  const [cohorts, setCohorts] = useState(isDemo ? DEMO_COHORTS : []);
  const [audit, setAudit] = useState(isDemo ? DEMO_AUDIT : []);
  const [stats, setStats] = useState(isDemo ? DEMO_STATS : null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isDemo) return;
    Promise.all([
      fetch("/api/admin/users/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("iles_auth_token")}`,
        },
      }).then((r) => (r.ok ? r.json() : [])),
      fetch("/api/admin/cohorts/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("iles_auth_token")}`,
        },
      }).then((r) => (r.ok ? r.json() : [])),
      fetch("/api/admin/audit/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("iles_auth_token")}`,
        },
      }).then((r) => (r.ok ? r.json() : [])),
      fetch("/api/admin/stats/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("iles_auth_token")}`,
        },
      }).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([userData, cohortData, auditData, statsData]) => {
        setUsers(userData || []);
        setCohorts(cohortData || []);
        setAudit(auditData || []);
        setStats(statsData);
      })
      .catch(() => {});
  }, [isDemo]);

  const filteredUsers = users
    .filter((u) => {
      if (filter === "All") return true;
      return (ROLE_MAP[filter] || []).some((r) => u.role.includes(r));
    })
    .filter(
      (u) =>
        search.trim() === "" ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="page">
      <PageHead
        crumb="System · Overview"
        title="Admin dashboard"
        sub="Manage users, pairings, cohorts, and system health."
        actions={
          <>
            <Btn sm kind="ghost">
              Export CSV
            </Btn>
            <Btn sm kind="primary">
              {I.plus} Invite user
            </Btn>
          </>
        }
      />

      <div className="grid grid--4">
        <Stat
          label="Total users"
          value={
            stats ? stats.totalUsers.toLocaleString() : String(users.length)
          }
          delta={stats ? "+38 this month" : undefined}
        />
        <Stat
          label="Active interns"
          value={stats ? String(stats.activeInterns) : "—"}
        />
        <Stat
          label="Supervisors"
          value={stats ? String(stats.supervisors) : "—"}
        />
        <Stat
          label="Open issues"
          value={stats ? String(stats.openIssues) : "—"}
          delta={stats?.openIssues > 0 ? "action needed" : undefined}
          deltaDown={stats?.openIssues > 0}
        />
      </div>

      <div className="grid grid--main-narrow">
        <div className="col">
          <Card label="User management" padless>
            <div
              style={{
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--color-border)",
                gap: 12,
              }}
            >
              <div className="row row--wrap" style={{ gap: 6 }}>
                {ROLE_FILTERS.map((f) => (
                  <Chip
                    key={f}
                    kind={filter === f ? "accent" : ""}
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                    {f === "All" ? ` · ${users.length}` : ""}
                  </Chip>
                ))}
              </div>
              <div style={{ width: 200 }}>
                <input
                  className="field"
                  type="text"
                  placeholder="Search users…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
              </div>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="empty-state">No users match this filter.</div>
            ) : (
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Cohort / Org</th>
                    <th>Status</th>
                    <th>Last seen</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <div className="row row--center" style={{ gap: 8 }}>
                          <Av name={u.name} />
                          <b style={{ fontSize: 13 }}>{u.name}</b>
                        </div>
                      </td>
                      <td className="muted">{u.role}</td>
                      <td className="muted">{u.org}</td>
                      <td>
                        <Chip kind={u.status === "Active" ? "ok" : "warn"} dot>
                          {u.status}
                        </Chip>
                      </td>
                      <td className="muted">{u.seen}</td>
                      <td style={{ textAlign: "right" }}>
                        <Btn sm kind="ghost" icon>
                          {I.dots}
                        </Btn>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
          <Card label="Pairings · students ↔ supervisors">
            <div className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
              Assign students to academic and workplace supervisors by cohort
              and company.
            </div>
            <div
              style={{
                height: 160,
                border: "2px dashed var(--color-border)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="muted" style={{ fontSize: 13 }}>
                Pairing UI — 2-column matcher coming soon
              </span>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Btn sm>Auto-assign by company</Btn>
              <Btn sm kind="ghost">
                {I.upload} Bulk import CSV
              </Btn>
            </div>
          </Card>
        </div>

        <div className="col">
          <Card label="System analytics">
            <div
              style={{
                height: 140,
                background: "var(--color-bg)",
                border: "2px dashed var(--color-border)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="muted" style={{ fontSize: 13 }}>
                Line chart · daily active users · 30 days
              </span>
            </div>
            <div className="row" style={{ marginTop: 14, gap: 24 }}>
              <div>
                <div className="tiny">Logbook submissions / wk</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>286</div>
              </div>
              <div>
                <div className="tiny">Avg approval time</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>18h</div>
              </div>
            </div>
          </Card>

          <Card label="Cohorts & programs">
            {cohorts.length === 0 ? (
              <div className="empty-state">No cohorts configured.</div>
            ) : (
              <>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {cohorts.map((c, i) => (
                    <li
                      key={i}
                      className="row row--between row--center"
                      style={{
                        padding: "12px 0",
                        borderBottom:
                          i < cohorts.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                      }}
                    >
                      <div>
                        <b style={{ fontSize: 13 }}>{c.name}</b>
                        <div className="muted" style={{ fontSize: 12 }}>
                          {c.count}
                        </div>
                      </div>
                      <Chip
                        kind={c.status === "Active" ? "ok" : ""}
                        dot={c.status === "Active"}
                      >
                        {c.status}
                      </Chip>
                    </li>
                  ))}
                </ul>
                <Btn sm style={{ marginTop: 12 }}>
                  {I.plus} New cohort
                </Btn>
              </>
            )}
          </Card>

          <Card kind="ghost" label="Audit log">
            {audit.length === 0 ? (
              <div className="empty-state">No recent activity.</div>
            ) : (
              <>
                <ul
                  style={{
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    fontSize: 13,
                  }}
                >
                  {audit.map((entry, i) => (
                    <li key={i} style={{ padding: "6px 0" }}>
                      <b>{entry.who}</b> {entry.what}{" "}
                      <span className="muted">· {entry.when}</span>
                    </li>
                  ))}
                </ul>
                <Btn sm kind="ghost" style={{ marginTop: 8 }}>
                  Open full audit log {I.arrow}
                </Btn>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
