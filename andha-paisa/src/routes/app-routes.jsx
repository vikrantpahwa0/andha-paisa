import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import Verification from "../pages/auth/otp-screen";
import Registration from "../pages/auth/registration";
import Dashboard from "../pages/dashboard";
import Offerwall from "../pages/offerwalls-and-surveys/offerwall";
import AdminDashboard from "../pages/admin-dashboard";
import Survey from "../pages/offerwalls-and-surveys/survey";
import Profile from "../pages/user/profile"
import RegisterGuard from "../components/guards/RegistrationGuard";
import Activity from "../pages/activity";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import HomePage from "../pages/static/home-page";
import PrivacyPolicy from "../pages/static/privacy-policy";
import TermsConditions from "../pages/static/terms-and-conditions";
import AboutUs from "../pages/static/about-us";
import ContactUs from "../pages/static/contact-us";

export default function AppRoutes() {
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verification />} />
        <Route
        path="/register"
        element={
          <RegisterGuard>
            <Registration />
          </RegisterGuard>
        }
      />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/offerwall" element={<Offerwall />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/survey/:id" element={<Survey />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsConditions />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<ContactUs />} />  
      </Routes>
  );
}
