// Verification.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./otp-screen.css";

function Verification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, identifier } = location.state || {};
  
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer logic for OTP resend
  useEffect(() => {
    if (mode === "mobile" && timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, mode, canResend]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (mode === "mobile") {
        // Verify OTP
        if (code.length === 6) {
          console.log("Verifying OTP:", code, "for mobile:", identifier);
          navigate("/dashboard"); // Redirect on success
        } else {
          setError("Invalid verification code");
        }
      } else {
        // Verify password
        if (password.length >= 6) {
          console.log("Verifying password for email:", identifier);
          navigate("/dashboard"); // Redirect on success
        } else {
          setError("Password must be at least 6 characters");
        }
      }
      setLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    setCanResend(false);
    setTimeLeft(60);
    console.log("Resending OTP to:", identifier);
    // API call to resend OTP
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container center">
      <div className="verification-card">
        <button className="back-btn" onClick={handleBack}>
          ← Back
        </button>

        <h2>
          {mode === "mobile" ? "Verify Your Number" : "Enter Your Password"}
        </h2>
        
        <p className="verification-subtitle">
          {mode === "mobile" 
            ? `We've sent a 6-digit verification code to ${identifier}`
            : `Welcome back! Enter your password for ${identifier}`}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "mobile" ? (
            <div className="otp-container">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                autoFocus
                required
                className="otp-input"
              />
              {!canResend && timeLeft > 0 && (
                <p className="timer-text">Resend code in {timeLeft}s</p>
              )}
              {canResend && (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendCode}
                >
                  Resend Code
                </button>
              )}
            </div>
          ) : (
            <div className="password-container">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => console.log("Forgot password")}
              >
                Forgot password?
              </button>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <button 
            type="submit" 
            className="primary-btn"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Verification;