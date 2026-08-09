// src/pages/Gallery.jsx
import { useResetKey } from "../hooks/useResetKey";
import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, StaggerContainer } from "../components/Animations";

const GalleryContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const GalleryTitle = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
`;

const ImageCard = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.surface || "rgba(255,255,255,0.05)"};
  border: 1px solid ${({ theme }) => theme.colors.border};
  aspect-ratio: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    z-index: 10;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 1rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  ${ImageCard}:hover & {
    opacity: 1;
  }
`;

const ImageTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  font-weight: 600;
`;

const ImageDescription = styled.p`
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
  opacity: 0.8;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  cursor: pointer;
`;

const ModalContent = styled(motion.div)`
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
  cursor: default;
`;

const ModalImage = styled.img`
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const ModalClose = styled.button`
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
  &:hover {
    transform: scale(1.2);
  }
  @media (max-width: 768px) {
    top: -50px;
    right: 0;
  }
`;

const ModalInfo = styled.div`
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  color: white;
  text-align: center;
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
  p {
    margin: 0.25rem 0 0;
    opacity: 0.7;
    font-size: 0.9rem;
  }
`;

const ModalNav = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  padding: 0 1rem;
`;

const NavButton = styled.button`
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

const galleryImages = [
  { id: 1, src: "https://via.placeholder.com/400/333/555?text=Project+Alpha", title: "Project Alpha", description: "Concept art for our upcoming game" },
  { id: 2, src: "https://via.placeholder.com/400/555/333?text=Character+Design", title: "Character Design", description: "Main character concept sketches" },
  { id: 3, src: "https://via.placeholder.com/400/333/777?text=Environment+Art", title: "Environment Art", description: "Level design and environment art" },
  { id: 4, src: "https://via.placeholder.com/400/777/333?text=UI/UX+Design", title: "UI/UX Design", description: "User interface mockups" },
  { id: 5, src: "https://via.placeholder.com/400/555/777?text=Animation", title: "Animation", description: "Character animation tests" },
  { id: 6, src: "https://via.placeholder.com/400/777/555?text=Logo+Design", title: "Logo Design", description: "Brand identity and logo concepts" },
  { id: 7, src: "https://via.placeholder.com/400/333/999?text=Poster+Art", title: "Poster Art", description: "Marketing and promotional materials" },
  { id: 8, src: "https://via.placeholder.com/400/999/333?text=Gameplay+Screenshot", title: "Gameplay Screenshot", description: "In-game capture from prototype" },
  { id: 9, src: "https://via.placeholder.com/400/555/999?text=Concept+Art", title: "Concept Art", description: "Early concept art for the game world" },
  { id: 10, src: "https://via.placeholder.com/400/999/555?text=Music+Production", title: "Music Production", description: "Behind the scenes of music creation" },
];

export default function Gallery() {
  const resetKey = useResetKey();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction) => {
    const newIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <GalleryContainer>
      <Reveal direction="up" delay={0} resetKey={resetKey}>
        <GalleryTitle>Gallery</GalleryTitle>
      </Reveal>

      <StaggerContainer delayChildren={0.05} resetKey={resetKey}>
        <GalleryGrid>
          {galleryImages.map((image, index) => (
            <ImageCard
              key={image.id}
              onClick={() => openLightbox(image, index)}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              layoutId={`image-${image.id}`}
            >
              <Image src={image.src} alt={image.title} />
              <ImageOverlay initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <ImageTitle>{image.title}</ImageTitle>
                <ImageDescription>{image.description}</ImageDescription>
              </ImageOverlay>
            </ImageCard>
          ))}
        </GalleryGrid>
      </StaggerContainer>

      <AnimatePresence>
        {selectedImage && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalClose onClick={closeLightbox}>✕</ModalClose>
              <ModalImage src={selectedImage.src} alt={selectedImage.title} />
              <ModalInfo>
                <h3>{selectedImage.title}</h3>
                <p>{selectedImage.description}</p>
              </ModalInfo>
              <ModalNav>
                <NavButton onClick={() => navigateImage(-1)}>‹</NavButton>
                <NavButton onClick={() => navigateImage(1)}>›</NavButton>
              </ModalNav>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </GalleryContainer>
  );
}

