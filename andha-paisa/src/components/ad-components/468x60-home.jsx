// src/components/ad-components/HeaderBanner.jsx
import { useEffect, useState, useRef } from "react";

export default function HeaderBanner() {
  const bannerRef = useRef(null);
  const loaded = useRef(false);
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
    const timer = setTimeout(() => {
      if (loaded.current) return;
      if (!bannerRef.current) return;

      bannerRef.current.innerHTML = "";

      const containerId = `header-banner-${Date.now()}`;
      bannerRef.current.id = containerId;

      const atAsyncOptions = {
        key: "96753a2eaab5594c1851078716789a9e",
        format: "js",
        async: true,
        container: containerId,
        height: 60,
        width: 468,
        params: {},
      };

      const configScript = document.createElement("script");
      configScript.innerHTML = `
        if (typeof atAsyncOptions !== 'object') var atAsyncOptions = [];
        atAsyncOptions.push(${JSON.stringify(atAsyncOptions)});
      `;

      const invokeScript = document.createElement("script");
      invokeScript.type = "text/javascript";
      invokeScript.src = `//www.highperformanceformat.com/${atAsyncOptions.key}/invoke.js`;
      invokeScript.async = true;

      bannerRef.current.appendChild(configScript);
      bannerRef.current.appendChild(invokeScript);
      loaded.current = true;

      console.log("HeaderBanner loaded (468x60)");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-white py-2 border-b border-slate-200 overflow-x-auto">
      <div className="flex justify-center min-w-[320px]">
        <div
          ref={bannerRef}
          style={{
            minWidth: isMobile ? "320px" : "468px",
            minHeight: "60px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </div>
    </div>
  );
}
