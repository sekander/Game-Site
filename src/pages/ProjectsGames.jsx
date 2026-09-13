// src/pages/ProjectsGames.jsx - MODAL WITH MOBILE STATIC THUMBNAILS
import { useResetKey } from "../hooks/useResetKey";
import React, { useContext, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import StyledMain from "../styles/StyledMain";
import ContentContext from "../contexts/ContentContext";
import { Reveal, StaggerContainer } from "../components/Animations";
import { motion, AnimatePresence } from "framer-motion";

// ============================================
// STYLED COMPONENTS
// ============================================

const Headline = styled.h2`
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 6vw, 1.8rem);
    margin-bottom: 1rem;
  }
`;

const ScrollBackground = styled.div`
  background: rgb(26, 10, 46);
  border-radius: 12px;
  padding: 3px;
  pointer-events: none;
  opacity: ${({ isActive }) => (isActive ? "1" : "0")};
  transition: opacity 0.3s ease;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.25rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 0.1rem;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background || "#1a1a2e"};
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    border-radius: 10px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
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

  @media (max-width: 768px) {
    aspect-ratio: 16/10;
  }

  @media (max-width: 480px) {
    aspect-ratio: 16/11;
  }
`;

const CardContent = styled.div`
  padding: 1.25rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    margin: 0 0 0.4rem 0;
    line-height: 1.3;
  }

  p {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    margin: 0 0 0.75rem 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    padding: 0.9rem;

    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.8rem;
      -webkit-line-clamp: 2;
    }
  }

  @media (max-width: 480px) {
    padding: 0.75rem;

    h3 {
      font-size: 0.9rem;
    }
    p {
      font-size: 0.75rem;
      -webkit-line-clamp: 2;
    }
  }
`;

const CardTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.3rem;
`;

const Tag = styled.span`
  font-size: 0.6rem;
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 0.5rem;
    padding: 0.15rem 0.5rem;
  }
`;

const StatusBadge = styled.span`
  font-size: 0.6rem;
  padding: 0.2rem 0.6rem;
  border-radius: 16px;
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

  @media (max-width: 480px) {
    font-size: 0.5rem;
    padding: 0.15rem 0.5rem;
  }
`;

// ============================================
// MODAL STYLES - POSITIONED AT TOP
// ============================================

const ModalOverlay = styled(motion.div).attrs({
  "data-modal-overlay": true,
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem;
  margin: 0;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    align-items: flex-start;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.25rem;
    align-items: flex-start;
  }
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background || "#1a1a2e"};
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2rem;
  position: relative;
  cursor: default;
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  margin: 0;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    border-radius: 4px;
  }

  @media (max-width: 1024px) {
    max-width: 95%;
    padding: 1.75rem;
    max-height: 82vh;
  }

  @media (max-width: 768px) {
    transform: translateY(45px);
    max-height: 80vh;
    padding: 1.25rem;
    border-radius: 16px;
    max-width: 98%;
    margin: 0;
  }

  @media (max-width: 480px) {
    max-height: 78vh;
    padding: 1rem;
    border-radius: 12px;
    max-width: 100%;
    margin: 0;
  }
`;

const ModalClose = styled.button`
  position: sticky;
  top: 0;
  float: right;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 1.5rem;
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
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  margin-bottom: 0.5rem;
  flex-shrink: 0;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    top: 0;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const ModalContentWrapper = styled.div`
  clear: both;
  padding-top: 0.5rem;
`;

// ============================================
// MODAL NAVIGATION - MOBILE FRIENDLY
// ============================================

const ModalNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.35rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.4rem;
  }
`;

const ModalNavButton = styled.button`
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  font-weight: 500;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.primary || "#e8d5a3"}20;
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 40px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.6rem;
    font-size: 0.65rem;
    min-height: 36px;
    border-radius: 4px;
  }
`;

const ModalNavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.4rem;
  }
`;

const ModalPageTitle = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  text-transform: uppercase;
  letter-spacing: 0.1em;

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const ModalNavDots = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
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

  @media (max-width: 480px) {
    width: 6px;
    height: 6px;
  }
`;

