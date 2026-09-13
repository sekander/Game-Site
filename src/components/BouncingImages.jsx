import React, { useRef, useEffect, useState } from "react";
import * as Particles from "react-particles-lite";

const BouncingImages = ({ images, width = "100%", height = "500px" }) => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDimensions({ width: rect.width, height: rect.height });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        background: "#1a1a2e",
        borderRadius: "12px",
      }}
    >
      {dimensions.width > 0 && (
        <Particles
          width={dimensions.width}
          height={dimensions.height}
          options={{
            particles: {
              number: { value: images.length },
              shape: {
                type: "image",
                options: {
                  image: images.map((src) => ({
                    src,
                    width: 80,
                    height: 80,
                  })),
                },
              },
              move: {
                enable: true,
                speed: 2,
                direction: "none",
                out_of_bounds: "bounce",
              },
              size: { value: 80 },
              opacity: { value: 1 },
            },
            interactivity: {
              events: {
                onHover: {
                  enable: false, // Set to true if you want mouse interaction
                  mode: "repulse",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default BouncingImages;
