// src/components/ad-components/SidebarDesktopAd.jsx
import { useEffect, useRef } from "react";

export default function SidebarDesktopAd() {
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
        'key' : '502893a28b3badbe90ace6ff83709314',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    const invokeScript = document.createElement("script");
    invokeScript.src = "https://www.highperformanceformat.com/502893a28b3badbe90ace6ff83709314/invoke.js";
    invokeScript.async = true;

    bannerRef.current.appendChild(configScript);
    bannerRef.current.appendChild(invokeScript);

    initialized.current = true;

    console.log("Sidebar desktop ad (300x250) loaded");
  }, []);

  return (
    <div 
      ref={bannerRef}
      style={{
        width: "300px",
        minHeight: "250px",
      }}
    />
  );
}