// ============================================
// MODAL PAGES - MOBILE OPTIMIZED
// ============================================

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
  margin-bottom: 1.25rem;
  background: ${({ theme }) => theme.colors.surface || "#2a2a4a"};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    border-radius: 10px;
    margin-bottom: 1rem;
    aspect-ratio: 16/10;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
    margin-bottom: 0.75rem;
    aspect-ratio: 16/10;
  }
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  margin: 0 0 0.5rem 0;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: clamp(1.2rem, 5vw, 1.5rem);
  }

  @media (max-width: 480px) {
    font-size: clamp(1rem, 6vw, 1.2rem);
  }
`;

const ModalMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.25rem;

  @media (max-width: 480px) {
    gap: 0.4rem;
    margin-bottom: 0.75rem;
  }
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

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.65rem;
    gap: 0.25rem;
  }
`;

const ModalDescription = styled.div`
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  margin-bottom: 1.25rem;

  p {
    margin: 0 0 0.75rem 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  ul {
    padding-left: 1.25rem;
    margin: 0.5rem 0 0.75rem 0;
  }

  li {
    margin-bottom: 0.4rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.6;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.5;
    margin-bottom: 0.75rem;

    ul {
      padding-left: 0.75rem;
    }
  }
`;

const ModalTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;

  @media (max-width: 480px) {
    gap: 0.3rem;
    margin-bottom: 0.75rem;
  }
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
  text-align: center;
  min-height: 44px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(232, 213, 163, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.85rem;
    min-height: 40px;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-height: 36px;
    border-radius: 6px;
    width: 100%;
    text-align: center;
  }
`;

// ============================================
// TECHNICAL CONTENT - MOBILE OPTIMIZED
// ============================================

const TechnicalContent = styled.div`
  font-size: clamp(0.9rem, 2vw, 1rem);
  line-height: 1.8;
  color: ${({ theme }) => theme.colors.text || "#8899aa"};

  h2,
  h3,
  h4 {
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.3rem;
  }
  h3 {
    font-size: 1.1rem;
  }
  h4 {
    font-size: 1rem;
  }

  p {
    margin-bottom: 0.75rem;
  }

  ul,
  ol {
    padding-left: 1.25rem;
    margin: 0.5rem 0 0.75rem 0;
  }

  li {
    margin-bottom: 0.35rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    line-height: 1.6;

    h2 {
      font-size: 1.1rem;
    }
    h3 {
      font-size: 1rem;
    }
    h4 {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    line-height: 1.5;

    h2 {
      font-size: 0.95rem;
    }
    h3 {
      font-size: 0.85rem;
    }
    h4 {
      font-size: 0.8rem;
    }

    ul,
    ol {
      padding-left: 0.75rem;
    }
  }
`;

// ============================================
// GALLERY GRID - MOBILE OPTIMIZED
// ============================================

const GalleryGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.35rem;
  }
`;

const GalleryImageCard = styled(motion.div)`
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: ${({ theme }) =>
    theme.colors.surface || "rgba(255,255,255,0.05)"};
  border: 1px solid
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  aspect-ratio: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    z-index: 2;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  &:active {
    transform: scale(0.95);
  }

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover img,
  &:hover video {
    transform: scale(1.05);
  }

  @media (max-width: 480px) {
    border-radius: 6px;
  }
`;

const GalleryImageOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${GalleryImageCard}:hover & {
    opacity: 1;
  }

  @media (max-width: 480px) {
    padding: 0.3rem;
    opacity: 1;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  }
`;

const GalleryImageTitle = styled.h4`
  font-size: 0.65rem;
  margin: 0;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 0.5rem;
  }
`;

const GalleryImageDesc = styled.p`
  font-size: 0.55rem;
  margin: 0.1rem 0 0;
  opacity: 0.8;

  @media (max-width: 480px) {
    font-size: 0.45rem;
  }
