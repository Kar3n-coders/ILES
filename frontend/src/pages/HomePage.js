import React from "react";

function HomePage() {
  return <h1> HOME PAGE</h1>;
}

export default HomePage;


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
