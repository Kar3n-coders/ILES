import React, { useState, useEffect } from "react";
import {
  PageHead,
  Card,
  Btn,
  Chip,
  Field,
  Bar,
  Lines,
} from "../../components/common/Primitives";
import { I } from "../../components/common/Icons";
import {
  getLogbooks,
  createLogbook,
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
    return (
      <div className="page">
        <PageHead
          crumb="Workspace · Logbook"
          title="Weekly logbook"
          sub="Each week, summarize what you did, learned, and need help with."
          actions={<Btn sm kind="primary">{I.plus} New week</Btn>}
        />
        <Card label="Logbook">
          <p className="muted" style={{ padding: 24, textAlign: 'center' }}>No logbook entries yet. Create your first week entry to get started.</p>
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
            <Btn sm kind="ghost">
              Export PDF
            </Btn>
            <Btn sm kind="primary">
              {I.plus} New week
            </Btn>
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
            {logbooks.map((it) => {
              const isActive = selected?.id === it.id;
              return (
                <li
                  key={it.id}
                  onClick={() => setSelected(it)}
                  style={{
                    padding: "10px 12px",
                    margin: 2,
                    borderRadius: 8,
                    background: isActive ? "var(--primary-soft)" : "transparent",
                    cursor: "pointer",
                    border: isActive
                      ? "1px solid rgba(26,54,93,0.2)"
                      : "1px solid transparent",
                  }}
                >
                  <div className="row row--between row--center">
                    <b
                      style={{
                        fontSize: 14,
                        color: isActive
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
              );
            })}
          </ul>
        </Card>
        <div className="col">
          <Card kind="accent">
            <div className="row row--between row--center">
              <div>
                <div className="tiny" style={{ color: "var(--color-primary)" }}>
                  Currently editing
                </div>
                <h3 className="section-title" style={{ marginTop: 4 }}>
                  Week 7 · May 4 — May 8
                </h3>
              </div>
              <div className="row row--center" style={{ gap: 8 }}>
                <Chip kind="warn" dot>
                  Draft
                </Chip>
                <Btn sm kind="ghost">
                  Save draft
                </Btn>
                <Btn sm kind="primary">
                  Submit for approval {I.arrow}
                </Btn>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Bar pct={40} />
            </div>
          </Card>

          <Card label="① Tasks completed this week">
            <Field kind="ta">
              <Lines count={4} />
            </Field>
          </Card>

          <div className="grid grid--2">
            <Card label="② Skills practiced">
              <div className="row row--wrap" style={{ gap: 6 }}>
                <Chip kind="accent">REST APIs</Chip>
                <Chip kind="accent">PostgreSQL</Chip>
                <Chip kind="accent">Docker</Chip>
                <Chip>{I.plus} add skill</Chip>
              </div>
              <div className="field__hint" style={{ marginTop: 12 }}>
                Tagged skills automatically appear on your Progress page.
              </div>
            </Card>
            <Card label="③ Hours">
              <div className="row" style={{ gap: 8 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
                  <Field key={d} label={d} placeholder={i < 3 ? "8" : "—"} />
                ))}
              </div>
              <div className="field__hint" style={{ marginTop: 8 }}>
                Total: 24 hrs · 16 hrs remaining this week
              </div>
            </Card>
          </div>

          <Card label="④ Challenges & lessons learned">
            <Field kind="ta">
              <Lines count={3} />
            </Field>
          </Card>

          <Card label="⑤ Attachments (optional)">
            <Field kind="file">
              <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                {I.upload} Drop screenshots, code, photos…
              </span>
            </Field>
          </Card>

          <Card kind="ghost" label="Supervisor approval">
            <div className="row row--between row--center">
              <div className="row row--center" style={{ gap: 12 }}>
                <span className="av av--orange">JO</span>
                <div>
                  <b>Mr. Okello</b> — Workplace supervisor
                  <div className="muted" style={{ fontSize: 12 }}>
                    Will review this entry once you submit. Approval typically
                    within 48 hours.
                  </div>
                </div>
              </div>
              <Chip>Awaiting submit</Chip>
            </div>
          </Card>

          <Card kind="warn" label="Week 4 was returned">
            <div className="row row--between row--center">
              <div className="flex-1" style={{ paddingRight: 16 }}>
                <b>
                  "Add more detail on the API testing task. Mention which
                  endpoints you tested and what tools you used."
                </b>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                  — Mr. Okello · 16 Apr 2026
                </div>
              </div>
              <Btn sm>Open Week 4 {I.arrow}</Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LogbookPage;
