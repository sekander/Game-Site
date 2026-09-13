// src/pages/ProjectsGames.jsx
import { useResetKey } from "../hooks/useResetKey";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import StyledMain from "../styles/StyledMain";
import ContentContext from "../contexts/ContentContext";
import { Reveal, StaggerContainer } from "../components/Animations";
import { motion, AnimatePresence } from "framer-motion";

// ===== STYLED COMPONENTS =====

const Headline = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  @media (max-width: 1100px) {
    font-size: clamp(1.8rem, 5vw, 2rem);
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background || "#1a1a2e"};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }
`;

const CardImage = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface || "#2a2a4a"};
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;

  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    margin: 0 0 0.5rem 0;
    line-height: 1.3;
  }

  p {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    margin: 0 0 1rem 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  font-size: 0.65rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatusBadge = styled.span`
  font-size: 0.65rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: ${({ release }) =>
    release?.toLowerCase().includes("released")
      ? "rgba(74,157,106,0.2)"
      : "rgba(232,213,163,0.2)"};
  color: ${({ release }) =>
    release?.toLowerCase().includes("released") ? "#4a9d6a" : "#e8d5a3"};
  border: 1px solid
    ${({ release }) =>
      release?.toLowerCase().includes("released")
        ? "rgba(74,157,106,0.3)"
        : "rgba(232,213,163,0.3)"};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ===== MODAL STYLES =====

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background || "#1a1a2e"};
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  position: relative;
  cursor: default;
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(90deg);
  }
`;

// ===== MODAL NAVIGATION =====

const ModalNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
`;

const ModalNavButton = styled.button`
  background: none;
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: ${({ theme }) => theme.colors.primary || "#e8d5a3"}20;
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ModalNavDots = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ModalDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active, theme }) =>
    active
      ? theme.colors.primary || "#e8d5a3"
      : theme.colors.border || "rgba(255,255,255,0.2)"};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
  }
`;

const ModalPageTitle = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

// ===== MODAL PAGES =====

const ModalPage = styled(motion.div)`
  animation: fadeSlide 0.3s ease;

  @keyframes fadeSlide {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalImage = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.colors.surface || "#2a2a4a"};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalMetaItem = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  strong {
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    font-weight: 600;
  }
`;

