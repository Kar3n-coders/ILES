import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/base.css";
import AppRoutes from "./routes/AppRoutes";

import AcademicDashboardPage from './pages/AcademicDashboardPage';
// ...
<Route path="/academic/dashboard" element={
  <ProtectedRoute roles={['academic_supervisor']}>
    <AcademicDashboardPage />
  </ProtectedRoute>
} />

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
