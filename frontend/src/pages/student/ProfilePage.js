import React, { useState, useEffect } from 'react';
import { PageHead, Card, Btn, Chip, Field, Av } from '../../components/common/Primitives';
import { I } from '../../components/common/Icons';
import { getProfile, updateProfile } from '../../services/api';

function Toggle ({ on }) {
    return (
        <div style = {{
            width: 36, height: 20, borderRadius: 999,
            background: on ? " var(--color-primary)" : "var(--color-border-strong)",
            position: "relative", flexShrink: 0,
        }}>
            <div style={{
                width: 16, height: 16, borderRadius: 999, background: "#fff",
                position: "absolute", top: 2, left: on ? 18 : 2,
                transition: "left .15s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }} />
        </div>
    );
}

function ProfilePage() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone_number: '',
    university: '', course: '', department: '', username: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone_number: data.phone_number || '',
          university: data.university || '',
          course: data.course || '',
          department: data.department || '',
          username: data.username || '',
          role: data.role || '',
        });
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const displayName = `${form.first_name} ${form.last_name}`.trim() || '—';

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSuccess(false);
    try {
      await updateProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        university: form.university,
        course: form.course,
        department: form.department,
      });
      setSuccess(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <PageHead crumb="Account · Profile" title="Your profile" />
        <p className="muted" style={{ padding: 24, textAlign: 'center' }}>Loading profile…</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="page">
        <PageHead crumb="Account · Profile" title="Your profile" />
        <Card label="Error"><p style={{ color: 'var(--color-error)' }}>{loadError}</p></Card>
      </div>
    );
  }

  return (
    <div className='page'>
      <PageHead
        crumb="Account · Profile"
        title="Your profile"
        actions={<><Btn sm kind="ghost">Cancel</Btn><Btn sm kind="primary" disabled={saving} onClick={handleSave}>{saving ? 'Saving…' : 'Save changes'}</Btn></>}
        sub={success ? '✓ Profile updated successfully.' : saveError ? `⚠ ${saveError}` : undefined}
      />

      <div className="grid grid--profile">
        <div className="col">
          <Card>
            <div style={{ display: "grid", placeItems: "center", gap: 12, textAlign: "center" }}>
              <Av name={displayName} lg />
              <Btn sm kind="ghost">{I.upload} Change photo</Btn>
              <div>
                <h3 className="section-title">{displayName}</h3>
                <div className="section-sub">{form.email || '—'}</div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <Chip kind="accent">{form.role || 'User'}</Chip>
                <Chip kind="ok" dot>Active</Chip>
              </div>
            </div>
          </Card>
          <Card kind="ghost" label="On this page">
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {["Personal info", "Academic info", "Placement", "Account & security", "Notifications"].map(s => (
                <li key={s} style={{ padding: "8px 0", borderBottom: "1px solid var(--color-border)", fontSize: 13, color: "var(--color-text-muted)" }}>{s}</li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="col">
          <Card label="Personal info">
            <div className="grid grid--2">
              <Field label="First name"><input name="first_name" value={form.first_name} onChange={handleChange} /></Field>
              <Field label="Last name"><input name="last_name" value={form.last_name} onChange={handleChange} /></Field>
              <Field label="Phone"><input name="phone_number" value={form.phone_number} onChange={handleChange} /></Field>
              <Field label="Date of birth"><input name="dob" placeholder="YYYY-MM-DD" /></Field>
              <Field label="Address"><input name="address" placeholder="City, Country" /></Field>
              <Field label="Emergency contact"><input name="emergency_contact" placeholder="Name + phone" /></Field>
            </div>
          </Card>

          <Card label="Academic info">
            <div className="grid grid--2">
              <Field label="University"><input name="university" value={form.university} onChange={handleChange} /></Field>
              <Field label="Programme"><input name="course" value={form.course} onChange={handleChange} /></Field>
              <Field label="Department"><input name="department" value={form.department} onChange={handleChange} /></Field>
              <Field label="Username"><input name="username" value={form.username} disabled /></Field>
            </div>
          </Card>

          <Card label="Placement">
            <div className="row row--between row--center">
              <div>
                <b style={{ fontSize: 14 }}>{form.university || '—'}</b>
                <div className="muted" style={{ fontSize: 12 }}>{form.department || '—'}</div>
              </div>
              <Btn sm kind="ghost">Request change</Btn>
            </div>
          </Card>

          <Card label="Account & security">
            <div className="grid grid--2">
              <Field label="Email"><input name="email" value={form.email} disabled /></Field>
              <Field label="Password"><span>••••••••••</span></Field>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <Btn sm>Change password</Btn>
              <Btn sm kind="ghost">{I.shield} Enable 2-factor auth</Btn>
            </div>
          </Card>

          <Card label="Notifications">
            {[
              ["Email me when an entry is approved", true],
              ["Email me 24h before a deadline", true],
              ["Email me when supervisor leaves a comment", true],
              ["Weekly progress digest", false],
            ].map(([s, on]) => (
              <div key={s} className="row row--between row--center" style={{ padding: "10px 0", borderBottom: "1px solid var(--color-border)" }}>
                <span style={{ fontSize: 14 }}>{s}</span>
                <Toggle on={on} />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage