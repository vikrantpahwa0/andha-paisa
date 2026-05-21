// src/components/ad-components/GamesPopunder.jsx
import { useEffect, useRef } from "react";

export default function GamesPopunder({ onTriggered }) {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    
    const script = document.createElement("script");
    script.src = "https://pl29456047.effectivecpmnetwork.com/d6/c5/b2/d6c5b25a3b9f0f74a3bcef9e0e334551.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
    triggered.current = true;
    
    console.log("Games popunder triggered");
    
    if (onTriggered) onTriggered();
  }, [onTriggered]);

  return null; // Popunder has no visual element
}