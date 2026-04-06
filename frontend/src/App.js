import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import { AuthContext } from "./context/AuthContext";

import ProtectedRoute from "./components/routing/ProtectedRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import SupervisorDashboardPage from "./pages/SupervisorDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import LogbookPage from "./pages/LogbookPage";
import EvaluationPage from "./pages/EvaluationPage";
import NotPageFound from "./pages/NotPageFound";

import "./styles/base.css";

function App() {
  return (
    <AuthContext>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Student Routes*/}
              <Route
                path="/student/dashboard"
                element={<StudentDashboardPage />}
              />
              <Route path="/student/logbook" element={<LogbookPage />} />

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
    </AuthContext>
  );
}

export default App;
