import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import ContentContext from "../contexts/ContentContext";

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
    `rgba(${hexToRgb(theme.colors.background)}, 0.95)`};
  backdrop-filter: blur(10px);
  overflow: visible;
  position: fixed;
  transition: all 0.3s ease;

  /* Main glowing border */
  border-bottom: 2px solid ${({ theme }) => theme.colors.neonPrimary};
  animation: ${pulseGlow} 3s ease-in-out infinite;

  /* Scan line effect */

  /* Enhanced gradient shadow */
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

const TopCorners = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  position: relative;
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
  //const [collapsed, setCollapsed] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // --- Navigation state and refs ---
  const [navTop, setNavTop] = useState(0);
  /*
  const [navTop, setNavTop] = useState(() => {
    if (navRef.current) {
        return -navRef.current.offsetHeight + 50;
    }
    return -200; // fallback
  });
    */

  const collapseTimeoutRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 1400);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const collapseNav = (delay = 200) => {
    if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);

    collapseTimeoutRef.current = setTimeout(() => {
      const navElement = navRef.current;
      if (navElement) {
        const navHeight = navElement.offsetHeight;
        const targetTop = -navHeight + 50;
        setNavTop(targetTop);
      } else {
        setNavTop(-200);
      }
      collapseTimeoutRef.current = null;
    }, delay);
  };

  const expandNav = () => {
    if (collapseTimeoutRef.current) clearTimeout(collapseTimeoutRef.current);
    setNavTop(10);
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

  const navItems = [
    {
      icon: "/images/Icon_Theme1_controller.png",
      text: "Home",
      path: "/",
    },
    {
      icon: "/images/Icon_Theme1_controller.png",
      text: "Projects / Games",
      path: "/projects",
    },
    {
      icon: "/images/Icon_Theme1_rocket.png",
      text: "Change Log",
      path: "/changelog",
    },
    {
      icon: "/images/Icon_Theme1_radar.png",
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
    <NavWrapper
      ref={navRef}
      onMouseEnter={handleMouseEnterNav}
      onMouseLeave={handleMouseLeaveNav}
      animate={{ top: navTop }}
      //transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      transition={{ type: "tween", duration: 0.2, ease: "easeInOut" }}
    >
      {/* Top Buttons */}
      <TopCorners hide={collapsed}>
        {/* HOME ICON */}
        <CornerItem paddingTop={5} paddingLeft={25}></CornerItem>

        {/* THEME TOGGLE ICON */}
        <CornerItem paddingTop={5} paddingRight={25}>
          <ThemeHoverIcon
            src="/images/ToggleButton_Main.png"
            hoverSrc="/images/ToggleButton_ToggleBright.png"
            alt="Toggle Theme"
            scale={5}
            scaleHover={6}
            onClick={onThemeToggle}
            style={{
              position: "absolute",
              top: "40px",
              right: "70px",
              height: "auto",
            }}
          />
        </CornerItem>
      </TopCorners>

      {/* Main Nav */}
      <NavList>
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
                <img
                  src={item.icon}
                  alt={item.text}
                  style={{ width: "100%", height: "100%" }}
                />
              </NavIcon>
              <LinkText>{item.text}</LinkText>
            </NavLink>
          </NavItem>
        ))}
      </NavList>
    </NavWrapper>
  );
}

// Make sure this export is at the bottom
export default Nav;
