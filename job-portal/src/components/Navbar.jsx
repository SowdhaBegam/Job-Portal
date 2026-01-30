import { Link } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/logo.jpeg";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* LEFT : LOGO + TEXT */}
      <div className="nav-left">
        <img src={logo} alt="GradsUp Logo" className="logo" />
        <span className="brand">GradsUp</span>
      </div>

      {/* CENTER : NAV OPTIONS */}
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/jobs">Find a Job</Link></li>
        <li><Link to="/post-job">Post a Job</Link></li>

        {/* ✅ FIX: scroll inside same Home page */}
        <li><a href="#about" className="nav-anchor">About Us</a></li>
        <li><a href="#contact" className="nav-anchor">Contact</a></li>
      </ul>

      {/* RIGHT : AUTH BUTTONS */}
      <div className="nav-right">
        <Link to="/login" className="btn-login">Login</Link>
        <Link to="/signup" className="btn-signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
