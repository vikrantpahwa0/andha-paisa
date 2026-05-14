import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserProfile } from '../../store/slices/user-personal';

export default function UserProfileLoader({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isLoading } = useSelector((state) => state.userPersonal);
  const { refreshToken } = useSelector((state) => state.auth); // only need refreshToken
  const hasFetched = useRef(false);

  // ✅ Authentication = refresh token exists (access token can be expired)
  const isAuthenticated = !!refreshToken;

  // Reset fetch flag when refresh token changes (new login) or profile becomes null
  useEffect(() => {
    if (!refreshToken || !profile) {
      hasFetched.current = false;
    }
  }, [refreshToken, profile]);

  // Fetch profile when authenticated and not yet fetched
  useEffect(() => {
    if (isAuthenticated && !profile && !isLoading && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchUserProfile({ fetchBankDetails: true }));
    }
  }, [isAuthenticated, profile, isLoading, dispatch]);

  // Redirect to login only when no refresh token (truly logged out)
  useEffect(() => {
    const publicPaths = ['/', '/register', '/verify','/login','/privacy-policy','/forgot-password','/reset-password','/terms-and-conditions','/about-us','/contact-us','/maximise-your-earnings'];
    const isPublicPage = publicPaths.includes(location.pathname);
    if (!isAuthenticated && !isPublicPage) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return children;
}