`;

const MediaBadge = styled.span`
  font-size: 0.5rem;
  background: ${({ type }) =>
    type === "gif" ? "rgba(232, 213, 163, 0.25)" : "rgba(74, 157, 106, 0.25)"};
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  border: 1px solid
    ${({ type }) =>
      type === "gif" ? "rgba(232, 213, 163, 0.3)" : "rgba(74, 157, 106, 0.3)"};
  color: ${({ type }) => (type === "gif" ? "#e8d5a3" : "#4a9d6a")};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 0.4rem;
    padding: 0.05rem 0.2rem;
  }
`;

// ============================================
// LIGHTBOX STYLES - MOBILE OPTIMIZED
// ============================================

const LightboxOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 2rem 1rem;
  cursor: pointer;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 120px 0.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 100px 0.25rem 1rem;
  }
`;

const LightboxContent = styled(motion.div)`
  max-width: 95vw;
  max-height: 85vh;
  position: relative;
  cursor: default;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0;

  @media (max-width: 768px) {
    max-width: 100vw;
    max-height: 75vh;
    margin-top: 20px;
  }
  @media (max-width: 480px) {
    max-height: 70vh;
    margin-top: 10px;
  }
`;

const LightboxImage = styled.img`
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    max-height: 65vh;
    margin-top: 20px;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    max-height: 60vh;
    border-radius: 4px;
    margin-top: 10px;
  }
`;

const LightboxVideo = styled.video`
  max-width: 90vw;
  max-height: 80vh;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  background: #000;
  display: block;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 100vw;
    max-height: 65vh;
    border-radius: 4px;
    margin-top: 20px;
  }

  @media (max-width: 480px) {
    max-height: 60vh;
    margin-top: 10px;
  }
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  z-index: 10;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.15);
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
  }

  &:active {
    transform: scale(0.9);
  }

  @media (max-width: 768px) {
    top: 8px;
    right: 8px;
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  @media (max-width: 480px) {
    top: 5px;
    right: 5px;
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
`;

const LightboxInfo = styled.div`
  position: relative;
  width: 100%;
  bottom: -70px;
  left: 0;
  right: 0;
  color: white;
  text-align: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  margin-top: 0.5rem;

  h3 {
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  p {
    margin: 0.25rem 0 0;
    opacity: 0.8;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    bottom: -55px;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;

    h3 {
      font-size: 0.85rem;
    }
    p {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    bottom: -45px;
    padding: 0.25rem 0.4rem;

    h3 {
      font-size: 0.7rem;
    }
    p {
      font-size: 0.6rem;
    }
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

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const LightboxNavButton = styled.button`
  pointer-events: all;
  background: rgba(255, 255, 255, 0.15);
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

  &:hover {
    background: rgba(255, 255, 255, 0.3);
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
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
`;

const LightboxMediaBadge = styled.span`
  font-size: 0.6rem;
  background: ${({ type }) =>
    type === "gif" ? "rgba(232, 213, 163, 0.2)" : "rgba(74, 157, 106, 0.2)"};
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  border: 1px solid
    ${({ type }) =>
      type === "gif" ? "rgba(232, 213, 163, 0.3)" : "rgba(74, 157, 106, 0.3)"};
  color: ${({ type }) => (type === "gif" ? "#e8d5a3" : "#4a9d6a")};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 480px) {
    font-size: 0.45rem;
    padding: 0.1rem 0.3rem;
  }
`;

const GalleryCount = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text || "#667a8a"};
  opacity: 0.7;
  margin-left: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`;

const TechnicalPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: ${({ theme }) =>
    theme.colors.surface || "rgba(255,255,255,0.03)"};
  border-radius: 12px;
  border: 2px dashed
    ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.08)"};
  padding: 1.5rem;
  text-align: center;

  .icon {
    font-size: 3rem;
    margin-bottom: 0.75rem;
    opacity: 0.4;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    font-size: 1rem;
    margin: 0 0 0.3rem 0;
  }

  p {
    color: ${({ theme }) => theme.colors.text || "#667a8a"};
    font-size: 0.8rem;
    margin: 0;
    opacity: 0.6;
  }

  @media (max-width: 480px) {
    min-height: 120px;
    padding: 1rem;

    .icon {
      font-size: 2rem;
    }
    h3 {
      font-size: 0.8rem;
    }
    p {
      font-size: 0.65rem;
    }
  }
