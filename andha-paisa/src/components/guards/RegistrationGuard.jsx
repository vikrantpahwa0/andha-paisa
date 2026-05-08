import { Navigate, useLocation } from "react-router-dom";

function RegistrationGuard({ children }) {
    console.log("Registration Guard called")
  const location = useLocation();
  const { verificationId } = location.state || {};

  if (!verificationId) {
    console.log("navigation test")
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RegistrationGuard;