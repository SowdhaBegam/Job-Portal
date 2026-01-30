import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import RoleSelect from "./pages/auth/Roleselect"; // optional
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// Dashboards
import JobSeekerDashboard from "./pages/jobseeker/Dashboard";
import RecruiterDashboard from "./pages/recruiter/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";

// Protection
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/home.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Home />} />

        {/* ✅ Optional RoleSelect page (you can keep or remove) */}
        <Route path="/roles" element={<RoleSelect />} />

        {/* ✅ Login without role param */}
        <Route path="/login" element={<Login />} />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/jobseeker"
          element={
            <ProtectedRoute role="jobseeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
