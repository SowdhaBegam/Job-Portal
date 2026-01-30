import { useState } from "react";
import "../dashboard.css";

export default function Sidebar({ tab, setTab, logout }) {
  const [collapsed, setCollapsed] = useState(false);   // ⭐ NEW

  return (
    <div className={`jsd-sidebar ${collapsed ? "collapsed" : ""}`}>
      
      {/* Toggle Button */}
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        ☰
      </button>

      <h2 className="jsd-logo">GU🚀 GradsUp</h2>

      <button className={tab === "search" ? "nav-btn active" : "nav-btn"} onClick={() => setTab("search")}>
        <span className="icon">🔍</span>
        <span className="text">Search Jobs</span>
      </button>

      <button className={tab === "profile" ? "nav-btn active" : "nav-btn"} onClick={() => setTab("profile")}>
        <span className="icon">👤</span>
        <span className="text">Profile Creation</span>
      </button>

      <button className={tab === "applications" ? "nav-btn active" : "nav-btn"} onClick={() => setTab("applications")}>
        <span className="icon">✅</span>
        <span className="text">Application Status</span>
      </button>

      <button className={tab === "posts" ? "nav-btn active" : "nav-btn"} onClick={() => setTab("posts")}>
        <span className="icon">⭐</span>
        <span className="text">Achievements Posts</span>
      </button>

      <button className={tab === "network" ? "nav-btn active" : "nav-btn"} onClick={() => setTab("network")}>
        <span className="icon">🤝</span>
        <span className="text">Networks</span>
      </button>

      <button className="nav-btn logout" onClick={logout}>
        <span className="icon">🚪</span>
        <span className="text">Logout</span>
      </button>
    </div>
  );
}
