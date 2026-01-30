import Navbar from "../components/Navbar";
import heroImg from "../assets/hero.png"; // ✅ background image
import "../styles/home.css";

const Home = () => {
  return (
    <div
      className="home"
      style={{
        backgroundImage: `url(${heroImg})`, // ✅ setting hero.png as background
      }}
    >
      <Navbar />

      {/* ✅ HERO SECTION (No change) */}
      <section className="hero" id="home">
        <div className="hero-left">
          <h1>Find Your Dream Job</h1>
          <p>Search from thousands of job opportunities</p>

          <div className="search-box">
            <input placeholder="Job title or keyword" />
            <input placeholder="Location" />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* ✅ ABOUT SECTION (New addition) */}
      <section className="about-section" id="about">
        <div className="about-container">
          <h2>About GradsUp</h2>
          <p>
            GradsUp is a modern job portal designed to connect job seekers,
            recruiters, and companies in one platform.
            <br />
            We help freshers and experienced candidates find the right
            opportunities with an easy-to-use professional dashboard system.
          </p>

          <div className="about-cards">
            <div className="about-card">
              <h3>🎯 Our Mission</h3>
              <p>
                To provide a smart and simple platform where job seekers can
                discover jobs and recruiters can find top talent easily.
              </p>
            </div>

            <div className="about-card">
              <h3>⚡ Why GradsUp?</h3>
              <p>
                Unique dashboards, real-time tracking, pipeline system,
                verification, and professional UI experience for all roles.
              </p>
            </div>

            <div className="about-card">
              <h3>🤝 Trust & Support</h3>
              <p>
                We focus on verified companies, safe job postings, and better
                communication between recruiters and job seekers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ CONTACT FOOTER (New addition) */}
      <footer className="footer" id="contact">
        <div className="footer-container">
          <div className="footer-left">
            <h3>🎓 GradsUp</h3>
            <p>
              A smart and professional job portal for Job Seekers, Recruiters,
              and Admin management.
            </p>
          </div>

          <div className="footer-mid">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-right">
            <h4>Contact Us</h4>
            <p>📍 Pondicherry, India</p>
            <p>📧 support@gradsup.com</p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GradsUp. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
