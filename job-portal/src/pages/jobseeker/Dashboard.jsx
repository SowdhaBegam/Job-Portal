import { useEffect, useMemo, useState } from "react";
import "./dashboard.css";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import JobCard from "./components/JobCard";
import API from "../../api";

/* ================= DEFAULT PROFILE ================= */
const DEFAULT_PROFILE = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  experienceType: "Fresher",

  headline: "",
  about: "",

  primarySkills: "",
  secondarySkills: "",
  skillLevel: "Beginner",

  resumeName: "",
  profileImage: "",

  experiences: [],
  projects: [],
  languages: [],
  internships: [],
  certifications: [],

};

export default function JobSeekerDashboard() {
  const [tab, setTab] = useState("search");
  const [toast, setToast] = useState("");

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [commentText, setCommentText] = useState({});



  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    experience: "",
    skill: "",
    salaryMin: "",
    salaryMax: "",
  });


  /* ================= LOGOUT (FIXED) ================= */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  /* ================= LOAD DASHBOARD ================= */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await API.get("/jobseeker/dashboard");
        setProfile({ ...DEFAULT_PROFILE, ...res.data.profile });
        setApplications(res.data.applications || []);
        setJobs(res.data.jobs || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  useEffect(() => {
  const loadJobs = async () => {
    try {
      const res = await API.get("/jobseeker/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  loadJobs();
}, []);

useEffect(() => {
  const loadApplications = async () => {
    try {
      const res = await API.get("/jobseeker/applications", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setApplications(res.data);
    } catch (err) {
      console.log("Error loading applications", err);
    }
  };

  loadApplications();
}, []);

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      await API.post("/jobseeker/profile", profile);
      setToast("✅ Profile saved");
    } catch {
      setToast("❌ Profile save failed");
    } finally {
      setTimeout(() => setToast(""), 2000);
    }
  };

  /* ================= FILE HANDLERS ================= */
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfile({ ...profile, resumeName: file.name });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfile({
      ...profile,
      profileImage: URL.createObjectURL(file),
    });
  };

  /* ================= APPLY JOB ================= */
const applyJob = async (jobId) => {
  try {
    await API.post(
      "/jobseeker/apply",
      { jobId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Applied Successfully");
  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Already applied or error");
  }
};

/* ================= POSTS ================= */

useEffect(() => {
  if (tab === "posts") {
    API.get("/posts").then((res) => setPosts(res.data));
  }
}, [tab]);


const createPost = async () => {
  try {
    const formData = new FormData();
    formData.append("text", postText);

    if (postImage) {
      formData.append("image", postImage);
    }

    await API.post("/posts", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ inside headers
      },
    });

    const res = await API.get("/posts");
    setPosts(res.data);
    setPostText("");
    setPostImage(null);

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Post Failed");
  }
};




const likePost = async (id) => {
  await API.put(`/posts/like/${id}`);
  const res = await API.get("/posts");
  setPosts(res.data);
};

const addComment = async (postId) => {
  try {
    await API.post(
      `/posts/comment/${postId}`,
      { text: commentText },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const res = await API.get("/posts");
    setPosts(res.data);
    setCommentText("");
  } catch (err) {
    console.log(err);
  }
};




  /* ================= ARRAY HELPERS ================= */
  const addItem = (key, template) => {
    setProfile({ ...profile, [key]: [...profile[key], template] });
  };

  const updateItem = (key, index, field, value) => {
    const updated = [...profile[key]];
    updated[index][field] = value;
    setProfile({ ...profile, [key]: updated });
  };

  const removeItem = (key, index) => {
    setProfile({
      ...profile,
      [key]: profile[key].filter((_, i) => i !== index),
    });
  };

  /* ================= FILTER JOBS ================= */
 /* ================= FILTER JOBS ================= */
const filteredJobs = useMemo(() => {
  return jobs.filter((job) => {
    return (
      (filters.keyword === "" ||
        job.title?.toLowerCase().includes(filters.keyword.toLowerCase())) &&
      (filters.location === "" ||
        job.location?.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.experience === "" ||
        job.experience === filters.experience) &&
      (filters.skill === "" ||
        job.skills?.some((s) =>
          s.toLowerCase().includes(filters.skill.toLowerCase())
        ))
    );
  });
}, [jobs, filters]);
         

  if (loading) return <p>Loading...</p>;

  return (
    <div className="jsd-page">
      <Sidebar tab={tab} setTab={setTab} logout={logout} />

      <div className="jsd-main">
        {toast && <div className="toast">{toast}</div>}
        <Topbar title="Job Seeker Dashboard" />

        {/* ================= PROFILE ================= */}
        {tab === "profile" && (
          <div className="jsd-content profile-card">
            <h2>Profile</h2>

            {/* TOP ROW */}
            <div className="profile-top-row">
              <div className="profile-photo-box">
                <img
                  src={profile.profileImage || "/default-user.png"}
                  alt="profile"
                  className="avatar-large"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              <div className="profile-summary">
                <input
                  placeholder="Full Name"
                  value={profile.fullName}
                  onChange={(e) =>
                    setProfile({ ...profile, fullName: e.target.value })
                  }
                />
                <input
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
                <input
                  placeholder="Location"
                  value={profile.location}
                  onChange={(e) =>
                    setProfile({ ...profile, location: e.target.value })
                  }
                />
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="grid-2">
              <input
                placeholder="Phone Number"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
              <select
                value={profile.skillLevel}
                onChange={(e) =>
                  setProfile({ ...profile, skillLevel: e.target.value })
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>

            {/* ABOUT */}
            <textarea
              placeholder="About yourself"
              value={profile.about}
              onChange={(e) =>
                setProfile({ ...profile, about: e.target.value })
              }
            />
            {/* ===== SKILLS ===== */}
<h3>Skills</h3>
<div className="grid-2">
  <input
    placeholder="Primary Skills (e.g. React, Node, MongoDB)"
    value={profile.primarySkills}
    onChange={(e) =>
      setProfile({ ...profile, primarySkills: e.target.value })
    }
  />
  <input
    placeholder="Secondary Skills (e.g. Docker, AWS)"
    value={profile.secondarySkills}
    onChange={(e) =>
      setProfile({ ...profile, secondarySkills: e.target.value })
    }
  />
</div>
{/* ===== LANGUAGES ===== */}
<h3>Languages</h3>
{profile.languages.map((lang, i) => (
  <div key={i} className="card-row">
    <input
      placeholder="Language (e.g. English, Tamil)"
      value={lang.name}
      onChange={(e) =>
        updateItem("languages", i, "name", e.target.value)
      }
    />
    <button onClick={() => removeItem("languages", i)}>Remove</button>
  </div>
))}
<button onClick={() => addItem("languages", { name: "" })}>
  + Add Language
</button>

{/* ===== INTERNSHIPS ===== */}
<h3>Internships</h3>
{profile.internships.map((intern, i) => (
  <div key={i} className="card-row">
    <input
      placeholder="Internship Role / Company"
      value={intern.role}
      onChange={(e) =>
        updateItem("internships", i, "role", e.target.value)
      }
    />
    <button onClick={() => removeItem("internships", i)}>Remove</button>
  </div>
))}
<button onClick={() => addItem("internships", { role: "" })}>
  + Add Internship
</button>



            {/* RESUME */}
            <div className="resume-row">
              <label>Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              {profile.resumeName && <span>{profile.resumeName}</span>}
            </div>

            {/* EXPERIENCE */}
            <h3>Experience</h3>
            {profile.experiences.map((exp, i) => (
              <div key={i} className="card-row">
                <input
                  placeholder="Role / Position"
                  value={exp.role}
                  onChange={(e) =>
                    updateItem("experiences", i, "role", e.target.value)
                  }
                />
                <button onClick={() => removeItem("experiences", i)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => addItem("experiences", { role: "" })}>
              + Add Experience
            </button>

            {/* PROJECTS */}
            <h3>Projects</h3>
            {profile.projects.map((p, i) => (
              <div key={i} className="card-row">
                <input
                  placeholder="Project Title"
                  value={p.title}
                  onChange={(e) =>
                    updateItem("projects", i, "title", e.target.value)
                  }
                />
                <button onClick={() => removeItem("projects", i)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={() => addItem("projects", { title: "" })}>
              + Add Project
            </button>
            {/* ===== CERTIFICATIONS ===== */}
<h3>Certifications</h3>
{profile.certifications.map((cert, i) => (
  <div key={i} className="card-row">
    <input
      placeholder="Certification Name (e.g. AWS, Coursera)"
      value={cert.name}
      onChange={(e) =>
        updateItem("certifications", i, "name", e.target.value)
      }
    />
    <button onClick={() => removeItem("certifications", i)}>Remove</button>
  </div>
))}
<button onClick={() => addItem("certifications", { name: "" })}>
  + Add Certification
</button>


            <div className="save-center">
              <button className="save-btn" onClick={saveProfile}>
                Save Profile
              </button>
            </div>
          </div>
        )}
        {/* ================= SEARCH JOBS ================= */}
{tab === "search" && (
  <div className="jsd-content">
    <h2>Available Jobs</h2>

    {filteredJobs.map((job) => (
      <JobCard key={job._id} job={job} applyJob={applyJob} />
    ))}

    {filteredJobs.length === 0 && <p>No jobs available</p>}
  </div>
)}
{/* ================= APPLICATION STATUS ================= */}
{tab === "applications" && (
  <div className="jsd-content">
    <h2>My Applications</h2>

    {applications.length === 0 ? (
      <p>No applications yet</p>
    ) : (
      applications.map((app) => (
        <div key={app._id} className="app-card">
          <h4>{app.jobId?.title}</h4>
          <p>📍 {app.jobId?.location}</p>
          <p>Status: <b>{app.status}</b></p>
        </div>
      ))
    )}
  </div>
)}
{/* ================= ACHIEVEMENTS POSTS ================= */}
{tab === "posts" && (
  <div className="jsd-content feed">
    <h2>Achievements Feed</h2>

    {/* CREATE POST BOX */}
    <div className="create-post">
      <textarea
        placeholder="Share your achievement..."
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      />
      <input
    type="file"
    accept="image/*"
    onChange={(e) => setPostImage(e.target.files[0])}
  />

      <button onClick={createPost}>Post 🚀</button>
    </div>

    {/* POSTS LIST */}
    {posts.map((p) => (
      <div key={p._id} className="post-card">
        <h4>{p.userId?.name}</h4>
        <p>{p.text}</p>
        {p.image && (
  <img
    src={`http://localhost:5000/uploads/${p.image}`}
    className="post-img"
  />
)}


        <div className="post-actions">
          <button onClick={() => likePost(p._id)}>❤️ {p.likes.length}</button>
          <button>💬 {p.comments.length}</button>
          <button
            onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: "Check this achievement!",
              text: p.text,
              url: window.location.href,
            });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied!");
          }
        }}
      >
            🔗 Share
          </button>
        </div>
         {/* 🔥 ADD COMMENTS UI HERE */}
    <div className="comment-box">
  <input
    placeholder="Write a comment..."
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
  />
  <button onClick={() => addComment(p._id)}>Send</button>
</div>

      </div>
    ))}
  </div>
)}


      </div>
    </div>
  );
}
