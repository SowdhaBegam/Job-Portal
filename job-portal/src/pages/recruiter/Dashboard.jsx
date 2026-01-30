import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";
import Topbar from "../jobseeker/components/Topbar";
import API from "../../api";

const STAGES = ["Applied", "Shortlisted", "Selected", "Rejected"];

export default function RecruiterDashboard() {
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState("pipeline");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [collapsed, setCollapsed] = useState(false);



  /* ================= COMPANY PROFILE ================= */
  const [companySaved, setCompanySaved] = useState(false);
  const [company, setCompany] = useState({
    companyName: "",
    email: "",
    phone: "",
    location: "",
    industry: "",
    website: "",
    about: "",
  });

  useEffect(() => {
    API.get("/recruiter/profile")
      .then((res) => {
        if (res.data) {
          setCompany(res.data);
          setCompanySaved(true);
        }
      })
      .catch(() => {});
  }, []);

  const saveCompany = async () => {
    await API.post("/recruiter/profile", company);
    setCompanySaved(true);
    setToast("✅ Company profile saved");
    setTimeout(() => setToast(""), 2000);
  };

  /* ================= PIPELINE ================= */
  const [candidates, setCandidates] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);


  useEffect(() => {
  API.get("/recruiter/applications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((res) => {
      setCandidates(res.data);
    })
    .catch((err) => console.log(err));
}, []);

  useEffect(() => {
  API.get("/recruiter/candidates")
    .then((res) => setAllCandidates(res.data))
    .catch((err) => console.log(err));
}, []);


  const moveStage = async (id, nextStage) => {
  try {
    await API.patch(
      `/recruiter/application/${id}/status`,
      { status: nextStage },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setCandidates((prev) =>
      prev.map((c) =>
        c._id === id ? { ...c, status: nextStage } : c
      )
    );

    setToast(`📌 Moved to ${nextStage}`);
    setTimeout(() => setToast(""), 1500);
  } catch (err) {
    console.log(err.response?.data || err.message);
    setToast("Status update failed");
  }
};


  const openCandidate = (c) => setSelectedCandidate(c);
  const closeCandidate = () => setSelectedCandidate(null);

  /* ================= JOB POSTS ================= */
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    API.get("/recruiter/jobs").then((res) => setJobPosts(res.data));
  }, []);

  /* ================= POST JOB ================= */
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    exp: "Fresher",
    salary: "",
    skills: "",
    description: "",
  });

  const postJob = async () => {
    await API.post("/recruiter/job", {
      title: jobForm.title,
      location: jobForm.location,
      experience: jobForm.exp,
      salary: jobForm.salary,
      skills: jobForm.skills.split(",").map((s) => s.trim()),
      description: jobForm.description,
    });

    setToast("✅ Job posted");
    setTimeout(() => setToast(""), 1500);

    setJobForm({
      title: "",
      location: "",
      exp: "Fresher",
      salary: "",
      skills: "",
      description: "",
    });

    const res = await API.get("/recruiter/jobs");
    setJobPosts(res.data);
    setActiveTab("jobsfeed");
  };

  /* ================= ANALYTICS ================= */
  const stats = useMemo(() => {
  const total = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "Shortlisted").length;
  const selected = candidates.filter((c) => c.status === "Selected").length;
  const rejected = candidates.filter((c) => c.status === "Rejected").length;

  return { total, shortlisted, selected, rejected };
}, [candidates]);

  /* ================= SEARCH ================= */
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    exp: "",
    skill: "",
  });

  const filtered = useMemo(() => {
  return allCandidates.filter((js) => {
    return (
      (!filters.keyword ||
        js.fullName?.toLowerCase().includes(filters.keyword.toLowerCase())) &&
      (!filters.location ||
        js.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (!filters.exp || js.experienceType === filters.exp) &&
      (!filters.skill ||
        js.primarySkills?.toLowerCase().includes(filters.skill.toLowerCase()))
    );
  });
}, [allCandidates, filters]);


  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="rec-page">
      <aside className={`rec-sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="collapse-toggle" onClick={() => setCollapsed(!collapsed)}>
  ☰
</div>
        <h2 className="rec-logo">🎓 GradsUp</h2>
        <button onClick={() => setActiveTab("pipeline")} className={`rec-btn ${activeTab === "pipeline" ? "active" : ""}`}>
  <span className="rec-icon">🧩</span>
  <span className="rec-text">Pipeline Board</span>
</button>

<button onClick={() => setActiveTab("search")} className={`rec-btn ${activeTab === "search" ? "active" : ""}`}>
  <span className="rec-icon">🔍</span>
  <span className="rec-text">Candidate Search</span>
</button>

<button onClick={() => setActiveTab("company")} className={`rec-btn ${activeTab === "company" ? "active" : ""}`}>
  <span className="rec-icon">🏢</span>
  <span className="rec-text">Company Profile</span>
</button>

<button onClick={() => setActiveTab("postjob")} className={`rec-btn ${activeTab === "postjob" ? "active" : ""}`}>
  <span className="rec-icon">➕</span>
  <span className="rec-text">Post a Job</span>
</button>

<button onClick={() => setActiveTab("jobsfeed")} className={`rec-btn ${activeTab === "jobsfeed" ? "active" : ""}`}>
  <span className="rec-icon">📢</span>
  <span className="rec-text">Posted Jobs Feed</span>
</button>

<button className="rec-btn logout" onClick={logout}>
  <span className="rec-icon">🚪</span>
  <span className="rec-text">Logout</span>
</button>

      </aside>

      <main className="rec-main">
        {toast && <div className="toast">{toast}</div>}
        <Topbar title="Recruiter Dashboard" />

        <div className="rec-analytics">
  <div className="stat-card"><p>Total</p><h2>{stats.total}</h2></div>
  <div className="stat-card"><p>Shortlisted</p><h2>{stats.shortlisted}</h2></div>
  <div className="stat-card"><p>Selected</p><h2>{stats.selected}</h2></div>
  <div className="stat-card"><p>Rejected</p><h2>{stats.rejected}</h2></div>
</div>

        {/* ================= SEARCH CANDIDATES ================= */}
{activeTab === "search" && (
  <section className="search-wrap">
    <h2>Search Candidates</h2>

    <div className="filters">
      <input
        placeholder="Name / Role"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
      />
      <input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
      <select
        value={filters.exp}
        onChange={(e) => setFilters({ ...filters, exp: e.target.value })}
      >
        <option value="">Experience</option>
        <option value="Fresher">Fresher</option>
        <option value="Experienced">Experienced</option>
      </select>
      <input
        placeholder="Skill"
        value={filters.skill}
        onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
      />
    </div>

    <div className="search-grid">
      {filtered.map((js) => (
        <div className="search-card" key={js._id}>
          <h4>{js.fullName}</h4>
          <p>{js.headline}</p>
          <p>📍 {js.location}</p>
          <p>💼 {js.experienceType}</p>
          <div><b>Skills:</b> {js.primarySkills}</div>
        </div>
      ))}
    </div>
  </section>
)}

        {/* PIPELINE */}
        {activeTab === "pipeline" && (
  <div className="pipeline-scroll">   {/* ⭐ ADD THIS */}
    <section className="pipeline-wrap">
      {STAGES.map((stage) => (
              <div className="stage-col" key={stage}>
                <h3>{stage}</h3>

                {candidates
                  .filter((c) => c.status === stage)
                  .map((c) => (
                    <div className="cand-card" key={c._id}>
  <h4>{c.jobseekerId?.fullName}</h4>
  <p>🧠 {c.jobseekerId?.headline}</p>

  <p>💼 Applied for: {c.jobId?.title}</p>
  <p>📍 {c.jobseekerId?.location}</p>
  <p>🎯 Experience: {c.jobseekerId?.experienceType}</p>
  <div><b>Skills:</b> {c.jobseekerId?.primarySkills}</div>

  <p><b>Status:</b> {c.status}</p>

  {stage !== "Rejected" && stage !== "Selected" && (
  <>
    <button onClick={() => moveStage(c._id, "Shortlisted")}>
      Shortlist
    </button>

    <button onClick={() => moveStage(c._id, "Selected")}>
      Select
    </button>

    <button onClick={() => moveStage(c._id, "Rejected")}>
      Reject
    </button>
  </>
)}

</div>
                  ))}
              </div>
            ))}
          </section>
          </div>
        )}

        {/* COMPANY PROFILE */}
        {activeTab === "company" && (
  <section className="company-wrap">
    <div className="company-card">
      <h2>Company Profile</h2>

      <div className="company-top">
        <div className="company-logo-box">
          <img
            src={company.logo || "/default-company.png"}
            alt="company"
            className="company-logo"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setCompany({ ...company, logo: URL.createObjectURL(e.target.files[0]) })
            }
          />
        </div>

        <div className="company-fields">
          <input
            placeholder="Company Name"
            value={company.companyName}
            onChange={(e) => setCompany({ ...company, companyName: e.target.value })}
          />
          <input
            placeholder="Email"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={company.phone}
            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
          />
          <input
            placeholder="Location"
            value={company.location}
            onChange={(e) => setCompany({ ...company, location: e.target.value })}
          />
          <input
            placeholder="Industry"
            value={company.industry}
            onChange={(e) => setCompany({ ...company, industry: e.target.value })}
          />
          <input
            placeholder="Website"
            value={company.website}
            onChange={(e) => setCompany({ ...company, website: e.target.value })}
          />
        </div>
      </div>

      <textarea
        placeholder="About Company"
        value={company.about}
        onChange={(e) => setCompany({ ...company, about: e.target.value })}
      />

      <button className="company-save-btn" onClick={saveCompany}>
        💾 Save Profile
      </button>
    </div>
  </section>
)}


        {/* POST JOB */}
        {activeTab === "postjob" && (
  <section className="postjob-wrap">
    <div className="postjob-card">
      <h2>Post a New Job</h2>

      <div className="postjob-grid">
        <input placeholder="Job Title"
          value={jobForm.title}
          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} />

        <input placeholder="Location"
          value={jobForm.location}
          onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} />

        <input placeholder="Salary"
          value={jobForm.salary}
          onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })} />

        <input placeholder="Skills (comma separated)"
          value={jobForm.skills}
          onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })} />
      </div>

      <textarea placeholder="Job Description"
        value={jobForm.description}
        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} />

      <button className="postjob-btn" onClick={postJob}>
        🚀 Post Job
      </button>
    </div>
  </section>
)}


        {/* JOB FEED */}
        {activeTab === "jobsfeed" && (
          <section className="search-wrap">
  <div className="recruiter-jobs">
    {jobPosts.map((p) => (
      <div key={p._id} className="rec-job-card">
        <div className="rec-job-top">
          <h3>{p.title}</h3>
          <span className="salary">₹{p.salary}</span>
        </div>

        <p className="location">📍 {p.location}</p>

        <button className="view-btn">View Applicants</button>
      </div>
    ))}
  </div>
</section>

        )}
      </main>
    </div>
  );
}