`;

// ============================================
// HELPER FUNCTIONS
// ============================================

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

const isGifUrl = (url) => {
  if (!url) return false;
  return url.toLowerCase().endsWith(".gif");
};

const isVideoUrl = (url) => {
  if (!url) return false;
  return (
    url.toLowerCase().endsWith(".mp4") ||
    url.toLowerCase().endsWith(".webm") ||
    url.toLowerCase().endsWith(".webp")
  );
};

const getMediaType = (url) => {
  if (isGifUrl(url)) return "gif";
  if (isVideoUrl(url)) return "video";
  return "image";
};

// ============================================
// GALLERY MEDIA COMPONENT - FORCE THUMBNAILS ON MOBILE
// ============================================

const GalleryMedia = ({
  src,
  thumbnail,
  alt,
  className,
  autoPlay = false,
  muted = true,
  loop = true,
  isMobile = false,
}) => {
  const mediaType = getMediaType(src);

  console.log(
    "🎬 [GalleryMedia] src:",
    src,
    "isMobile:",
    isMobile,
    "mediaType:",
    mediaType,
  );

  // Force: On mobile, ALWAYS show thumbnail for videos and GIFs
  if (isMobile && (mediaType === "video" || mediaType === "gif")) {
    const thumbnailSrc = thumbnail || "/images/thumbnails/placeholder.jpg";

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <img
          className={className}
          src={thumbnailSrc}
          alt={alt}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"%3E%3Crect width="320" height="180" fill="%232a2a4a"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23667a8a" text-anchor="middle" dy=".3em"%3E🎬%3C/text%3E%3C/svg%3E';
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50px",
            height: "50px",
            background: "rgba(0,0,0,0.6)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            border: "2px solid rgba(255,255,255,0.3)",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              color: "white",
              marginLeft: "4px",
            }}
          >
            ▶
          </span>
        </div>
      </div>
    );
  }

  // Desktop only: Video with auto-play
  if (mediaType === "video") {
    return (
      <GalleryVideo
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        poster={thumbnail || src.replace(/\.(mp4|webm)$/, ".jpg")}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </GalleryVideo>
    );
  }

  // Desktop only: GIF (animated)
  if (mediaType === "gif") {
    return <img className={className} src={src} alt={alt} loading="lazy" />;
  }

  // Static images (works on both desktop and mobile)
  return <img className={className} src={src} alt={alt} loading="lazy" />;
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProjectsGames() {
  const resetKey = useResetKey();
  const content = useContext(ContentContext);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const modalRef = useRef(null);
  const modalScrollPositionRef = useRef(0);
  const pageScrollPositionRef = useRef(0);
  const scrollPositionRef = useRef(0);
  const totalPages = 3;
  const pageNames = ["Overview", "Gallery", "Technical"];

  // Check if device is mobile - more reliable detection
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        window.innerWidth <= 768 ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
      );
    }
    return false;
  });

  const [isBackgroundActive, setIsBackgroundActive] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobileNow =
        window.innerWidth <= 768 ||
        /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      setIsMobile(isMobileNow);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Build projects from content
  const buildProjects = () => {
    const projectsContent = content?.projectsGames || {};

    if (projectsContent.projects_json) {
      try {
        const parsedProjects = JSON.parse(projectsContent.projects_json);
        if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
          return parsedProjects.map((project, index) => {
            const gallery = (project.gallery || []).map((g) => ({
              ...g,
              isGif: isGifUrl(g.src),
              isVideo: isVideoUrl(g.src),
              mediaType: getMediaType(g.src),
              thumbnail: g.thumbnail || null,
            }));

            return {
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
              gallery: gallery,
              technical: project.technical || "",
            };
          });
        }
      } catch (e) {
        console.error("Error parsing projects JSON:", e);
      }
    }

    // Fallback projects
    return [
      {
        id: 1,
        title: "Multi-Player Space Shooter",
        link: "#",
        description: "Thrilling Unity multiplayer game with powerups",
        fullDescription: `<p><strong>Multi-Player Space Shooter</strong> is a thrilling game built using Unity.</p>`,
        genre: "Action · Multiplayer · Shooter",
        platform: "PC, Mobile",
        release: "2024",
        image: { main: "/images/space-shooter.jpg" },
        showImage: true,
        tags: ["Unity", "Multiplayer", "Space Shooter"],
        gallery: [],
        technical: "<h3>Engine</h3><p>Built with Unity 2022.3 LTS</p>",
      },
    ];
  };

  const projects = buildProjects();

  // ============================================
  // SIMPLE DEBUG KEYBOARD CONTROLS
  // ============================================

  useEffect(() => {
    const isDebugMode =
      process.env.NODE_ENV === "development" ||
      window.location.search.includes("debug");

    if (!isDebugMode) return;

    console.log("🐛 [DEBUG] Keyboard controls enabled!");
    console.log("🐛 [DEBUG] Press 'S' to SAVE and echo scroll position");
    console.log("🐛 [DEBUG] Press 'T' to scroll to TOP");

    const handleKeyPress = (event) => {
      const key = event.key.toLowerCase();

      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      const getScrollPosition = () => {
        return (
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
        );
      };

      switch (key) {
        case "s":
          const currentPos = getScrollPosition();
          scrollPositionRef.current = currentPos;

          console.log("========================================");
          console.log(`📌 [SAVED] Scroll position: ${currentPos}px`);
          console.log(`📌 [SAVED] Stored in ref:`, scrollPositionRef.current);
          console.log(`📌 [SAVED] window.pageYOffset: ${window.pageYOffset}`);
          console.log(
            `📌 [SAVED] document.documentElement.scrollTop: ${document.documentElement.scrollTop}`,
          );
          console.log(
            `📌 [SAVED] document.body.scrollTop: ${document.body.scrollTop}`,
          );
          console.log(
            `📌 [SAVED] Page height: ${document.documentElement.scrollHeight}px`,
          );
          console.log(`📌 [SAVED] Viewport height: ${window.innerHeight}px`);
          console.log(
            `📌 [SAVED] Scroll percentage: ${(
              (currentPos /
                (document.documentElement.scrollHeight - window.innerHeight)) *
              100
            ).toFixed(2)}%`,
          );
          console.log("========================================");

          showDebugToast(`✅ Saved: ${currentPos}px`);
          break;

        case "t":
          console.log("⬆️ [SCROLL] Scrolling to TOP");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          showDebugToast(`⬆️ Scrolled to top`);
          break;

        default:
          return;
      }
    };

    const showDebugToast = (message) => {
      const toast = document.createElement("div");
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0,0,0,0.85);
        color: #00ff88;
        padding: 12px 20px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 14px;
        z-index: 99999;
        border: 1px solid #00ff88;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-break: break-word;
      `;

      if (!document.getElementById("debug-toast-style")) {
        const style = document.createElement("style");
        style.id = "debug-toast-style";
        style.textContent = `
          @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `;
        document.head.appendChild(style);
      }

      toast.textContent = `🐛 ${message}`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }, 2000);
    };

    console.log("========================================");
    console.log("🐛 [DEBUG] SIMPLE CONTROLS:");
    console.log("  S - Save & echo scroll position");
    console.log("  T - Scroll to top");
    console.log("========================================");

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      document
        .querySelectorAll("[data-debug-toast]")
        .forEach((el) => el.remove());
    };
  }, []);

  // ============================================
  // DEBUG VISUAL INDICATOR
  // ============================================

  const DebugIndicator = () => {
    const isDebugMode =
      process.env.NODE_ENV === "development" ||
      window.location.search.includes("debug");

    if (!isDebugMode) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          background: "rgba(255, 100, 100, 0.9)",
          color: "white",
          padding: "6px 12px",
          borderRadius: "4px",
          fontSize: "12px",
          fontFamily: "monospace",
          zIndex: 99999,
          border: "1px solid #ff4444",
          boxShadow: "0 2px 10px rgba(255,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>🐛</span>
        <span>DEBUG</span>
        <span
          style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#00ff88",
            animation: "pulse 1s infinite",
          }}
        ></span>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
          `}
        </style>
      </div>
    );
  };

  // ============================================
  // MODAL FUNCTIONS - WITH SCROLL CACHING
  // ============================================

  const openModal = (project) => {
    const pageScrollY =
      document.body.scrollTop ||
      document.documentElement.scrollTop ||
      window.scrollY ||
      window.pageYOffset ||
      0;

    pageScrollPositionRef.current = pageScrollY;
    console.log("🔵 [MODAL OPEN] 📍 Cached page scroll:", pageScrollY);

    setIsBackgroundActive(true);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    setSelectedProject(project);
    setCurrentPage(0);
    setIsModalOpen(true);

    setTimeout(() => {
      if (modalRef.current) {
        modalScrollPositionRef.current = modalRef.current.scrollTop || 0;
      }
    }, 100);
  };

  const closeModal = () => {
    if (modalRef.current) {
      modalScrollPositionRef.current = modalRef.current.scrollTop || 0;
      console.log(
        "🟢 [MODAL CLOSE] 📍 Saved modal scroll:",
        modalScrollPositionRef.current,
      );
    }
    setIsBackgroundActive(false);

    const pageScrollY = pageScrollPositionRef.current;
    console.log("🟢 [MODAL CLOSE] 📍 Restoring page scroll to:", pageScrollY);

    if (pageScrollY > 0) {
      document.body.scrollTop = pageScrollY;
      document.documentElement.scrollTop = pageScrollY;
      window.scrollTo({
        top: pageScrollY,
        behavior: "smooth",
      });
      console.log("🟢 [MODAL CLOSE] ✅ Restored page scroll to:", pageScrollY);
    } else {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    document.body.style.paddingRight = "";
    setIsModalOpen(false);
    setTimeout(() => setSelectedProject(null), 300);
  };

  const goToPage = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      if (modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    }
  };

  // Lightbox functions
  const openLightbox = (image, index) => {
    setSelectedGalleryImage(image);
    setCurrentGalleryIndex(index);
  };

  const closeLightbox = () => {
    setSelectedGalleryImage(null);
    document.body.style.overflow = "";
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

  // Render page content
  const renderPageContent = (project, page) => {
    const projectGallery = project.gallery || [];

    switch (page) {
      case 0:
        return (
          <ModalPage>
            {project.showImage && project.image?.main && (
              <ModalImage>
                <img
                  src={project.image.main}
                  alt={project.title}
                  loading="lazy"
                />
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
                <span style={{ fontSize: "4rem", opacity: 0.2 }}>🎮</span>
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

      case 1:
        return (
          <ModalPage>
            <h3
              style={{
                color: "#e8d5a3",
                marginBottom: "0.75rem",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
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
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GalleryMedia
                      src={image.src}
                      thumbnail={image.thumbnail}
                      alt={image.title}
                      autoPlay={!isMobile}
                      muted={true}
                      loop={true}
                      isMobile={isMobile}
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

      case 2:
        return (
          <ModalPage>
            <h3
              style={{
                color: "#e8d5a3",
                marginBottom: "0.75rem",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
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
      <DebugIndicator />

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
                    <img
                      src={project.image.main}
                      alt={project.title}
                      loading="lazy"
                    />
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
                    <span style={{ fontSize: "3rem", opacity: 0.3 }}>🎮</span>
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

      {/* ===== MODAL - POSITIONED AT TOP ===== */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalClose onClick={closeModal}>✕</ModalClose>

              <ModalContentWrapper>
                <ModalNav>
                  <ModalNavButton
                    onClick={prevPage}
                    disabled={currentPage === 0}
                  >
                    ← Back
                  </ModalNavButton>

                  <ModalNavCenter>
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
                  </ModalNavCenter>

                  <ModalNavButton
                    onClick={nextPage}
                    disabled={currentPage === totalPages - 1}
                  >
                    Next →
                  </ModalNavButton>
                </ModalNav>

                {renderPageContent(selectedProject, currentPage)}
              </ModalContentWrapper>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ===== LIGHTBOX ===== */}
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

              {selectedGalleryImage.mediaType === "video" ? (
                <LightboxVideo
                  controls
                  autoPlay={!isMobile}
                  loop
                  muted={isMobile}
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
    </>
  );
}
