import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead, Card, Btn, Field } from '../../components/common/Primitives';
import { I } from '../../components/common/Icons';
import { createPlacement, getCompanies, getUsersByRoleAndCompany, getUsersByRole } from '../../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    selected_company: "",
    supervisor: "",
    academic_supervisor: "",
    start_date: "",
    end_date: "",
  });
  const [companies, setCompanies] = useState([]);
  const [wsSupervisors, setWsSupervisors] = useState([]);
  const [asSupervisors, setAsSupervisors] = useState([]);
  const [loadingWs, setLoadingWs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load companies and all AS on mount
  useEffect(() => {
    Promise.all([
      getCompanies(),
      getUsersByRole("academic_supervisor"),
    ])
      .then(([cos, as]) => {
        setCompanies(Array.isArray(cos) ? cos : []);
        setAsSupervisors(Array.isArray(as) ? as : []);
      })
      .catch(() => {});
  }, []);

  // When company changes, load WS for that company
  useEffect(() => {
    if (!form.selected_company) {
      setWsSupervisors([]);
      return;
    }
    setLoadingWs(true);
    setForm(p => ({ ...p, supervisor: "" }));
    getUsersByRoleAndCompany("workplace_supervisor", form.selected_company)
      .then((ws) => setWsSupervisors(Array.isArray(ws) ? ws : []))
      .catch(() => setWsSupervisors([]))
      .finally(() => setLoadingWs(false));
  }, [form.selected_company]);

  function update(k, v) {
    setForm(p => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.selected_company || !form.start_date || !form.end_date) {
      setError("Company, start date, and end date are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createPlacement({
        company_name: form.selected_company,
        supervisor: form.supervisor || null,
        academic_supervisor: form.academic_supervisor || null,
        start_date: form.start_date,
        end_date: form.end_date,
      });
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <PageHead
        crumb="Onboarding"
        title="Set up your internship placement"
        sub="You'll unlock your dashboard once your placement is approved."
        actions={<>
          <Btn kind="ghost" sm disabled>Save draft</Btn>
          <Btn kind="primary" sm onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : <>{I.arrow} Submit for approval</>}
          </Btn>
        </>}
      />

      {error && (
        <div style={{
          padding: "12px 16px",
          background: "var(--color-danger-subtle)",
          color: "var(--color-danger)",
          borderRadius: 8,
          marginBottom: 16,
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      <Card kind="warn">
        <div className="row row--center" style={{ gap: 12 }}>
          <span style={{
            width: 36, height: 36, borderRadius: 10, background: "#fff",
            display: "grid", placeItems: "center",
            color: "var(--color-orange)", flexShrink: 0,
          }}>
            {I.alert}
          </span>
          <div className="flex-1">
            <div style={{ fontWeight: 600, color: "var(--color-text)" }}>
              Dashboard locked until your placement is approved.
            </div>
            <div className="muted" style={{ fontSize: 13 }}>
              Tell us where you'll be doing your internship so your supervisors can be linked to your account.
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid--2">
        <Card label="Company / Organisation">
          <Field label="Select company">
            {companies.length === 0 ? (
              <div className="muted" style={{ fontSize: 13, padding: "10px 0" }}>
                No companies registered yet. Ask your internship admin to create an account first.
              </div>
            ) : (
              <select
                value={form.selected_company}
                onChange={e => update("selected_company", e.target.value)}
                required
              >
                <option value="">Choose a company…</option>
                {companies.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            )}
          </Field>
        </Card>

        <Card label="Placement dates">
          <div className="row" style={{ gap: 12 }}>
            <Field label="Start date">
              <input
                type="date"
                value={form.start_date}
                onChange={e => update("start_date", e.target.value)}
                required
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                value={form.end_date}
                onChange={e => update("end_date", e.target.value)}
                required
              />
            </Field>
          </div>
        </Card>

        <Card label="Workplace Supervisor">
          <Field label="Select workplace supervisor">
            <select
              value={form.supervisor}
              onChange={e => update("supervisor", e.target.value)}
              disabled={!form.selected_company || loadingWs}
            >
              <option value="">
                {!form.selected_company
                  ? "Select a company first…"
                  : loadingWs
                  ? "Loading supervisors…"
                  : wsSupervisors.length === 0
                  ? "No supervisors for this company"
                  : "Choose supervisor…"}
              </option>
              {wsSupervisors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} ({s.email})
                </option>
              ))}
            </select>
          </Field>
          <div className="field__hint" style={{ marginTop: 12 }}>
            Your day-to-day supervisor at the company.
          </div>
        </Card>

        <Card label="Academic Supervisor">
          <Field label="Select academic supervisor">
            <select
              value={form.academic_supervisor}
              onChange={e => update("academic_supervisor", e.target.value)}
            >
              <option value="">Choose academic supervisor…</option>
              {asSupervisors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.first_name} {s.last_name} — {s.university || s.email}
                </option>
              ))}
            </select>
          </Field>
          <div className="field__hint" style={{ marginTop: 12 }}>
            {asSupervisors.length === 0
              ? "No academic supervisors available."
              : "Your faculty supervisor at the university."}
          </div>
        </Card>
      </div>

      <Card kind="ghost" label="What happens next">
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-muted)" }}>
          <li>Admin reviews and approves your placement.</li>
          <li>Your dashboard, logbook, and evaluations unlock once approved.</li>
          <li>You can submit another placement while waiting.</li>
        </ol>
      </Card>
    </div>
  );
}
