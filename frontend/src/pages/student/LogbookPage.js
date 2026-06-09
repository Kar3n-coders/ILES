import React, { useState, useEffect } from "react";
import {
  PageHead,
  Card,
  Btn,
  Chip,
  Field,
  Bar,
} from "../../components/common/Primitives";
import { I } from "../../components/common/Icons";
import "../supervisor/FeedbackModal.css";
import {
  getLogbooks,
  createLogbook,
  updateLogbook,
  submitLogbook,
  getPlacements,
} from "../../services/api";

const STATUS_KIND = {
  draft: "accent",
  pending: "warn",
  approved: "ok",
  returned: "warn",
};

function LogbookPage() {
  const [logbooks, setLogbooks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [placement, setPlacement] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newEntry, setNewEntry] = useState({
    week_number: "",
    start_date: "",
    end_date: "",
    activities: "",
  });

  useEffect(() => {
    Promise.all([getLogbooks(), getPlacements()])
      .then(([logData, placementsData]) => {
        const sorted = (logData || []).sort((a, b) => b.week_number - a.week_number);
        setLogbooks(sorted);
        setSelected(sorted[0] || null);
        setPlacement(placementsData?.[0] || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!placement) return;
    setCreating(true);
    try {
      const entry = await createLogbook({
        ...newEntry,
        placement: placement.id,
      });
      setLogbooks((prev) => [entry, ...prev]);
      setSelected(entry);
      setNewEntry({ week_number: "", start_date: "", end_date: "", activities: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveDraft() {
    if (!selected) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateLogbook(selected.id, {
        week_number: selected.week_number,
        start_date: selected.start_date,
        end_date: selected.end_date,
        activities: selected.activities || "",
        status: "draft",
      });
      setLogbooks((prev) =>
        prev.map((l) => (l.id === selected.id ? { ...l, ...updated } : l))
      );
      setSelected((prev) => ({ ...prev, ...updated }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(logId) {
    setSubmitting(true);
    try {
      const updated = await submitLogbook(logId);
      setLogbooks((prev) =>
        prev.map((l) => (l.id === logId ? { ...l, status: updated.status } : l))
      );
      if (selected?.id === logId) {
        setSelected((prev) => ({ ...prev, status: updated.status }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <PageHead crumb="Workspace · Logbook" title="Weekly logbook" />
        <p className="muted" style={{ padding: 24, textAlign: 'center' }}>Loading logbook…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <PageHead crumb="Workspace · Logbook" title="Weekly logbook" />
        <Card label="Error"><p style={{ color: 'var(--color-error)' }}>{error}</p></Card>
      </div>
    );
  }

  if (!selected) {
    const canCreate = placement && placement.status !== "pending";
    return (
      <div className="page">
        <PageHead
          crumb="Workspace · Logbook"
          title="Weekly logbook"
          sub="Each week, summarize what you did, learned, and need help with."
          actions={
            canCreate ? (
              <Btn sm kind="primary" onClick={() => setShowCreateForm(true)}>
                {I.plus} New week
              </Btn>
            ) : null
          }
        />
        <Card label="Logbook">
          <p className="muted" style={{ padding: 24, textAlign: 'center' }}>
            {!placement
              ? "Complete your placement onboarding to start logging entries."
              : placement.status === "pending"
              ? "Your placement is pending approval. Logbook unlocks after approval."
              : "No logbook entries yet. Create your first week entry to get started."}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHead
        crumb="Workspace · Logbook"
        title="Weekly logbook"
        sub="Each week, summarize what you did, learned, and need help with. Your supervisor signs off on every entry."
        actions={
          <>
            <Btn sm kind="ghost">Export PDF</Btn>
            <Btn
              sm
              kind="primary"
              disabled={!placement || placement?.status === "pending"}
              title={!placement ? "Complete your placement onboarding first" : placement?.status === "pending" ? "Placement pending approval" : ""}
              onClick={() => setShowCreateForm((v) => !v)}
            >
              {I.plus} New week
            </Btn>
            {(!placement || placement?.status === "pending") && (
              <span className="muted" style={{ fontSize: 12 }}>
                {!placement ? "Complete placement onboarding to create entries" : "Placement pending approval — logbook unlocks after approval"}
              </span>
            )}
          </>
        }
      />

      <div className="grid grid--side-list">
        <Card padless style={{ overflow: "hidden" }}>
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <span className="tiny">Weeks</span>
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 6 }}>
            {logbooks.length === 0 ? (
              <li style={{ padding: 16, textAlign: "center", fontSize: 13, color: "var(--color-text-muted)" }}>
                No entries yet
              </li>
            ) : (
              logbooks.map((it) => (
                <li
                  key={it.id}
                  onClick={() => setSelected(it)}
                  style={{
                    padding: "10px 12px",
                    margin: 2,
                    borderRadius: 8,
                    background: selected?.id === it.id ? "var(--primary-soft)" : "transparent",
                    cursor: "pointer",
                    border: selected?.id === it.id
                      ? "1px solid rgba(26,54,93,0.2)"
                      : "1px solid transparent",
                  }}
                >
                  <div className="row row--between row--center">
                    <b
                      style={{
                        fontSize: 14,
                        color: selected?.id === it.id
                          ? "var(--color-primary)"
                          : "var(--color-text)",
                      }}
                    >
                      Week {it.week_number}
                    </b>
                    <Chip kind={STATUS_KIND[it.status] || "accent"}>
                      {it.status_display || it.status}
                    </Chip>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    {it.start_date && it.end_date
                      ? `${it.start_date} — ${it.end_date}`
                      : it.created_at?.split("T")[0] || "—"}
                  </div>
                </li>
              ))
            )}
          </ul>
        </Card>
        <div className="col">
          {showCreateForm && (
            <div className="modal-overlay" onClick={() => setShowCreateForm(false)}>
              <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                <div className="modal-header">
                  <h3>New logbook entry</h3>
                  <p>Fill in the details for this week's log.</p>
                  <button className="modal-close" onClick={() => setShowCreateForm(false)} aria-label="Close">&times;</button>
                </div>
                <div className="modal-body">
                  <div className="grid grid--2">
                    <div>
                      <label>Week number</label>
                      <input
                        type="number"
                        value={newEntry.week_number}
                        onChange={(e) => setNewEntry((p) => ({ ...p, week_number: e.target.value }))}
                        placeholder="e.g. 8"
                      />
                    </div>
                    <div>
                      <label>Start date</label>
                      <input
                        type="date"
                        value={newEntry.start_date}
                        onChange={(e) => setNewEntry((p) => ({ ...p, start_date: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label>End date</label>
                      <input
                        type="date"
                        value={newEntry.end_date}
                        onChange={(e) => setNewEntry((p) => ({ ...p, end_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label>Activities</label>
                    <textarea
                      rows={4}
                      value={newEntry.activities}
                      onChange={(e) => setNewEntry((p) => ({ ...p, activities: e.target.value }))}
                      placeholder="Describe what you worked on this week…"
                    />
                  </div>
                  {error && <p style={{ color: "var(--color-error)", fontSize: 13 }}>{error}</p>}
                  <div className="modal-actions">
                    <Btn sm kind="ghost" onClick={() => setShowCreateForm(false)}>Cancel</Btn>
                    <Btn
                      sm
                      kind="primary"
                      disabled={creating || !newEntry.week_number || !newEntry.start_date || !newEntry.end_date}
                      onClick={handleCreate}
                    >
                      {creating ? "Creating…" : "Create entry"}
                    </Btn>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card kind="accent">
            <div className="row row--between row--center">
              <div>
                <div className="tiny" style={{ color: "var(--color-primary)" }}>
                  Currently editing
                </div>
                <h3 className="section-title" style={{ marginTop: 4 }}>
                  Week {selected.week_number}
                  {selected.start_date && selected.end_date
                    ? ` · ${selected.start_date} — ${selected.end_date}`
                    : ""}
                </h3>
              </div>
              <div className="row row--center" style={{ gap: 8 }}>
                <Chip kind={STATUS_KIND[selected.status] || "accent"} dot>
                  {selected.status_display || selected.status}
                </Chip>
                {saveSuccess && (
                  <span style={{ fontSize: 12, color: "var(--color-success)" }}>✓ Saved</span>
                )}
                <Btn sm kind="ghost" disabled={saving} onClick={handleSaveDraft}>
                  {saving ? "Saving…" : "Save draft"}
                </Btn>
                {selected.status === "draft" && (
                  <Btn
                    sm
                    kind="primary"
                    disabled={submitting}
                    onClick={() => handleSubmit(selected.id)}
                  >
                    {submitting ? "Submitting…" : `Submit for approval ${I.arrow}`}
                  </Btn>
                )}
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Bar pct={selected.status === "approved" ? 100 : selected.status === "pending" ? 50 : 40} />
            </div>
          </Card>

          <Card label="Activities">
            <Field kind="ta">
              {selected.activities || <span className="muted" style={{ fontSize: 13 }}>No activities recorded.</span>}
            </Field>
          </Card>

          <Card kind="ghost" label="Supervisor approval">
            <div className="row row--between row--center">
              <div className="row row--center" style={{ gap: 12 }}>
                <span className="av av--orange">WS</span>
                <div>
                  <b>Your Workplace Supervisor</b>
                  <div className="muted" style={{ fontSize: 12 }}>
                    Will review this entry once you submit. Approval typically
                    within 48 hours.
                  </div>
                </div>
              </div>
              <Chip>Awaiting submit</Chip>
            </div>
          </Card>

          {selected.status === "returned" && (
            <Card kind="warn" label={`Week ${selected.week_number} was returned`}>
              <div className="row row--between row--center">
                <div className="flex-1" style={{ paddingRight: 16 }}>
                  <b>
                    Your supervisor has requested revisions. Please review
                    their feedback and resubmit.
                  </b>
                  <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                    Check the comments on your entry for details.
                  </div>
                </div>
                <Btn sm>Edit entry {I.arrow}</Btn>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default LogbookPage;
