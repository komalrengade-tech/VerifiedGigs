import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import "./StudentDashboard.css";

const API_BASE = "http://localhost:5000/api";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const isStudent = user && user.role === "STUDENT";

  // Derive immediate auth error if role is not STUDENT
  let initialAuthError = null;
  if (!token) {
    initialAuthError = { type: "AUTH", message: "No active session found. Please log in as a Student." };
  } else if (!isStudent) {
    initialAuthError = {
      type: "ROLE",
      message: `Your current account (${user?.role || "Unknown"}) does not have student privileges. This area is reserved for verified students only.`,
    };
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!initialAuthError);
  const [apiError, setApiError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const error = initialAuthError || apiError;

  const [retryTrigger, setRetryTrigger] = useState(0);

  useEffect(() => {
    if (!token || !isStudent) return undefined;

    let ignore = false;

    axios
      .get(`${API_BASE}/student/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!ignore) {
          setData(response.data);
          setLoading(false);
          setIsRefreshing(false);
          setApiError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          console.error("Dashboard fetch error:", err);
          const status = err.response?.status;
          const apiMessage = err.response?.data?.message;

          if (status === 401 || status === 403) {
            setApiError({
              type: "AUTH",
              message: apiMessage || "Session expired or access denied. Please log in as a student.",
            });
          } else if (status === 404) {
            setApiError({
              type: "NOT_FOUND",
              message: apiMessage || "Student profile not found. Please complete your registration.",
            });
          } else {
            setApiError({
              type: "SERVER",
              message: apiMessage || "Failed to load dashboard data. Please check your backend connection.",
            });
          }
          setLoading(false);
          setIsRefreshing(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token, isStudent, retryTrigger]);

  const handleRefresh = (isRetry = false) => {
    if (isRetry) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setRetryTrigger((prev) => prev + 1);
  };

  const handleLogoutClick = () => {
    logout();
    navigate("/", { replace: true });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return isoString;
    }
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined || val === "") return "N/A";
    const num = Number(val);
    if (isNaN(num)) return `₹${val}`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auth Guard Views (Fallback in case accessed directly)
  if (error && (error.type === "AUTH" || error.type === "ROLE")) {
    return (
      <div className="student-dashboard-wrapper">
        <header className="sd-header">
          <div className="sd-header-left">
            <button className="logo" onClick={() => navigate("/")}>
              <span className="logo-mark">V</span>
              <span>Verified<span>Gigs</span></span>
            </button>
          </div>
          <div className="sd-header-right">
            <button className="sd-btn sd-btn-outline" onClick={() => navigate("/")}>
              ← Back to Home
            </button>
          </div>
        </header>

        <main className="sd-main">
          <div className="sd-unauth-card">
            <div className="sd-unauth-icon">🔒</div>
            <h2 className="sd-unauth-title">
              {error.type === "ROLE" ? "Student Access Only" : "Authentication Required"}
            </h2>
            <p className="sd-unauth-desc">
              {error.message || "Please sign in with a registered student account to access your dashboard."}
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                className="sd-btn sd-btn-primary"
                onClick={() => {
                  if (error.type === "ROLE") {
                    handleLogoutClick();
                  } else {
                    navigate("/login", { replace: true });
                  }
                }}
              >
                {error.type === "ROLE" ? "Switch Account / Login" : "Log in as Student ↗"}
              </button>
              <button className="sd-btn sd-btn-outline" onClick={() => navigate("/")}>
                Back to Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Loading State
  if (loading) {
    return (
      <div className="student-dashboard-wrapper">
        <header className="sd-header">
          <div className="sd-header-left">
            <button className="logo" onClick={() => navigate("/")}>
              <span className="logo-mark">V</span>
              <span>Verified<span>Gigs</span></span>
            </button>
            <span className="sd-role-pill">Student Portal</span>
          </div>
        </header>

        <main className="sd-main">
          <div className="sd-loading-container">
            <div className="sd-spinner" />
            <h3 className="sd-loading-text">Loading your dashboard...</h3>
            <p className="sd-loading-subtext">Fetching your applications, active projects, and stats from server</p>
          </div>
        </main>
      </div>
    );
  }

  // Error State + Retry
  if (error && !data) {
    return (
      <div className="student-dashboard-wrapper">
        <header className="sd-header">
          <div className="sd-header-left">
            <button className="logo" onClick={() => navigate("/")}>
              <span className="logo-mark">V</span>
              <span>Verified<span>Gigs</span></span>
            </button>
            <span className="sd-role-pill">Student Portal</span>
          </div>
          <div className="sd-header-right">
            <button className="sd-btn sd-btn-danger" onClick={handleLogoutClick}>
              Log out
            </button>
          </div>
        </header>

        <main className="sd-main">
          <div className="sd-error-box">
            <div className="sd-error-icon">⚠️</div>
            <h3 className="sd-error-title">Unable to Load Dashboard</h3>
            <p className="sd-error-desc">{error.message}</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className="sd-btn sd-btn-primary" onClick={() => handleRefresh(true)}>
                ↻ Try Again
              </button>
              <button className="sd-btn sd-btn-outline" onClick={() => navigate("/")}>
                Return Home
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const profile = data?.profile || {};
  const stats = data?.stats || {
    totalApplications: 0,
    pendingApplications: 0,
    shortlistedApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    withdrawnApplications: 0,
    activeProjects: 0,
    unreadNotifications: 0,
  };
  const recentApplications = data?.recentApplications || [];
  const activeProjects = data?.activeProjects || [];
  const recentNotifications = data?.recentNotifications || [];

  return (
    <div className="student-dashboard-wrapper">
      {/* Top Header with Logged-in Navbar */}
      <header className="sd-header">
        <div className="sd-header-left">
          <button className="logo" onClick={() => navigate("/")} title="Go to home">
            <span className="logo-mark">V</span>
            <span>Verified<span>Gigs</span></span>
          </button>
          <span className="sd-role-pill">Student Portal</span>

          <nav style={{ display: "flex", alignItems: "center", gap: "16px", marginLeft: "12px" }}>
            <button
              className="text-btn"
              style={{ color: "var(--blue)", fontWeight: 700 }}
              onClick={() => navigate("/student/dashboard")}
            >
              Dashboard
            </button>
            <button
              className="text-btn"
              onClick={() => scrollToSection("applications-section")}
            >
              My Applications
            </button>
            <button
              className="text-btn"
              onClick={() => scrollToSection("projects-section")}
            >
              Active Projects
            </button>
          </nav>
        </div>

        <div className="sd-header-right">
          <button
            className="sd-btn sd-btn-outline"
            onClick={() => handleRefresh(false)}
            disabled={isRefreshing}
            title="Refresh dashboard data"
          >
            {isRefreshing ? "↻ Refreshing..." : "↻ Refresh"}
          </button>

          <button className="sd-btn sd-btn-outline" onClick={() => navigate("/")}>
            Home
          </button>

          <div className="sd-user-chip">
            <div className="sd-user-avatar">
              {(profile.name || user?.name || "S").charAt(0).toUpperCase()}
            </div>
            <div className="sd-user-info">
              <span className="sd-user-name">{profile.name || user?.name || "Student"}</span>
              <span className="sd-user-sub">
                {profile.student_id ? `ID: #${profile.student_id}` : profile.email || user?.email}
              </span>
            </div>
          </div>

          <button className="sd-btn sd-btn-danger" onClick={handleLogoutClick} title="Sign out">
            Log out
          </button>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="sd-main">
        {/* Welcome Hero Banner */}
        <section className="sd-hero-card">
          <div className="sd-hero-left">
            <p className="eyebrow" style={{ margin: "0 0 8px" }}>
              <span className="eyebrow-dot" /> Verified Student Dashboard
            </p>
            <h1>
              Welcome back, <span>{profile.name || user?.name || "Student"}</span>!
            </h1>
            <p className="sd-hero-subtitle">
              Track your freelance applications, active client contracts, and real-time gig updates.
            </p>

            <div className="sd-badge-row">
              {profile.verification_status === "VERIFIED" ? (
                <span className="sd-badge sd-badge-verified">✓ Verified Student</span>
              ) : (
                <span className="sd-badge sd-badge-pending-verify">
                  ⏳ Verification: {profile.verification_status || "PENDING"}
                </span>
              )}

              {profile.availability_status && (
                <span className="sd-badge sd-badge-available">● {profile.availability_status}</span>
              )}

              {profile.college_name && (
                <span className="sd-badge sd-badge-neutral">🏛 {profile.college_name}</span>
              )}

              {profile.course && (
                <span className="sd-badge sd-badge-neutral">
                  📚 {profile.course} {profile.year_of_study ? `· Year ${profile.year_of_study}` : ""}
                </span>
              )}

              {profile.hourly_rate && (
                <span className="sd-badge sd-badge-neutral">
                  💰 {formatCurrency(profile.hourly_rate)}/hr
                </span>
              )}

              {profile.location && (
                <span className="sd-badge sd-badge-neutral">📍 {profile.location}</span>
              )}
            </div>
          </div>

          <div className="sd-hero-right">
            <button className="sd-btn sd-btn-primary" onClick={() => navigate("/student/gigs")}>
              Browse Gigs ↗
            </button>
          </div>
        </section>

        {/* Real Backend Statistics Grid */}
        <div className="sd-section-title">
          <span>Application & Work Metrics</span>
          {stats.unreadNotifications > 0 && (
            <span style={{ fontSize: "12px", color: "var(--blue)", fontWeight: 600 }}>
              🔔 {stats.unreadNotifications} unread notification{stats.unreadNotifications > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="sd-stats-grid">
          {/* Total Applications */}
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Total Applications</span>
              <span className="sd-stat-icon icon-blue">📋</span>
            </div>
            <div className="sd-stat-value">{stats.totalApplications}</div>
            <span className="sd-stat-subtext">All submitted proposals</span>
          </div>

          {/* Pending Applications */}
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Pending</span>
              <span className="sd-stat-icon icon-amber">⏳</span>
            </div>
            <div className="sd-stat-value">{stats.pendingApplications}</div>
            <span className="sd-stat-subtext">Under client review</span>
          </div>

          {/* Shortlisted Applications */}
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Shortlisted</span>
              <span className="sd-stat-icon icon-indigo">⭐</span>
            </div>
            <div className="sd-stat-value">{stats.shortlistedApplications}</div>
            <span className="sd-stat-subtext">Under final evaluation</span>
          </div>

          {/* Accepted Applications */}
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Accepted</span>
              <span className="sd-stat-icon icon-green">✓</span>
            </div>
            <div className="sd-stat-value">{stats.acceptedApplications}</div>
            <span className="sd-stat-subtext">Ready or transitioned to project</span>
          </div>

          {/* Active Projects */}
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Active Projects</span>
              <span className="sd-stat-icon icon-purple">💼</span>
            </div>
            <div className="sd-stat-value">{stats.activeProjects}</div>
            <span className="sd-stat-subtext">Current contracts in progress</span>
          </div>

          {/* Unread Notifications */}
          <div className="sd-stat-card">
            <div className="sd-stat-header">
              <span className="sd-stat-label">Unread Notifications</span>
              <span className="sd-stat-icon icon-rose">🔔</span>
            </div>
            <div className="sd-stat-value">{stats.unreadNotifications}</div>
            <span className="sd-stat-subtext">New alerts requiring attention</span>
          </div>
        </div>

        {/* 2-Column Section: Active Projects & Recent Applications */}
        <div className="sd-content-grid">
          {/* Active Projects Panel */}
          <section className="sd-panel" id="projects-section">
            <div className="sd-panel-head">
              <h2 className="sd-panel-title">
                <span>Active Projects</span>
                <span className="sd-panel-badge">{activeProjects.length}</span>
              </h2>
            </div>

            {activeProjects.length === 0 ? (
              <div className="sd-empty-box">
                <div className="sd-empty-icon">📁</div>
                <h3 className="sd-empty-title">No Active Projects</h3>
                <p className="sd-empty-desc">
                  When a client accepts your application and starts a gig contract, your active projects will appear here.
                </p>
              </div>
            ) : (
              <div className="sd-project-list">
                {activeProjects.map((project) => (
                  <article className="sd-project-card" key={project.project_id}>
                    <div className="sd-card-top">
                      <div>
                        <h3 className="sd-card-title">{project.project_title}</h3>
                        <div className="sd-card-client">
                          🏢 {project.company_name || `Client #${project.client_id}`}
                        </div>
                      </div>
                      <span
                        className={`sd-app-status ${
                          project.project_status === "IN_PROGRESS"
                            ? "status-in-progress"
                            : project.project_status === "COMPLETED"
                            ? "status-completed"
                            : "status-not-started"
                        }`}
                      >
                        {project.project_status ? project.project_status.replace(/_/g, " ") : "NOT STARTED"}
                      </span>
                    </div>

                    <div className="sd-app-meta-row">
                      <div className="sd-meta-item">
                        <span>Agreed:</span>
                        <strong className="sd-project-amount">
                          {formatCurrency(project.agreed_amount)}
                        </strong>
                      </div>
                      <div className="sd-meta-item">
                        <span>Application:</span>
                        <strong>#{project.application_id}</strong>
                      </div>
                    </div>

                    <div className="sd-timeline-track">
                      <span>
                        Start: <strong>{formatDate(project.start_date)}</strong>
                      </span>
                      <span>
                        Expected End: <strong>{formatDate(project.expected_end_date)}</strong>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Recent Applications Panel */}
          <section className="sd-panel" id="applications-section">
            <div className="sd-panel-head">
              <h2 className="sd-panel-title">
                <span>Recent Applications</span>
                <span className="sd-panel-badge">{recentApplications.length}</span>
              </h2>
            </div>

            {recentApplications.length === 0 ? (
              <div className="sd-empty-box">
                <div className="sd-empty-icon">📝</div>
                <h3 className="sd-empty-title">No Applications Found</h3>
                <p className="sd-empty-desc">
                  You haven't applied to any gigs yet. Browse open student opportunities and submit your first proposal!
                </p>
              </div>
            ) : (
              <div className="sd-app-list">
                {recentApplications.map((app) => (
                  <article className="sd-app-card" key={app.application_id}>
                    <div className="sd-card-top">
                      <div>
                        <h3 className="sd-card-title">{app.gig_title}</h3>
                        <div className="sd-card-client">
                          🏢 {app.company_name || `Client #${app.client_id}`}
                        </div>
                      </div>
                      <span
                        className={`sd-app-status ${
                          app.application_status === "ACCEPTED"
                            ? "status-accepted"
                            : app.application_status === "SHORTLISTED"
                            ? "status-shortlisted"
                            : app.application_status === "REJECTED"
                            ? "status-rejected"
                            : app.application_status === "WITHDRAWN"
                            ? "status-withdrawn"
                            : "status-pending"
                        }`}
                      >
                        {app.application_status}
                      </span>
                    </div>

                    <div className="sd-app-meta-row">
                      <div className="sd-meta-item">
                        <span>Bid:</span>
                        <strong>{formatCurrency(app.proposed_price)}</strong>
                      </div>
                      <div className="sd-meta-item">
                        <span>Est. Days:</span>
                        <strong>{app.estimated_days ? `${app.estimated_days}d` : "N/A"}</strong>
                      </div>
                      <div className="sd-meta-item">
                        <span>Gig Budget:</span>
                        <strong>
                          {formatCurrency(app.budget_min)} - {formatCurrency(app.budget_max)}
                        </strong>
                      </div>
                      <div className="sd-meta-item">
                        <span>Applied:</span>
                        <strong>{formatDate(app.applied_at)}</strong>
                      </div>
                    </div>

                    {app.cover_letter && (
                      <div className="sd-app-cover">
                        <strong>Pitch: </strong>
                        {app.cover_letter.length > 140
                          ? `${app.cover_letter.substring(0, 140)}...`
                          : app.cover_letter}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Recent Notifications Panel */}
        <section className="sd-notifications-panel">
          <div className="sd-panel-head">
            <h2 className="sd-panel-title">
              <span>Recent Notifications</span>
              <span className="sd-panel-badge">{recentNotifications.length}</span>
            </h2>
          </div>

          {recentNotifications.length === 0 ? (
            <div className="sd-empty-box">
              <div className="sd-empty-icon">🔔</div>
              <h3 className="sd-empty-title">All Caught Up!</h3>
              <p className="sd-empty-desc">
                No recent notifications. Any updates on applications, reviews, or project milestones will appear here.
              </p>
            </div>
          ) : (
            <div className="sd-notif-list">
              {recentNotifications.map((notif) => (
                <div
                  className={`sd-notif-item ${notif.is_read === 0 ? "is-unread" : ""}`}
                  key={notif.notification_id}
                >
                  <div className="sd-notif-icon">
                    {notif.notification_type === "APPLICATION"
                      ? "📝"
                      : notif.notification_type === "PROJECT"
                      ? "💼"
                      : notif.notification_type === "PAYMENT"
                      ? "💳"
                      : "🔔"}
                  </div>
                  <div className="sd-notif-body">
                    <div className="sd-notif-header">
                      <h4 className="sd-notif-title">
                        {notif.title}
                        {notif.is_read === 0 && (
                          <span
                            style={{
                              marginLeft: "8px",
                              fontSize: "10px",
                              background: "#2563eb",
                              color: "white",
                              padding: "2px 6px",
                              borderRadius: "4px",
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </h4>
                      <span className="sd-notif-time">{formatDate(notif.created_at)}</span>
                    </div>
                    <p className="sd-notif-message">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
