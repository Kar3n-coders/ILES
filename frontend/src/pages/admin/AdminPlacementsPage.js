import { useState, useEffect } from "react";
import { PageHead, Card, Stat, Chip, Btn } from "../../components/common/Primitives";
import { getPlacements, updatePlacement, deletePlacement, getUsersByRole } from "../../services/api";
import "../supervisor/FeedbackModal.css";
import "./AdminPlacementsPage.css";

const FILTERS = ["All", "pending", "approved", "rejected"];
const KIND = { approved: "ok", pending: "warn", rejected: "err" };

export default function AdminPlacementsPage() {
  const [placements, setPlacements] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlacement, setEditingPlacement] = useState(null);
  const [editForm, setEditForm] = useState({ supervisor: "", academic_supervisor: "", company_name: "", start_date: "", end_date: "" });
  const [wsUsers, setWsUsers] = useState([]);
  const [asUsers, setAsUsers] = useState([]);

  useEffect(() => {
    Promise.all([getPlacements(), getUsersByRole("workplace_supervisor"), getUsersByRole("academic_supervisor")])
      .then(([p, ws, as]) => {
        setPlacements(p || []);
        setWsUsers(ws || []);
        setAsUsers(as || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === "All" ? placements : placements.filter((p) => p.status === filter);
  const counts = {
    total: placements.length,
    pending: placements.filter((p) => p.status === "pending").length,
    approved: placements.filter((p) => p.status === "approved").length,
    rejected: placements.filter((p) => p.status === "rejected").length,
  };

  async function handleApprove(id) {
    setUpdating(id);
    setActionError(null);
    try {
      await updatePlacement(id, { status: "approved" });
      setPlacements((prev) => prev.map((p) => (p.id === id ? { ...p, status: "approved", status_display: "Approved" } : p)));
    } catch (err) { setActionError(err.message); }
    finally { setUpdating(null); }
  }

  async function handleReject(id) {
    setUpdating(id);
    setActionError(null);
    try {
      await updatePlacement(id, { status: "rejected" });
      setPlacements((prev) => prev.map((p) => (p.id === id ? { ...p, status: "rejected", status_display: "Rejected" } : p)));
    } catch (err) { setActionError(err.message); }
    finally { setUpdating(null); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this placement? This cannot be undone.")) return;
    setUpdating(id);
    try {
      await deletePlacement(id);
      setPlacements((prev) => prev.filter((p) => p.id !== id));
    } catch (err) { setError(err.message); }
    finally { setUpdating(null); }
  }

  function openEdit(p) {
    setEditingPlacement(p);
    setEditForm({
      supervisor: p.supervisor || "",
      academic_supervisor: p.academic_supervisor || "",
      company_name: p.company_name || "",
      start_date: p.start_date ? p.start_date.split("T")[0] : "",
      end_date: p.end_date ? p.end_date.split("T")[0] : "",
    });
    setShowEditModal(true);
  }

  async function handleEditSave() {
    if (!editingPlacement) return;
    setUpdating(editingPlacement.id);
    try {
      const updated = await updatePlacement(editingPlacement.id, {
        supervisor: editForm.supervisor || null,
        academic_supervisor: editForm.academic_supervisor || null,
        company_name: editForm.company_name,
        start_date: editForm.start_date,
        end_date: editForm.end_date,
      });
      setPlacements((prev) => prev.map((p) => (p.id === editingPlacement.id ? { ...p, ...updated } : p)));
      setShowEditModal(false);
    } catch (err) { setError(err.message); }
    finally { setUpdating(null); }
  }

  if (loading) return (
    <div className="page"><PageHead title="Placements" /><p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading…</p></div>
  );

  if (error) return (
    <div className="page"><PageHead title="Placements" /><Card label="Error"><p style={{ color: "var(--color-error)" }}>{error}</p><Btn kind="primary" sm onClick={() => window.location.reload()}>Retry</Btn></Card></div>
  );

  return (
    <div className="page">
      <PageHead title="Placements" sub="Manage and approve student internship placements." />

      <div className="grid grid--4">
        <Stat label="Total" value={counts.total} />
        <Stat label="Pending" value={counts.pending} />
        <Stat label="Approved" value={counts.approved} />
        <Stat label="Rejected" value={counts.rejected} />
      </div>

      <Card label="All Placements">
        {actionError && (
          <p style={{ color: "var(--color-error)", fontSize: 13, padding: "8px 0 0" }}>{actionError}</p>
        )}
        <div className="ap-filters">
          {FILTERS.map((f) => (
            <button key={f} className={`ap-filter${filter === f ? " ap-filter--active" : ""}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <table className="ap-table">
          <thead>
            <tr><th scope="col">Student</th><th scope="col">Company</th><th scope="col">Supervisor</th><th scope="col">Status</th><th scope="col">Actions</th></tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={5} className="ap-empty">No placements match this filter.</td></tr>
            ) : (
              visible.map((p) => (
                <tr key={p.id}>
                  <td>{p.student_full_name || p.student_username || "—"}</td>
                  <td>{p.company_name || "—"}</td>
                  <td>{p.supervisor_full_name || p.supervisor_username || "—"}</td>
                  <td><Chip kind={KIND[p.status] || "accent"}>{p.status_display || p.status}</Chip></td>
                  <td>
                    <div className="ap-actions">
                      {p.status === "pending" && (
                        <>
                          <Btn kind="primary" sm disabled={updating === p.id} onClick={() => handleApprove(p.id)}>
                            {updating === p.id ? "…" : "Approve"}
                          </Btn>
                          <Btn kind="danger" sm disabled={updating === p.id} onClick={() => handleReject(p.id)}>
                            {updating === p.id ? "…" : "Reject"}
                          </Btn>
                        </>
                      )}
                      <Btn kind="ghost" sm disabled={updating === p.id} onClick={() => openEdit(p)}>Edit</Btn>
                      <Btn kind="danger" sm disabled={updating === p.id} onClick={() => handleDelete(p.id)}>
                        {updating === p.id ? "…" : "Delete"}
                      </Btn>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Edit modal */}
      {showEditModal && editingPlacement && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3>Edit Placement</h3>
              <p>{editingPlacement.student_full_name || editingPlacement.student_username} — {editingPlacement.company_name}</p>
              <button className="modal-close" onClick={() => setShowEditModal(false)} aria-label="Close">&times;</button>
            </div>
            <div className="modal-body">
              <div>
                <label>Workplace Supervisor</label>
                <select value={editForm.supervisor} onChange={e => setEditForm(p => ({ ...p, supervisor: e.target.value }))}>
                  <option value="">None</option>
                  {wsUsers.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label>Academic Supervisor</label>
                <select value={editForm.academic_supervisor} onChange={e => setEditForm(p => ({ ...p, academic_supervisor: e.target.value }))}>
                  <option value="">None</option>
                  {asUsers.map(u => <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>)}
                </select>
              </div>
              <div>
                <label>Company Name</label>
                <input value={editForm.company_name} onChange={e => setEditForm(p => ({ ...p, company_name: e.target.value }))} />
              </div>
              <div>
                <label>Start Date</label>
                <input type="date" value={editForm.start_date} onChange={e => setEditForm(p => ({ ...p, start_date: e.target.value }))} />
              </div>
              <div>
                <label>End Date</label>
                <input type="date" value={editForm.end_date} onChange={e => setEditForm(p => ({ ...p, end_date: e.target.value }))} />
              </div>
              <div className="modal-actions">
                <Btn sm kind="ghost" onClick={() => setShowEditModal(false)}>Cancel</Btn>
                <Btn sm kind="primary" disabled={updating === editingPlacement.id} onClick={handleEditSave}>
                  {updating === editingPlacement.id ? "Saving…" : "Save changes"}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
