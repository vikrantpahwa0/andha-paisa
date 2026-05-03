import { useEffect, useState } from 'react';

export default function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setShowPrompt(false);
      });
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-xl border p-4 z-50 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">Install App</h4>
          <p className="text-sm text-gray-500 mt-1">
            Install Andha Paisa on your device for faster access
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDismiss}
            className="px-3 py-1 text-gray-500 hover:text-gray-700"
          >
            Later
          </button>
          <button
            onClick={handleInstall}
            className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}