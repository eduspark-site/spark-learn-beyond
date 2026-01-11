import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

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
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
    }
  });

  const geometry = useMemo(() => {
    switch (shape) {
      case "torus":
        return <torusGeometry args={[1, 0.4, 16, 32]} />;
      case "octahedron":
        return <octahedronGeometry args={[1, 0]} />;
      case "icosahedron":
        return <icosahedronGeometry args={[1, 0]} />;
      default:
        return <sphereGeometry args={[1, 32, 32]} />;
    }
  }, [shape]);

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.6}
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
};

const Scene = () => {
  const { theme } = useTheme();
  const goldColor = theme === "dark" ? "#D4AF37" : "#C9A227";
  const accentColor = theme === "dark" ? "#1a2744" : "#e8dcc8";

  const shapes: FloatingShapeProps[] = [
    { position: [-4, 2, -5], scale: 0.8, speed: 1, color: goldColor, shape: "sphere" },
    { position: [4, -1, -6], scale: 0.6, speed: 1.2, color: accentColor, shape: "torus" },
    { position: [-3, -2, -4], scale: 0.5, speed: 0.8, color: goldColor, shape: "octahedron" },
    { position: [3, 3, -7], scale: 0.7, speed: 1.5, color: accentColor, shape: "icosahedron" },
    { position: [0, -3, -8], scale: 0.9, speed: 0.6, color: goldColor, shape: "sphere" },
    { position: [-5, 0, -9], scale: 0.4, speed: 1.1, color: accentColor, shape: "torus" },
  ];

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color={goldColor} />
      
      {shapes.map((shape, index) => (
        <FloatingShape key={index} {...shape} />
      ))}
    </>
  );
};

const FloatingGeometry = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingGeometry;
