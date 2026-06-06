import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHead, Card, Btn, Field } from '../../components/common/Primitives';
import { I } from '../../components/common/Icons';
import { createPlacement } from '../../services/api';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: "",
    supervisor_name: "",
    supervisor_email: "",
    start_date: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company_name || !form.start_date || !form.end_date) {
      setError("Company name, start date, and end date are required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createPlacement({
        company_name: form.company_name,
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
        crumb="Onboarding · Step 1 of 2"
        title="Set up your internship placement"
        sub="You'll unlock your dashboard once your placement is approved."
        actions={<>
          <Btn kind="ghost" sm disabled title="Draft saving not supported">Save draft</Btn>
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
        <Card label="Company / Organization">
          <Field label="Company name">
            <input
              value={form.company_name}
              onChange={e => update("company_name", e.target.value)}
              placeholder="e.g. Acme Telecoms Ltd."
              required
            />
          </Field>
        </Card>

        <Card label="Workplace supervisor">
          <div className="col" style={{ gap: 12 }}>
            <Field label="Full name">
              <input
                value={form.supervisor_name}
                onChange={e => update("supervisor_name", e.target.value)}
                placeholder="Mr. / Mrs. ___________"
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={form.supervisor_email}
                onChange={e => update("supervisor_email", e.target.value)}
                placeholder="supervisor@company.com"
              />
            </Field>
          </div>
          <div className="field__hint" style={{ marginTop: 12 }}>
            We'll email them an invite to confirm and create a supervisor account.
          </div>
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
      </div>

      <Card kind="ghost" label="What happens next">
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-muted)" }}>
          <li>Academic supervisor reviews and approves your placement (typically 1–2 days).</li>
          <li>Workplace supervisor receives an invite email and confirms.</li>
          <li>Your dashboard, logbook, and evaluations unlock automatically.</li>
        </ol>
      </Card>
    </div>
  );
}
