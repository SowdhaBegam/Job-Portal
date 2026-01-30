const JobCard = ({ job, onApply }) => {   // ✅ receive onApply

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h2>{job.title}</h2>
      <p>📍 Location: {job.location}</p>
      <p>💰 Salary: {job.salary}</p>
      <p>💼 Experience: {job.experience}</p>

      <button onClick={() => onApply(job._id)}>Apply Now</button> {/* ✅ FIX */}
    </div>
  );
};

export default JobCard;
