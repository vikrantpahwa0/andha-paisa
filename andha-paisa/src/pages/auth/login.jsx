import { useState } from "react";
import "./login.css";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("mobile"); // mobile | email

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "mobile") {
      console.log("Mobile:", mobile);
      // Navigate to verification with mobile mode
      navigate("/verify", { 
        state: { mode: "mobile", identifier: mobile } 
      });
    } else {
      console.log("Email:", email);
      // Navigate to verification with email mode
      navigate("/verify", { 
        state: { mode: "email", identifier: email } 
      });
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
            />
          ) : (
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          )}
          <button type="submit" className="primary-btn">Continue</button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        {/* Toggle Option */}
        <button
          className="secondary-btn"
          onClick={() => setMode(mode === "mobile" ? "email" : "mobile")}
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