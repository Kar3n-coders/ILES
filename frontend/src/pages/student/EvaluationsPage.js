import { useState, useEffect } from "react";
import { PageHead, Card, Chip, Bar } from "../../components/common/Primitives";
import { getEvaluations } from "../../services/api";
import "./EvaluationsPage.css";

const STATUS_KIND = { approved: "ok", pending: "warn", rejected: "err", scheduled: "accent" };

function Crit({ label, weight, score }) {
  const pct = Math.round((score / weight) * 100);
  return (
    <div className="eval-crit">
      <div className="eval-crit__top">
        <span className="eval-crit__label">{label}</span>
        <span className="eval-crit__score">{score}/{weight}</span>
      </div>
      <Bar pct={pct} />
    </div>
  );
}

function EvalCard({ title, total, max, criteria }) {
  const pct = Math.round((total / max) * 100);
  return (
    <Card label={title}>
      <div className="eval-card__header">
        <span className="eval-card__score">
          {total}<span className="eval-card__max">/{max}</span>
        </span>
        <Chip kind={pct >= 70 ? "ok" : pct >= 50 ? "warn" : "err"}>{pct}%</Chip>
      </div>
      <Bar pct={pct} />
      <div className="eval-card__criteria">
        {criteria.map((c) => <Crit key={c.label} {...c} />)}
      </div>
    </Card>
  );
}

export default function EvaluationsPage() {
  const [workplaceCriteria, setWorkplaceCriteria] = useState([]);
  const [academicCriteria, setAcademicCriteria] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getEvaluations()
      .then((data) => {
        const evals = data || [];
        const workplace = evals.filter((e) => e.evaluator_type === "workplace");
        const academic = evals.filter((e) => e.evaluator_type === "academic");

        setWorkplaceCriteria(
          workplace.map((e) => ({
            label: e.criteria_name,
            score: e.score,
            weight: e.criteria_weight || 5,
          }))
        );
        setAcademicCriteria(
          academic.map((e) => ({
            label: e.criteria_name,
            score: e.score,
            weight: e.criteria_weight || 5,
          }))
        );
        setHistory(
          evals
            .filter((e) => e.is_finalised)
            .map((e) => ({
              date: e.evaluated_at?.split("T")[0] || "—",
              type: e.evaluator_type === "workplace" ? "Workplace" : "Academic",
              evaluator: e.evaluator_username || (e.evaluator_type === "workplace" ? "Workplace Supervisor" : "Academic Supervisor"),
              criteria: e.criteria_name,
              score: e.score,
              status: "approved",
            }))
        );
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const wpTotal = workplaceCriteria.reduce((s, c) => s + c.score, 0);
  const wpMax   = workplaceCriteria.reduce((s, c) => s + c.weight, 0);
  const acTotal = academicCriteria.reduce((s, c) => s + c.score, 0);
  const acMax   = academicCriteria.reduce((s, c) => s + c.weight, 0);

  if (loading) {
    return (
      <div className="page">
        <PageHead title="My Evaluations" sub="Scores from your workplace and academic supervisors." />
        <p className="muted" style={{ padding: 24, textAlign: 'center' }}>Loading evaluations…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <PageHead title="My Evaluations" sub="Scores from your workplace and academic supervisors." />
        <Card label="Error">
          <p style={{ color: 'var(--color-error)', marginBottom: 12 }}>{error}</p>
          <button className="btn btn--primary btn--sm" onClick={() => window.location.reload()}>
            Retry
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        title="My Evaluations"
        sub="Scores from your workplace and academic supervisors."
      />

      {(workplaceCriteria.length === 0 && academicCriteria.length === 0) ? (
        <Card label="Evaluations">
          <p className="eval-empty">No evaluations yet. Scores will appear here once your supervisors submit them.</p>
        </Card>
      ) : (
        <div className="grid grid--2">
          {workplaceCriteria.length > 0 && (
            <EvalCard
              title="Workplace Evaluation"
              total={wpTotal}
              max={wpMax}
              criteria={workplaceCriteria}
            />
          )}
          {academicCriteria.length > 0 && (
            <EvalCard
              title="Academic Evaluation"
              total={acTotal}
              max={acMax}
              criteria={academicCriteria}
            />
          )}
        </div>
      )}

      <Card label="Evaluation History">
        {history.length === 0 ? (
          <p className="eval-empty">No completed evaluations yet.</p>
        ) : (
          <table className="eval-table">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Evaluator</th>
                <th scope="col">Criteria</th>
                <th scope="col">Score</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td>{h.type}</td>
                  <td>{h.evaluator}</td>
                  <td>{h.criteria}</td>
                  <td className="eval-table__score">{h.score}/5</td>
                  <td><Chip kind={STATUS_KIND[h.status] || "ok"}>{h.status}</Chip></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
