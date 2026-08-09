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

// This is a new style guide
// This is a new template
const NewTemplate = styled.div`
  position: relative;
  width: 80%;
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color
   ${({ theme }) => theme.colors.background};
   box-shadow: 0 4px 8
   px rgba(0, 0, 0
   0.1);
   border-radius: 8px;
   box-shadow
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
  background-color: rgba(0, 0, 0, 0.9); /* black with 60% opacity */
  padding: 2rem; /* spacing around content */
  border-radius: 8px; /* optional rounded corners */
  margin: 2rem auto; /* center the box horizontally */
  max-width: 1200px; /* optional: limit width */
  min-height: 80vh; /* optional: ensure some height */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* optional: subtle shadow */
`;

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

  // Create a new loading verification function
  const verifyLoading = () => {
    if (isLoading) {
      return (
        <LoadingScreen>
          <LoadingSpinner />
          <LoadingText>Loading...</LoadingText>
        </LoadingScreen>
      );
    }
    return null;
  };

  // Initialize scroll animations ONCE
  //
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        // Scroll is initialized once
        initScrollAnimationsOnce();
        //console.log("Scroll animations initialized once");
        console.log(`Current init count: ${getScrollAnimationInitCount()}`);
      }, 50);
    }
  }, [isLoading]);

  // Theme toggle function
  const toggleTheme = () => {
    setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % themes.length);
  };

  // Main content rendering

  if (isLoading) {
    return (
      <ThemeProvider theme={themes[currentThemeIndex]}>
        <LoadingScreen>
          <LoadingSpinner />
          <LoadingText>Loading Threeclipse...</LoadingText>
        </LoadingScreen>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={themes[currentThemeIndex]}>
      <GlobalStyles />
      <ContentContext.Provider value={content}>
        {/*<HeroVideoWrapper>*/}
        <div
          style={{
            backgroundImage: "url('/images/background.png')",
            backgroundSize: "contain",
            minHeight: "100vh",
          }}
        >
          <Router>
            {/* Menu Components */}
            {/* <Nav onThemeToggle={toggleTheme} /> */}
            {/* <NavMenu />


                  */}
            <ResponsiveNav onThemeToggle={toggleTheme} />

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
        {/* </HeroVideoWrapper> */}
      </ContentContext.Provider>
    </ThemeProvider>
  );
}
