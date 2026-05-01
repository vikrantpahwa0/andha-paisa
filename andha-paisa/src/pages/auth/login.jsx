import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaGoogle, FaFacebookF, FaInfoCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { sendOTP, clearError } from "../../store/slices/auth-slice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [showTooltip, setShowTooltip] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    const result = await dispatch(
      sendOTP({
        email: email,
      })
    );

    if (result.payload?.success) {
      switch (result.payload?.data?.code) {
        case "PG_VERF":
          navigate("/verify", {
            state: {
              mode: "email",
              identifier: email,
              requiresVerification: true,
            },
          });
          break;

        case "PG_PASS":
          navigate("/verify", {
            state: {
              mode: "email",
              identifier: email,
              requiresVerification: false,
            },
          });
          break;

        default:
          navigate("/verify", {
            state: {
              mode: "email",
              identifier: email,
              requiresVerification: true,
            },
          });
          break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl text-center font-medium mb-6 sm:mb-8">
          Welcome
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 mb-3 text-base focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-200 transition disabled:opacity-50"
          />

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-green-200 text-slate-900 font-semibold text-base transition active:scale-95 hover:bg-green-300 disabled:opacity-50 mt-1"
          >
            {isLoading ? "Sending OTP..." : "Continue"}
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

        {/* Mobile Login - Disabled with Coming Soon */}
        <div className="relative">
          <button
            type="button"
            disabled
            className="w-full py-3 rounded-xl bg-white text-slate-900 border border-gray-200 text-sm font-medium transition cursor-not-allowed opacity-50 mb-6"
          >
            Sign in with Mobile Number
          </button>
          <button
            onMouseEnter={() => setShowTooltip("mobile")}
            onMouseLeave={() => setShowTooltip(null)}
            className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 transition"
          >
            <FaInfoCircle className="w-4 h-4" />
          </button>
          {showTooltip === "mobile" && (
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
              Coming soon
              <div className="absolute top-full right-2 transform translate-x-0 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-gray-400">OR</span>
          </div>
        </div>

        {/* SSO Buttons - Disabled with Coming Soon */}
        <div className="flex justify-center gap-4">
          {/* Google Button */}
          <div className="relative">
            <button
              type="button"
              aria-label="Google"
              disabled
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white text-red-600 text-xl transition cursor-not-allowed opacity-50"
            >
              <FaGoogle className="mx-auto" />
            </button>
            <button
              onMouseEnter={() => setShowTooltip("google")}
              onMouseLeave={() => setShowTooltip(null)}
              className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 transition"
            >
              <FaInfoCircle className="w-4 h-4" />
            </button>
            {showTooltip === "google" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                Coming soon
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>

          {/* Facebook Button */}
          <div className="relative">
            <button
              type="button"
              aria-label="Facebook"
              disabled
              className="w-12 h-12 rounded-xl border border-gray-200 bg-white text-blue-700 text-xl transition cursor-not-allowed opacity-50"
            >
              <FaFacebookF className="mx-auto" />
            </button>
            <button
              onMouseEnter={() => setShowTooltip("facebook")}
              onMouseLeave={() => setShowTooltip(null)}
              className="absolute -top-2 -right-2 text-gray-400 hover:text-gray-600 transition"
            >
              <FaInfoCircle className="w-4 h-4" />
            </button>
            {showTooltip === "facebook" && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-10">
                Coming soon
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Mobile & social login coming soon
        </p>
      </div>
    </div>
  );
}

export default Login;