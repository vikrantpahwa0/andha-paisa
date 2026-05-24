// TopBanner.jsx
import { useEffect, useRef, useState } from "react";

export default function TopBanner() {
  const bannerRef = useRef(null);
  const initialized = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Prevent multiple initializations
    if (initialized.current) return;
    if (!bannerRef.current) return;

    // Generate a unique container ID
    const containerId = `top-banner-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Set the ID on the div
    bannerRef.current.id = containerId;

    // Clear any existing content
    bannerRef.current.innerHTML = "";

    // Use different ad key for mobile vs desktop
    const adKey = isMobile
      ? "666294eb6c5aa819b9902f1956c425cc"
      : "96753a2eaab5594c1851078716789a9e";
    const adHeight = isMobile ? 50 : 60;
    const adWidth = isMobile ? 320 : 468;

    console.log(
      `Loading top banner ad for ${isMobile ? "mobile" : "desktop"}...`,
    );

    // Use the async pattern that works with React
    const atAsyncOptions = {
      key: adKey,
      format: "js",
      async: true,
      container: containerId,
      height: adHeight,
      width: adWidth,
      params: {},
    };

    // Create the config script
    const configScript = document.createElement("script");
    configScript.innerHTML = `
      if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
      atAsyncOptions.push(${JSON.stringify(atAsyncOptions)});
    `;

    // Create the invoke script
    const invokeScript = document.createElement("script");
    invokeScript.type = "text/javascript";
    invokeScript.src = `//www.highperformanceformat.com/${atAsyncOptions.key}/invoke.js`;
    invokeScript.async = true;

    // Append scripts
    bannerRef.current.appendChild(configScript);
    bannerRef.current.appendChild(invokeScript);

    initialized.current = true;

    // No cleanup - ad should stay
  }, [isMobile]);

  return (
    <div className="w-full bg-white py-2 flex justify-center border-b border-slate-200 overflow-x-auto">
      <div className="flex justify-center min-w-[320px]">
        <div
          ref={bannerRef}
          style={{
            minWidth: isMobile ? "320px" : "468px",
            minHeight: isMobile ? "50px" : "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
    </div>
  );
}
