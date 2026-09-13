// components/Model3D.js - With fallback
import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const Model3D = ({ modelPath, scale = 1.5, rotationSpeed = 0.01 }) => {
  const modelRef = useRef();
  const [error, setError] = useState(false);
  const { scene } = useGLTF(modelPath, undefined, () => setError(true));

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += rotationSpeed;
    }
  });

  // ✅ Show a geometric shape if model fails to load
  if (error) {
    return (
      <group ref={modelRef} scale={scale}>
        <mesh>
          <icosahedronGeometry args={[0.8, 2]} />
          <meshStandardMaterial
            color="#00ff88"
            metalness={0.7}
            roughness={0.3}
            emissive="#00ff88"
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh rotation={[0, 0, 0.5]}>
          <torusGeometry args={[0.5, 0.1, 8, 12]} />
          <meshStandardMaterial
            color="#ff00ff"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      </group>
    );
  }

  return <primitive ref={modelRef} object={scene.clone()} scale={scale} />;
};

export default Model3D;
