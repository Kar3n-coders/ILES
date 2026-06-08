import { useState } from "react";
import { PageHead, Card, Btn } from "../../components/common/Primitives";
import "./WorkplaceEvaluationPage.css";

const STUDENTS = [
  { id: 1, name: "Alice Namukasa" },
  { id: 2, name: "Brian Ssemanda" },
  { id: 3, name: "Carol Atim" },
];

const CRITERIA = [
  { key: "technical",       label: "Technical Skills",  max: 30 },
  { key: "punctuality",     label: "Punctuality",        max: 20 },
  { key: "communication",   label: "Communication",      max: 20 },
  { key: "initiative",      label: "Initiative",         max: 15 },
  { key: "professionalism", label: "Professionalism",    max: 15 },
];

export default function WorkplaceEvaluationPage() {
  const [studentId, setStudentId] = useState("");
  const [scores, setScores] = useState(
    Object.fromEntries(CRITERIA.map((c) => [c.key, ""]))
  );

  function setScore(key, val) {
    setScores((s) => ({ ...s, [key]: val }));
  }

  const total = CRITERIA.reduce((sum, c) => {
    const v = parseInt(scores[c.key], 10);
    return sum + (isNaN(v) ? 0 : Math.min(v, c.max));
  }, 0);

  return (
    <div className="page">
      <PageHead
        title="Submit Evaluation"
        sub="Score a student's internship performance."
        actions={
          <Btn kind="primary" sm>
            Submit evaluation
          </Btn>
        }
      />

      <div className="grid grid--2">
        <Card label="Student">
          <div className="weval-group">
            <label className="weval-label">Select student</label>
            <select className="weval-select" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
              <option value="">Choose…</option>
              {STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </Card>

        <Card label="Total score">
          <div className="weval-total">
            <span className="weval-total__value">{total}</span>
            <span className="weval-total__max">/100</span>
          </div>
          <p className="weval-total__hint">
            Fills as you enter scores below.
          </p>
        </Card>
      </div>

      <Card label="Criteria">
        <div className="weval-criteria">
          {CRITERIA.map((c) => (
            <div key={c.key} className="weval-row">
              <div className="weval-row__meta">
                <span className="weval-row__label">{c.label}</span>
                <span className="weval-row__max">max {c.max}</span>
              </div>
              <input
                type="number"
                className="weval-input"
                min={0}
                max={c.max}
                value={scores[c.key]}
                onChange={(e) => setScore(c.key, e.target.value)}
                placeholder="—"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
