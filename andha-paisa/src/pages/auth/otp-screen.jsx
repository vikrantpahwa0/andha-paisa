// Verification.jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./otp-screen.css";

function Verification() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, identifier, requiresVerification } = location.state || {};
  
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer logic for OTP resend (only for mobile or when verification is required)
  useEffect(() => {
    if ((mode === "mobile" || requiresVerification) && timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, mode, requiresVerification, canResend]);

  // Handle OTP verification
  const handleOTPVerification = async (e) => {
  e.preventDefault();
  setError("");
  
  if (code.length !== 6) {
    setError("Please enter a valid 6-digit code");
    return;
  }

  setLoading(true);

  // Simulate API call for OTP verification
  setTimeout(() => {
    if (code.length === 6) {
      console.log("Verifying OTP:", code, "for", mode, ":", identifier);
      
      // After OTP verification, navigate to registration page
      navigate("/register", { 
        state: { 
          mode: mode,
          identifier: identifier
        } 
      });
    } else {
      setError("Invalid verification code");
    }
    setLoading(false);
  }, 1000);
};

  // Handle password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Verifying password for email:", identifier);
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
  };

  const handleResendCode = () => {
    setCanResend(false);
    setTimeLeft(60);
    console.log("Resending OTP to:", identifier);
    // API call to resend OTP
  };

  const handleForgotPassword = () => {
    console.log("Forgot password for:", identifier);
    // Navigate to forgot password page
    // navigate("/forgot-password");
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show OTP verification screen for:
  // 1. Mobile users (always)
  // 2. Email users when requiresVerification is true (new users)
  if (mode === "mobile" || (mode === "email" && requiresVerification === true)) {
    return (
      <div className="container center">
        <div className="verification-card">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>

          <h2>
            {mode === "mobile" ? "Verify Your Number" : "Verify Your Email"}
          </h2>
          
          <p className="verification-subtitle">
            {mode === "mobile" 
              ? `We've sent a 6-digit verification code to ${identifier}`
              : `We've sent a 6-digit verification code to ${identifier}`}
          </p>

          <form onSubmit={handleOTPVerification}>
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
                disabled={loading}
              />
              {!canResend && timeLeft > 0 && (
                <p className="timer-text">Resend code in {timeLeft}s</p>
              )}
              {canResend && (
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Resend Code
                </button>
              )}
            </div>

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

  // Show password login screen for:
  // 1. Email users when requiresVerification is false (registered users)
  if (mode === "email" && requiresVerification === false) {
    return (
      <div className="container center">
        <div className="verification-card">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>

          <h2>Enter Your Password</h2>
          <p className="verification-subtitle">
            Welcome back! Enter your password for {identifier}
          </p>

          <form onSubmit={handlePasswordLogin}>
            <div className="password-container">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                disabled={loading}
              />
              <button
                type="button"
                className="forgot-password-btn"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

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

  return null;
}

export default Verification;