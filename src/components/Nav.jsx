import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import ContentContext from "../contexts/ContentContext";
import ParticlesBg from "particles-bg"; // ✅ Import the library

import ModelIcon from "./ModelIcon";
import { preloadModels } from "./GLTFLoader";

// 1️⃣ Define the helper function at the top
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
};

// --- Sci-Fi Animations ---
const pulseGlow = ({ theme }) => keyframes`
  0%, 100% { 
    box-shadow: 0 0 5px ${theme.colors.neonPrimary}, 0 0 10px ${theme.colors.neonPrimary};
  }
  50% { 
    box-shadow: 0 0 15px ${theme.colors.neonPrimary}, 0 0 25px ${theme.colors.neonPrimary};
  }
`;

const scanline = keyframes`
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
`;

// --- Styled Components ---
const NavWrapper = styled(motion.nav)`
  top: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) =>
    `rgba(${hexToRgb(theme.colors.background)}, 0.45)`};
  backdrop-filter: blur(10px);
  overflow: hidden; /* ✅ Changed to hidden for bouncing images */
  position: fixed;
  transition: all 0.3s ease;

  height: auto;
  min-height: 60px;
  max-height: 320px;
  transform: translateY(${(props) => (props.$collapsed ? "-80%" : "0%")});

  /* Main glowing border */
  border-bottom: 2px solid ${({ theme }) => theme.colors.neonPrimary};
  border-top: 2px solid ${({ theme }) => theme.colors.neonPrimary};

  animation: ${pulseGlow} 3s ease-in-out infinite;

  /* Enhanced gradient shadow */
  &::before {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 98%;
    height: 30px;
    background: ${({ theme }) => `
      linear-gradient(
        to top,
        ${theme.colors.neonPrimary} 0%,
        ${theme.colors.neonSecondary} 30%,
        transparent 100%
      )
    `};
    border-radius: 50%;
    filter: blur(8px);
    opacity: 0.7;
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 98%;
    height: 30px;

    background: ${({ theme }) => `
    linear-gradient(
      to bottom,
      ${theme.colors.neonPrimary} 0%,
      ${theme.colors.neonSecondary} 30%,
      transparent 100%
    )
  `};

    border-radius: 50%;
    filter: blur(8px);
    opacity: 0.7;
    z-index: -1;
  }
`;

const BackgroundImages = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  opacity: 0.15;
  pointer-events: none;
`;

const BgImage = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
  opacity: 1;
  filter: grayscale(0.5);
  position: absolute;
  pointer-events: none;
  transition: none; /* ✅ No transition for smooth movement */
`;

