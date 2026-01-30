import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/roleselect.css";

export default function RoleSelect() {
  const navigate = useNavigate();

  // ✅ modal states
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  // ✅ form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const openLogin = (role) => {
    setSelectedRole(role);
    setShowLogin(true);
    setEmail("");
    setPassword("");
  };

  const closeLogin = () => {
    setShowLogin(false);
    setSelectedRole(null);
  };

  const roleTitle =
    selectedRole === "jobseeker"
      ? "Job Seeker Login"
      : selectedRole === "recruiter"
      ? "Recruiter Login"
      : "Admin Login";

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ demo login (later API connect pannalaam)
    const userData = { role: selectedRole, email };
    localStorage.setItem("user", JSON.stringify(userData));

    // ✅ redirect to dashboard based on role
    if (selectedRole === "jobseeker") navigate("/jobseeker");
    else if (selectedRole === "recruiter") navigate("/recruiter");
    else navigate("/admin");
  };

  return (
    <div className="role-page">
      <div className="role-wrapper">
        {/* TOP HEADER */}
        <div className="role-header">
          <h1>Choose Login Role</h1>
          <p>Select your role to continue login</p>
        </div>

        {/* ROLE CARDS (design same) */}
        <div className="role-grid">
          <button className="role-box seeker" onClick={() => openLogin("jobseeker")}>
            <div className="role-top">
              <span className="role-icon">👤</span>
              <span className="role-tag">Job Seeker</span>
            </div>

            <h2>Find & Apply Jobs</h2>
            <p>Search jobs, upload resume, track applications.</p>

            <div className="role-go">Continue →</div>
          </button>

          <button className="role-box recruiter" onClick={() => openLogin("recruiter")}>
            <div className="role-top">
              <span className="role-icon">🏢</span>
              <span className="role-tag">Recruiter</span>
            </div>

            <h2>Hire Faster</h2>
            <p>Post jobs, shortlist candidates, manage applications.</p>

            <div className="role-go">Continue →</div>
          </button>

          <button className="role-box admin" onClick={() => openLogin("admin")}>
            <div className="role-top">
              <span className="role-icon">🛡️</span>
              <span className="role-tag">Admin</span>
            </div>

            <h2>Platform Control</h2>
            <p>Manage users, job posts, reports & monitoring.</p>

            <div className="role-go">Continue →</div>
          </button>
        </div>

        {/* FOOTER */}
        <div className="role-footer">
          <button className="role-back" onClick={() => navigate("/")}>
            ← Back Home
          </button>
        </div>
      </div>

      {/* ✅ LOGIN MODAL (same page) */}
      {showLogin && (
        <div className="login-modal-overlay" onClick={closeLogin}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            {/* header */}
            <div className="login-modal-head">
              <h2>{roleTitle}</h2>
              <button className="login-close" onClick={closeLogin}>
                ✕
              </button>
            </div>

            <p className="login-modal-sub">
              Enter your email and password to continue.
            </p>

            {/* form */}
            <form className="login-modal-form" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" className="login-modal-btn">
                Login
              </button>
            </form>

            {/* extra option */}
            <p className="login-extra">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/signup")}>Sign Up</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
