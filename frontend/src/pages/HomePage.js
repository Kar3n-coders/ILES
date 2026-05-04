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
