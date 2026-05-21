// src/components/ad-components/FooterBanner.jsx
import { useEffect, useRef, useState } from "react";

export default function FooterBanner() {
  const bannerRef = useRef(null);
  const loaded = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load footer banner ad
  useEffect(() => {
    if (loaded.current) return;
    if (!bannerRef.current) return;

    const isMobileDevice = window.innerWidth <= 768;
    
    const script = document.createElement("script");
    
    if (isMobileDevice) {
      script.src = "https://www.highperformanceformat.com/666294eb6c5aa819b9902f1956c425cc/invoke.js";
    } else {
      script.src = "https://www.highperformanceformat.com/fc742c6dceb14fd146a6494ce8a0049a/invoke.js";
    }
    script.async = true;
    
    const config = document.createElement("script");
    if (isMobileDevice) {
      config.text = `
        atOptions = {
          'key' : '666294eb6c5aa819b9902f1956c425cc',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;
    } else {
      config.text = `
        atOptions = {
          'key' : 'fc742c6dceb14fd146a6494ce8a0049a',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
    }
    
    bannerRef.current.appendChild(config);
    bannerRef.current.appendChild(script);
    loaded.current = true;

    console.log("Footer banner loaded:", isMobileDevice ? "320x50 (mobile)" : "728x90 (desktop)");
  }, [isMobile]);

  return (
    <div className="w-full bg-gray-50 py-3 flex justify-center border-t border-slate-200">
      <div 
        ref={bannerRef}
        style={{ 
          width: isMobile ? '320px' : '728px',
          minHeight: isMobile ? '50px' : '90px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      />
    </div>
  );
}