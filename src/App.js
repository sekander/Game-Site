import React, { useState, useEffect, useRef } from "react";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import styled, { createGlobalStyle } from "styled-components";

// Components
import Nav from "./components/Nav";
import NavMenu from "./components/NavMenu";
import ResponsiveNav from "./components/ResponsiveNav";
import Footer from "./components/Footer";
import HeroVideoWrapper from "./components/HeroVideoWrapper";
import ScrollToTop from "./components/ScrollToTop";
import ParticlesBg from "particles-bg";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import ChangeLog from "./pages/ChangeLog";
import ContactUs from "./pages/ContactUs";
import FAQ from "./components/Faq";
import ProjectsGames from "./pages/ProjectsGames";
import PrivacyNotice from "./pages/PrivacyPolicy";

// Context
import ContentContext from "./contexts/ContentContext";

// Themes
import {
  originalTheme,
  retroArcadeTheme,
  adventureQuestTheme,
  cyberpunkGlitchTheme,
} from "./themes";

// Scroll Animations
//import { initScrollAnimationsOnce } from "./utils/scrollAnimations";
import {
  initScrollAnimationsOnce,
  getScrollAnimationInitCount,
} from "./utils/scrollAnimations";

// *** START OF GLOBAL CSS FIXES ***
const GlobalStyles = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
  }

  body {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    font-family: ${({ theme }) => theme.fonts.body};
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  p, h1, h2, h3, h4, h5, h6, span, div {
    word-break: break-word;
  }

  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none;
  }   

  a:hover {
    text-decoration: underline;
  }

  .fade-in-up,
  .fade-in-down,
  .fade-in-left,
  .fade-in-right,
  .scale-in,
  .section-fade,
  .animate-on-enter {
    opacity: 1 !important;
    visibility: visible !important;
  }

  .fade-in-up { transform: translateY(30px); }
  .fade-in-down { transform: translateY(-30px); }
  .fade-in-left { transform: translateX(-50px); }
  .fade-in-right { transform: translateX(50px); }
  .scale-in { transform: scale(0.9); }
  .section-fade { transform: translateY(50px); }

  .fade-in-up.animate,
  .fade-in-down.animate,
  .fade-in-left.animate,
  .fade-in-right.animate,
  .scale-in.animate,
  .section-fade.animate,
  .animate-on-enter.animate {
    opacity: 1;
    transform: none;
  }

  .stagger-delay-1 { transition-delay: 0.1s; }
  .stagger-delay-2 { transition-delay: 0.2s; }
  .stagger-delay-3 { transition-delay: 0.3s; }
  .stagger-delay-4 { transition-delay: 0.4s; }
  .stagger-delay-5 { transition-delay: 0.5s; }


    
      /* ===== NEON SCROLLBAR ===== */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.background};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neonPrimary};
    border-radius: 4px;
    box-shadow: 
      0 0 15px ${({ theme }) => theme.colors.neonPrimary},
      0 0 30px ${({ theme }) => theme.colors.neonSecondary};
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    box-shadow: 
      0 0 25px ${({ theme }) => theme.colors.neonPrimary},
      0 0 50px ${({ theme }) => theme.colors.neonSecondary};
    transform: scale(1.1);
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.neonPrimary} ${({ theme }) => theme.colors.background};
  }

  /* ✅ FIX: Make particles container fixed and full viewport */
  .particles-bg-canvas-wrapper {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    pointer-events: none !important;
    z-index: 0 !important;
    overflow: visible !important;
  }

  /* ✅ Ensure canvas inside particles-bg is full size */
  .particles-bg-canvas-wrapper canvas {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
    pointer-events: none !important;
  }

  /* ===== FIX: Remove inner scrollbars from accordion ===== */
  .accordion-content::-webkit-scrollbar,
  .changelog-content::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  .accordion-content,
  .changelog-content {
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    overflow: visible !important;
    max-height: none !important;
  }

  .accordion-item {
    overflow: visible !important;
  }

  .accordion-body {
    overflow: visible !important;
    max-height: none !important;
  }

  .modal-content::-webkit-scrollbar {
    width: 4px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.neonPrimary || "#e8d5a3"};
    border-radius: 4px;
  }

  .modal-content {
    scrollbar-width: thin;
  }

  .project-card,
  .project-card *,
  .accordion-item * {
    overflow: visible !important;
  }
