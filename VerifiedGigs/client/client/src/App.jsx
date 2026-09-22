import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./components/LandingPage";
import AuthPage from "./components/AuthPage";
import StudentDashboard from "./components/StudentDashboard";
import ClientDashboard from "./components/ClientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import {
  StudentGigs,
  StudentGigDetail,
  StudentApplications,
  StudentProjects,
  StudentProjectDetail,
  StudentPortfolio,
  StudentFavorites,
  StudentNotifications,
  StudentMessages,
  StudentProfile,
} from "./components/StudentPortal";
import {
  ClientNewGig,
  ClientGigDetail,
  ClientEditGig,
  ClientApplications,
  ClientApplicationDetail,
  ClientProjects,
  ClientProjectDetail,
  ClientMessages,
  ClientNotifications,
  ClientProfile,
} from "./components/ClientPortal";
import ClientOwnedGigs from "./components/ClientOwnedGigs";
import {
  AdminGigs,
  AdminVerifications,
  AdminReports,
  AdminCatalog,
} from "./components/AdminPortal";
import {
  AdminDashboardLive,
  AdminUsersLive,
  AdminProjectsLive,
  AdminPaymentsLive,
  AdminProfileLive,
} from "./components/AdminManagement";
import {
  StudentReports,
  StudentReviews,
  ClientReports,
  ClientReviews,
} from "./components/PortalExtras";
import StudentPayments from "./components/StudentPayments";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Guest Routes: Redirect to role dashboard if already authenticated */}
          <Route
            path="/login"
            element={
              <GuestRoute>
                <AuthPage initialMode="login" />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <AuthPage initialMode="signup" />
              </GuestRoute>
            }
          />

          {/* Protected Role-Specific Dashboards */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/student/gigs" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentGigs /></ProtectedRoute>} />
          <Route path="/student/gigs/:gigId" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentGigDetail /></ProtectedRoute>} />
          <Route path="/student/applications" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentApplications /></ProtectedRoute>} />
          <Route path="/student/projects" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentProjects /></ProtectedRoute>} />
          <Route path="/student/projects/:projectId" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentProjectDetail /></ProtectedRoute>} />
          <Route path="/student/portfolio" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentPortfolio /></ProtectedRoute>} />
          <Route path="/student/favorites" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentFavorites /></ProtectedRoute>} />
          <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentNotifications /></ProtectedRoute>} />
          <Route path="/student/messages" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentMessages /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentProfile /></ProtectedRoute>} />
          <Route path="/student/reports" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentReports /></ProtectedRoute>} />
          <Route path="/student/reviews" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentReviews /></ProtectedRoute>} />
          <Route path="/student/payments" element={<ProtectedRoute allowedRoles={["STUDENT"]}><StudentPayments /></ProtectedRoute>} />
          <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute allowedRoles={["CLIENT"]}>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/client/gigs/new" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientNewGig /></ProtectedRoute>} />
          <Route path="/client/gigs" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientOwnedGigs /></ProtectedRoute>} />
          <Route path="/client/gigs/:gigId" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientGigDetail /></ProtectedRoute>} />
          <Route path="/client/gigs/:gigId/edit" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientEditGig /></ProtectedRoute>} />
          <Route path="/client/applications" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientApplications /></ProtectedRoute>} />
          <Route path="/client/applications/:applicationId" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientApplicationDetail /></ProtectedRoute>} />
          <Route path="/client/projects" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientProjects /></ProtectedRoute>} />
          <Route path="/client/projects/:projectId" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientProjectDetail /></ProtectedRoute>} />
          <Route path="/client/messages" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientMessages /></ProtectedRoute>} />
          <Route path="/client/notifications" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientNotifications /></ProtectedRoute>} />
          <Route path="/client/profile" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientProfile /></ProtectedRoute>} />
          <Route path="/client/reports" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientReports /></ProtectedRoute>} />
          <Route path="/client/reviews" element={<ProtectedRoute allowedRoles={["CLIENT"]}><ClientReviews /></ProtectedRoute>} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboardLive />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminUsersLive /></ProtectedRoute>} />
          <Route path="/admin/gigs" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminGigs /></ProtectedRoute>} />
          <Route path="/admin/verifications" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminVerifications /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/catalog" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminCatalog /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminProfileLive /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminProjectsLive /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminPaymentsLive /></ProtectedRoute>} />

          {/* Catch‑all fallback: redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;