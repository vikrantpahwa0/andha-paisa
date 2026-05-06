import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppRoutes from "./routes/app-routes.jsx";
import UserProfileLoader from "./components/common/user-profile-loader.jsx";

// Helper to decode JWT and extract role
const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role; // assuming role is stored in token
  } catch {
    return null;
  }
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect from the root path '/'
    if (location.pathname !== '/') return;

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    const role = getRoleFromToken(accessToken);
    if (role === 'AD') {
      navigate('/admin/dashboard', { replace: true });
    } else if (role) {
      navigate('/dashboard', { replace: true });
    }
    // If role is missing, stay on '/' (login page)
  }, [location.pathname, navigate]);

  return (
    <UserProfileLoader>
      <AppRoutes />
    </UserProfileLoader>
  );
}

export default App;