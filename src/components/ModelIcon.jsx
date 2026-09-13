import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model3D from "./Model3D";

const ModelIcon = ({
  modelPath,
  size = 60,
  rotationSpeed = 0.01,
  scale = 1.5,
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* ✅ Suspense OUTSIDE Canvas */}
      <Suspense
        fallback={
          <div
            style={{ color: "white", fontSize: "12px", textAlign: "center" }}
          >
            Loading...
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {/* ✅ ONLY Three.js components inside Canvas */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[-5, 5, 5]} intensity={0.5} />

          <Model3D
            modelPath={modelPath}
            scale={scale}
            rotationSpeed={rotationSpeed}
          />
          <Environment preset="city" />
        </Canvas>
      </Suspense>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none", // Blocks events from reaching canvas
          zIndex: 1,
        }}
      />
    </div>
  );
};

export default ModelIcon;
