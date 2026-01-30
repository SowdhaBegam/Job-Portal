const mongoose = require("mongoose");

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },

    // BASIC
    fullName: String,
    email: String,
    phone: String,
    location: String,
    experienceType: { type: String, default: "Fresher" },
    resumeName: String,

    // SUMMARY
    headline: String,
    about: String,

    // SKILLS
    primarySkills: String,
    secondarySkills: String,
    skillLevel: { type: String, default: "Beginner" },
    skillYears: String,

    // EDUCATION
    qualification: String,
    branch: String,
    college: String,
    gradYear: String,
    cgpa: String,

    // WORK EXPERIENCE
    experiences: [
      {
        jobTitle: String,
        company: String,
        employmentType: String,
        startDate: String,
        endDate: String,
        currentlyWorking: Boolean,
        jobLocation: String,
        description: String,
        noticePeriod: String,
      },
    ],

    // INTERNSHIPS
    internships: [
      {
        role: String,
        company: String,
        duration: String,
        details: String,
      },
    ],

    // CERTIFICATIONS
    certifications: [
      {
        name: String,
        platform: String,
        year: String,
        fileName: String,
      },
    ],

    // PROJECTS
    projects: [
      {
        title: String,
        role: String,
        tech: String,
        description: String,
        github: String,
        demo: String,
      },
    ],

    // LINKS
    portfolio: String,
    linkedin: String,
    github: String,
    behance: String,

    // JOB PREFERENCES
    preferredRole: String,
    preferredLocation: String,
    expectedSalary: String,
    jobType: String,
    relocate: String,
    shift: String,

    // LANGUAGES
    languages: [
      {
        name: String,
        read: Boolean,
        write: Boolean,
        speak: Boolean,
      },
    ],

    achievements: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSeekerProfile", jobSeekerProfileSchema);
