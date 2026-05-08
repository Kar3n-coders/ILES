import { useState } from "react";
import { createPlacement } from "../../services/api";
import "./PlacementOnBoarding.css";

function PlacementOnBoardingPage() {
  const [form, setForm] = useState({
    company_name: "",
    position: "",
    start_date: "",
    end_date: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // await createPlacement(form);
      setSubmitted(true);
    } catch (err) {
      setError("Could not submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div className="onboarding-page">
        <div className="onboarding-success">
          <span className="onboarding-icon">✅</span>
          <h2>Request submitted!</h2>
          <p>
            Your internship placement request has been sent to the Internship
            Administrator. You will gain access to your full dashboard once it
            is approved.
          </p>
        </div>
      </div>
    );

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">
        <h1>Set Up Your Internship 🏢</h1>
        <p>
          You don't have an active placement yet. Fill in your internship
          details and an admin will approve it.
        </p>

        {error && <div className="onboarding-error">{error}</div>}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <label>Company / Organization Name *</label>
          <input
            required
            value={form.company_name}
            onChange={(e) => update("company_name", e.target.value)}
            placeholder="e.g. TechNova Solutions"
          />

          <label>Your Position / Role *</label>
          <input
            required
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
            placeholder="e.g. Junior software developer"
          />

          <div className="form-row">
            <div>
              <label>Start date *</label>
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => update("start_date", e.target.value)}
              />
            </div>
            <div>
              <label>End Date *</label>
              <input
                type="date"
                required
                value={form.end_date}
                onChange={(e) => update("end_date", e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Submitting..." : "Submit for Admin Approval"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PlacementOnBoardingPage;
