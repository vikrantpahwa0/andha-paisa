// src/components/ad-components/SocialBar.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SocialBar() {
  const location = useLocation();

  useEffect(() => {
    console.log("SocialBar useEffect triggered for path:", location.pathname);
    
    // Check if script already exists
    const existingScript = document.getElementById("social-bar-script");
    if (existingScript) {
      console.log("Social Bar script already exists, skipping");
      return;
    }
    
    console.log("Creating new Social Bar script element");
    const script = document.createElement("script");
    script.id = "social-bar-script";
    script.src = "https://pl29456049.effectivecpmnetwork.com/a6/7e/e1/a67ee17bfaa51eacf07b14234f152792.js";
    script.async = true;
    
    script.onload = () => {
      console.log("✅ Social Bar script loaded successfully");
    };
    
    script.onerror = (error) => {
      console.error("❌ Social Bar script failed to load:", error);
    };
    
    // Append to head instead of body (sometimes works better)
    document.head.appendChild(script);
    console.log("Script appended to document.head");
    
  }, [location.pathname]); // Re-run on route change

  return null;
}