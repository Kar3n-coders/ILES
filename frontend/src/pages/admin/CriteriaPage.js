import { useState, useEffect } from "react";
import { PageHead, Card, Btn, Chip } from "../../components/common/Primitives";
import { getEvaluationCriteria, createEvaluationCriteria } from "../../services/api";
import "./CriteriaPage.css";

export default function CriteriaPage() {
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
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading criteria…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        title="Evaluation Criteria"
        sub="Define scoring categories and weights for supervisor evaluations."
      />

      {error && (
        <Card label="Error">
          <p style={{ color: "var(--color-error)", marginBottom: 12 }}>{error}</p>
          <Btn kind="primary" sm onClick={() => { setError(null); setLoading(true); getEvaluationCriteria().then(d => { setCriteria(d || []); setLoading(false); }).catch(e => { setError(e.message); setLoading(false); }); }}>Retry</Btn>
        </Card>
      )}

      <div className="grid grid--2">
        <Card label="Create Criterion">
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
              <label>Description</label>
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
                placeholder="0.30"
              />
            </div>
            <Btn
              kind="primary"
              sm
              disabled={creating || !form.name || !form.weight}
              onClick={handleCreate}
            >
              {creating ? "Creating…" : "Create criterion"}
            </Btn>
            {success && (
              <p style={{ color: "var(--color-success)", fontSize: "0.8rem", marginTop: 8 }}>
                ✓ Criterion created.
              </p>
            )}
          </div>
        </Card>

        <Card label={`Criteria (${criteria.length})`}>
          {criteria.length === 0 ? (
            <p className="criteria-empty">No criteria defined yet.</p>
          ) : (
            <table className="criteria-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Weight</th>
                  <th scope="col">Max Score</th>
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
                      <Chip kind="accent">{Math.round(c.weight * 100)}%</Chip>
                    </td>
                    <td>5</td>
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
