import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login";
import Verification from "../pages/auth/otp-screen";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<Verification />} />
      </Routes>
    </BrowserRouter>
  );
}