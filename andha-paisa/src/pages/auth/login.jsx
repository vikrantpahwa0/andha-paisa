import { useState } from "react";
import "./login.css";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("mobile"); // mobile | email
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === "mobile") {
      console.log("Mobile:", mobile);
      // Mobile always goes to OTP verification
      navigate("/verify", { 
        state: { 
          mode: "mobile", 
          identifier: mobile,
          requiresVerification: true  // Mobile always needs OTP
        } 
      });
    } else {
      // For email, we'll simulate the API check
      setLoading(true);
      
      // TODO: Replace this with your actual API call
      // This is where you'll call your API to check if user is registered
      // The API should return a boolean (true if user needs verification, false if needs password)
      
      // For now, using a demo parameter:
      // You can change this based on your API response
      const demoParameter = true; // Change to false to test password screen
      
      // Simulate API delay
      setTimeout(() => {
        console.log("Email:", email);
        console.log("Requires verification:", demoParameter);
        
        navigate("/verify", { 
          state: { 
            mode: "email", 
            identifier: email,
            requiresVerification: demoParameter  // This will determine which screen to show
          } 
        });
        
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="container center">
      <div className="auth-card">
        <h2>Welcome 👋</h2>

        <form onSubmit={handleSubmit}>
          {mode === "mobile" ? (
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              required
              disabled={loading}
            />
          ) : (
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          )}
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Toggle Option */}
        <button
          className="secondary-btn"
          onClick={() => setMode(mode === "mobile" ? "email" : "mobile")}
          disabled={loading}
        >
          {mode === "mobile" ? "Sign in with Email" : "Use Mobile Number"}
        </button>

        {/* New Mini Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Small Rounded SSO Icons */}
        <div className="social-login-container">
          <button type="button" className="social-icon-btn google" aria-label="Google">
            <FaGoogle />
          </button>
          <button type="button" className="social-icon-btn facebook" aria-label="Facebook">
            <FaFacebookF />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;