import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  // Timer logic for OTP resend
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
  };

  const handleForgotPassword = () => {
    console.log("Forgot password for:", identifier);
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show OTP verification screen for mobile or new email users
  if (mode === "mobile" || (mode === "email" && requiresVerification === true)) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8 relative">
          <button 
            onClick={handleBack}
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 text-lg transition-colors"
          >
            ← Back
          </button>

          <h2 className="text-2xl sm:text-3xl text-center font-medium mt-4 mb-3">
            {mode === "mobile" ? "Verify Your Number" : "Verify Your Email"}
          </h2>
          
          <p className="text-center text-gray-500 text-sm mb-8">
            {mode === "mobile" 
              ? `We've sent a 6-digit verification code to ${identifier}`
              : `We've sent a 6-digit verification code to ${identifier}`}
          </p>

          <form onSubmit={handleOTPVerification}>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              autoFocus
              required
              disabled={loading}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl border border-gray-200 mb-4 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50"
            />
            
            <div className="text-center mb-6">
              {!canResend && timeLeft > 0 && (
                <p className="text-gray-400 text-sm">Resend code in {timeLeft}s</p>
              )}
              {canResend && (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show password login screen for registered email users
  if (mode === "email" && requiresVerification === false) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8 relative">
          <button 
            onClick={handleBack}
            className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 text-lg transition-colors"
          >
            ← Back
          </button>

          <h2 className="text-2xl sm:text-3xl text-center font-medium mt-4 mb-3">
            Enter Your Password
          </h2>
          
          <p className="text-center text-gray-500 text-sm mb-8">
            Welcome back! Enter your password for {identifier}
          </p>

          <form onSubmit={handlePasswordLogin}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50"
            />
            
            <div className="text-right mb-6">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-green-600 hover:text-green-700 text-sm transition disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50"
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