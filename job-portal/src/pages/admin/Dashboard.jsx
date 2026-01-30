import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";
import Topbar from "../jobseeker/components/Topbar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

/* ================= Dummy Users ================= */
const DEFAULT_USERS = [
  { id: 1, name: "Sowdha Begam", role: "jobseeker", email: "sowdha@gmail.com", status: "Active" },
  { id: 2, name: "Karthik Raja", role: "jobseeker", email: "karthik@gmail.com", status: "Active" },
  { id: 3, name: "HR Zoho", role: "recruiter", email: "zohohr@gmail.com", status: "Active" },
  { id: 4, name: "Kaar Recruiter", role: "recruiter", email: "kaar@gmail.com", status: "Blocked" },
];

/* ================= Dummy Jobs ================= */
const DEFAULT_JOBS = [
  { id: 101, title: "React Developer", company: "GradsUp Hiring", location: "Chennai", status: "Active" },
  { id: 102, title: "Python Developer", company: "DataBridge", location: "Bangalore", status: "Active" },
  { id: 103, title: "Java Developer", company: "CloudNex", location: "Hyderabad", status: "Reported" },
];

/* ================= Dummy Reports ================= */
const DEFAULT_REPORTS = [
  { id: 1, type: "Job Post", reportedItem: "Java Developer - CloudNex", reason: "Fake job posting", status: "Pending" },
  { id: 2, type: "User", reportedItem: "Kaar Recruiter", reason: "Spam messages", status: "Solved" },
];

/* ================= NEW: Pending Approvals ================= */
const DEFAULT_PENDING_RECRUITERS = [
  {
    id: 9001,
    name: "New HR Team",
    company: "NextGen Pvt Ltd",
    email: "hr@nextgen.com",
    location: "Chennai",
    kyc: "Uploaded",
    status: "Pending",
  },
  {
    id: 9002,
    name: "Talent Acquisition",
    company: "SparkTech",
    email: "talent@spark.com",
    location: "Bangalore",
    kyc: "Uploaded",
    status: "Pending",
  },
];

const DEFAULT_PENDING_JOBS = [
  {
    id: 8001,
    title: "UI Developer",
    company: "SparkTech",
    location: "Chennai",
    salary: "₹25k - ₹40k",
    status: "Pending",
  },
  {
    id: 8002,
    title: "Backend Developer",
    company: "NextGen Pvt Ltd",
    location: "Bangalore",
    salary: "₹40k - ₹70k",
    status: "Pending",
  },
];

