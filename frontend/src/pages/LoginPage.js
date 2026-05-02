import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { LoginForm } from "../components/auth/LoginForm";
import {
  GraduationCap, ChevronRight, ClipboardCheck, BookOpen,
  LayoutDashboard, Moon, Sun, ArrowLeft,
} from "lucide-react";
import "./LoginPage.css";

const DEMO_USERS = [
  { role: "student",               username: "maria.reyes",  password: "student123",    label: "Student (with placement)",  color: "#1a365d" },
  { role: "student_new",           username: "john.doe",     password: "student123",    label: "Student (no placement)",    color: "#2b6cb0" },
  { role: "workplace_supervisor",  username: "dr.santos",    password: "supervisor123", label: "Workplace Supervisor",      color: "#276749" },
  { role: "academic_supervisor",   username: "prof.torres",  password: "supervisor123", label: "Academic Supervisor",       color: "#c05621" },
  { role: "internship_admin",      username: "admin",        password: "admin123",      label: "Internship Admin",          color: "#6b46c1" },
];

const FEATURES = [
  "Weekly logbook submission & tracking",
  "Supervisor review & revision flow",
  "Weighted evaluation scoring",
  "Admin analytics & placements",
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useContext(AuthContext);
  const { isDark, toggleDark } = useContext(ThemeContext);
  const [prefill, setPrefill] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const fillDemo = (u) => {
    setPrefill({ username: u.username, password: u.password });
    setError("");
  };

  const handleLogin = async (username, password) => {
    setError("");
    const result = await login(username, password);
    if (result.success) {
      const found = DEMO_USERS.find((u) => u.username === username);
      if (found?.role === "workplace_supervisor") navigate("/supervisor/dashboard");
      else if (found?.role === "academic_supervisor") navigate("/academic/dashboard");
      else if (found?.role === "internship_admin") navigate("/admin");
      else navigate("/student/dashboard");
    } else {
      setError(result.error || "Invalid credentials. Please try again.");
    }
  };
