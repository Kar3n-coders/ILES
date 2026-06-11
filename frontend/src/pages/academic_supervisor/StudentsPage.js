import { useState, useEffect } from "react";
import { PageHead, Card, Chip } from "../../components/common/Primitives";
import { getPlacements } from "../../services/api";
import "./StudentsPage.css";

const STATUS_KIND = { approved: "ok", pending: "warn", rejected: "err" };

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPlacements()
      .then((placements) => {
        const list = (placements || []).map((p) => ({
          id: p.student,
          placement_id: p.id,
          name: p.student_full_name || p.student_username || `Student #${p.student}`,
          company: p.company_name || "—",
          status: p.status,
          logbook_count: p.logbook_count ?? 0,
        }));
        setStudents(list);
      })
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
        crumb="Workspace · Students"
        title="My Students"
        sub={`${students.length} student${students.length !== 1 ? "s" : ""} assigned to you.`}
      />

      {students.length === 0 ? (
        <Card>
          <p className="students-empty">No students assigned to you yet. Ask the internship admin to assign students to your placements.</p>
        </Card>
      ) : (
        <div className="students-grid">
          {students.map((s) => (
            <Card key={s.placement_id}>
              <div className="students-card">
                <div className="students-card__name">{s.name}</div>
                <div className="students-card__email">{s.company}</div>
                <div className="students-card__meta">
                  <span>{s.logbook_count} log{s.logbook_count !== 1 ? "s" : ""}</span>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Chip kind={STATUS_KIND[s.status] || "ghost"}>
                    {s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : "—"}
                  </Chip>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
