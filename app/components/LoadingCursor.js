"use client"; // This is required for using React hooks

import { useEffect } from "react";

export default function LoadingCursor() {
  useEffect(() => {
    // Handle cursor change logic for loading state
    const handleRouteChangeStart = () => {
      document.body.classList.add("loading"); // Add the loading class to body
    };

    const handleRouteChangeComplete = () => {
      document.body.classList.remove("loading"); // Remove the loading class
    };

    const handleRouteChangeError = () => {
      document.body.classList.remove("loading"); // Remove the loading class if there's an error
    };

    // Attach event listeners for route changes
    window.addEventListener("beforeunload", handleRouteChangeStart);
    window.addEventListener("load", handleRouteChangeComplete);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      window.removeEventListener("load", handleRouteChangeComplete);
    };
  }, []);

  return null; // This component doesn't render anything visually
}
