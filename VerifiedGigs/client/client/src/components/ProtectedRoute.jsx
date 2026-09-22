import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isAuthLoading, user, getRoleDashboard } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f6f9fd",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            border: "4px solid #dbeafe",
            borderTopColor: "#2563eb",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            marginBottom: "16px",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#10213f", fontWeight: 600, fontSize: "15px" }}>
          Verifying session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If logged-in user tries to access a dashboard belonging to another role, redirect to their own dashboard
    const userDashboard = getRoleDashboard(user?.role);
    return <Navigate to={userDashboard} replace />;
  }

  return children;
}