const LeftTabContainer = styled.div`
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ✅ Individual Tab Button - Slides out on hover
const TabButton = styled.div`
  background: ${({ theme }) =>
    `rgba(${hexToRgb(theme.colors.background)}, 0.92)`};
  border: 2px solid ${({ theme }) => theme.colors.neonPrimary};
  border-left: none;
  border-radius: 0 12px 12px 0;
  padding: 10px 12px 10px 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  gap: 10px;
  transform: translateX(-75%); /* Hidden by default - only icon peeks out */
  box-shadow: 0 0 20px ${({ theme }) => theme.colors.neonPrimary}30;
  backdrop-filter: blur(5px);
  position: relative;

  /* Icon that's always visible */
  &::before {
    content: "";
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 24px;
    background-image: url(${({ icon }) => icon});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
    filter: drop-shadow(0 0 5px ${({ theme }) => theme.colors.neonPrimary}40);
    transition: all 0.3s ease;
  }

  /* Show full tab on hover */
  &:hover {
    transform: translateX(0%); /* Slide out completely */
    box-shadow: 0 0 30px ${({ theme }) => theme.colors.neonPrimary}60;
    background: ${({ theme }) =>
      `rgba(${hexToRgb(theme.colors.background)}, 0.98)`};
    border-color: ${({ theme }) => theme.colors.neonSecondary};
    padding-right: 20px;
  }

  &:hover::before {
    opacity: 1;
    filter: drop-shadow(
      0 0 10px ${({ theme }) => theme.colors.neonSecondary}80
    );
  }

  /* Glow effect on hover */
  &::after {
    content: "";
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 50%;
    background: ${({ theme }) => theme.colors.neonPrimary};
    filter: blur(8px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.5;
  }
`;

// ✅ Tab Icon (visible when tab is expanded)
const TabIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
  opacity: 0;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px ${({ theme }) => theme.colors.neonPrimary}40);
  margin-right: 4px;

  ${TabButton}:hover & {
    opacity: 1;
    transform: scale(1.1);
  }
`;

// ✅ Tab Label
const TabLabel = styled.span`
  font-family: "Courier New", monospace;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.linkText};
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0;
  max-width: 0;
  overflow: hidden;
  transition: all 0.3s ease;

  ${TabButton}:hover & {
    opacity: 1;
    max-width: 120px;
    margin-right: 8px;
  }
`;

// ✅ Tab Badge (for notifications)
const TabBadge = styled.span`
  background: ${({ theme }) => theme.colors.neonSecondary};
  color: ${({ theme }) => theme.colors.background};
  font-size: 10px;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 10px;
  opacity: 0;
  transform: scale(0);
  transition: all 0.3s ease;
  min-width: 18px;
  text-align: center;

  ${TabButton}:hover & {
    opacity: 1;
    transform: scale(1);
  }
`;

// ✅ Tab Tooltip (optional - shows when not hovered)
const TabTooltip = styled.span`
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  background: ${({ theme }) =>
    `rgba(${hexToRgb(theme.colors.background)}, 0.95)`};
  color: ${({ theme }) => theme.colors.linkText};
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.neonPrimary}60;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  font-family: "Courier New", monospace;

  ${TabButton}:hover & {
    opacity: 0;
  }

  /* Show tooltip when not hovered */
  ${TabButton}:not(:hover) & {
    opacity: 1;
  }
`;

const ParticlesWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0; /* Behind nav content */
  pointer-events: none; /* Allow clicking through to nav items */
`;

const TopCorners = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
`;

const CornerItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: ${({ paddingTop }) => paddingTop || 0}px;
  padding-bottom: ${({ paddingBottom }) => paddingBottom || 0}px;
  padding-left: ${({ paddingLeft }) => paddingLeft || 0}px;
  padding-right: ${({ paddingRight }) => paddingRight || 0}px;
  position: relative;
`;

const SciFiHoverIcon = styled.img`
  cursor: pointer;
  transform: scale(${({ scale }) => scale || 1});
  transition: all 0.3s ease;
  width: 200px;
  height: auto;

  &:hover {
    transform: scale(${({ scaleHover }) => scaleHover || 1.1});
  }

  @media (max-width: 1400px) {
    width: 150px;
  }
`;

const HomeIcon = styled(SciFiHoverIcon)`
  /* Additional home icon specific styles if needed */
`;

const ThemeHoverIcon = styled(SciFiHoverIcon)`
  &:hover {
    content: url(${({ hoverSrc }) => hoverSrc});
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  padding: 15px 0;
  align-items: center;
  position: relative;
  z-index: 2;
`;

const NavItem = styled(motion.li)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.linkText};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  padding: 10px 15px;
  border-radius: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.neonSecondary};
    transform: translateY(-2px);
    filter: drop-shadow(${({ theme }) => theme.colors.neonPrimary} 0px 0px 8px);
  }
`;

const NavIcon = styled.div`
  width: ${({ size }) => size || 40}vw;
  height: ${({ size }) => size || 40}vw;
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  transition: all 0.3s ease;

  /* 🔥 Max size constraints */
  max-width: 200px;
  max-height: 200px;
  pointer-events: none !important;

  /* 🔥 Ensure images don't exceed container */
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }

  ${NavLink}:hover & {
    transform: scale(1.2);
    filter: drop-shadow(${({ theme }) => theme.colors.neonPrimary} 0px 0px 8px);
  }
`;

const LinkText = styled.span`
  font-weight: 500;
  transition: all 0.3s ease;
  font-family: "Courier New", monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 1.1em;

  ${NavLink}:hover & {
    color: ${({ theme }) => theme.colors.neonSecondary};
    transform: scale(1.1);
    text-shadow: 0 0 10px ${({ theme }) => theme.colors.neonSecondary};
  }
`;

// --- Nav Component ---
function Nav({ onThemeToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const content = useContext(ContentContext);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1400);
  const [collapsed, setCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // --- Navigation state and refs ---
  const [navTop, setNavTop] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const collapseTimeoutRef = useRef(null);
  const navRef = useRef(null);

  // ✅ Model paths for preloading
  const modelPaths = [
    "/models/home.glb",
    "/models/games.glb",
    "/models/changelog.glb",
    "/models/contact.glb",
  ];

  // ✅ Preload models
  useEffect(() => {
    if (typeof preloadModels === "function") {
      preloadModels(modelPaths);
    }
  }, []);

  const [hoveredTab, setHoveredTab] = useState(null);

  // ✅ Tab configuration
  const tabs = [
    {
      id: "theme",
      icon: "/images/ToggleButton_Main.png",
      hoverIcon: "/images/ToggleButton_ToggleBright.png",
      label: "Theme",
      tooltip: "Toggle Theme",
      onClick: onThemeToggle,
      badge: null,
    },
    {
      id: "settings",
      icon: "/images/settings-icon.png",
      hoverIcon: null,
      label: "Settings",
      tooltip: "Settings",
      onClick: () => console.log("Settings clicked"),
      badge: null,
    },
    {
      id: "notifications",
      icon: "/images/notification-icon.png",
      hoverIcon: null,
      label: "Alerts",
      tooltip: "Notifications",
      onClick: () => console.log("Notifications clicked"),
      badge: "3",
    },
  ];

  /*
  // ✅ CUSTOM CONFIGURATION FOR PARTICLES
  const particleConfig = {
    num: [10, 20], // [min, max] number of particles
    radius: [8, 25], // [min, max] particle size in pixels
    v: [0.5, 2], // [min, max] speed
    tha: [-45, 45], // [min, max] movement angle in degrees
    alpha: [0.7, 0.2], // [min, max] opacity
    scale: [1, 0.3], // [min, max] scale
    position: "all", // "all" or "center"
    color: ["#00ff88", "#ff00ff", "#00ccff", "#ff6600"], // Color array
    cross: "dead", // "dead" or "bround" (bounce off edges)
    random: 10, // Randomness factor
    // For images instead of circles:
    // body: "/images/your-icon.png",
  };
    */

  const bgImages = [
    "/images/A_buttons_transparent.png",
    "/images/B_buttons_transparent.png",
    "/images/X_buttons_transparent.png",
    "/images/Y_buttons_transparent.png",
    "/images/C_buttons_transparent.png",
    "/images/T_buttons_transparent.png",
    "/images/S_buttons_transparent.png",
    "/images/XX_buttons_transparent.png",
  ];

  const createParticleConfig = (image) => ({
    num: [1, 2], // Few particles per image
    radius: [2, 5], // Size of each image
    v: [0.3, 1.0], // Speed
    tha: [-45, 45], // Movement angle
    alpha: [0.2, 0.0125], // Opacity
    scale: [0.5, 0.15], // Scale variation
    position: "all",
    body: image, // Single image
    cross: "bround",
    random: 10,
    color: ["#ffffff"],
  });

  // ✅ Force close navbar on ANY mouse scroll
  useEffect(() => {
    const handleScroll = () => {
      // Check if navbar is currently open (not collapsed)
      if (!isCollapsed) {
        console.log("🔄 Scroll detected - closing navbar");
        setIsCollapsed(true);

        // Also clear any pending expand timeouts
        if (collapseTimeoutRef.current) {
          clearTimeout(collapseTimeoutRef.current);
          collapseTimeoutRef.current = null;
        }
      }
    };

    // Use wheel event for more reliable detection
    const handleWheel = (e) => {
      // Only trigger if user is scrolling (any direction)
      if (e.deltaY !== 0 && !isCollapsed) {
        console.log("🔄 Wheel detected - closing navbar");
        setIsCollapsed(true);

        if (collapseTimeoutRef.current) {
          clearTimeout(collapseTimeoutRef.current);
          collapseTimeoutRef.current = null;
        }
      }
    };

    // Add both scroll and wheel listeners
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isCollapsed]); // ✅ Include isCollapsed as dependency

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1400);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const collapseNav = (delay = 200) => {
    if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    collapseTimeoutRef.current = setTimeout(() => {
      setIsCollapsed(true);
      collapseTimeoutRef.current = null;
    }, delay);
  };

  const expandNav = () => {
    if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    setIsCollapsed(false);
  };

  // --- cleanup ---
  useEffect(() => {
    return () => {
      if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (!isHovering && e.deltaY > 0) {
        collapseNav(150);
      }
    };
    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isHovering]);

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (path) => {
    if (location.pathname === path) handleScrollTop();

    console.log("Navigating Desktop to: " + path);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    navigate(path);
    collapseNav(150);
  };

  /*
  const navItems = [
    {
      model: "/models/home.glb",
      text: "Home",
      path: "/",
      scale: 1.5,
      rotationSpeed: 0.01,
    },
    {
      model: "/models/games.glb",
      text: "Projects / Games",
      path: "/projects",
      scale: 1.5,
      rotationSpeed: 0.015,
    },
    {
      model: "/models/changelog.glb",
      text: "Change Log",
      path: "/changelog",
      scale: 1.5,
      rotationSpeed: 0.02,
    },
    {
      model: "/models/contact.glb",
      text: "Contact Me",
      path: "/contact-us",
      scale: 1.5,
      rotationSpeed: 0.01,
    },
  ];
    */

  const navItems = [
    {
      type: "image",
      icon: "/images/Home_Page_Icon.png",
      text: "Home",
      path: "/",
    },
    {
      type: "image",
      icon: "/images/Game_Page_Icon.png",
      text: "Projects / Games",
      path: "/projects",
    },
    {
      type: "image",
      icon: "/images/ChangeLog_Page_Icon.png",
      text: "Change Log",
      path: "/changelog",
    },
    {
      type: "image",
      icon: "/images/Contact_Page_Icon.png",
      text: "Contact Us",
      path: "/contact-us",
    },
  ];

  const handleMouseEnterNav = () => {
    setIsHovering(true);
    expandNav();
  };

  const handleMouseLeaveNav = (e) => {
    const navRect = e.currentTarget.getBoundingClientRect();
    const { clientX, clientY } = e;

    if (
      clientY > navRect.bottom ||
      clientX < navRect.left ||
      clientX > navRect.right
    ) {
      setIsHovering(false);
      collapseNav(150);
    }
  };

  return (
    <>
      <NavWrapper
        ref={navRef}
        onMouseEnter={handleMouseEnterNav}
        onMouseLeave={handleMouseLeaveNav}
        $collapsed={isCollapsed}
      >
        {/* ✅ Left Side Tabs */}
        <LeftTabContainer>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              icon={tab.icon}
              onClick={tab.onClick}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                borderColor:
                  hoveredTab === tab.id
                    ? "${({ theme }) => theme.colors.neonSecondary}"
                    : "${({ theme }) => theme.colors.neonPrimary}",
              }}
            >
              {/* Tooltip shown when not hovered */}
              <TabTooltip>{tab.tooltip}</TabTooltip>

              {/* Icon shown when expanded */}
              <TabIcon
                src={
                  hoveredTab === tab.id && tab.hoverIcon
                    ? tab.hoverIcon
                    : tab.icon
                }
                alt={tab.label}
              />

              {/* Label */}
              <TabLabel>{tab.label}</TabLabel>

              {/* Badge */}
              {tab.badge && <TabBadge>{tab.badge}</TabBadge>}
            </TabButton>
          ))}
        </LeftTabContainer>

        <ParticlesWrapper>
          {/* Top Buttons 
        <ParticlesBg
          type="circle" // Change this to your preferred type
          bg={true} // Makes it position: absolute, fill the container
          color="#ffffff" // Particle color
          num={50} // Number of particles (adjust for density)
          size={0.1}
          />
        <ParticlesBg type="custom" config={particleConfig} bg={true} />
      */}
        </ParticlesWrapper>

        {/* Top Buttons */}
        <TopCorners hide={collapsed}>
          {/* HOME ICON */}
          <CornerItem paddingTop={5} paddingLeft={25}></CornerItem>

          {/* THEME TOGGLE ICON */}
          <CornerItem paddingTop={5} paddingRight={20}>
            <ThemeHoverIcon
              src="/images/mlogo.png"
              hoverSrc="/images/mlogo.png"
              alt="Toggle Theme"
              scale={8}
              scaleHover={9}
              onClick={onThemeToggle}
              style={{
                position: "absolute",
                top: "40px",
                right: "100px",
                height: "auto",
              }}
            />
          </CornerItem>
        </TopCorners>

        {/* Main Nav */}
        <NavList
          style={{
            right: "10px",
          }}
        >
          {navItems.map((item, index) => (
            <NavItem
              key={item.path}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: index * 0.06,
              }}
            >
              <NavLink to={item.path} onClick={() => handleNavClick(item.path)}>
                <NavIcon size={15}>
                  {item.type === "model" ? (
                    <ModelIcon
                      modelPath={item.model}
                      size={200}
                      scale={item.scale}
                      rotationSpeed={item.rotationSpeed}
                    />
                  ) : (
                    <img
                      src={item.icon}
                      alt={item.text}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </NavIcon>
                <LinkText>{item.text}</LinkText>
              </NavLink>
            </NavItem>
          ))}
        </NavList>
      </NavWrapper>
    </>
  );
}

// Make sure this export is at the bottom
export default Nav;
