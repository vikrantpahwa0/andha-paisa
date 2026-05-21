// src/components/ad-components/HomeTopBanner.jsx
import { useEffect, useRef } from "react";

export default function HomeTopBanner() {
  const bannerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!bannerRef.current) return;
    
    // Clear any existing content
    bannerRef.current.innerHTML = '';
    
    console.log("Loading homepage top banner...");
    
    // Add configuration script
    const configScript = document.createElement("script");
    configScript.text = `
      atOptions = {
        'key' : '96753a2eaab5594c1851078716789a9e',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    
    // Add invoke script
    const invokeScript = document.createElement("script");
    invokeScript.src = "https://www.highperformanceformat.com/96753a2eaab5594c1851078716789a9e/invoke.js";
    invokeScript.async = true;
    
    // Add both scripts to container
    bannerRef.current.appendChild(configScript);
    bannerRef.current.appendChild(invokeScript);
    
    initialized.current = true;
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex justify-center">
        <div 
          ref={bannerRef}
          style={{ 
            minWidth: '468px', 
            minHeight: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
      </div>
    </div>
  );
}