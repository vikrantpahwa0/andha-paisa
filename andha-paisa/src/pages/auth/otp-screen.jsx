import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOTP, verifyOTP, loginUser, clearError } from "../../store/slices/auth-slice";

function Verification() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error: reduxError } = useSelector((state) => state.auth);
  
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
    dispatch(clearError());
    
    if (code.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);

    const body = {
      otp: code,
      country_code: "+91"
    };

    if (mode === "mobile") {
      body.mobile = identifier;
    } else {
      body.email = identifier;
    }

    const result = await dispatch(verifyOTP(body));

    console.log(result)

    if (result.payload?.success) {
        switch (result.payload?.data?.code) {
          case 'PG_DSH':
            navigate("/dashboard", { 
        state: { 
          mode: mode,
          identifier: identifier
        } 
      });            
            break;

          case 'PG_ONB':
            navigate("/register", { 
        state: { 
          mode: mode,
          identifier: identifier
        } 
      });
      
    }
    
    setLoading(false);
  }
    
    
    setLoading(false);
  };

  // Handle password login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(clearError());
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const body = {
      email: identifier,
      password: password
    };

    const result = await dispatch(loginUser(body));
    
    if (result.payload?.success) {
      navigate("/dashboard");
    }
    
    setLoading(false);
  };

  const handleResendCode = async () => {
    setCanResend(false);
    setTimeLeft(60);
    dispatch(clearError());
    
    const body = {
      country_code: "+91"
    };

    if (mode === "mobile") {
      body.mobile = identifier;
    } else {
      body.email = identifier;
    }

    await dispatch(sendOTP(body));
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
              disabled={loading || isLoading}
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
                  disabled={loading || isLoading}
                  className="text-green-600 hover:text-green-700 text-sm font-medium transition disabled:opacity-50"
                >
                  Resend Code
                </button>
              )}
            </div>

            {(error || reduxError) && (
              <p className="text-red-500 text-sm text-center mb-4">{error || reduxError}</p>
            )}

            <button 
              type="submit" 
              disabled={loading || isLoading}
              className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50"
            >
              {loading || isLoading ? "Verifying..." : "Verify"}
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
              disabled={loading || isLoading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50"
            />
            
            <div className="text-right mb-6">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading || isLoading}
                className="text-green-600 hover:text-green-700 text-sm transition disabled:opacity-50"
              >
                Forgot password?
              </button>
            </div>

            {(error || reduxError) && (
              <p className="text-red-500 text-sm text-center mb-4">{error || reduxError}</p>
            )}

            <button 
              type="submit" 
              disabled={loading || isLoading}
              className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50"
            >
              {loading || isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return null;
}

export default Verification;