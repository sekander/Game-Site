// src/pages/Home.jsx - FULLY OPTIMIZED FOR MOBILE
import { useResetKey } from "../hooks/useResetKey";
import React, { useEffect, useContext, useState, useRef } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { resetAnimations } from "../utils/scrollAnimations";
import ContentContext from "../contexts/ContentContext";
import { Reveal, StaggerContainer } from "../components/Animations";
import { motion, AnimatePresence } from "framer-motion";

// ===== SLIDESHOW STYLES - MOBILE OPTIMIZED =====

const SlideshowContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  background: #0a0e17;
  aspect-ratio: 16/9;
  min-height: 250px;
  max-height: 80vh;

  @media (max-width: 768px) {
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    max-height: 70vh;
    min-height: 200px;
    aspect-ratio: 16/10;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    max-height: 60vh;
    min-height: 180px;
    aspect-ratio: 16/11;
  }
`;

const SlideshowSlide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  img {
    background: #1a1a2e;
  }

  video {
    background: #0a0e17;
  }
`;

const SlideshowOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  text-align: left;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const SlideshowTitle = styled.h3`
  font-size: clamp(1rem, 2vw, 1.2rem);
  margin: 0 0 0.25rem 0;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.15rem;
  }
`;

const SlideshowDescription = styled.p`
  font-size: clamp(0.8rem, 1.5vw, 0.9rem);
  margin: 0;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 0.7rem;
    -webkit-line-clamp: 1;
  }
`;

const SlideshowDots = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;

  @media (max-width: 480px) {
    bottom: 0.5rem;
    gap: 0.35rem;
  }
`;

const SlideshowDot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${({ active }) => (active ? "#e8d5a3" : "rgba(255,255,255,0.3)")};
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    transform: scale(1.2);
    background: ${({ active }) =>
      active ? "#e8d5a3" : "rgba(255,255,255,0.6)"};
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 480px) {
    width: 8px;
    height: 8px;
  }
`;

const SlideshowNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 0.5rem;
  pointer-events: none;
  z-index: 10;

  @media (max-width: 480px) {
    padding: 0 0.25rem;
  }
`;

const SlideshowNavButton = styled.button`
  pointer-events: all;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
`;

const VideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e, #2a2a4a);
  color: #e8d5a3;
  font-size: 3rem;
  gap: 0.5rem;

  span {
    font-size: 0.9rem;
    opacity: 0.6;
    letter-spacing: 0.1em;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
    span {
      font-size: 0.7rem;
    }
  }
`;

// ===== HERO SECTION STYLES - MOBILE OPTIMIZED =====

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.colors.primary}15,
    ${(props) => props.theme.colors.secondary}15
  );

  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: auto;
    padding-top: 80px;
    padding-bottom: 2rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    padding-top: 70px;
    padding-bottom: 1.5rem;
  }
`;

const MainContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 2rem 4rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 3rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.75rem 2rem;
  }
`;

const ContentHeader = styled.div`
  height: 60px;
  background-image: url("/images/Framing_Angle01_Main.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 10;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    height: 45px;
    background-position: center;
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    height: 35px;
    margin-bottom: 0.5rem;
  }
`;

const Headline = styled.h2`
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 5vw, 1.8rem);
    margin-bottom: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.2rem, 6vw, 1.5rem);
    margin-bottom: 0.5rem;
  }
`;

const TextBlock = styled.div`
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
  }
`;

const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  line-height: 1.8;
  font-size: clamp(0.95rem, 1.5vw, 1.05rem);
  color: ${({ theme }) => theme.colors.text};
  margin-top: 0.5rem;
  max-width: 880px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    gap: 1.25rem;
    line-height: 1.7;
    font-size: clamp(0.9rem, 2vw, 0.95rem);
    margin-top: 0.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    line-height: 1.6;
    font-size: clamp(0.85rem, 2.5vw, 0.9rem);
  }
