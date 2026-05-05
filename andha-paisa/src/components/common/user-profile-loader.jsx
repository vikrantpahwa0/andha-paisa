import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../../store/slices/user-personal';

export default function UserProfileLoader({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.userPersonal);

  useEffect(() => {
    // If user is authenticated and profile not loaded yet, fetch it
    if (isAuthenticated && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, profile, dispatch]);

  return children;
}