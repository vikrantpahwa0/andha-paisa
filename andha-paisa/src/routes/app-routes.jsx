import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import Verification from "../pages/auth/otp-screen";
import Registration from "../pages/auth/registration";
import Dashboard from "../pages/dashboard";
import Offerwall from "../pages/offerwalls-and-surveys/offerwall";
import AdminDashboard from "../pages/admin-dashboard";
import Survey from "../pages/offerwalls-and-surveys/survey";
import Profile from "../pages/user/profile"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<Verification />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offerwall" element={<Offerwall />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/survey/:id" element={<Survey />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
