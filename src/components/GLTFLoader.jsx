import { useGLTF } from "@react-three/drei";

// Preload models to avoid loading delays
export const preloadModels = (modelPaths) => {
  modelPaths.forEach((path) => {
    useGLTF.preload(path);
  });
};
