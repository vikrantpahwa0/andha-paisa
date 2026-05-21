// src/components/ad-components/HeaderBanner.jsx
import { useEffect, useRef } from "react";

export default function HeaderBanner() {
  const bannerRef = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    // Add a delay to ensure DOM is ready in production
    const timer = setTimeout(() => {
      if (loaded.current) return;
      if (!bannerRef.current) return;

      // Clear any existing content
      bannerRef.current.innerHTML = '';

      const containerId = `header-banner-${Date.now()}`;
      bannerRef.current.id = containerId;

      const atAsyncOptions = {
        key: '96753a2eaab5594c1851078716789a9e',
        format: 'js',
        async: true,
        container: containerId,
        height: 60,
        width: 468,
        params: {}
      };

      const configScript = document.createElement('script');
      configScript.innerHTML = `
        if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
        atAsyncOptions.push(${JSON.stringify(atAsyncOptions)});
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${atAsyncOptions.key}/invoke.js`;
      invokeScript.async = true;

      bannerRef.current.appendChild(configScript);
      bannerRef.current.appendChild(invokeScript);
      loaded.current = true;

      console.log("HeaderBanner loaded (468x60)");
    }, 500); // Increased delay for production

    return () => clearTimeout(timer);
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