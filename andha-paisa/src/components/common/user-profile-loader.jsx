import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../store/slices/user-personal';

export default function UserProfileLoader({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.userPersonal);
  const hasFetched = useRef(false); // ✅ local flag to prevent double fetch

  useEffect(() => {
    // Only fetch once: when authenticated, profile not loaded, and not already fetching
    if (isAuthenticated && !profile && !isLoading && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchUserProfile({ fetchBankDetails: true }));
    }
  }, [isAuthenticated, profile, isLoading, dispatch]);

  return children;
}