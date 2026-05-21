// src/components/ad-components/SidebarMobileAd.jsx
import { useEffect, useRef } from "react";

export default function SidebarMobileAd() {
  const bannerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!bannerRef.current) return;

    // Clear any existing content
    bannerRef.current.innerHTML = '';

    const configScript = document.createElement("script");
    configScript.innerHTML = `
      atOptions = {
        'key' : '666294eb6c5aa819b9902f1956c425cc',
        'format' : 'iframe',
        'height' : 50,
        'width' : 320,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src = "https://www.highperformanceformat.com/666294eb6c5aa819b9902f1956c425cc/invoke.js";
    invokeScript.async = true;

    bannerRef.current.appendChild(configScript);
    bannerRef.current.appendChild(invokeScript);

    initialized.current = true;

    console.log("Sidebar mobile ad (320x50) loaded");
  }, []);

  return (
    <div 
      ref={bannerRef}
      style={{
        width: "320px",
        minHeight: "50px",
      }}
    />
  );
}