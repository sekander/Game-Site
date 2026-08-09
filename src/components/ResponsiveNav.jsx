// components/ResponsiveNav.jsx
import React, { useState, useEffect } from "react";
import Nav from "./Nav";
import NavMenu from "./NavMenu";

export default function ResponsiveNav({ onThemeToggle }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 967);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 967;
      setIsMobile(mobile);
      console.log(`[DEBUG] Screen resized to ${window.innerWidth}px: ${mobile ? "Mobile" : "Desktop"}`);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <NavMenu /> : <Nav onThemeToggle={onThemeToggle} />;
}

