import { useState } from "react";
import { PageHead, Card, Btn } from "../../components/common/Primitives";
import "./AcademicEvaluationPage.css";

const STUDENTS = [
  { id: 1, name: "Alice Namukasa" },
  { id: 2, name: "Brian Ssemanda" },
  { id: 3, name: "Carol Atim" },
];

const CRITERIA = [
  { key: "logbook",     label: "Logbook Quality",    max: 40 },
  { key: "submissions", label: "Weekly Submissions",  max: 30 },
  { key: "report",      label: "Progress Report",     max: 30 },
];

export default function AcademicEvaluationPage() {
  const [studentId, setStudentId] = useState("");
  const [scores, setScores] = useState(
    Object.fromEntries(CRITERIA.map((c) => [c.key, ""]))
  );
  const [comment, setComment] = useState("");

  function setScore(key, val) {
    setScores((s) => ({ ...s, [key]: val }));
  }

  return (
    <div className="page">
      <PageHead
        title="Submit Evaluation"
        sub="Evaluate a student's logbook and internship progress."
        actions={
          <Btn kind="primary" sm>
            Submit evaluation
          </Btn>
        }
      />

      <div className="grid grid--2">
        <Card label="Student">
          <div className="aeval-group">
            <label className="aeval-label">Select student</label>
            <select
              className="aeval-select"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            >
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
          <div className="aeval-total">
            <span className="aeval-total__value">0</span>
            <span className="aeval-total__max">/100</span>
          </div>
          <p className="aeval-total__hint">Fills as you score below.</p>
        </Card>
      </div>

      <Card label="Criteria">
        <div className="aeval-criteria">
          {CRITERIA.map((c) => (
            <div key={c.key} className="aeval-row">
              <div className="aeval-row__meta">
                <span className="aeval-row__label">{c.label}</span>
                <span className="aeval-row__max">max {c.max}</span>
              </div>
              <input
                type="number"
                className="aeval-input"
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

      <Card label="Comments">
        <textarea
          className="aeval-textarea"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Overall feedback for the student…"
        />
      </Card>
    </div>
  );
}
