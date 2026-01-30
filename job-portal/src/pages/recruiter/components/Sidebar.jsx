export default function Sidebar({ tab, setTab, logout, role }) {
  return (
    <aside className="jsd-sidebar">
      <h2 className="jsd-logo">🎓 GradsUp</h2>

      <button className={`nav-btn ${tab === "profile" ? "active" : ""}`} onClick={() => setTab("profile")}>
        🏢 Company Profile
      </button>

      <button className={`nav-btn ${tab === "post" ? "active" : ""}`} onClick={() => setTab("post")}>
        ➕ Post New Job
      </button>

      <button className={`nav-btn ${tab === "jobs" ? "active" : ""}`} onClick={() => setTab("jobs")}>
        🔍 Jobs + Filters
      </button>

      <button className={`nav-btn ${tab === "applicants" ? "active" : ""}`} onClick={() => setTab("applicants")}>
        👥 View Applicants
      </button>

      <button className="nav-btn logout" onClick={logout}>
        🚪 Logout
      </button>
    </aside>
  );
}
