import { useState, useEffect } from "react";
import { PageHead, Card, Chip } from "../../components/common/Primitives";
import { getPlacements, getEvaluations, getEvaluationCriteria, getEvaluationSummary } from "../../services/api";
import "./AcademicEvaluationPage.css";

export default function AcademicEvaluationPage() {
  const [placements, setPlacements] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    Promise.all([getPlacements(), getEvaluations(), getEvaluationCriteria()])
      .then(([pData, evData, cData]) => {
        setPlacements(pData || []);
        setEvaluations(evData || []);
        setCriteria(cData || []);
        if (pData && pData.length > 0) {
          setSelected(pData[0].id);
          getEvaluationSummary(pData[0].id).then(setSummary).catch(() => {});
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Student Grades" />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <PageHead title="Student Grades" />
        <Card kind="warn"><p style={{ color: "var(--color-error)", fontSize: 13 }}>{error}</p></Card>
      </div>
    );
  }

  const selectedPlacement = placements.find((p) => p.id === selected || p.id === Number(selected));
  const placementEvals = evaluations.filter((e) => e.placement === selected || e.placement === Number(selected));

  const wsEvals = placementEvals.filter((e) => e.evalutor_type === "workplace");
  const asEvals = placementEvals.filter((e) => e.evalutor_type === "academic");

  const totalWeighted = placementEvals.reduce((sum, e) => sum + (e.weighted_score || 0), 0);
  const maxWeighted = criteria.reduce((sum, c) => sum + (c.weight || 0), 0) * 5;
  const pct = maxWeighted > 0 ? Math.round((totalWeighted / maxWeighted) * 100) : 0;

  function gradeLabel(p) {
    if (p >= 80) return { label: "Distinction", kind: "ok" };
    if (p >= 65) return { label: "Credit", kind: "accent" };
    if (p >= 50) return { label: "Pass", kind: "warn" };
    if (p > 0) return { label: "Fail", kind: "err" };
    return { label: "Not scored", kind: "ghost" };
  }

  const grade = gradeLabel(pct);

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · Grades"
        title="Student Grades"
        sub="View workplace supervisor scores for your assigned students."
      />

      {placements.length === 0 ? (
        <Card>
          <p className="muted" style={{ padding: "24px 0", textAlign: "center" }}>
            No students assigned to you yet.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid--2">
            <Card label="Select student">
              <div className="aeval-group">
                <select
                  className="aeval-select"
                  value={selected || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelected(id);
                    setSummary(null);
                    getEvaluationSummary(id).then(setSummary).catch(() => {});
                  }}
                >
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.student_full_name || p.student_username} — {p.company_name || "—"}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            <Card label="Overall grade">
              <div className="aeval-total">
                <span className="aeval-total__value">{pct}</span>
                <span className="aeval-total__max">%</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <Chip kind={grade.kind}>{grade.label}</Chip>
              </div>
              <p className="aeval-total__hint" style={{ marginTop: 8 }}>
                {totalWeighted.toFixed(2)} weighted pts of {maxWeighted.toFixed(2)} possible
              </p>
            </Card>
          </div>

          <Card label={`Workplace supervisor scores (${wsEvals.length} submitted)`}>
            {wsEvals.length === 0 ? (
              <p className="muted" style={{ fontSize: 13, padding: "12px 0" }}>
                Workplace supervisor has not submitted scores for this student yet.
              </p>
            ) : (
              <table className="criteria-table">
                <thead>
                  <tr>
                    <th scope="col">Criterion</th>
                    <th scope="col">Score</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Weighted</th>
                  </tr>
                </thead>
                <tbody>
                  {wsEvals.map((ev) => (
                    <tr key={ev.id}>
                      <td>
                        <div className="criteria-table__name">{ev.criteria_name || `Criterion #${ev.criteria}`}</div>
                      </td>
                      <td><Chip kind="accent">{ev.score} / 5</Chip></td>
                      <td className="muted">{ev.criteria_weight ? `${Math.round(ev.criteria_weight * 100)}%` : "—"}</td>
                      <td className="muted">{ev.weighted_score?.toFixed(2) ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {asEvals.length > 0 && (
            <Card label={`Academic supervisor scores (${asEvals.length} submitted)`}>
              <table className="criteria-table">
                <thead>
                  <tr>
                    <th scope="col">Criterion</th>
                    <th scope="col">Score</th>
                    <th scope="col">Weighted</th>
                  </tr>
                </thead>
                <tbody>
                  {asEvals.map((ev) => (
                    <tr key={ev.id}>
                      <td className="criteria-table__name">{ev.criteria_name || `Criterion #${ev.criteria}`}</td>
                      <td><Chip kind="accent">{ev.score} / 5</Chip></td>
                      <td className="muted">{ev.weighted_score?.toFixed(2) ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
