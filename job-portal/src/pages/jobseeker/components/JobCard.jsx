import "../dashboard.css";

export default function JobCard({ job, applyJob }) {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
      <p className="company">{job.company}</p>

      <div className="job-meta">
        <span>📍 {job.location}</span>
        <span>💼 {job.experience}</span>
        <span>💰 ₹{job.salary}/month</span>
      </div>

      <div className="skills">
        {job.skills.map((s, i) => (
          <span key={i} className="skill-pill">
            {s}
          </span>
        ))}
      </div>

      <button className="apply-btn" onClick={() => applyJob(job._id)}>
        Apply Now
      </button>
    </div>
  );
}
