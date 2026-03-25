// Registration.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./registration.css";

function Registration() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, identifier } = location.state || {};
  
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (mode === "email") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }

    if (!acceptTerms) {
      setError("Please accept the Terms and Conditions");
      return;
    }

    setLoading(true);

    // Simulate API call for registration
    setTimeout(() => {
      console.log("Registration data:", {
        mode,
        identifier,
        name,
        ...(mode === "email" && { password })
      });
      
      // Navigate to dashboard after successful registration
      navigate("/dashboard");
      setLoading(false);
    }, 1500);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleCheckboxChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  return (
    <div className="container center">
      <div className="registration-card">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>

        <h2>Complete Your Profile</h2>
        <p className="registration-subtitle">
          {mode === "mobile" 
            ? `Set up your account with ${identifier}`
            : `Create your account with ${identifier}`}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name Field - Common for both */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoFocus
            />
          </div>

          {/* Password Fields - Only for Email */}
          {mode === "email" && (
            <>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;