`;
// *** END OF GLOBAL CSS FIXES ***

// Loading Screen
const LoadingScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  margin-top: 20px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const PageContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem auto;
  max-width: 1200px;
  min-height: 80vh;
  position: relative;
  z-index: 1;
  backdrop-filter: blur(10px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 1rem auto;
  }
`;

// ✅ Move particles OUTSIDE PageContainer - wrap in a fixed container
const ParticlesWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
`;

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

const createParticleConfig = (image, rowIndex) => {
  // Each row gets a different speed based on its index
  const speeds = [
    [0.5, 0.8], // Row 0 - slow
    [1.0, 1.3], // Row 1 - medium
    [1.5, 1.8], // Row 2 - fast
    [0.8, 1.1], // Row 3 - medium-slow
    [1.8, 2.1], // Row 4 - fastest
    [0.3, 0.6], // Row 5 - slowest
    [1.2, 1.5], // Row 6 - medium-fast
    [0.7, 1.0], // Row 7 - medium-slow
  ];

  const speed = speeds[rowIndex % speeds.length];

  // Different diagonal angles for variety
  const angles = [
    [20, 25],
    [25, 30],
    [30, 35],
    [15, 20],
    [35, 40],
    [22, 27],
    [28, 33],
    [18, 23],
  ];

  const angle = angles[rowIndex % angles.length];

  return {
    num: [1, 1], // More particles per row
    radius: [1, 1], // Fixed size - no growth
    v: speed, // Different speed per row
    tha: angle, // Diagonal angle per row
    alpha: [0.5, 0.5], // Fixed opacity - no fading
    scale: [0.1, 0.1], // Fixed scale - no shrinking/growth
    position: "all",
    body: image,
    cross: "bround",
    random: 0, // No randomness for clean rows
    color: ["#ffffff"],
  };
};

export default function App() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState({
    home: null,
    about: null,
    careers: null,
    gallery: null,
    projectsGames: null,
    coreTeam: null,
    ourPillars: null,
    contactUs: null,
    privacyNotice: null,
    footer: null,
  });

  const themes = [
    originalTheme,
    retroArcadeTheme,
    adventureQuestTheme,
    cyberpunkGlitchTheme,
  ];
  const scrollContainerRef = useRef(null);

  // Check if device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch local JSON content
  useEffect(() => {
    const fetchLocalContent = async () => {
      try {
        document.title = "FnkyG4m3z";
        console.log("Using local json");
        const res = await fetch("/content.json");
        if (!res.ok) throw new Error("Failed to fetch local content.json");
        const data = await res.json();
        setContent(data);
        localStorage.setItem("siteContent", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocalContent();
  }, []);

  // Initialize scroll animations ONCE
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        initScrollAnimationsOnce();
        console.log(`Current init count: ${getScrollAnimationInitCount()}`);
      }, 50);
    }
  }, [isLoading]);

  // Theme toggle function
  const toggleTheme = () => {
    setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={themes[currentThemeIndex]}>
        <LoadingScreen>
          <LoadingSpinner />
          <LoadingText>Loading FnkyG4m3z...</LoadingText>
        </LoadingScreen>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={themes[currentThemeIndex]}>
      <GlobalStyles />
      <ContentContext.Provider value={content}>
        <div
          style={{
            backgroundSize: "contain",
            minHeight: "100vh",
            position: "relative",
          }}
        >
          <Router>
            {/* Menu Components */}
            <ResponsiveNav onThemeToggle={toggleTheme} />

            {/* ✅ PARTICLES - DISABLED ON MOBILE */}
            {!isMobile && (
              <ParticlesWrapper>
                {bgImages.map((image, index) => (
                  <ParticlesBg
                    key={index}
                    type="custom"
                    config={createParticleConfig(image, index)}
                    bg={true}
                  />
                ))}
              </ParticlesWrapper>
            )}

            <PageContainer>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/projects" element={<ProjectsGames />} />
                <Route path="/changelog" element={<ChangeLog />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route
                  path="/projects/dynagun"
                  element={<h2>Dynagun Game Page</h2>}
                />
                <Route
                  path="/projects/yes-no-goodbye"
                  element={<h2>Yes, No, Goodbye Game Page</h2>}
                />
                <Route path="/privacy-notice" element={<PrivacyNotice />} />
              </Routes>
            </PageContainer>

            <Footer />
          </Router>
        </div>
      </ContentContext.Provider>
    </ThemeProvider>
  );
}
