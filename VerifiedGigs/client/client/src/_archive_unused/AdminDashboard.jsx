import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./StudentDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="student-dashboard-wrapper">
      {/* Admin Logged-in Header */}
      <header className="sd-header">
        <div className="sd-header-left">
          <button className="logo" onClick={() => navigate("/")} title="Go to home">
            <span className="logo-mark">V</span>
            <span>
              Verified<span>Gigs</span>
            </span>
          </button>
          <span
            className="sd-role-pill"
            style={{ background: "#fee2e2", color: "#b91c1c" }}
          >
            Admin Portal
          </span>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginLeft: "12px",
            }}
          >
            <button
              className="text-btn"
              style={{ color: "var(--blue)", fontWeight: 700 }}
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </button>
            <button className="text-btn" onClick={() => navigate("/admin/verifications")}>
              Verifications
            </button>
            <button className="text-btn" onClick={() => navigate("/admin/reports")}>
              Reports
            </button>
          </nav>
        </div>

        <div className="sd-header-right">
          <div className="sd-user-chip">
            <div
              className="sd-user-avatar"
              style={{ background: "linear-gradient(135deg, #dc2626, #f87171)" }}
            >
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="sd-user-info">
              <span className="sd-user-name">{user?.name || "Administrator"}</span>
              <span className="sd-user-sub">{user?.email}</span>
            </div>
          </div>

          <button className="sd-btn sd-btn-danger" onClick={handleLogout} title="Sign out">
            Log out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="sd-main">
        {/* Hero Card */}
        <section className="sd-hero-card">
          <div className="sd-hero-left">
            <p className="eyebrow" style={{ margin: "0 0 8px" }}>
              <span className="eyebrow-dot" /> Platform Administration
            </p>
            <h1>
              Welcome back, <span>{user?.name || "Administrator"}</span>!
            </h1>
            <p className="sd-hero-subtitle">
              Monitor platform metrics, manage student and client accounts, and verify credentials.
            </p>

            <div className="sd-badge-row">
              <span className="sd-badge sd-badge-verified">🛡 Super Admin</span>
              <span className="sd-badge sd-badge-available">● System Operational</span>
              <span className="sd-badge sd-badge-neutral">⚙ Role: ADMIN</span>
            </div>
          </div>
          <div className="sd-hero-right">
            <button className="sd-btn sd-btn-primary" onClick={() => navigate("/admin/verifications")}>
              Review queue ↗
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="sd-section-title">
          <span>Platform Overview</span>
        </div>

        <div className="sd-stats-grid">
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Total Users</span>
              <span className="sd-stat-icon icon-blue">👥</span>
            </div>
            <div className="sd-stat-value">—</div>
            <span className="sd-stat-subtext">Students & Clients</span>
          </div>

          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Pending Verifications</span>
              <span className="sd-stat-icon icon-amber">⏳</span>
            </div>
            <div className="sd-stat-value">—</div>
            <span className="sd-stat-subtext">ID checks awaiting review</span>
          </div>

          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Live Gigs</span>
              <span className="sd-stat-icon icon-green">💼</span>
            </div>
            <div className="sd-stat-value">—</div>
            <span className="sd-stat-subtext">Active on marketplace</span>
          </div>

          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">System Health</span>
              <span className="sd-stat-icon icon-purple">⚡</span>
            </div>
            <div className="sd-stat-value">100%</div>
            <span className="sd-stat-subtext">All services healthy</span>
          </div>
        </div>
      </main>
    </div>
  );
}
