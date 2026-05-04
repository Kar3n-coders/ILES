import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import LoginForm from "../components/auth/LoginForm";
import { GraduationCap, ChevronRight, Moon, Sun, ArrowLeft } from "lucide-react";
import "./LoginPage.css";

const DEMO_USERS = [
  {
    role: "student",
    username: "maria.reyes",
    password: "student123",
    label: "Student (with placement)",
    color: "#1a365d",
  },
  {
    role: "student_new",
    username: "john.doe",
    password: "student123",
    label: "Student (no placement)",
    color: "#2b6cb0",
  },
  {
    role: "workplace_supervisor",
    username: "dr.santos",
    password: "supervisor123",
    label: "Workplace Supervisor",
    color: "#276749",
  },
  {
    role: "academic_supervisor",
    username: "prof.torres",
    password: "supervisor123",
    label: "Academic Supervisor",
    color: "#c05621",
  },
  {
    role: "internship_admin",
    username: "admin",
    password: "admin123",
    label: "Internship Admin",
    color: "#6b46c1",
  },
];

const FEATURES = [
  "Weekly logbook submission & tracking",
  "Supervisor review & revision flow",
  "Weighted evaluation scoring",
  "Admin analytics & placements",
];

export default function LoginPage() {
  const { isDark, toggleTheme: toggleDark } = useContext(ThemeContext);
  const [prefill, setPrefill] = useState({ username: "", password: "" });

  const fillDemo = (u) => {
    setPrefill({ username: u.username, password: u.password });
  };

  return (
    <div className="login-page" data-theme={isDark ? "dark" : "light"}>
      {/* ── Left brand panel ── */}
      <aside className="login-page__brand">
        <div className="login-page__brand-top">
          <div className="login-page__logo">
            <div className="login-page__logo-icon">
              <GraduationCap size={20} color="#fff" />
            </div>
            <div>
              <p className="login-page__logo-name">ILES</p>
              <p className="login-page__logo-sub">
                Internship Logging &amp; Evaluation System
              </p>
            </div>
          </div>
          <h2 className="login-page__brand-heading">Welcome back</h2>
          <p className="login-page__brand-desc">
            Sign in to access your dashboard. Students, supervisors, and admins
            each have a tailored view of the system.
          </p>
          <ul className="login-page__feature-list">
            {FEATURES.map((f) => (
              <li key={f} className="login-page__feature-item">
                <ChevronRight size={13} className="login-page__feature-icon" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <p className="login-page__brand-footer">
          Makerere University · Computer Science · 2025–2026
        </p>
      </aside>

      <main className="login-page__form-area">
        <div className="login-page__form-inner">
          <div className="login-page__topbar">
            <Link to="/" className="login-page__back-link">
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <button
              onClick={toggleDark}
              className="login-page__theme-btn"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <h1 className="login-page__title">Sign in to ILES</h1>
          <p className="login-page__subtitle">
            Don't have an account?{" "}
            <Link to="/register" className="login-page__register-link">
              Register here
            </Link>
          </p>

          <LoginForm prefill={prefill} />

          <div className="login-page__demo">
            <div className="login-page__demo-divider">
              <span>Quick demo access</span>
            </div>
            <div className="login-page__demo-list">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.role}
                  onClick={() => fillDemo(u)}
                  className="login-page__demo-btn"
                >
                  <span
                    className="login-page__demo-dot"
                    style={{ backgroundColor: u.color + "22", color: u.color }}
                  >
                    ●
                  </span>
                  <span className="login-page__demo-label">{u.label}</span>
                  <span className="login-page__demo-user">{u.username}</span>
                  <ChevronRight size={12} className="login-page__demo-arrow" />
                </button>
              ))}
            </div>
            <p className="login-page__demo-hint">
              Click any row to fill credentials, then click Sign In
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
