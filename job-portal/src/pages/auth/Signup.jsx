import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/signup.css";
import API from "../../api";

export default function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("jobseeker");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("Fresher");

  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [adminKey, setAdminKey] = useState("");

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setLoading(true);

    try {
      const payload = {
        role,
        name: fullName,
        email,
        password,

        phone,
        location,
        skills,
        experience,

        companyName,
        companyWebsite,

        adminKey,
      };

      await API.post("/auth/register", payload);

      setMsg({
        type: "success",
        text: "✅ Account created successfully! Please login.",
      });

      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      console.log(err);
      setMsg({
        type: "error",
        text:
          err?.response?.data?.message ||
          "❌ Signup failed! Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-overlay"></div>

      <div className="signup-card">
        <button className="signup-back" onClick={() => navigate("/")}>
          ←
        </button>

        <div className="signup-head">
          <h1>Create Account</h1>
          <p>Select role and complete details</p>
        </div>

        {msg.text && <div className={`signup-msg ${msg.type}`}>{msg.text}</div>}

        <div className="signup-role-tabs">
          <button
            className={role === "jobseeker" ? "tab active" : "tab"}
            onClick={() => setRole("jobseeker")}
            type="button"
          >
            👤 Job Seeker
          </button>

          <button
            className={role === "recruiter" ? "tab active" : "tab"}
            onClick={() => setRole("recruiter")}
            type="button"
          >
            🏢 Recruiter
          </button>

          <button
            className={role === "admin" ? "tab active" : "tab"}
            onClick={() => setRole("admin")}
            type="button"
          >
            🛡️ Admin
          </button>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

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

          {role === "jobseeker" && (
            <>
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                type="text"
                placeholder="Location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                type="text"
                placeholder="Skills (optional)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              >
                <option>Fresher</option>
                <option>1+ Years</option>
                <option>2+ Years</option>
                <option>5+ Years</option>
              </select>
            </>
          )}

          {role === "recruiter" && (
            <>
              <input
                type="text"
                placeholder="Company Name"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Company Website (optional)"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
              />
            </>
          )}

          {role === "admin" && (
            <input
              type="text"
              placeholder="Admin Key"
              required
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
            />
          )}

          <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="signup-foot">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </div>
  );
}
