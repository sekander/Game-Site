import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const HeroContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black; /* letterbox background */
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const SiteContent = styled.div`
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  width: 100%;
  pointer-events: ${(props) => (props.visible ? "auto" : "none")};
  position: relative;
  z-index: 1;
`;

const VideoOverlay = styled.video`
  width: 100%; /* always full width */
  height: auto; /* maintain aspect ratio */
  max-height: 100%; /* don’t exceed viewport height */
  pointer-events: none;
`;

export default function HeroVideoWrapper({ children }) {
  const [showVideo, setShowVideo] = useState(false);
  const [siteVisible, setSiteVisible] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("heroVideoPlayed");
    if (!hasPlayed) setShowVideo(true);
    else setSiteVisible(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded:");
      console.log("Natural width:", video.videoWidth);
      console.log("Natural height:", video.videoHeight);
      console.log("Viewport size:", window.innerWidth, window.innerHeight);
      video.play();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () =>
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, [showVideo]);

  const handleVideoEnd = () => {
    setShowVideo(false);
    sessionStorage.setItem("heroVideoPlayed", "true");
    setTimeout(() => setSiteVisible(true), 100);
  };

  return (
    <>
      {showVideo && (
        <HeroContainer>
          <VideoOverlay
            ref={videoRef}
            src="/videos/logo.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
          />
        </HeroContainer>
      )}
      <SiteContent visible={siteVisible}>{children}</SiteContent>
    </>
  );
}
