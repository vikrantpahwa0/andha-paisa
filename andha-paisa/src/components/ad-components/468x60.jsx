// TopBanner.jsx
import { useEffect, useRef } from "react";

export default function TopBanner() {
  const bannerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    if (!bannerRef.current) return;
    
    // Generate a unique container ID
    const containerId = `top-banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Set the ID on the div
    bannerRef.current.id = containerId;
    
    // Clear any existing content
    bannerRef.current.innerHTML = '';
    
    console.log("Loading top banner ad with async pattern...");
    
    // Use the async pattern that works with React
    const atAsyncOptions = {
      key: '96753a2eaab5594c1851078716789a9e',
      format: 'js',
      async: true,
      container: containerId,
      height: 60,
      width: 468,
      params: {}
    };
    
    // Create the config script
    const configScript = document.createElement('script');
    configScript.innerHTML = `
      if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
      atAsyncOptions.push(${JSON.stringify(atAsyncOptions)});
    `;
    
    // Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${atAsyncOptions.key}/invoke.js`;
    invokeScript.async = true;
    
    // Append scripts
    bannerRef.current.appendChild(configScript);
    bannerRef.current.appendChild(invokeScript);
    
    initialized.current = true;
    
    // No cleanup - ad should stay
  }, []);

  return (
    <div className="w-full bg-white py-2 flex justify-center border-b border-slate-200">
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
  );
}