import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/routing/ProtectedRoute";
import Layout from "../components/layout/Layout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// Student imports
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import LogbookPage from "../pages/student/LogbookPage";
import ProgressPage from "../pages/student/ProgressPage";
import ProfilePage from "../pages/student/ProfilePage";
import SchedulePage from "../pages/student/SchedulePage";
import DocumentsPage from "../pages/student/DocumentsPage";

// WorkplaceSupervisor imports
import WorkplaceSupervisorDashboardPage from "../pages/workplace_supervisor/WorkplaceSupervisorDashboardPage";
import WorkplaceEvaluationPage from "../pages/workplace_supervisor/WorkplaceEvaluationPage";

// Academic Supervisor imports
import AcademicSupervisorDashboardPage from "../pages/academic_supervisor/AcademicSupervisorDashboardPage";
import AcademicEvaluationPage from "../pages/academic_supervisor/AcademicEvaluationPage";

//Admin imports
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminPlacementsPage from "../pages/admin/AdminPlacementsPage";

//Not Page Found
import NotPageFound from "../pages/NotPageFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Student routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<Layout />}>
            <Route
              path="/student/dashboard"
              element={<StudentDashboardPage />}
            />
            <Route path="/student/logbook" element={<LogbookPage />} />
            <Route path="/student/progress" element={<ProgressPage />} />
            <Route path="/student/schedule" element={<SchedulePage />} />
            <Route path="/student/documents" element={<DocumentsPage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        {/* Workplace Supervisor */}
        <Route
          element={<ProtectedRoute allowedRoles={["workplace_supervisor"]} />}
        >
          <Route element={<Layout />}>
            <Route
              path="/supervisor/dashboard"
              element={<WorkplaceSupervisorDashboardPage />}
            />
            <Route
              path="/supervisor/evaluation"
              element={<WorkplaceEvaluationPage />}
            />
          </Route>
        </Route>
        {/* Academic Supervisor */}
        <Route
          element={<ProtectedRoute allowedRoles={["academic_supervisor"]} />}
        >
          <Route element={<Layout />}>
            <Route
              path="/academic/dashboard"
              element={<AcademicSupervisorDashboardPage />}
            />
            <Route
              path="/academic/evaluation"
              element={<AcademicEvaluationPage />}
            />
          </Route>
        </Route>
        {/* Admin Routes*/}
        <Route element={<ProtectedRoute allowedRoles={["internship_admin"]} />}>
          <Route element={<Layout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/placements" element={<AdminPlacementsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotPageFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
