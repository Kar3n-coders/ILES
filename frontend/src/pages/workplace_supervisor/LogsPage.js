import { useState, useEffect } from "react";
import { PageHead, Card, Btn, Chip } from "../../components/common/Primitives";
import { getLogbooks, getPlacements, createReview } from "../../services/api";
import "../supervisor/FeedbackModal.css";

const STATUS_KIND = {
  pending: "warn",
  submitted: "accent",
  reviewed: "accent",
  approved: "ok",
  draft: "ghost",
};

export default function LogsPage() {
  const [logbooks, setLogbooks] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [acting, setActing] = useState(null);
  const [returnForms, setReturnForms] = useState({});

  useEffect(() => {
    Promise.all([getLogbooks(), getPlacements()])
      .then(([logs, placements]) => {
        setLogbooks(logs || []);
        setPlacements(placements || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const approvedPlacementIds = new Set(
    placements.filter((p) => p.status === "approved").map((p) => p.id)
  );

  const hasApprovedPlacements = approvedPlacementIds.size > 0;

  const pending = logbooks.filter((l) => l.status === "pending");
  const history = logbooks.filter((l) => l.status !== "pending" && l.status !== "draft");

  async function handleApprove(logId) {
    setActing(logId);
    try {
      await createReview({ Logbook: logId, action: "approved", comment: "" });
      setLogbooks((prev) =>
        prev.map((l) => (l.id === logId ? { ...l, status: "approved" } : l))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(null);
    }
  }

  async function handleReturn(logId) {
    const comment = returnForms[logId] || "";
    if (!comment.trim()) return;
    setActing(logId);
    try {
      await createReview({ Logbook: logId, action: "revision_requested", comment });
      setLogbooks((prev) =>
        prev.map((l) => (l.id === logId ? { ...l, status: "draft" } : l))
      );
      setReturnForms((prev) => { const next = { ...prev }; delete next[logId]; return next; });
    } catch (err) {
      setError(err.message);
    } finally {
      setActing(null);
    }
  }

  function toggleReturnForm(logId) {
    setReturnForms((prev) =>
      prev[logId] !== undefined
        ? (() => { const next = { ...prev }; delete next[logId]; return next; })()
        : { ...prev, [logId]: "" }
    );
  }

  if (loading) {
    return (
      <div className="page">
        <PageHead title="Student Logs" />
        <p className="muted" style={{ padding: 24, textAlign: "center" }}>Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · Logs"
        title="Student Logbooks"
        sub="Review and approve your students' weekly log submissions."
      />

      {error && (
        <Card kind="warn">
          <p style={{ color: "var(--color-error)", fontSize: 13 }}>{error}</p>
        </Card>
      )}

      {!hasApprovedPlacements && (
        <Card kind="ghost">
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <div>
              <b style={{ fontSize: 14 }}>Placements pending admin approval</b>
              <div className="muted" style={{ fontSize: 13, marginTop: 2 }}>
                You can review student logbooks once an admin approves a placement.
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card label={`Awaiting review (${pending.length})`} padless>
        {pending.length === 0 ? (
          <div className="empty-state" style={{ padding: 24 }}>No entries awaiting review.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {pending.map((log, i) => {
              const canAct = hasApprovedPlacements && approvedPlacementIds.has(log.placement);
              const showReturn = returnForms[log.id] !== undefined;
              return (
                <div
                  key={log.id}
                  style={{
                    padding: "20px 20px",
                    borderBottom: i < pending.length - 1 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <b style={{ fontSize: 14 }}>
                          {log.student_fullname || log.student_username || `Student #${log.student}`}
                        </b>
                        <Chip kind={STATUS_KIND[log.status] || "accent"} dot>
                          {log.status_display || log.status}
                        </Chip>
                      </div>
                      <div className="muted" style={{ fontSize: 12, marginBottom: 10 }}>
                        Week {log.week_number}
                        {log.start_date && log.end_date
                          ? ` · ${log.start_date.split("T")[0]} — ${log.end_date.split("T")[0]}`
                          : ""}
                        {log.submitted_at ? ` · Submitted ${log.submitted_at.split("T")[0]}` : ""}
                      </div>
                      <div
                        style={{
                          background: "var(--color-bg)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 8,
                          padding: "12px 14px",
                          fontSize: 13,
                          lineHeight: 1.65,
                          color: "var(--color-text)",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {log.activities || <span className="muted">No activities recorded.</span>}
                      </div>
                    </div>

                    {canAct && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 110 }}>
                        <Btn
                          sm
                          kind="primary"
                          disabled={acting === log.id}
                          onClick={() => handleApprove(log.id)}
                        >
                          {acting === log.id ? "…" : "Approve"}
                        </Btn>
                        <Btn
                          sm
                          kind="ghost"
                          disabled={acting === log.id}
                          onClick={() => toggleReturnForm(log.id)}
                        >
                          {showReturn ? "Cancel" : "Return"}
                        </Btn>
                      </div>
                    )}
                  </div>

                  {showReturn && canAct && (
                    <div style={{ marginTop: 12 }}>
                      <textarea
                        rows={3}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          borderRadius: 8,
                          border: "1px solid var(--color-border)",
                          fontSize: 13,
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                        placeholder="Explain what needs to be revised…"
                        value={returnForms[log.id] || ""}
                        onChange={(e) =>
                          setReturnForms((prev) => ({ ...prev, [log.id]: e.target.value }))
                        }
                      />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                        <Btn
                          sm
                          kind="primary"
                          disabled={acting === log.id || !returnForms[log.id]?.trim()}
                          onClick={() => handleReturn(log.id)}
                        >
                          {acting === log.id ? "Sending…" : "Send return"}
                        </Btn>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {history.length > 0 && (
        <Card label={`History (${history.length})`} padless>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {history.map((log, i) => (
              <div
                key={log.id}
                style={{
                  padding: "16px 20px",
                  borderBottom: i < history.length - 1 ? "1px solid var(--color-border)" : "none",
                  opacity: 0.8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <b style={{ fontSize: 13 }}>
                    {log.student_fullname || log.student_username || `Student #${log.student}`}
                  </b>
                  <span className="muted" style={{ fontSize: 12 }}>· Week {log.week_number}</span>
                  <Chip kind={STATUS_KIND[log.status] || "accent"} dot>
                    {log.status_display || log.status}
                  </Chip>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {log.activities || <span className="muted">No activities.</span>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
