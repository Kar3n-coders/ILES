import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  GraduationCap, BookOpen, ClipboardCheck, Star, Building2, Shield,
  ArrowRight, Moon, Sun, ChevronRight, Clock, Users, CheckCircle2,
} from "lucide-react";
import "./HomePage.css";
import {
  GraduationCap, BookOpen, ClipboardCheck, Star, Building2, Shield,
  ArrowRight, Moon, Sun, ChevronRight, Clock, Users, CheckCircle2,
} from "lucide-react";
import "./HomePage.css";
const HOW_IT_WORKS = [
  { step: "01", title: "Register & Get Placed", color: "#1a365d",
    desc: "Students register, select their role, and an admin links them to an internship placement at a partner company." },
  { step: "02", title: "Submit Weekly Logs", color: "#276749",
    desc: "Each week, students log their activities, learnings, and challenges. Logs move from Draft to Pending to Reviewed to Approved." },
  { step: "03", title: "Supervisor Review", color: "#c05621",
    desc: "Workplace supervisors review and approve logs. Academic supervisors evaluate interns on weighted performance criteria." },
  { step: "04", title: "Final Evaluation", color: "#6b46c1",
    desc: "At the end of the internship, students receive a final weighted score covering technical skills, communication, and initiative." },
];

const FEATURES = [
  { icon: BookOpen,       title: "Weekly Logbook",       color: "#1a365d", desc: "Structured weekly activity logs with Draft to Pending to Approved workflow." },
  { icon: ClipboardCheck, title: "Supervisor Review",     color: "#276749", desc: "Approve, request revision, or reject logs with comments and feedback." },
  { icon: Star,           title: "Weighted Evaluation",   color: "#b7791f", desc: "Score interns on Punctuality, Technical Skills, Initiative - computed automatically." },
  { icon: Building2,      title: "Placement Tracking",    color: "#c05621", desc: "Link students to companies and supervisors with clear start/end dates." },
  { icon: Shield,         title: "Role-Based Access",     color: "#2b6cb0", desc: "Student, Workplace Supervisor, Academic Supervisor, Admin - each sees only their data." },
  { icon: Users,          title: "Admin Analytics",       color: "#6b46c1", desc: "System-wide insights: placement rates, completion trends, log statistics." },
];


const STATS = [
  { VALUE: "100+",   label: "students Enrolled",  icon: GraduatioCap },
  { value: "87%",    label: "Placement Rate",     icon: Building2 },
  { value: "12 wks", label: "Average Duration",   icon: Clock  },
  {value: "4 Roles",label: "User Types",          icon: Users },
];

function getDashboardPath(role) {
  if (role === "workplace_supervisor") return "/supervisor/dashboard";
  if (role === "academic_supervisor")  return "/academic/dashboard";
  if (role === "internship_admin")     return "/admin";
  return "/student/dashboard";
}

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const { isDark, toggleDark } = useContext(ThemeContext);

 return (
    <div className="home-page" data-theme={isDark ? "dark" : "light"}>

      {/* Sticky Navbar */}
      <nav className="home-nav">
        <div className="home-nav__brand">
          <div className="home-nav__logo-icon">
            <GraduationCap size={18} color="#fff" />
          </div>
          <span className="home-nav__logo-name">ILES</span>
          <span className="home-nav__logo-sub">Internship Logging &amp; Evaluation System</span>
        </div>
        <div className="home-nav__actions">
          <button onClick={toggleDark} className="home-nav__theme-btn" aria-label="Toggle dark mode">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <Link to={getDashboardPath(user.role)} className="home-nav__btn home-nav__btn--primary">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login"    className="home-nav__btn home-nav__btn--outline">Sign In</Link>
              <Link to="/register" className="home-nav__btn home-nav__btn--primary">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__bg-circles" aria-hidden="true">
          {[0,1,2,3,4].map((i) => (
            <div key={i} className="home-hero__circle" style={{
              width:  `${100 + i * 80}px`,
              height: `${100 + i * 80}px`,
              top:    `${5  + i * 15}%`,
              left:   `${-10 + i * 22}%`,
            }} />
          ))}
        </div>
        <div className="home-hero__content">
          <span className="home-hero__badge">
            <span className="home-hero__badge-dot" />
          
          </span>
          <h1 className="home-hero__title">
            Track Every Step of<br />
            <span className="home-hero__title-accent">Your Internship Journey</span>
          </h1>
          <p className="home-hero__desc">

          </p>
          <div className="home-hero__cta">
            <Link to="/register" className="home-hero__btn home-hero__btn--white">
              Get Started <ArrowRight size={15} />
            </Link>
            <Link to="/login" className="home-hero__btn home-hero__btn--ghost">
              Sign In <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>



      {/* Stats bar */}
      <div className="home-stats">
        {STATS.map((s) => (
          <div key={s.label} className="home-stats__item">
            <div className="home-stats__value-row">
              <s.icon size={16} color="#1a365d" />
              <span className="home-stats__value">{s.value}</span>
            </div>
            <p className="home-stats__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <section className="home-how">
        <h2 className="home-section__title"></h2>
        <p className="home-section__sub"></p>
        <div className="home-how__grid">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="home-how__card">
              <span className="home-how__step-badge" style={{ backgroundColor: step.color }}>{step.step}</span>
              <h3 className="home-how__card-title">{step.title}</h3>
              <p className="home-how__card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        <h2 className="home-section__title">Built for the Full Internship Lifecycle</h2>
        <p className="home-section__sub">Everything the team needs - from day one to the final grade</p>
        <div className="home-features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="home-features__card">
              <div className="home-features__icon-wrap" style={{ backgroundColor: f.color + "18" }}>
                <f.icon size={20} color={f.color} />
              </div>
              <h4 className="home-features__card-title">{f.title}</h4>
              <p className="home-features__card-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="home-cta">
        <h2 className="home-cta__title">Ready to start your internship journey?</h2>
        <p className="home-cta__desc">
          Register today to submit your first logbook entry and connect with your supervisors.
        </p>
        <div className="home-cta__buttons">
          <Link to="/register" className="home-cta__btn home-cta__btn--white">
            Create Account <ArrowRight size={15} />
          </Link>
          <Link to="/login" className="home-cta__btn home-cta__btn--ghost">
            Already have an account? Sign in
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="home-footer__brand">
          <div className="home-footer__logo-icon">
            <GraduationCap size={13} color="#fff" />
          </div>
          <span className="home-footer__text">ILES · Makerere University · Computer Science · 2025-2026</span>
        </div>
        <div className="home-footer__links">
          <Link to="/login"    className="home-footer__link">Sign In</Link>
          <Link to="/register" className="home-footer__link">Register</Link>
          <span className="home-footer__built">
            <CheckCircle2 size={10} color="#276749" /> Built with React + Django
          </span>
        </div>
      </footer>

    </div>
  );
}