`;

const AboutSubSection = styled.div`
  padding: 1.25rem 1.25rem;
  background: ${({ theme }) => theme.colors.surface || "rgba(255,255,255,0.03)"};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  transition: all 0.3s ease;

  h3 {
    font-size: clamp(1.2rem, 2vw, 1.4rem);
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 10px;

    h3 {
      font-size: clamp(1rem, 2.5vw, 1.2rem);
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 8px;

    h3 {
      font-size: clamp(0.9rem, 3vw, 1rem);
      margin-bottom: 0.3rem;
    }
  }
`;

// ===== COMPONENT =====

export default function Home() {
  const resetKey = useResetKey();
  const location = useLocation();
  const content = useContext(ContentContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const videoRefs = useRef({});
  const slideInterval = useRef(null);

  // Detect mobile for touch handling
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ===== BUILD SLIDES FROM WORDPRESS CONTENT =====
  const buildSlides = () => {
    const slidesData = [];
    const homeContent = content?.home || {};

    if (homeContent.slides_json) {
      try {
        const parsedSlides = JSON.parse(homeContent.slides_json);
        if (Array.isArray(parsedSlides) && parsedSlides.length > 0) {
          return parsedSlides.map((slide, index) => ({
            id: index + 1,
            type: slide.type || "image",
            src: slide.src || slide.image || "",
            title: slide.title || "Slide",
            description: slide.description || slide.desc || "",
          }));
        }
      } catch (e) {
        console.error("Error parsing slides JSON:", e);
      }
    }

    const projects = content?.projectsGames?.projects || [];
    if (projects && projects.length > 0) {
      projects.forEach((project, index) => {
        if (project.hideFromSlideshow) return;
        const imageUrl = project.image?.main || project.image || "";
        if (imageUrl) {
          slidesData.push({
            id: index + 1,
            type: "image",
            src: imageUrl,
            title: project.title || "Project",
            description: project.description || "",
          });
        }
      });
    }

    if (slidesData.length === 0) {
      slidesData.push({
        id: 1,
        type: "image",
        src: "https://via.placeholder.com/900x506/1a1a2e/e8d5a3?text=Welcome",
        title: "Welcome",
        description: "Check out my latest projects and games.",
      });
    }

    return slidesData;
  };

  const slides = buildSlides();

  // ===== SLIDESHOW LOGIC =====

  const goToSlide = (index) => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video && !video.paused) {
        video.pause();
      }
    });

    setVideoError(false);
    setIsVideoPlaying(false);
    setCurrentSlide(index);

    const slide = slides[index];
    if (slide && slide.type === "video" && videoRefs.current[index]) {
      videoRefs.current[index].play().catch(() => {
        setVideoError(true);
      });
    }
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    goToSlide((currentSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  // Handle touch events for mobile
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  useEffect(() => {
    clearInterval(slideInterval.current);

    const currentSlideData = slides[currentSlide];
    const isVideo = currentSlideData?.type === "video";

    if (isPlaying && slides.length > 1 && !isVideo) {
      // Longer interval for mobile
      const interval = isMobile ? 6000 : 5000;
      slideInterval.current = setInterval(nextSlide, interval);
    }
    return () => clearInterval(slideInterval.current);
  }, [currentSlide, isPlaying, slides.length, isMobile]);

  const handleMouseEnter = () => setIsPlaying(false);
  const handleMouseLeave = () => setIsPlaying(true);

  const handleVideoEnd = (index) => {
    if (index === currentSlide) {
      setIsVideoPlaying(false);
      setTimeout(nextSlide, 1000);
    }
  };

  // ===== CONTENT LOGIC =====

  useEffect(() => {
    resetAnimations();
    const timer = setTimeout(() => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-up,.fade-in-down,.fade-in-left,.fade-in-right",
      );
      animatedElements.forEach((el, i) =>
        setTimeout(() => el.classList.add("animate"), i * 90),
      );
    }, 100);
    return () => clearTimeout(timer);
  }, [location.key]);

  useEffect(() => {
    const forceVisibility = () => {
      const elements = document.querySelectorAll(
        ".fade-in-up,.fade-in-down,.fade-in-left,.fade-in-right",
      );
      elements.forEach((el) => {
        el.style.opacity = "1";
        el.style.visibility = "visible";
      });
    };
    forceVisibility();
    const timer = setTimeout(forceVisibility, 500);
    return () => clearTimeout(timer);
  }, [location.key]);

  const getField = (section, key, fallbackSection) => {
    const value = content?.[section]?.[key];
    return value === undefined || value === null || value === ""
      ? fallbackSection[key]
      : value;
  };

  const fallbackContent = {
    about: {
      about_title: "About Nahid Sekander",
      section_1_title: "My Values",
      section_1_content:
        "I believe in creating games that are not only fun but also meaningful. Quality, integrity, and continuous growth are at the core of everything I do. I value collaboration, clean code, and building experiences that leave a lasting impression on players.",
      section_2_title: "My Expertise",
      section_2_content:
        "With a strong foundation in game development and programming, my expertise spans across multiple disciplines. I have professional experience with Unity and Godot engines, as well as deep knowledge in custom engine development with Vulkan. I specialize in multiplayer networking, AI programming, cross-platform development, and performance optimization.",
    },
  };

  const aboutTitle = getField("about", "about_title", fallbackContent.about);
  const section1Title = getField("about", "section_1_title", fallbackContent.about);
  const section1Content = getField("about", "section_1_content", fallbackContent.about);
  const section2Title = getField("about", "section_2_title", fallbackContent.about);
  const section2Content = getField("about", "section_2_content", fallbackContent.about);

  if (slides.length === 0) {
    return (
      <HeroSection>
        <p style={{ color: '#8899aa' }}>Loading slides...</p>
      </HeroSection>
    );
  }

  return (
    <>
      <HeroSection className="parallax-section">
        <Reveal
          direction="up"
          delay={0}
          resetKey={resetKey}
          style={{ width: "100%", maxWidth: "900px", padding: isMobile ? "0 0.5rem" : "0" }}
        >
          <SlideshowContainer
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false}>
              {slides.map(
                (slide, index) =>
                  index === currentSlide && (
                    <SlideshowSlide
                      key={slide.id}
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {slide.type === "video" ? (
                        <>
                          {!videoError ? (
                            <video
                              ref={(el) => (videoRefs.current[index] = el)}
                              src={slide.src}
                              muted
                              playsInline
                              autoPlay={index === currentSlide}
                              onEnded={() => handleVideoEnd(index)}
                              onError={() => setVideoError(true)}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <VideoPlaceholder>
                              🎬
                              <span>Video unavailable</span>
                            </VideoPlaceholder>
                          )}
                        </>
                      ) : (
                        <img
                          src={slide.src}
                          alt={slide.title}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/900x506/1a1a2e/e8d5a3?text=Image+Not+Found";
                          }}
                        />
                      )}

                      <SlideshowOverlay>
                        <SlideshowTitle>{slide.title}</SlideshowTitle>
                        <SlideshowDescription>
                          {slide.description}
                        </SlideshowDescription>
                      </SlideshowOverlay>
                    </SlideshowSlide>
                  ),
              )}
            </AnimatePresence>

            <SlideshowDots>
              {slides.map((_, index) => (
                <SlideshowDot
                  key={index}
                  active={index === currentSlide}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </SlideshowDots>

            <SlideshowNav>
              <SlideshowNavButton onClick={prevSlide} aria-label="Previous slide">
                ‹
              </SlideshowNavButton>
              <SlideshowNavButton onClick={nextSlide} aria-label="Next slide">
                ›
              </SlideshowNavButton>
            </SlideshowNav>
          </SlideshowContainer>
        </Reveal>
      </HeroSection>

      <MainContainer>
        <ContentHeader />

        <Reveal direction="up" delay={0.1} resetKey={resetKey}>
          <TextBlock className="fade-in-up animate-on-enter">
            <Headline>{aboutTitle}</Headline>
          </TextBlock>
        </Reveal>

        <StaggerContainer delayChildren={0.1} resetKey={resetKey}>
          <AboutWrapper>
            {section1Title && (
              <AboutSubSection>
                <h3>{section1Title}</h3>
                <p>{section1Content}</p>
              </AboutSubSection>
            )}
            {section2Title && (
              <AboutSubSection>
                <h3>{section2Title}</h3>
                <p>{section2Content}</p>
              </AboutSubSection>
            )}
          </AboutWrapper>
        </StaggerContainer>
      </MainContainer>
    </>
  );
}
