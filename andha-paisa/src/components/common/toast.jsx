// src/components/ui/Toast.jsx
import { useEffect } from "react";
import { X, CheckCircle, Gift, Meh } from "lucide-react";

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    bonus: <Gift className="w-5 h-5 text-amber-500" />,
    error: <Meh className="w-5 h-5 text-slate-500" />,
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200",
    bonus: "bg-amber-50 border-amber-200",
    error: "bg-slate-50 border-slate-200",
  };

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${bgColors[type]} bg-white animate-in slide-in-from-bottom-5 duration-300`}>
      {icons[type]}
      <span className="text-slate-700 font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-slate-600">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;