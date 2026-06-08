import { useState, useEffect } from "react";
import { PageHead, Card, Btn } from "../../components/common/Primitives";
import { getPlacements, getEvaluationCriteria, createEvaluation } from "../../services/api";
import "./AcademicEvaluationPage.css";

export default function AcademicEvaluationPage() {
  const [placements, setPlacements] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState("");
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    Promise.all([getPlacements(), getEvaluationCriteria()])
      .then(([pData, cData]) => {
        setPlacements(pData || []);
        const crits = cData || [];
        setCriteria(crits);
        setScores(Object.fromEntries(crits.map((c) => [c.id, ""])));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const total = criteria.reduce((sum, c) => {
    const v = parseInt(scores[c.id], 10);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  const maxTotal = criteria.length * 5;

  function setScore(id, val) {
    setScores((s) => ({ ...s, [id]: val }));
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedPlacement) return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      const promises = criteria
        .filter((c) => scores[c.id] !== "" && parseInt(scores[c.id], 10) > 0)
        .map((c) =>
          createEvaluation({
            placement: selectedPlacement,
            evalutor_type: "academic",
            criteria: c.id,
            score: parseInt(scores[c.id], 10),
            is_finalised: true,
          })
        );
      await Promise.all(promises);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Submit Evaluation" />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        title="Submit Evaluation"
        sub={success ? "✓ Evaluation submitted successfully." : error ? `⚠ ${error}` : "Evaluate a student's logbook and internship progress."}
        actions={
          <Btn kind="primary" sm disabled={submitting || !selectedPlacement} onClick={handleSubmit}>
            {submitting ? "Submitting…" : "Submit evaluation"}
          </Btn>
        }
      />

      {placements.length === 0 ? (
        <Card label="No Students">
          <p className="aeval-total__hint" style={{ padding: "24px 0", textAlign: "center" }}>
            No students assigned to you yet.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid--2">
            <Card label="Student">
              <div className="aeval-group">
                <label className="aeval-label">Select student</label>
                <select
                  className="aeval-select"
                  value={selectedPlacement}
                  onChange={(e) => setSelectedPlacement(e.target.value)}
                >
                  <option value="">Choose…</option>
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.student_full_name || p.student_username} — {p.company_name}
                    </option>
                  ))}
                </select>
              </div>
            </Card>

            <Card label="Total score">
              <div className="aeval-total">
                <span className="aeval-total__value">{total}</span>
                <span className="aeval-total__max">/{maxTotal}</span>
              </div>
              <p className="aeval-total__hint">Fills as you score below.</p>
            </Card>
          </div>

          <Card label="Criteria">
            <div className="aeval-criteria">
              {criteria.map((c) => (
                <div key={c.id} className="aeval-row">
                  <div className="aeval-row__meta">
                    <span className="aeval-row__label">{c.name}</span>
                    <span className="aeval-row__max">max 5</span>
                  </div>
                  <input
                    type="number"
                    className="aeval-input"
                    min={1}
                    max={5}
                    value={scores[c.id] || ""}
                    onChange={(e) => setScore(c.id, e.target.value)}
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