export default function AdminDashboard() {
  const [toast, setToast] = useState("");
  const [tab, setTab] = useState("overview");
  // overview | users | jobs | reports | approvals | announcements | settings

  /* ================= Storage state ================= */
   const [users, setUsers] = useState([]);
const [jobs, setJobs] = useState([]);
const [reports, setReports] = useState([]);

/* ================= FETCH FROM BACKEND ================= */
useEffect(() => {
  fetch("http://localhost:5000/api/admin/users")
    .then(res => res.json())
    .then(data => setUsers(data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  fetch("http://localhost:5000/api/admin/jobs")
    .then(res => res.json())
    .then(data => setJobs(data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  fetch("http://localhost:5000/api/admin/reports")
    .then(res => res.json())
    .then(data => setReports(data))
    .catch(err => console.log(err));
}, []);
useEffect(() => {
  fetch("http://localhost:5000/api/admin/pending-recruiters")
    .then(res => res.json())
    .then(data => setPendingRecruiters(data))
    .catch(err => console.log(err));
}, []);
useEffect(() => {
  fetch("http://localhost:5000/api/admin/pending-jobs")
    .then(res => res.json())
    .then(data => setPendingJobs(data))
    .catch(err => console.log(err));
}, []);





  // ✅ NEW: approvals
  const [pendingRecruiters, setPendingRecruiters] = useState([]);

  const [pendingJobs, setPendingJobs] = useState([]);


  /* ================= Save to localStorage ================= */

  useEffect(() => localStorage.setItem("admin_pending_recruiters", JSON.stringify(pendingRecruiters)), [pendingRecruiters]);

  /* ================= Analytics ================= */
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const jobSeekers = users.filter((u) => u.role === "jobseeker").length;
    const recruiters = users.filter((u) => u.role === "recruiter").length;
    const blocked = users.filter((u) => u.status === "Blocked").length;

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === "Active").length;
    const reportedJobs = jobs.filter((j) => j.status === "Reported").length;

    const pendingReports = reports.filter((r) => r.status === "Pending").length;

    const pendingRecruiterCount = pendingRecruiters.filter((r) => r.status === "Pending").length;
    const pendingJobCount = pendingJobs.filter((j) => j.status === "Pending").length;

    return {
      totalUsers,
      jobSeekers,
      recruiters,
      blocked,
      totalJobs,
      activeJobs,
      reportedJobs,
      pendingReports,
      pendingRecruiterCount,
      pendingJobCount,
    };
  }, [users, jobs, reports, pendingRecruiters, pendingJobs]);

  /* ================= Graph Data ================= */
  const pieData = [
    { name: "Job Seekers", value: stats.jobSeekers },
    { name: "Recruiters", value: stats.recruiters },
    { name: "Blocked", value: stats.blocked },
  ];

  const barData = [
    { name: "Jobs", Active: stats.activeJobs, Reported: stats.reportedJobs },
    { name: "Approvals", Recruiters: stats.pendingRecruiterCount, Jobs: stats.pendingJobCount },
    { name: "Reports", Pending: stats.pendingReports },
  ];

  const PIE_COLORS = ["#22c55e", "#60a5fa", "#ef4444"];

  /* ================= Actions ================= */
 const toggleUserStatus = async (id) => {
  await fetch(`http://localhost:5000/api/admin/user/${id}/toggle`, {
    method: "PATCH",
  });

  setUsers(prev =>
  prev.map(u =>
    u._id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u
  )
);


  setToast("✅ User status updated!");
  setTimeout(() => setToast(""), 1800);
};

  const deleteJob = async (id) => {
  await fetch(`http://localhost:5000/api/admin/job/${id}`, {
    method: "DELETE",
  });

  setJobs(jobs.filter(j => j._id !== id));

  setToast("🗑️ Job deleted!");
  setTimeout(() => setToast(""), 1800);
};


  const solveReport = async (id) => {
  await fetch(`http://localhost:5000/api/admin/report/${id}/solve`, {
    method: "PATCH",
  });

  setReports(reports.map(r =>
    r._id === id ? { ...r, status: "Solved" } : r
  ));

  setToast("✅ Report marked as solved!");
  setTimeout(() => setToast(""), 1800);
};

  /* ================= Approvals Actions ================= */
  const approveRecruiter = async (rec) => {
  await fetch(`http://localhost:5000/api/admin/recruiter/${rec._id}/approve`, {
    method: "POST",
  });

  setPendingRecruiters(prev => prev.filter(r => r._id !== rec._id));

  setToast(`✅ Recruiter Approved: ${rec.company}`);
  setTimeout(() => setToast(""), 1800);
};


  const rejectRecruiter = async (id) => {
  await fetch(`http://localhost:5000/api/admin/recruiter/${id}/reject`, {
    method: "DELETE",
  });

  setPendingRecruiters(prev => prev.filter(r => r._id !== id));

  setToast("❌ Recruiter Rejected!");
  setTimeout(() => setToast(""), 1800);
  };

  const approveJob = async (job) => {
  await fetch(`http://localhost:5000/api/admin/job/${job._id}/approve`, {
    method: "PATCH",
  });

  // Remove from pending list
  setPendingJobs(prev => prev.filter(j => j._id !== job._id));

  // 🔥 Fetch active jobs again so it appears in Job Management
  fetch("http://localhost:5000/api/admin/jobs")
    .then(res => res.json())
    .then(data => setJobs(data));

  setToast(`✅ Job Approved: ${job.title}`);
  setTimeout(() => setToast(""), 1800);
};

  
const rejectJob = async (id) => {
  await fetch(`http://localhost:5000/api/admin/job/${id}/reject`, {
    method: "DELETE",
  });

  setPendingJobs(prev => prev.filter(j => j._id !== id));

  setToast("❌ Job Rejected!");
  setTimeout(() => setToast(""), 1800);
};


  /* ================= Announcement ================= */
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState(() => {
    return JSON.parse(localStorage.getItem("admin_announcements")) || [];
  });

  useEffect(() => {
    localStorage.setItem("admin_announcements", JSON.stringify(announcements));
  }, [announcements]);

  const postAnnouncement = () => {
    if (!announcement.trim()) return;

    const newAnn = {
      id: Date.now(),
      text: announcement,
      time: new Date().toLocaleString(),
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setAnnouncement("");

    setToast("📢 Announcement posted!");
    setTimeout(() => setToast(""), 1800);
  };

  /* ================= NEW: Admin Settings ================= */
  const [admin, setAdmin] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("admin_settings")) || {
        name: "Admin",
        email: "admin@gradsup.com",
        phone: "",
        password: "",
      }
    );
  });

  const saveAdminSettings = () => {
    localStorage.setItem("admin_settings", JSON.stringify(admin));
    setToast("✅ Admin settings saved!");
    setTimeout(() => setToast(""), 1800);
  };

  /* ================= Logout ================= */
  const logout = () => {
  localStorage.removeItem("token");  // ✅ JWT token remove
  localStorage.removeItem("user");   // ✅ user details remove

  setToast("✅ Logged out successfully!");
  setTimeout(() => (window.location.href = "/login"), 700); // ✅ go to login
};


  return (
    <div className="admin-page">
      {/* =============== Sidebar =============== */}
      <aside className="admin-sidebar">
        <h2 className="admin-logo">
          <span className="admin-mark">🛡</span> Admin Panel
        </h2>

        <button className={`admin-btn ${tab === "overview" ? "active" : ""}`} onClick={() => setTab("overview")}>
          📊 Overview
        </button>

        <button className={`admin-btn ${tab === "approvals" ? "active" : ""}`} onClick={() => setTab("approvals")}>
          ✅ Approvals
          {(stats.pendingRecruiterCount + stats.pendingJobCount) > 0 && (
            <span className="notify-dot">{stats.pendingRecruiterCount + stats.pendingJobCount}</span>
          )}
        </button>

        <button className={`admin-btn ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
          👥 User Management
        </button>

        <button className={`admin-btn ${tab === "jobs" ? "active" : ""}`} onClick={() => setTab("jobs")}>
          📌 Job Management
        </button>

        <button className={`admin-btn ${tab === "reports" ? "active" : ""}`} onClick={() => setTab("reports")}>
          🚨 Reports
        </button>

        <button className={`admin-btn ${tab === "announcements" ? "active" : ""}`} onClick={() => setTab("announcements")}>
          📢 Announcements
        </button>

        <button className={`admin-btn ${tab === "settings" ? "active" : ""}`} onClick={() => setTab("settings")}>
          ⚙️ Settings
        </button>

        <button className="admin-btn logout" onClick={logout}>
          🚪 Logout
        </button>
      </aside>

      {/* =============== Main =============== */}
      <main className="admin-main">
        {toast && <div className="toast">{toast}</div>}

        <Topbar title="Admin Dashboard" />

        {/* ================= OVERVIEW + GRAPHS ================= */}
        {tab === "overview" && (
          <div className="admin-content">
            <h2 className="admin-heading">Admin Overview</h2>

            <div className="admin-stats">
              <div className="stat-card"><p>Total Users</p><h2>{stats.totalUsers}</h2></div>
              <div className="stat-card"><p>Job Seekers</p><h2>{stats.jobSeekers}</h2></div>
              <div className="stat-card"><p>Recruiters</p><h2>{stats.recruiters}</h2></div>
              <div className="stat-card"><p>Blocked Users</p><h2>{stats.blocked}</h2></div>

              <div className="stat-card"><p>Total Jobs</p><h2>{stats.totalJobs}</h2></div>
              <div className="stat-card"><p>Active Jobs</p><h2>{stats.activeJobs}</h2></div>
              <div className="stat-card"><p>Reported Jobs</p><h2>{stats.reportedJobs}</h2></div>
              <div className="stat-card"><p>Pending Reports</p><h2>{stats.pendingReports}</h2></div>
            </div>

            {/* ✅ Graphs */}
            <div className="charts-wrap">
              <div className="chart-card">
                <h3>Users Distribution (Pie Chart)</h3>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3>System Activity (Bar Graph)</h3>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="Active" />
                      <Bar dataKey="Reported" />
                      <Bar dataKey="Recruiters" />
                      <Bar dataKey="Jobs" />
                      <Bar dataKey="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= APPROVALS ================= */}
        {tab === "approvals" && (
          <div className="admin-content">
            <h2 className="admin-heading">Approvals / Verification</h2>

            <div className="approval-grid">
              {/* Recruiters Approval */}
              <div className="approval-card">
                <h3>✅ Pending Recruiters ({pendingRecruiters.length})</h3>

                {pendingRecruiters.length === 0 ? (
                  <p className="empty">No pending recruiters ✅</p>
                ) : (
                  pendingRecruiters.map((r) => (
                    <div key={r.id} className="approval-item">
                      <div>
                        <b>{r.company}</b>
                        <p className="muted">👤 {r.name} | 📍 {r.location}</p>
                        <p className="muted">📧 {r.email} | KYC: {r.kyc}</p>
                      </div>

                      <div className="approval-actions">
                        <button className="mini-btn" onClick={() => approveRecruiter(r)}>Approve</button>
                        <button className="mini-btn danger" onClick={() => rejectRecruiter(r._id)}>Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Jobs Approval */}
              <div className="approval-card">
                <h3>📌 Pending Jobs ({pendingJobs.length})</h3>

                {pendingJobs.length === 0 ? (
                  <p className="empty">No pending jobs ✅</p>
                ) : (
                  pendingJobs.map((j) => (
                    <div key={j._id} className="approval-item">
                      <div>
                        <b>{j.title}</b>
                        <p className="muted">🏢 {j.company} | 📍 {j.location}</p>
                        <p className="muted">💰 {j.salary}</p>
                      </div>

                      <div className="approval-actions">
                        <button className="mini-btn" onClick={() => approveJob(j)}>Approve</button>
                        <button className="mini-btn danger" onClick={() => rejectJob(j._id)}>Reject</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= USERS ================= */}
        {tab === "users" && (
          <div className="admin-content">
            <h2 className="admin-heading">User Management</h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th><th>Role</th><th>Email</th><th>Status</th><th>Action</th>
                </tr>
              </thead>

              <tbody>
  {users.map((u) => (
    <tr key={u._id}>
      <td>{u.name}</td>
      <td>{u.role}</td>
      <td>{u.email}</td>
      <td>
        <span className={`badge ${(u.status || "").toLowerCase()}`}>
          {u.status}
        </span>
      </td>
      <td>
        <button className="mini-btn" onClick={() => toggleUserStatus(u._id)}>
          {u.status === "Active" ? "Block" : "Unblock"}
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )}

        {/* ================= JOBS ================= */}
        {tab === "jobs" && (
          <div className="admin-content">
            <h2 className="admin-heading">Job Management</h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th><th>Company</th><th>Location</th><th>Status</th><th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id}>
                    <td>{j.title}</td>
                    <td>{j.company}</td>
                    <td>{j.location}</td>
                    <td><span className={`badge ${j.status.toLowerCase()}`}>{j.status}</span></td>
                    <td>
                      <button className="mini-btn danger" onClick={() => deleteJob(j._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= REPORTS ================= */}
        {tab === "reports" && (
          <div className="admin-content">
            <h2 className="admin-heading">Reports / Complaints</h2>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th><th>Reported Item</th><th>Reason</th><th>Status</th><th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reports.map((r) => (
                  <tr key={r._id}>
                    <td>{r.type}</td>
                    <td>{r.reportedItem}</td>
                    <td>{r.reason}</td>
                    <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                    <td>
                      {r.status === "Pending" ? (
                        <button className="mini-btn" onClick={() => solveReport(r._id)}>Mark Solved</button>
                      ) : "✅ Done"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ================= ANNOUNCEMENTS ================= */}
        {tab === "announcements" && (
          <div className="admin-content">
            <h2 className="admin-heading">Announcements</h2>

            <div className="announce-box">
              <textarea
                placeholder="Post announcement..."
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
              />
              <button className="mini-btn" onClick={postAnnouncement}>📢 Post Announcement</button>
            </div>

            <div className="announce-list">
              {announcements.length === 0 ? (
                <p className="empty">No announcements yet.</p>
              ) : (
                announcements.map((a) => (
                  <div key={a.id} className="announce-card">
                    <b>📌 {a.time}</b>
                    <p>{a.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= SETTINGS ================= */}
        {tab === "settings" && (
          <div className="admin-content">
            <h2 className="admin-heading">Admin Profile Settings</h2>

            <div className="settings-card">
              <input
                placeholder="Admin Name"
                value={admin.name}
                onChange={(e) => setAdmin({ ...admin, name: e.target.value })}
              />
              <input
                placeholder="Admin Email"
                value={admin.email}
                onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
              />
              <input
                placeholder="Phone"
                value={admin.phone}
                onChange={(e) => setAdmin({ ...admin, phone: e.target.value })}
              />
              <input
                type="password"
                placeholder="Change Password"
                value={admin.password}
                onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
              />

              <button className="mini-btn" onClick={saveAdminSettings}>
                ✅ Save Settings
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
