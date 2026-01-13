import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface FloatingShapeProps {
  position: [number, number, number];
  scale: number;
  speed: number;
  color: string;
  shape: "sphere" | "torus" | "octahedron" | "icosahedron";
}

const FloatingShape: React.FC<FloatingShapeProps> = ({ position, scale, speed, color, shape }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.22;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.35;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "torus":
        return <torusGeometry args={[1, 0.38, 16, 28]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[1, 0]} />;
      default:
        return <sphereGeometry args={[1, 28, 28]} />;
    }
  }, [shape]);

  return (
    <Float speed={speed} rotationIntensity={0.3} floatIntensity={0.35}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.55}
          distort={0.2}
          speed={1.6}
          roughness={0.25}
          metalness={0.75}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  const { theme } = useTheme();
  const goldColor = theme === "dark" ? "#D4AF37" : "#C9A227";
  const accentColor = theme === "dark" ? "#1a2744" : "#e8dcc8";

  // Keep this intentionally light for smooth scrolling on phones.
  const shapes: FloatingShapeProps[] = [
    { position: [-4, 2, -5], scale: 0.75, speed: 0.9, color: goldColor, shape: "sphere" },
    { position: [4, -1, -6], scale: 0.55, speed: 1.0, color: accentColor, shape: "torus" },
    { position: [-3, -2, -4], scale: 0.45, speed: 0.75, color: goldColor, shape: "octahedron" },
    { position: [3, 3, -7], scale: 0.6, speed: 1.1, color: accentColor, shape: "icosahedron" },
  ];

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[10, 10, 5]} intensity={0.85} />
      <pointLight position={[-10, -10, -5]} intensity={0.45} color={goldColor} />

      {shapes.map((shape, index) => (
        <FloatingShape key={index} {...shape} />
      ))}
    </>
  );
};

const FloatingGeometry = () => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  // Mobile + low-end devices: WebGL background causes scroll jank/context-loss.
  if (isMobile || reduceMotion) return null;

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingGeometry;

