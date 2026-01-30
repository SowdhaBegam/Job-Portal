import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";
import API from "../../api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [roleDetected, setRoleDetected] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });

      const { token, user } = res.data;

      // ✅ Save token + user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setRoleDetected(user.role);

      setMsg({
        type: "success",
        text: `✅ Logged in as ${user.role.toUpperCase()}`,
      });

      // ✅ redirect dashboard based on role
      setTimeout(() => {
        if (user.role === "jobseeker") navigate("/jobseeker");
        else if (user.role === "recruiter") navigate("/recruiter");
        else navigate("/admin");
      }, 700);
    } catch (err) {
      console.log(err);
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          "❌ Login failed! Try again.",
      });
      setRoleDetected("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay"></div>

      <button className="login-back" onClick={() => navigate("/")}>
        ←
      </button>

      <div className="login-shell">
        {/* LEFT */}
        <div className="login-brand">
          <div className="brand-head">
            <span className="brand-dot"></span>
            GradsUp Job Portal
          </div>

          <h1 className="brand-title">
            Discover Jobs. <br /> Build Career.
          </h1>

          <p className="brand-sub">
            Login and explore opportunities from top companies.
            Role will be detected automatically.
          </p>

          {roleDetected && (
            <div className="role-pill">
              ✅ Logged in as <b>{roleDetected.toUpperCase()}</b>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="login-card">
          <h2 className="form-title">Login</h2>
          <p className="mini-text">Enter your credentials to continue</p>

          {msg.text && <div className={`login-msg ${msg.type}`}>{msg.text}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-wrap">
              <span className="input-ico">📩</span>
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-wrap">
              <span className="input-ico">🔑</span>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className={`login-btn ${loading ? "loading" : ""}`}
              type="submit"
              disabled={loading}
            >
              {loading ? <span className="spinner"></span> : "Login"}
            </button>
          </form>

          <p className="signup-text">
            New here?{" "}
            <span onClick={() => navigate("/signup")}>Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
}
