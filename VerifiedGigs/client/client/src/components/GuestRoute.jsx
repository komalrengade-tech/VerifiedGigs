import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function GuestRoute({ children }) {
  const { isAuthenticated, isAuthLoading, user, getRoleDashboard } = useAuth();

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
          Loading...
        </p>
      </div>
    );
  }

  if (isAuthenticated && user) {
    // If the user is already logged in and visits /login or /signup, redirect to their correct dashboard
    return <Navigate to={getRoleDashboard(user.role)} replace />;
  }

  return children;
}
