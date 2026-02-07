import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group position={[0, -2.5, 0]}>
      {/* Earth sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          color="#1a4d7c"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Landmass layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.52, 64, 64]} />
        <meshStandardMaterial
          color="#2d5a3d"
          transparent
          opacity={0.7}
          roughness={0.9}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.7, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere */}
      <mesh>
        <sphereGeometry args={[2.9, 64, 64]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

const Aurora = () => {
  const auroraRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (auroraRef.current) {
      auroraRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <mesh ref={auroraRef} position={[0, 2, -5]} rotation={[0.3, 0, 0]}>
      <planeGeometry args={[20, 8, 32, 32]} />
      <meshBasicMaterial
        color="#00ff88"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export const EarthScene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ background: 'linear-gradient(to bottom, #000510 0%, #001a0a 50%, #000510 100%)' }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Main light from top-left */}
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      
      {/* Rim light for atmosphere effect */}
      <pointLight position={[-5, 0, -5]} intensity={0.5} color="#00ff88" />
      
      {/* Stars background */}
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.5} 
      />

      {/* Aurora effect */}
      <Aurora />

      {/* Earth */}
      <Earth />
    </Canvas>
  );
};
