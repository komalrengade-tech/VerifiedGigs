import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/useAuth";

const API_URL = "http://localhost:5000/api/auth";

export default function AuthPage({ initialMode = "login" }) {
  const navigate = useNavigate();
  const { login, getRoleDashboard } = useAuth();
  const isLogin = initialMode === "login";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "STUDENT",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/login`, {
          email: form.email,
          password: form.password,
        });

        const token = response.data.token;
        const user = response.data.user;

        // Store session in context & localStorage
        login(token, user);

        setMessage(`Welcome back, ${user.name}! Redirecting...`);

        // Redirect based on role
        const targetDashboard = getRoleDashboard(user.role);
        navigate(targetDashboard, { replace: true });
      } else {
        const response = await axios.post(`${API_URL}/register`, {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
        });

        setMessage(
          `Registration successful! User ID #${response.data.userId}. Redirecting to Login...`
        );

        setForm({
          name: "",
          email: "",
          password: "",
          phone: "",
          role: "STUDENT",
        });

        // After successful signup, redirect them to the Login page (do not open dashboard)
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <button className="auth-back" onClick={() => navigate("/")}>
        ← Back to VerifiedGigs
      </button>

      <div className="auth-layout">
        <div className="auth-intro">
          <button className="logo logo-light" onClick={() => navigate("/")}>
            <span className="logo-mark">V</span>
            <span>
              Verified<span>Gigs</span>
            </span>
          </button>
          <div>
            <p className="eyebrow">{isLogin ? "Welcome back" : "Start something real"}</p>
            <h1>
              {isLogin ? (
                <>
                  Your next
                  <br />
                  <em>opportunity awaits.</em>
                </>
              ) : (
                <>
                  Build your skills.
                  <br />
                  <em>Grow your career.</em>
                </>
              )}
            </h1>
            <p>
              {isLogin
                ? "Pick up where you left off and keep your momentum moving."
                : "Create your profile and find work that makes your potential visible."}
            </p>
          </div>
          <div className="intro-note">
            <span>✦</span> Trusted by students building what comes next
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-card-head">
            <p className="eyebrow">VerifiedGigs account</p>
            <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
            <p className="subtitle">
              {isLogin
                ? "Log in to continue your journey."
                : "Join a network built around your potential."}
            </p>
          </div>

          <div className="tabs">
            <button
              className={isLogin ? "active" : ""}
              onClick={() => {
                setMessage("");
                setError("");
                navigate("/login", { replace: true });
              }}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active" : ""}
              onClick={() => {
                setMessage("");
                setError("");
                navigate("/signup", { replace: true });
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={handleChange}
                />
                <label>Account Type</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="STUDENT">Student</option>
                  <option value="CLIENT">Client</option>
                </select>
              </>
            )}

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              <span>
                {isSubmitting
                  ? isLogin
                    ? "Logging in..."
                    : "Registering..."
                  : isLogin
                  ? "Log in"
                  : "Create account"}
              </span>
              <span>↗</span>
            </button>
          </form>

          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}

          <p className="switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => {
                setMessage("");
                setError("");
                navigate(isLogin ? "/signup" : "/login", { replace: true });
              }}
            >
              {isLogin ? " Sign Up" : " Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
