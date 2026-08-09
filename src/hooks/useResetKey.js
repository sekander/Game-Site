// src/hooks/useResetKey.js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useResetKey() {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1); // Increment on page change
    window.scrollTo(0, 0); // Scroll to top
  }, [location.pathname]);

  return key;
}
