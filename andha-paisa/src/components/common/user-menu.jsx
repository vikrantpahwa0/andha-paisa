import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/auth-slice';
import { clearUserPersonal } from '../../store/slices/user-personal';
import { LogOut, Settings } from 'lucide-react';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile } = useSelector((state) => state.userPersonal);
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ✅ Move all hooks before any conditional return
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Now it's safe to conditionally return
  if (!isAuthenticated || !profile) return null;

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name?.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 55%)`;
  };

  const handleUpdateProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(clearUserPersonal());
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200"
      >
        {profile.profilePicture ? (
          <img
            src={profile?.profilePicture}
            alt={profile.name}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
            style={{ backgroundColor: getAvatarColor(profile.name) }}
          >
            {getInitials(profile.name)}
          </div>
        )}
        <span className="text-slate-700 font-medium hidden sm:inline">
          {profile.name}
        </span>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
          <button
            onClick={handleUpdateProfile}
            className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-green-50 flex items-center gap-3 transition-colors"
          >
            <Settings size={18} className="text-green-600" />
            <span>Update Profile</span>
          </button>
          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}