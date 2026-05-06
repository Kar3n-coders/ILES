import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./styles/base.css";
import AppRoutes from "./routes/AppRoutes";

import WorkplaceSupervisorDashboardPage from './pages/WorkplaceSupervisorDashboardPage';
// ...
<Route path="/supervisor/dashboard" element={
  <ProtectedRoute roles={['workplace_supervisor']}>
    <WorkplaceSupervisorDashboardPage />
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
