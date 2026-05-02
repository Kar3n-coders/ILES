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