const ModalDescription = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  margin-bottom: 1.5rem;

  p {
    margin: 0 0 1rem 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  ul {
    padding-left: 1.5rem;
    margin: 0.5rem 0 1rem 0;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const ModalTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ModalLink = styled.a`
  display: inline-block;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  color: ${({ theme }) => theme.colors.background || "#0a0e17"};
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232, 213, 163, 0.3);
  }
`;

// ===== TECHNICAL CONTENT STYLES =====

const TechnicalContent = styled.div`
  font-size: 1rem;
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text || "#8899aa"};

  h2,
  h3,
  h4 {
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h2 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.25rem;
  }
  h4 {
    font-size: 1.1rem;
  }

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0 1rem 0;
  }

  li {
    margin-bottom: 0.5rem;
  }

  pre,
  code {
    background: ${({ theme }) =>
      theme.colors.surface || "rgba(255,255,255,0.05)"};
    border-radius: 4px;
    padding: 0.2rem 0.4rem;
    font-family: monospace;
    font-size: 0.9rem;
  }

  pre {
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;

    th,
    td {
      border: 1px solid
        ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
      padding: 0.5rem 1rem;
      text-align: left;
    }

    th {
      background: ${({ theme }) =>
        theme.colors.surface || "rgba(255,255,255,0.05)"};
      color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    }
  }

  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    padding-left: 1rem;
    margin: 1rem 0;
    opacity: 0.8;
  }

  hr {
    border: none;
    border-top: 1px solid
      ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
    margin: 1.5rem 0;
  }
`;

// ===== GALLERY GRID STYLES =====

const GalleryGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }
`;

const GalleryImageCard = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: ${({ theme }) =>
    theme.colors.surface || "rgba(255,255,255,0.05)"};
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  aspect-ratio: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    z-index: 2;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const GalleryImageOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  //opacity: 0;
  // transition: opacity 0.3s ease;

  ${GalleryImageCard}:hover & {
    //   opacity: 1;
  }
`;

const GalleryImageTitle = styled.h4`
  font-size: 0.75rem;
  margin: 0;
  font-weight: 600;
`;

const GalleryImageDesc = styled.p`
  font-size: 0.65rem;
  margin: 0.15rem 0 0;
  opacity: 0.8;
`;

// ===== VIDEO GALLERY STYLES =====

const GalleryVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;

  ${GalleryImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const LightboxVideo = styled.video`
  max-width: 90vw;
  max-height: 85vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  background: #000;
  display: block;
  margin: 0 auto;
`;

const MediaBadge = styled.span`
  font-size: 0.55rem;
  background: ${({ type }) =>
    type === "gif" ? "rgba(232, 213, 163, 0.25)" : "rgba(74, 157, 106, 0.25)"};
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid
    ${({ type }) =>
      type === "gif" ? "rgba(232, 213, 163, 0.3)" : "rgba(74, 157, 106, 0.3)"};
  color: ${({ type }) => (type === "gif" ? "#e8d5a3" : "#4a9d6a")};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LightboxMediaBadge = styled.span`
  font-size: 0.65rem;
  background: ${({ type }) =>
    type === "gif" ? "rgba(232, 213, 163, 0.2)" : "rgba(74, 157, 106, 0.2)"};
  padding: 0.15rem 0.6rem;
  border-radius: 4px;
  border: 1px solid
    ${({ type }) =>
      type === "gif" ? "rgba(232, 213, 163, 0.3)" : "rgba(74, 157, 106, 0.3)"};
  color: ${({ type }) => (type === "gif" ? "#e8d5a3" : "#4a9d6a")};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ===== GIF Badge component =====
const GifBadge = styled.span`
  font-size: 0.55rem;
  background: rgba(232, 213, 163, 0.25);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(232, 213, 163, 0.3);
  color: #e8d5a3;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ===== Lightbox GIF Badge =====
const LightboxGifBadge = styled.span`
  font-size: 0.65rem;
  background: rgba(232, 213, 163, 0.2);
  padding: 0.15rem 0.6rem;
  border-radius: 4px;
  border: 1px solid rgba(232, 213, 163, 0.3);
  color: #e8d5a3;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// ===== LIGHTBOX STYLES =====

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
`;

const LightboxContent = styled(motion.div)`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const LightboxClose = styled.button`
  position: absolute;
  top: -40px;
  right: -40px;
  background: none;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
  z-index: 10;
  &:hover {
    transform: scale(1.2);
  }
  @media (max-width: 768px) {
    top: -50px;
    right: 0;
  }
`;

const LightboxInfo = styled.div`
  position: absolute;
  top: 20px;
  //bottom: -80px;
  left: 0;
  right: 0;
  color: white;
  text-align: center;
  padding: 0 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  pointer-events: none;

  h3 {
    margin: 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
  }

  p {
    margin: 0.5rem 0 0;
    opacity: 0.8;
    font-size: 0.95rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.5;
  }
`;

const LightboxNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  padding: 0 1rem;
`;

const LightboxNavButton = styled.button`
  pointer-events: all;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
`;

// ===== PLACEHOLDER PAGES =====

const TechnicalPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: ${({ theme }) =>
    theme.colors.surface || "rgba(255,255,255,0.03)"};
  border-radius: 12px;
  border: 2px dashed
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  padding: 2rem;
  text-align: center;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.4;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    font-size: 1.2rem;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text || "#667a8a"};
    font-size: 0.9rem;
    margin: 0;
    opacity: 0.6;
  }
`;

const GalleryCount = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  opacity: 0.7;
  margin-left: 0.5rem;
`;

// ===== COMPONENT =====

export default function ProjectsGames() {
  const resetKey = useResetKey();
  const content = useContext(ContentContext);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Lightbox state
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);

  // ===== Helper function to detect if a URL is a GIF =====
  const isGifUrl = (url) => {
    if (!url) return false;
    return url.toLowerCase().endsWith(".gif");
  };

  const isVideoUrl = (url) => {
    if (!url) return false;
    // Only support MP4 for now
    return url.toLowerCase().endsWith(".mp4");
  };

  const getMediaType = (url) => {
    if (isGifUrl(url)) return "gif";
    if (isVideoUrl(url)) return "video";
    return "image";
  };

  // ===== MEDIA RENDER COMPONENT =====
  const GalleryMedia = ({
    src,
    alt,
    className,
    autoPlay = false,
    muted = true,
    loop = true,
  }) => {
    const mediaType = getMediaType(src);

    if (mediaType === "video") {
      return (
        <GalleryVideo
          className={className}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          playsInline
          preload="metadata"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </GalleryVideo>
      );
    }

    // GIF or still image
    return <img className={className} src={src} alt={alt} />;
  };

  // ===== BUILD PROJECTS FROM WORDPRESS CONTENT =====
  const buildProjects = () => {
    const projectsContent = content?.projectsGames || {};

    // Try to parse JSON from projects_json field
    if (projectsContent.projects_json) {
      try {
        const parsedProjects = JSON.parse(projectsContent.projects_json);

        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          const mappedProjects = parsedProjects.map((project, index) => ({
            id: index + 1,
            title: project.title || "Project",
            link: project.link || "#",
            description: project.description || "",
            fullDescription:
              project.fullDescription || project.description || "",
            genre: project.genre || "",
            platform: project.platform || "",
            release: project.release || "",
            image: {
              main: project.image?.main || project.image || "",
              title: project.image?.title || "",
            },
            showImage: project.showImage !== false,
            tags: project.tags || [],
            gallery: (project.gallery || []).map((g) => ({
              ...g,
              isGif: isGifUrl(g.src),
              isVideo: isVideoUrl(g.src),
              mediaType: getMediaType(g.src),
            })),
            technical: project.technical || "",
          }));

          return mappedProjects;
        }
      } catch (e) {
        console.error("❌ Error parsing projects JSON:", e);
      }
    }

    // Fallback hardcoded projects if no JSON
    return [
      {
        id: 1,
        title: "Multi-Player Space Shooter",
        link: "#",
        description: "Thrilling Unity multiplayer game with powerups",
        fullDescription: `<p><strong>Multi-Player Space Shooter</strong> is a thrilling game built using Unity that allows players to engage in fast-paced space battles.</p>`,
        genre: "Action · Multiplayer · Shooter",
        platform: "PC, Mobile",
        release: "2024",
        image: {
          main: "/images/space-shooter.jpg",
        },
        showImage: true,
        tags: ["Unity", "Multiplayer", "Space Shooter"],
        gallery: [],
        technical:
          "<h3>Engine</h3><p>Built with Unity 2022.3 LTS</p><h3>Platforms</h3><ul><li>Windows PC</li><li>Android</li><li>iOS</li></ul><h3>Key Technologies</h3><ul><li>Unity Netcode for GameObjects</li><li>Input System Package</li><li>Universal Render Pipeline</li></ul>",
      },
      {
        id: 2,
        title: "Contra Remix",
        link: "#",
        description: "Side-scrolling action with AI",
        fullDescription: `<p><strong>Contra Remix</strong> is a side-scrolling game with AI.</p>`,
        genre: "Platformer · Action · AI",
        platform: "PC",
        release: "2024",
        image: {
          main: "/images/contra-remix.jpg",
        },
        showImage: true,
        tags: ["Godot", "Platformer", "Multiplayer", "AI"],
        gallery: [],
        technical:
          "<h3>Engine</h3><p>Built with Godot 4.2</p><h3>Features</h3><ul><li>State Machine AI</li><li>Split-screen multiplayer</li><li>Dynamic difficulty scaling</li></ul>",
      },
      {
        id: 3,
        title: "Colour Memory Master",
        link: "#",
        description: "Puzzle game on Google Play",
        fullDescription: `<p><strong>Colour Memory Master</strong> is a puzzle game on Google Play.</p>`,
        genre: "Puzzle · Memory",
        platform: "Android, Desktop, HTML5",
        release: "2024",
        image: {
          main: "/images/color-memory.jpg",
        },
        showImage: true,
        tags: ["Java", "LIBGDX", "Puzzle", "Android"],
        gallery: [],
        technical:
          "<h3>Framework</h3><p>Built with LIBGDX</p><h3>Platforms</h3><ul><li>Android (Google Play)</li><li>Desktop (Windows, Mac, Linux)</li><li>HTML5 (WebGL)</li></ul><h3>Features</h3><ul><li>Multi-threading for pattern generation</li><li>AdMob integration</li><li>High score tracking</li></ul>",
      },
    ];
  };

  const projects = buildProjects();
  const totalPages = 3;
  const pageNames = ["Overview", "Gallery", "Technical"];

  const openModal = (project) => {
    setSelectedProject(project);
    setCurrentPage(0);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
    setTimeout(() => setSelectedProject(null), 300);
  };

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Lightbox functions
  const openLightbox = (image, index) => {
    setSelectedGalleryImage(image);
    setCurrentGalleryIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedGalleryImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateLightbox = (direction) => {
    const projectGallery = selectedProject?.gallery || [];
    if (projectGallery.length === 0) return;
    const newIndex =
      (currentGalleryIndex + direction + projectGallery.length) %
      projectGallery.length;
    setCurrentGalleryIndex(newIndex);
    setSelectedGalleryImage(projectGallery[newIndex]);
  };

  const extractTags = (project) => {
    return project.tags || [];
  };

  const renderPageContent = (project, page) => {
    const projectGallery = project.gallery || [];

    switch (page) {
      case 0: // Overview
        return (
          <ModalPage>
            {project.showImage && project.image?.main && (
              <ModalImage>
                <img src={project.image.main} alt={project.title} />
              </ModalImage>
            )}
            {!project.showImage && (
              <ModalImage
                style={{
                  background: "linear-gradient(135deg, #2a2a4a, #1a1a2e)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "6rem", opacity: 0.2 }}>🎮</span>
              </ModalImage>
            )}

            <ModalTitle>{project.title}</ModalTitle>

            <ModalMeta>
              {project.release && (
                <ModalMetaItem>
                  <strong>Release:</strong> {project.release}
                </ModalMetaItem>
              )}
              {project.genre && (
                <ModalMetaItem>
                  <strong>Genre:</strong> {project.genre}
                </ModalMetaItem>
              )}
              {project.platform && (
                <ModalMetaItem>
                  <strong>Platform:</strong> {project.platform}
                </ModalMetaItem>
              )}
            </ModalMeta>

            <ModalTags>
              {extractTags(project).map((tag, i) => (
                <Tag key={i}>{tag}</Tag>
              ))}
              {project.release && (
                <StatusBadge release={project.release}>
                  {project.release}
                </StatusBadge>
              )}
            </ModalTags>

            <ModalDescription
              dangerouslySetInnerHTML={{
                __html: project.fullDescription || project.description,
              }}
            />

            {project.link && project.link !== "#" && (
              <ModalLink
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {project.link.includes("steam")
                  ? "View on Steam →"
                  : "Learn More →"}
              </ModalLink>
            )}
          </ModalPage>
        );

      case 1: // Gallery
        return (
          <ModalPage>
            <h3
              style={{
                color: "#e8d5a3",
                marginBottom: "1rem",
                fontSize: "1.2rem",
              }}
            >
              Gallery
              {projectGallery.length > 0 && (
                <GalleryCount>({projectGallery.length} images)</GalleryCount>
              )}
            </h3>
            {projectGallery.length === 0 ? (
              <TechnicalPlaceholder>
                <div className="icon">🖼️</div>
                <h3>No Gallery Images</h3>
                <p>Gallery images coming soon...</p>
              </TechnicalPlaceholder>
            ) : (
              <GalleryGridContainer>
                {projectGallery.map((image, index) => (
                  <GalleryImageCard
                    key={image.id || index}
                    onClick={() => openLightbox(image, index)}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GalleryMedia
                      src={image.src}
                      alt={image.title}
                      autoPlay={true}
                      muted={true}
                      loop={true}
                    />
                    <GalleryImageOverlay>
                      <GalleryImageTitle>
                        {image.title}
                        {image.mediaType === "gif" && (
                          <MediaBadge type="gif">GIF</MediaBadge>
                        )}
                        {image.mediaType === "video" && (
                          <MediaBadge type="video">VIDEO</MediaBadge>
                        )}
                      </GalleryImageTitle>
                      <GalleryImageDesc>{image.description}</GalleryImageDesc>
                    </GalleryImageOverlay>
                  </GalleryImageCard>
                ))}
              </GalleryGridContainer>
            )}
          </ModalPage>
        );

      case 2: // Technical - Now pulls from JSON with HTML support
        return (
          <ModalPage>
            <h3
              style={{
                color: "#e8d5a3",
                marginBottom: "1rem",
                fontSize: "1.2rem",
              }}
            >
              Technical Details
            </h3>
            {project.technical ? (
              <TechnicalContent
                dangerouslySetInnerHTML={{ __html: project.technical }}
              />
            ) : (
              <TechnicalPlaceholder>
                <div className="icon">⚙️</div>
                <h3>No Technical Details</h3>
                <p>Technical information coming soon...</p>
              </TechnicalPlaceholder>
            )}
          </ModalPage>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <StyledMain>
        <br />
        <br />
        <Reveal direction="up" delay={0} resetKey={resetKey}>
          <Headline>Projects / Games</Headline>
        </Reveal>

        <StaggerContainer delayChildren={0.06} resetKey={resetKey}>
          <CardGrid>
            {projects.map((project, index) => (
              <Card
                key={project.id || index}
                onClick={() => openModal(project)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {project.showImage && project.image?.main && (
                  <CardImage>
                    <img src={project.image.main} alt={project.title} />
                  </CardImage>
                )}
                {!project.showImage && (
                  <CardImage
                    style={{
                      background: "linear-gradient(135deg, #2a2a4a, #1a1a2e)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "4rem", opacity: 0.3 }}>🎮</span>
                  </CardImage>
                )}
                <CardContent>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <CardTags>
                    <StatusBadge release={project.release}>
                      {project.release}
                    </StatusBadge>
                    {extractTags(project)
                      .slice(0, 2)
                      .map((tag, i) => (
                        <Tag key={i}>{tag}</Tag>
                      ))}
                  </CardTags>
                </CardContent>
              </Card>
            ))}
          </CardGrid>
        </StaggerContainer>
      </StyledMain>

      {/* ===== MAIN MODAL ===== */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalClose onClick={closeModal}>✕</ModalClose>

              {/* Navigation */}
              <ModalNav>
                <ModalNavButton onClick={prevPage} disabled={currentPage === 0}>
                  ← Back
                </ModalNavButton>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <ModalPageTitle>{pageNames[currentPage]}</ModalPageTitle>
                  <ModalNavDots>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <ModalDot
                        key={i}
                        active={i === currentPage}
                        onClick={() => goToPage(i)}
                      />
                    ))}
                  </ModalNavDots>
                </div>

                <ModalNavButton
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1}
                >
                  Next →
                </ModalNavButton>
              </ModalNav>

              {/* Page Content */}
              {renderPageContent(selectedProject, currentPage)}
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ===== LIGHTBOX (for gallery image click) ===== */}
      <AnimatePresence>
        {selectedGalleryImage && (
          <LightboxOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <LightboxContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <LightboxClose onClick={closeLightbox}>✕</LightboxClose>

              {/* Video or Image */}
              {selectedGalleryImage.mediaType === "video" ? (
                <LightboxVideo
                  controls
                  autoPlay
                  loop
                  muted={false}
                  playsInline
                  preload="metadata"
                  key={selectedGalleryImage.src}
                >
                  <source src={selectedGalleryImage.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </LightboxVideo>
              ) : (
                <LightboxImage
                  src={selectedGalleryImage.src}
                  alt={selectedGalleryImage.title}
                />
              )}

              <LightboxInfo>
                <h3>
                  {selectedGalleryImage.title}
                  {selectedGalleryImage.mediaType === "gif" && (
                    <LightboxMediaBadge
                      type="gif"
                      style={{ marginLeft: "8px" }}
                    >
                      GIF
                    </LightboxMediaBadge>
                  )}
                  {selectedGalleryImage.mediaType === "video" && (
                    <LightboxMediaBadge
                      type="video"
                      style={{ marginLeft: "8px" }}
                    >
                      VIDEO
                    </LightboxMediaBadge>
                  )}
                </h3>
                {selectedGalleryImage.description && (
                  <p>{selectedGalleryImage.description}</p>
                )}
              </LightboxInfo>
              <LightboxNav>
                <LightboxNavButton onClick={() => navigateLightbox(-1)}>
                  ‹
                </LightboxNavButton>
                <LightboxNavButton onClick={() => navigateLightbox(1)}>
                  ›
                </LightboxNavButton>
              </LightboxNav>
            </LightboxContent>
          </LightboxOverlay>
        )}
      </AnimatePresence>

      <style>{`
        /* Scrollbar styling for modal */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: rgba(232,213,163,0.3);
          border-radius: 10px;
        }
        .modal-content::-webkit-scrollbar-thumb:hover {
          background: rgba(232,213,163,0.5);
        }
      `}</style>
    </>
  );
}
