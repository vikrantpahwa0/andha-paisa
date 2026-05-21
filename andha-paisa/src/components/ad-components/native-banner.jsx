// src/components/ad-components/NativeBanner.jsx
import { useEffect, useRef } from "react";

export default function NativeBanner() {
  const bannerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!bannerRef.current) return;

    // Clear any existing content
    bannerRef.current.innerHTML = '';

    // Create container div for the ad
    const containerDiv = document.createElement("div");
    containerDiv.id = "container-b09ff8e53728d3a4d2b00f91d28bedf3";

    // Create invoke script
    const invokeScript = document.createElement("script");
    invokeScript.src = "https://pl29456048.effectivecpmnetwork.com/b09ff8e53728d3a4d2b00f91d28bedf3/invoke.js";
    invokeScript.async = true;
    invokeScript.setAttribute("data-cfasync", "false");

    // Append to container
    bannerRef.current.appendChild(containerDiv);
    bannerRef.current.appendChild(invokeScript);

    initialized.current = true;

    console.log("Native banner loaded");
  }, []);

  return (
    <div 
      ref={bannerRef}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
      style={{ 
        width: '100%',
        minHeight: '120px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    />
  );
}