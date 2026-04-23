import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/routing/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Student imports
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import LogbookPage from "./pages/student/LogbookPage";
import ProgressPage from "./pages/student/ProgressPage";

// WorkplaceSupervisor imports
import SupervisorDashboardPage from "./pages/SupervisorDashboardPage";

// Academic Supervisor imports
import AdminDashboardPage from "./pages/AdminDashboardPage";
import EvaluationPage from "./pages/EvaluationPage";
import NotPageFound from "./pages/NotPageFound";

import "./styles/base.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Routes*/}
          <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route element={<Layout />}>
              <Route
                path="/student/dashboard"
                element={<StudentDashboardPage />}
              />
              <Route path="/student/logbook" element={<LogbookPage />} />
              <Route path="/student/progress" element={<ProgressPage />} />

              {/* Supervisor Routes*/}
              <Route
                path="/supervisor/dashboard"
                element={<SupervisorDashboardPage />}
              />
              <Route
                path="/supervisor/evaluation"
                element={<EvaluationPage />}
              />

              {/* Admin Routes*/}
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NotPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
