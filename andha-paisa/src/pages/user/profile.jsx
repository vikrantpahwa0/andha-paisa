import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/common/app-layout';
import { Camera, Edit2, Save, X, Plus, AlertCircle } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    avatarUrl: null,
    bankDetails: null, // will store object once added
  });
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);

  // Bank details state
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [bankErrors, setBankErrors] = useState({});

  // Avatar handlers (unchanged)
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be < 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatarUrl: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Only JPG/PNG images');
    }
  };

  const saveName = () => {
    if (nameInput.trim()) {
      setUser({ ...user, name: nameInput.trim() });
      setIsEditing(false);
    }
  };

  // Bank validation helpers
  const validateIFSC = (ifsc) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase());
  const validateAccountNumber = (acc) => /^\d{9,18}$/.test(acc);

  const handleBankFieldChange = (e) => {
    const { name, value } = e.target;
    setBankFormData({ ...bankFormData, [name]: value });
    if (bankErrors[name]) setBankErrors({ ...bankErrors, [name]: '' });
  };

  const saveBankDetails = () => {
    const errors = {};
    if (!bankFormData.accountHolderName.trim())
      errors.accountHolderName = 'Account holder name required';
    if (!bankFormData.bankName.trim())
      errors.bankName = 'Bank name required';
    if (!bankFormData.accountNumber.trim())
      errors.accountNumber = 'Account number required';
    else if (!validateAccountNumber(bankFormData.accountNumber.trim()))
      errors.accountNumber = 'Account number must be 9–18 digits';
    if (!bankFormData.ifscCode.trim())
      errors.ifscCode = 'IFSC code required';
    else if (!validateIFSC(bankFormData.ifscCode.trim()))
      errors.ifscCode = 'Invalid IFSC (e.g., SBIN0001234)';
    if (bankFormData.accountNumber !== confirmAccountNumber)
      errors.confirmAccountNumber = 'Account numbers do not match';

    if (Object.keys(errors).length) {
      setBankErrors(errors);
      return;
    }

    setUser({
      ...user,
      bankDetails: {
        accountHolderName: bankFormData.accountHolderName.trim(),
        bankName: bankFormData.bankName.trim(),
        accountNumber: bankFormData.accountNumber.trim(),
        ifscCode: bankFormData.ifscCode.trim().toUpperCase(),
      },
    });
    // Reset form and close
    setShowBankForm(false);
    setBankFormData({
      accountHolderName: '',
      bankName: '',
      accountNumber: '',
      ifscCode: '',
    });
    setConfirmAccountNumber('');
    setBankErrors({});
  };

  const openBankForm = () => {
    // If bank details exist, pre‑fill form for editing
    if (user.bankDetails) {
      setBankFormData({
        accountHolderName: user.bankDetails.accountHolderName,
        bankName: user.bankDetails.bankName,
        accountNumber: user.bankDetails.accountNumber,
        ifscCode: user.bankDetails.ifscCode,
      });
      setConfirmAccountNumber(user.bankDetails.accountNumber);
    } else {
      // Reset form
      setBankFormData({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
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

  const getInitials = (name) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const getAvatarColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${hash % 360}, 70%, 55%)`;
  };

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column – Profile card */}
        <div className="w-full lg:w-1/2 xl:w-2/5">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">Your Profile</h1>
            <p className="text-gray-500 text-sm">Update your name and profile picture</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            {/* Avatar section (unchanged) */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-green-200" />
                ) : (
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-green-200" style={{ backgroundColor: getAvatarColor(user.name) }}>
                    {getInitials(user.name)}
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
                    <button onClick={() => { setNameInput(user.name); setIsEditing(false); }} className="text-gray-500 hover:text-gray-700"><X size={16} /></button>
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
                <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-700">{user.name}</p>
              )}
            </div>

            {/* Email (read‑only) */}
            <div className="mt-4">
              <label className="font-medium text-slate-700 mb-1 block">Email Address</label>
              <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-700">{user.email}</p>
            </div>

            {/* Bank Details Section */}
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between items-center mb-3">
                <label className="font-medium text-slate-700">Bank Account (for withdrawals)</label>
                {!showBankForm && (
                  <button
                    onClick={openBankForm}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                  >
                    <Plus size={14} /> {user.bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
                  </button>
                )}
              </div>

              {!showBankForm && user.bankDetails && (
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-sm">
                  <div><span className="text-slate-500">Account Holder:</span> {user.bankDetails.accountHolderName}</div>
                  <div><span className="text-slate-500">Bank:</span> {user.bankDetails.bankName}</div>
                  <div><span className="text-slate-500">Account No:</span> ••••{user.bankDetails.accountNumber.slice(-4)}</div>
                  <div><span className="text-slate-500">IFSC:</span> {user.bankDetails.ifscCode}</div>
                </div>
              )}

              {showBankForm && (
                <div className="mt-3 space-y-4">
                  {/* Account Holder Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Holder Name *</label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={bankFormData.accountHolderName}
                      onChange={handleBankFieldChange}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.accountHolderName ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.accountHolderName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {bankErrors.accountHolderName}</p>}
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Bank Name *</label>
                    <input
                      type="text"
                      name="bankName"
                      value={bankFormData.bankName}
                      onChange={handleBankFieldChange}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.bankName ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.bankName && <p className="text-red-500 text-xs mt-1">{bankErrors.bankName}</p>}
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account Number *</label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={bankFormData.accountNumber}
                      onChange={handleBankFieldChange}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.accountNumber ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.accountNumber && <p className="text-red-500 text-xs mt-1">{bankErrors.accountNumber}</p>}
                  </div>

                  {/* Confirm Account Number */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Account Number *</label>
                    <input
                      type="text"
                      value={confirmAccountNumber}
                      onChange={(e) => setConfirmAccountNumber(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl border ${bankErrors.confirmAccountNumber ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.confirmAccountNumber && <p className="text-red-500 text-xs mt-1">{bankErrors.confirmAccountNumber}</p>}
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">IFSC Code *</label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={bankFormData.ifscCode}
                      onChange={handleBankFieldChange}
                      placeholder="e.g., SBIN0001234"
                      className={`w-full px-3 py-2 rounded-xl border uppercase ${bankErrors.ifscCode ? 'border-red-400' : 'border-slate-200'} focus:border-green-400 focus:ring-2 focus:ring-green-200 outline-none`}
                    />
                    {bankErrors.ifscCode && <p className="text-red-500 text-xs mt-1">{bankErrors.ifscCode}</p>}
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

        {/* Right Column – reserved for video */}
        <div className="w-full lg:w-1/2 xl:w-3/5 mt-6 lg:mt-0">
          <div className="bg-white rounded-2xl shadow-sm border p-6 h-64 flex items-center justify-center text-slate-400">
            🎥 Video / Promotional content will appear here
          </div>
        </div>
      </div>
    </AppLayout>
  );
}