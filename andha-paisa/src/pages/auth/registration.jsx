import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8 relative">
        <button 
          onClick={handleBack}
          className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 text-lg transition-colors"
        >
          ← Back
        </button>

        <h2 className="text-2xl sm:text-3xl text-center font-medium mt-4 mb-3">
          Complete Your Profile
        </h2>
        
        <p className="text-center text-gray-500 text-sm mb-8">
          {mode === "mobile" 
            ? `Set up your account with ${identifier}`
            : `Create your account with ${identifier}`}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name Field - Common for both */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50 disabled:bg-gray-50"
            />
          </div>

          {/* Password Fields - Only for Email */}
          {mode === "email" && (
            <>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>
            </>
          )}

          {/* Terms and Conditions Checkbox */}
          <div className="mb-6">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={handleCheckboxChange}
                disabled={loading}
                className="mt-1 w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-200 disabled:opacity-50"
              />
              <span className="text-sm text-gray-600">
                I accept the{" "}
                <button
                  type="button"
                  className="text-green-600 hover:text-green-700 underline"
                  onClick={() => console.log("Open Terms")}
                >
                  Terms and Conditions
                </button>
              </span>
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;