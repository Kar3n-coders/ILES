import { useState, useEffect } from "react";
import { PageHead, Card, Chip } from "../../components/common/Primitives";
import { getUsers } from "../../services/api";
import "./StudentsPage.css";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then((data) => setStudents(data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page">
        <PageHead title="My Students" sub="Interns assigned to your supervision." />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading students…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <PageHead title="My Students" />
        <Card label="Error"><p style={{ color: "var(--color-error)" }}>{error}</p></Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        title="My Students"
        sub={`${students.length} student${students.length !== 1 ? "s" : ""} assigned to you.`}
      />

      {students.length === 0 ? (
        <Card label="Students">
          <p className="students-empty">No students assigned to you yet.</p>
        </Card>
      ) : (
        <div className="students-grid">
          {students.map((s) => (
            <Card key={s.id}>
              <div className="students-card">
                <div className="students-card__name">
                  {s.first_name} {s.last_name}
                </div>
                <div className="students-card__email">{s.email}</div>
                <div className="students-card__meta">
                  {s.university && <span>{s.university}</span>}
                  {s.course && <span>{s.course}</span>}
                </div>
                <Chip kind="accent">{s.role_display || s.role}</Chip>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
