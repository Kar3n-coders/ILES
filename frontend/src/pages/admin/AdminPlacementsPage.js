import { useState, useEffect } from "react";
import { PageHead, Card, Stat, Chip, Btn } from "../../components/common/Primitives";
import { getPlacements, updatePlacement } from "../../services/api";
import "./AdminPlacementsPage.css";

const FILTERS = ["All", "pending", "approved", "rejected"];
const KIND = { approved: "ok", pending: "warn", rejected: "err" };

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    getPlacements()
      .then((data) => setPlacements(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === "All" ? placements : placements.filter((p) => p.status === filter);

  const counts = {
    total:    placements.length,
    pending:  placements.filter((p) => p.status === "pending").length,
    approved: placements.filter((p) => p.status === "approved").length,
    rejected: placements.filter((p) => p.status === "rejected").length,
  };

  async function handleApprove(id) {
    setUpdating(id);
    try {
      await updatePlacement(id, { status: "approved" });
      setPlacements((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "approved", status_display: "Approved" } : p))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  async function handleReject(id) {
    setUpdating(id);
    try {
      await updatePlacement(id, { status: "rejected" });
      setPlacements((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: "rejected", status_display: "Rejected" } : p))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(null);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Placements" />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading placements…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <PageHead title="Placements" />
        <Card label="Error">
          <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p>
          <Btn kind="primary" sm onClick={() => window.location.reload()}>Retry</Btn>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        title="Placements"
        sub="Manage and approve student internship placements."
      />

      <div className="grid grid--4">
        <Stat label="Total"    value={counts.total}    />
        <Stat label="Pending"  value={counts.pending}  />
        <Stat label="Approved" value={counts.approved} />
        <Stat label="Rejected" value={counts.rejected} />
      </div>

      <Card label="All Placements">
        <div className="ap-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`ap-filter${filter === f ? " ap-filter--active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <table className="ap-table">
          <thead>
            <tr>
              <th scope="col">Student</th>
              <th scope="col">Company</th>
              <th scope="col">Supervisor</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="ap-empty">No placements match this filter.</td>
              </tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id}>
                  <td>{p.student_full_name || p.student_username || "—"}</td>
                  <td>{p.company_name || "—"}</td>
                  <td>{p.supervisor_full_name || p.supervisor_username || "—"}</td>
                  <td>
                    <Chip kind={KIND[p.status] || "accent"}>
                      {p.status_display || p.status}
                    </Chip>
                  </td>
                  <td>
                    {p.status === "pending" && (
                      <div className="ap-actions">
                        <Btn
                          kind="primary"
                          sm
                          disabled={updating === p.id}
                          onClick={() => handleApprove(p.id)}
                        >
                          {updating === p.id ? "…" : "Approve"}
                        </Btn>
                        <Btn
                          kind="danger"
                          sm
                          disabled={updating === p.id}
                          onClick={() => handleReject(p.id)}
                        >
                          {updating === p.id ? "…" : "Reject"}
                        </Btn>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
