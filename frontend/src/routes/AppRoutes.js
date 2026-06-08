import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/routing/ProtectedRoute";
import Layout from "../components/layout/Layout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// Student imports
import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import LogbookPage from "../pages/student/LogbookPage";
import ProfilePage from "../pages/student/ProfilePage";
import SchedulePage from "../pages/student/SchedulePage";
import EvaluationsPage from "../pages/student/EvaluationsPage";

// WorkplaceSupervisor imports
import WorkplaceSupervisorDashboardPage from "../pages/workplace_supervisor/WorkplaceSupervisorDashboardPage";
import WorkplaceEvaluationPage from "../pages/workplace_supervisor/WorkplaceEvaluationPage";
import WorkplaceSupervisorProfilePage from "../pages/workplace_supervisor/ProfilePage";
import WorkplaceStudentsPage from "../pages/workplace_supervisor/StudentsPage";

// Academic Supervisor imports
import AcademicSupervisorDashboardPage from "../pages/academic_supervisor/AcademicSupervisorDashboardPage";
import AcademicEvaluationPage from "../pages/academic_supervisor/AcademicEvaluationPage";
import AcademicSupervisorProfilePage from "../pages/academic_supervisor/ProfilePage";
import AcademicStudentsPage from "../pages/academic_supervisor/StudentsPage";

//Admin imports
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminPlacementsPage from "../pages/admin/AdminPlacementsPage";
import AdminProfilePage from "../pages/admin/ProfilePage";
import AdminUsersPage from "../pages/admin/UsersPage";
import AdminCriteriaPage from "../pages/admin/CriteriaPage";

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
            <Route path="/student/schedule" element={<SchedulePage />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/evaluations" element={<EvaluationsPage />} />
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
              path="/supervisor/students"
              element={<WorkplaceStudentsPage />}
            />
            <Route
              path="/supervisor/evaluation"
              element={<WorkplaceEvaluationPage />}
            />
            <Route path="/supervisor/profile" element={<WorkplaceSupervisorProfilePage />} />
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
              path="/academic/students"
              element={<AcademicStudentsPage />}
            />
            <Route
              path="/academic/evaluation"
              element={<AcademicEvaluationPage />}
            />
            <Route path="/academic/profile" element={<AcademicSupervisorProfilePage />} />
          </Route>
        </Route>
        {/* Admin Routes*/}
        <Route element={<ProtectedRoute allowedRoles={["internship_admin"]} />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/placements" element={<AdminPlacementsPage />} />
            <Route path="/admin/criteria" element={<AdminCriteriaPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotPageFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
