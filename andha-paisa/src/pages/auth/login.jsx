import { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("mobile");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mode === "mobile") {
      navigate("/verify", { 
        state: { 
          mode: "mobile", 
          identifier: mobile,
          requiresVerification: true
        } 
      });
    } else {
      setLoading(true);
      
      // TODO: Replace with your actual API call
      setTimeout(() => {
        navigate("/verify", { 
          state: { 
            mode: "email", 
            identifier: email,
            requiresVerification: true
          } 
        });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl text-center font-medium mb-6 sm:mb-8">
          Welcome 👋
        </h2>

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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 text-base focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50"
            />
          ) : (
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 text-base focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50"
            />
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50 mt-1"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">OR</span>
          </div>
        </div>

        <button
          className="w-full py-3 rounded-xl bg-white text-slate-900 border border-gray-200 text-sm font-medium transition active:scale-95 hover:bg-slate-50 mb-6"
          onClick={() => setMode(mode === "mobile" ? "email" : "mobile")}
          disabled={loading}
        >
          {mode === "mobile" ? "Sign in with Email" : "Use Mobile Number"}
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">OR</span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            type="button" 
            aria-label="Google"
            className="w-12 h-12 rounded-xl border border-gray-200 bg-white text-red-600 text-xl transition hover:-translate-y-1 active:scale-95 hover:border-gray-300"
          >
            <FaGoogle className="mx-auto" />
          </button>
          <button 
            type="button" 
            aria-label="Facebook"
            className="w-12 h-12 rounded-xl border border-gray-200 bg-white text-blue-700 text-xl transition hover:-translate-y-1 active:scale-95 hover:border-gray-300"
          >
            <FaFacebookF className="mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;