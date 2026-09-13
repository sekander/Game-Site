import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";

// --- Neon Pulse Animation ---
const pulseGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px ${({ theme }) => theme.colors.neonPrimary}, 0 0 10px ${({ theme }) => theme.colors.neonPrimary};
  }
  50% { 
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.neonPrimary}, 0 0 25px ${({ theme }) => theme.colors.neonPrimary};
  }
`;

const MenuToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  padding: 10px 15px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.neonSecondary};
  border: 2px solid ${({ theme }) => theme.colors.neonPrimary};
  cursor: pointer;
  border-radius: 6px;
  font-weight: bold;
  animation: ${pulseGlow} 3s ease-in-out infinite;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  z-index: 998;
`;

// Converts hex color (#RRGGBB) to "R, G, B" string
const hexToRgb = (hex) => {
  // Remove '#' if present
  hex = hex.replace(/^#/, "");

  // Parse r, g, b
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  return `${r}, ${g}, ${b}`;
};

const SideMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 260px;
  height: 100vh;
  background: ${({ theme }) =>
    `rgba(${hexToRgb(theme.colors.background)}, 0.95)`};
  border-left: 2px solid ${({ theme }) => theme.colors.neonPrimary};
  z-index: 999;
  display: flex;
  flex-direction: column;
  padding: 80px 20px 20px 20px;
  box-shadow: -2px 0 10px ${({ theme }) => theme.colors.neonPrimary};

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    height: 30px;
    background: linear-gradient(
      to bottom,
      ${({ theme }) => theme.colors.neonPrimary} 0%,
      ${({ theme }) => theme.colors.neonSecondary} 30%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(8px);
    opacity: 0.7;
    z-index: -1;
  }
`;

const MenuItemButton = styled.button`
  width: 100%;
  padding: 14px 16px;
  text-align: left;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.neonSecondary};
  cursor: pointer;G
  font-size: 1.1rem;
  font-weight: 500;
  border-bottom: 1px solid ${({ theme }) => theme.colors.neonPrimary};
  margin-bottom: 15px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.neonPrimary};
    text-shadow:
      0 0 8px ${({ theme }) => theme.colors.neonPrimary},
      0 0 15px ${({ theme }) => theme.colors.neonSecondary};
  }
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MenuIcon = styled.img`
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;

  ${MenuItemButton}:hover & {
    filter: drop-shadow(0 0 8px ${({ theme }) => theme.colors.neonPrimary});
    transform: scale(1.1);
  }
`;

export default function NavMenu() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sideMenuRef = useRef(null);

  const menuItems = [
    { label: "Home", path: "/", icon: "/images/Home_Page_Icon.png" },
    {
      label: "Projects / Games",
      path: "/projects",
      icon: "/images/Game_Page_Icon.png",
    },
    {
      label: "Change Log",
      path: "/changelog",
      icon: "/images/ChangeLog_Page_Icon.png",
    },
    {
      label: "Contact Me",
      path: "/contact-us",
      icon: "/images/Contact_Page_Icon.png",
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsOpen(false);
  };

  return (
    <>
      <MenuToggleButton onClick={() => setIsOpen((prev) => !prev)}>
        {isOpen ? "Close Menu" : "Open Menu"}
      </MenuToggleButton>

      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      <SideMenu
        ref={sideMenuRef}
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
      >
        {menuItems.map((item) => (
          <MenuItemButton
            key={item.path}
            onClick={() => handleNavigate(item.path)}
          >
            <MenuIcon src={item.icon} alt={item.label} />
            <span>{item.label}</span>
          </MenuItemButton>
        ))}
      </SideMenu>
    </>
  );
}
