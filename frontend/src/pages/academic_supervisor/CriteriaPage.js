import { useState, useEffect } from "react";
import { PageHead, Card, Btn, Chip } from "../../components/common/Primitives";
import { getEvaluationCriteria, createEvaluationCriteria, deleteEvaluationCriteria } from "../../services/api";
import "../admin/CriteriaPage.css";

export default function AcademicCriteriaPage() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", weight: "" });

  useEffect(() => {
    getEvaluationCriteria()
      .then((data) => setCriteria(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm("Delete this criterion? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await deleteEvaluationCriteria(id);
      setCriteria((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(false);
    try {
      const created = await createEvaluationCriteria({
        name: form.name,
        description: form.description,
        weight: parseFloat(form.weight),
      });
      setCriteria((prev) => [...prev, created]);
      setForm({ name: "", description: "", weight: "" });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Evaluation Criteria" />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · Criteria"
        title="Evaluation Criteria"
        sub="Set the scoring categories used to evaluate your students. Workplace supervisors submit scores against these criteria."
      />

      {error && (
        <Card kind="warn">
          <p style={{ color: "var(--color-error)", fontSize: 13 }}>{error}</p>
        </Card>
      )}

      {totalWeight > 0 && Math.abs(totalWeight - 1) > 0.001 && (
        <Card kind="warn">
          <p style={{ fontSize: 13 }}>
            ⚠ Criteria weights currently sum to <b>{Math.round(totalWeight * 100)}%</b>. They should total 100%.
          </p>
        </Card>
      )}

      <div className="grid grid--2">
        <Card label="Add Criterion">
          <div className="criteria-form">
            <div className="criteria-field">
              <label>Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Technical Skills"
              />
            </div>
            <div className="criteria-field">
              <label>Description <span style={{ fontWeight: 400, color: "var(--color-text-muted)" }}>(optional)</span></label>
              <input
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="What this criterion measures"
              />
            </div>
            <div className="criteria-field">
              <label>Weight (0.01–1.00)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max="1"
                value={form.weight}
                onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
                placeholder="e.g. 0.30 for 30%"
              />
            </div>
            <Btn
              kind="primary"
              sm
              disabled={creating || !form.name || !form.weight}
              onClick={handleCreate}
            >
              {creating ? "Adding…" : "Add criterion"}
            </Btn>
            {success && (
              <p style={{ color: "var(--color-success)", fontSize: 13, marginTop: 8 }}>
                ✓ Criterion added. Workplace supervisors can now score against it.
              </p>
            )}
          </div>
        </Card>

        <Card label={`Criteria (${criteria.length}) · ${Math.round(totalWeight * 100)}% total weight`}>
          {criteria.length === 0 ? (
            <p className="criteria-empty">
              No criteria yet. Add criteria above — workplace supervisors will score your students against them.
            </p>
          ) : (
            <table className="criteria-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Weight</th>
                  <th scope="col">Max</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="criteria-table__name">{c.name}</div>
                      {c.description && (
                        <div className="criteria-table__desc">{c.description}</div>
                      )}
                    </td>
                    <td>
                      <Chip kind="accent">{c.weight_pct ?? Math.round(c.weight * 100)}%</Chip>
                    </td>
                    <td>5</td>
                    <td>
                      <Btn sm kind="ghost" disabled={deleting === c.id} onClick={() => handleDelete(c.id)}>
                        {deleting === c.id ? "…" : "Delete"}
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </div>
  );
}
