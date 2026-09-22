import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, getRoleDashboard } = useAuth();
  const landingRef = useRef(null);

  useEffect(() => {
    if (!landingRef.current) return undefined;

    const revealItems = landingRef.current.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const handleHeroAction = (isPrimary) => {
    if (isAuthenticated && user) {
      navigate(getRoleDashboard(user.role));
    } else {
      navigate(isPrimary ? "/login" : "/signup");
    }
  };

  return (
    <div className="landing-page" ref={landingRef}>
      <header className="site-header">
        <button className="logo" onClick={() => navigate("/")}>
          <span className="logo-mark">V</span>
          <span>
            Verified<span>Gigs</span>
          </span>
        </button>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>

        <div className="header-actions">
          {isAuthenticated && user ? (
            <>
              <button
                className="button button-small"
                onClick={() => navigate(getRoleDashboard(user.role))}
              >
                Dashboard ↗
              </button>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                <span
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "var(--blue)",
                    color: "white",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "12px",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span>{user.name}</span>
              </div>
              <button className="text-btn" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="text-btn" onClick={() => navigate("/login")}>
                Log in
              </button>
              <button
                className="button button-small"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> The trusted student talent network
            </p>
            <h1>
              Turn your skills
              <br />
              <em>into opportunities.</em>
            </h1>
            <p className="hero-text">
              VerifiedGigs connects talented students with real freelance opportunities,
              helping you build experience, earn, and grow your career.
            </p>
            <div className="hero-actions">
              <button className="button" onClick={() => handleHeroAction(true)}>
                {isAuthenticated ? "Go to Dashboard" : "Find gigs"} <span>↗</span>
              </button>
              <button
                className="button button-ghost"
                onClick={() => handleHeroAction(false)}
              >
                {isAuthenticated ? "My Account" : "Get started"}
              </button>
            </div>
            <div className="trust-row">
              <span>✓ Verified students</span>
              <span>✓ Real opportunities</span>
              <span>✓ Secure platform</span>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="Student working on a freelance project"
          >
            <div className="visual-grid" />
            <div className="photo-frame">
              <img
                className="hero-photo"
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1100&q=85"
                alt="College students collaborating on a laptop"
              />
              <span className="photo-label">Real people. Real projects.</span>
            </div>
            <div className="visual-card visual-card-top">
              <span className="mini-icon">✓</span>
              <span>
                <b>Verified Student</b>
                <small>Profile verified</small>
              </span>
            </div>
            <div className="visual-card visual-card-gig">
              <span className="gig-icon">⌘</span>
              <span>
                <b>New gig available</b>
                <small>Web development · ₹5,000–₹10,000</small>
              </span>
            </div>
            <div className="visual-card visual-card-rating">
              <span className="rating-star">★</span>
              <span>
                <b>4.9</b>
                <small>Student rating</small>
              </span>
            </div>
            <div className="sun-disc" />
          </div>
        </section>

        <section className="stats-strip reveal">
          <div>
            <strong>2.5k+</strong>
            <span>Verified students</span>
          </div>
          <div>
            <strong>840+</strong>
            <span>Live freelance gigs</span>
          </div>
          <div>
            <strong>1.2k+</strong>
            <span>Projects delivered</span>
          </div>
          <div>
            <strong>96%</strong>
            <span>Client satisfaction</span>
          </div>
        </section>

        <section className="section features-section reveal" id="features">
          <div className="section-heading">
            <p className="eyebrow">Why students choose us</p>
            <h2>
              Everything you need
              <br />
              to move <em>forward.</em>
            </h2>
            <p>
              One focused platform to find meaningful work, prove what you can do, and
              build a career before graduation.
            </p>
          </div>
          <div className="feature-grid">
            {[
              ["✦", "Verified students", "Profiles backed by real student identity and skills."],
              ["⌁", "Real opportunities", "Work with clients on projects that matter."],
              ["◇", "Secure & trusted", "Clear milestones and reliable project workflows."],
              ["▣", "Build your portfolio", "Turn every successful gig into proof of your craft."],
              ["◷", "Flexible work", "Choose projects that fit your studies and your life."],
              ["↗", "Career growth", "Build confidence, connections, and momentum."],
            ].map(([icon, title, text]) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="card-arrow">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section process-section reveal" id="how-it-works">
          <div className="section-heading centered">
            <p className="eyebrow">Simple by design</p>
            <h2>
              From curious to <em>capable.</em>
            </h2>
            <p>Four steps between where you are and the experience you want.</p>
          </div>
          <div className="steps">
            {[
              ["01", "Create your profile", "Tell the world what you know and what you want to learn."],
              ["02", "Find the right gig", "Browse opportunities that match your skills and ambition."],
              ["03", "Complete the work", "Collaborate with confidence and deliver great work."],
              ["04", "Build your experience", "Collect wins, reviews, and a portfolio that opens doors."],
            ].map(([number, title, text]) => (
              <div className="step" key={number}>
                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="value-section reveal" id="about">
          <div className="value-copy">
            <p className="eyebrow">Built for the next generation</p>
            <h2>
              Your first opportunity
              <br />
              can change <em>everything.</em>
            </h2>
            <p>
              Students bring fresh thinking. Clients bring real problems. VerifiedGigs is
              where those two forces meet, with the trust and structure to make great
              work happen.
            </p>
            <button className="button" onClick={() => handleHeroAction(false)}>
              Join the network <span>↗</span>
            </button>
          </div>
          <div className="quote-card">
            <span className="quote-mark">“</span>
            <p>
              VerifiedGigs gave me more than a project. It gave me the confidence to call
              myself a designer.
            </p>
            <div className="quote-person">
              <span className="quote-avatar">NS</span>
              <span>
                <b>Nisha Shah</b>
                <small>Product design student</small>
              </span>
            </div>
          </div>
        </section>

        <section className="final-cta reveal">
          <p className="eyebrow">Your next chapter starts here</p>
          <h2>
            Ready to start your
            <br />
            <em>freelancing journey?</em>
          </h2>
          <div className="hero-actions">
            <button className="button button-light" onClick={() => handleHeroAction(false)}>
              Join as a student <span>↗</span>
            </button>
            <button
              className="button button-outline-light"
              onClick={() => handleHeroAction(false)}
            >
              Hire student talent
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <button className="logo" onClick={() => navigate("/")}>
            <span className="logo-mark">V</span>
            <span>
              Verified<span>Gigs</span>
            </span>
          </button>
          <p>Make your potential visible.</p>
        </div>
        <div className="footer-links">
          <div>
            <b>Explore</b>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#about">About us</a>
          </div>
          <div>
            <b>Connect</b>
            <a href="mailto:hello@verifiedgigs.com">hello@verifiedgigs.com</a>
            <a href="#home">LinkedIn</a>
            <a href="#home">Instagram</a>
          </div>
        </div>
        <p className="copyright">© 2025 VerifiedGigs. Built for ambitious students.</p>
      </footer>
    </div>
  );
}
