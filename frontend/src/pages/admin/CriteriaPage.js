import { useState, useEffect } from "react";
import { PageHead, Card, Chip } from "../../components/common/Primitives";
import { getEvaluationCriteria } from "../../services/api";
import "./CriteriaPage.css";

export default function CriteriaPage() {
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvaluationCriteria()
      .then((data) => setCriteria(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Evaluation Criteria" />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading criteria…</p>
      </div>
    );
  }

  const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);

  return (
    <div className="page">
      <PageHead
        crumb="System · Criteria"
        title="Evaluation Criteria"
        sub="Criteria are managed by academic supervisors. This is a read-only view."
      />

      {error && (
        <Card kind="warn">
          <p style={{ color: "var(--color-error)", fontSize: 13 }}>{error}</p>
        </Card>
      )}

      <Card kind="ghost">
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
          <span style={{ fontSize: 20 }}>ℹ️</span>
          <div>
            <b style={{ fontSize: 14 }}>Criteria are managed by academic supervisors</b>
            <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
              Academic supervisors set the scoring categories used to evaluate students. Workplace supervisors submit scores against these criteria.
            </div>
          </div>
        </div>
      </Card>

      {criteria.length > 0 && Math.abs(totalWeight - 1) > 0.001 && (
        <Card kind="warn">
          <p style={{ fontSize: 13 }}>
            ⚠ Criteria weights sum to <b>{Math.round(totalWeight * 100)}%</b> — should total 100%.
          </p>
        </Card>
      )}

      <Card label={`Criteria (${criteria.length}) · ${Math.round(totalWeight * 100)}% total weight`} padless>
        {criteria.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}>
            No evaluation criteria have been created yet.
          </div>
        ) : (
          <table className="criteria-table" style={{ width: "100%" }}>
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
                    <Chip kind="accent">{c.weight_pct ?? Math.round(c.weight * 100)}%</Chip>
                  </td>
                  <td>5</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
