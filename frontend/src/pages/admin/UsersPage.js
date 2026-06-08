import { useState, useEffect } from "react";
import { PageHead, Card, Chip } from "../../components/common/Primitives";
import { getUsers } from "../../services/api";
import "./UsersPage.css";

const ROLE_KIND = {
  student: "accent",
  workplace_supervisor: "info",
  academic_supervisor: "accent",
  internship_admin: "ok",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Users" sub="Manage all platform users." />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading users…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <PageHead title="Users" />
        <Card label="Error"><p style={{ color: "var(--color-error)" }}>{error}</p></Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        title="Users"
        sub={`${users.length} user${users.length !== 1 ? "s" : ""} registered.`}
      />

      <Card label="All Users">
        <table className="users-table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Full Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="users-table__username">{u.username}</td>
                <td>{u.first_name} {u.last_name}</td>
                <td>{u.email}</td>
                <td><Chip kind={ROLE_KIND[u.role] || "accent"}>{u.role_display || u.role}</Chip></td>
                <td>{u.date_joined?.split("T")[0] || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
