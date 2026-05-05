import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/common/app-layout';
import {
  updateUserProfile,
  updateUserBankDetails,
} from '../../store/slices/user-personal';
import { Camera, Edit2, Save, X, Plus, AlertCircle } from 'lucide-react';
 
export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { profile, bankDetails, isLoading, error } = useSelector(
    (state) => state.userPersonal
  );

  // Local UI states
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    account_holder_name: '',
    bank_name: '',
    account_number: '',
    ifsc_code: '',
  });
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankErrors, setBankErrors] = useState({});

  // ✅ Only populate local state from Redux – no fetch call
  useEffect(() => {
    if (profile) {
      setNameInput(profile.name);
    }
    if (bankDetails) {
      setBankFormData({
        account_holder_name: bankDetails.account_holder_name || '',
        bank_name: bankDetails.bank_name || '',
        account_number: bankDetails.account_number || '',
        ifsc_code: bankDetails.ifsc_code || '',
      });
    }
  }, [profile, bankDetails]);

  // Avatar upload (base64) – calls updateUserProfile
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be < 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        setAvatarPreview(base64);
        await dispatch(updateUserProfile({ profilePicture: base64 }));
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only JPG/PNG images');
    }
  };

  // Save name
  const saveName = async () => {
    if (nameInput.trim()) {
      await dispatch(updateUserProfile({ name: nameInput.trim() }));
      setIsEditing(false);
    }
  };

  // Bank validation
  const validateIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  const validateAccountNumber = (acc) => /^\d{9,18}$/.test(acc);

  const handleBankFieldChange = (e) => {
    const { name, value } = e.target;
    setBankFormData({ ...bankFormData, [name]: value });
    if (bankErrors[name]) setBankErrors({ ...bankErrors, [name]: '' });
  };

  const saveBankDetails = async () => {
    const errors = {};
    if (!bankFormData.account_holder_name.trim())
      errors.account_holder_name = 'Account holder name required';
    if (!bankFormData.bank_name.trim())
      errors.bank_name = 'Bank name required';
    if (!bankFormData.account_number.trim())
      errors.account_number = 'Account number required';
    else if (!validateAccountNumber(bankFormData.account_number.trim()))
      errors.account_number = 'Account number must be 9–18 digits';
    if (!bankFormData.ifsc_code.trim())
      errors.ifsc_code = 'IFSC code required';
    else if (!validateIFSC(bankFormData.ifsc_code.trim()))
      errors.ifsc_code = 'Invalid IFSC (e.g., SBIN0001234)';
    if (bankFormData.account_number !== confirmAccountNumber)
      errors.confirm_account_number = 'Account numbers do not match';

    if (Object.keys(errors).length) {
      setBankErrors(errors);
      return;
    }

    await dispatch(updateUserBankDetails(bankFormData));
    setShowBankForm(false);
    setBankErrors({});
  };

  const openBankForm = () => {
    if (bankDetails) {
      setBankFormData({ ...bankDetails });
      setConfirmAccountNumber(bankDetails.account_number);
    } else {
      setBankFormData({
        account_holder_name: '',
        bank_name: '',
        account_number: '',
        ifsc_code: '',
      });
      setConfirmAccountNumber('');
    }
    setBankErrors({});
    setShowBankForm(true);
  };

  const cancelBankForm = () => {
    setShowBankForm(false);
    setBankErrors({});
  };

  // Helper for fallback avatar
  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name?.length; i++)
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 70%, 55%)`;
  };

  if (isLoading && !profile) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          Error: {error}
        </div>
      </AppLayout>
    );
  }

  const displayAvatar = profile?.profilePicture?`${import.meta.env.VITE_BE_URL}${profile?.profilePicture}`:avatarPreview;

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column – Profile card */}
        <div className="w-full lg:w-1/2 xl:w-2/5">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">Your Profile</h1>
            <p className="text-gray-500 text-sm">Update your name and profile picture</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-green-200" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-green-200" style={{ backgroundColor: getAvatarColor(profile?.name) }}>
                    {getInitials(profile?.name)}
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/jpeg,image/png" className="hidden" />
              <p className="text-xs text-slate-500 mt-2">Click to change profile picture</p>
            </div>

            {/* Name */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-slate-700">Full Name</label>
                {!isEditing ? (
                  <button onClick={() => setIsEditing(true)} className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm">
                    <Edit2 size={14} /> Edit
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => { setNameInput(profile.name); setIsEditing(false); }} className="text-gray-500 hover:text-gray-700"><X size={16} /></button>
                    <button onClick={saveName} className="text-green-600 hover:text-green-700"><Save size={16} /></button>
                  </div>
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none"
                />
              ) : (
                <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-700">{profile?.name}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="mt-4">
              <label className="font-medium text-slate-700 mb-1 block">Email Address</label>
              <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-700">{profile?.email}</p>
            </div>

            {/* Bank details section */}
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="font-medium text-slate-700">Bank Account (for withdrawals)</label>
                {!showBankForm && (
                  <button onClick={openBankForm} className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700">
                    <Plus size={14} /> {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
                  </button>
                )}
              </div>

              {!showBankForm && bankDetails && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                  <div><span className="text-slate-500">Account Holder:</span> {bankDetails.account_holder_name}</div>
                  <div><span className="text-slate-500">Bank:</span> {bankDetails.bank_name}</div>
                  <div><span className="text-slate-500">Account No:</span> ••••{bankDetails.account_number.slice(-4)}</div>
                  <div><span className="text-slate-500">IFSC:</span> {bankDetails.ifsc_code}</div>
                </div>
              )}

              {showBankForm && (
                <div className="mt-3 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      name="account_holder_name"
                      value={bankFormData.account_holder_name}
                      onChange={handleBankFieldChange}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.account_holder_name ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.account_holder_name && <p className="text-red-500 text-xs mt-1"><AlertCircle size={12} /> {bankErrors.account_holder_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      name="bank_name"
                      value={bankFormData.bank_name}
                      onChange={handleBankFieldChange}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.bank_name ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.bank_name && <p className="text-red-500 text-xs mt-1">{bankErrors.bank_name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number *</label>
                    <input
                      type="text"
                      name="account_number"
                      value={bankFormData.account_number}
                      onChange={handleBankFieldChange}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.account_number ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.account_number && <p className="text-red-500 text-xs mt-1">{bankErrors.account_number}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Account Number *</label>
                    <input
                      type="text"
                      value={confirmAccountNumber}
                      onChange={(e) => setConfirmAccountNumber(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.confirm_account_number ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.confirm_account_number && <p className="text-red-500 text-xs mt-1">{bankErrors.confirm_account_number}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      name="ifsc_code"
                      value={bankFormData.ifsc_code}
                      onChange={handleBankFieldChange}
                      placeholder="e.g., SBIN0001234"
                      className={`w-full px-3 py-2 rounded-xl border uppercase ${bankErrors.ifsc_code ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.ifsc_code && <p className="text-red-500 text-xs mt-1">{bankErrors.ifsc_code}</p>}
                    <p className="text-xs text-slate-500 mt-1">11 characters: first 4 letters, then '0', then 6 alphanumeric</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={saveBankDetails} className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition">Save Bank Details</button>
                    <button onClick={cancelBankForm} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 w-full py-2 rounded-xl bg-gradient-to-r from-green-200 to-green-400 text-slate-900 font-semibold hover:from-green-300 hover:to-green-500"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Right column – Video placeholder */}
        <div className="w-full lg:w-1/2 xl:w-3/5 mt-6 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-sm border p-6 h-64 flex items-center justify-center text-slate-400">
            🎥 Video / Promotional content will appear here
          </div>
        </div>
      </div>
    </AppLayout>
  );
}