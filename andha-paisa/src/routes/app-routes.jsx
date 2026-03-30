import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import Verification from "../pages/auth/otp-screen";
import Registration from "../pages/auth/registration";
import Dashboard from "../pages/dashboard";
import Offerwall from "../pages/offerwall";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offerwall" element={<Offerwall />} />
      </Routes>
    </BrowserRouter>
  );
}
