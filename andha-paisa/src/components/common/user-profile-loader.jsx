import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../store/slices/user-personal';

export default function UserProfileLoader({ children }) {
  const dispatch = useDispatch();
  const { profile, isLoading } = useSelector((state) => state.userPersonal);
  const hasFetched = useRef(false);

  // Check if user is authenticated by looking for refresh token (not access token)
  const isAuthenticated = !!localStorage.getItem('refreshToken');

  useEffect(() => {
    // Fetch only once: when we have a refresh token, profile not loaded, and not already fetching
    if (isAuthenticated && !profile && !isLoading && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchUserProfile({ fetchBankDetails: true }));
    }
  }, [isAuthenticated, profile, isLoading, dispatch]);

  return children;
}