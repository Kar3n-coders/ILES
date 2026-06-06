import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getUsers, getPlacements } from "../../services/api";
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

const ROLE_FILTERS = ["All", "Students", "Workplace", "Academic", "Admins"];

const ROLE_DISPLAY = {
  student: "Student",
  workplace_supervisor: "Workplace sup.",
  academic_supervisor: "Academic sup.",
  internship_admin: "System admin",
};

const ROLE_MAP = {
  Students: ["student"],
  Workplace: ["workplace_supervisor"],
  Academic: ["academic_supervisor"],
  Admins: ["internship_admin"],
};

function AdminDashboardPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [audit, setAudit] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([getUsers(), getPlacements()])
      .then(([usersData, placementsData]) => {
        const userList = (usersData?.results || usersData || []).map((u) => ({
          id: u.id,
          name: u.first_name
            ? `${u.first_name} ${u.last_name || ""}`.trim()
            : u.username,
          role: ROLE_DISPLAY[u.role] || u.role,
          rawRole: u.role,
          org: u.cohort || "—",
          status: "Active",
          seen: "—",
        }));
        const placements = placementsData?.results || placementsData || [];

        setUsers(userList);
        setCohorts([]);
        setAudit([]);
        setStats({
          totalUsers: userList.length,
          activeInterns: userList.filter((u) => u.rawRole === "student").length,
          supervisors: userList.filter(
            (u) =>
              u.rawRole === "workplace_supervisor" ||
              u.rawRole === "academic_supervisor",
          ).length,
          openIssues: placements.filter((p) => p.status === "pending").length,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p className="muted">Loading dashboard…</p>
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

  const filteredUsers = users
    .filter((u) => {
      if (filter === "All") return true;
      return (ROLE_MAP[filter] || []).some((r) => u.rawRole === r);
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
                Pairing UI — coming soon
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
                Analytics chart — coming soon
              </span>
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
