import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { mockAsteroids } from '@/data/mockAsteroids';
import { Asteroid } from '@/types/asteroid';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  name: string;
  orbitRadius: number;
  orbitSpeed: number;
  emissive?: string;
  emissiveIntensity?: number;
}

const Planet = ({ position, size, color, name, orbitRadius, orbitSpeed, emissive, emissiveIntensity = 0 }: PlanetProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const angle = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    if (meshRef.current) {
      angle.current += orbitSpeed * delta;
      meshRef.current.position.x = Math.cos(angle.current) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle.current) * orbitRadius;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={emissive || color}
        emissiveIntensity={hovered ? 0.5 : emissiveIntensity}
      />
      {hovered && (
        <Html distanceFactor={15}>
          <div className="bg-card/90 backdrop-blur-sm px-3 py-1 rounded border border-primary text-primary font-orbitron text-xs whitespace-nowrap">
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
};

const Sun = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshBasicMaterial color="#FDB813" />
      <pointLight intensity={2} distance={100} decay={2} />
    </mesh>
  );
};

interface AsteroidMeshProps {
  asteroid: Asteroid;
  baseOrbitRadius: number;
  onClick: (asteroid: Asteroid) => void;
  isSelected: boolean;
}

const AsteroidMesh = ({ asteroid, baseOrbitRadius, onClick, isSelected }: AsteroidMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const angle = useRef(Math.random() * Math.PI * 2);
  const orbitSpeed = 0.1 + Math.random() * 0.1;
  const orbitTilt = (Math.random() - 0.5) * 0.3;
  
  // Size based on asteroid diameter (scaled down)
  const avgDiameter = (asteroid.diameterMin + asteroid.diameterMax) / 2;
  const size = Math.max(0.05, Math.min(0.3, avgDiameter / 3000));

  useFrame((_, delta) => {
    if (meshRef.current) {
      angle.current += orbitSpeed * delta;
      meshRef.current.position.x = Math.cos(angle.current) * baseOrbitRadius;
      meshRef.current.position.z = Math.sin(angle.current) * baseOrbitRadius;
      meshRef.current.position.y = Math.sin(angle.current * 2) * orbitTilt;
      meshRef.current.rotation.x += delta * 2;
      meshRef.current.rotation.y += delta * 1.5;
    }
  });

  const color = asteroid.isHazardous 
    ? asteroid.riskScore === 'high' ? '#ef4444' : '#f59e0b'
    : '#22c55e';

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onClick(asteroid)}
    >
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={hovered || isSelected ? 1 : 0.3}
        roughness={0.8}
      />
      {(hovered || isSelected) && (
        <Html distanceFactor={10}>
          <div className="bg-card/95 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary text-foreground font-rajdhani text-xs whitespace-nowrap min-w-[200px]">
            <div className="font-orbitron text-primary text-sm mb-2">{asteroid.name}</div>
            <div className="space-y-1 text-muted-foreground">
              <p>Diameter: <span className="text-foreground">{Math.round(avgDiameter)}m</span></p>
              <p>Speed: <span className="text-foreground">{Math.round(asteroid.velocityKmps)} km/s</span></p>
              <p>Hazardous: <span className={asteroid.isHazardous ? 'text-destructive' : 'text-safe'}>{asteroid.isHazardous ? 'YES' : 'NO'}</span></p>
              <p>Risk: <span className={`risk-${asteroid.riskScore}`}>{asteroid.riskScore.toUpperCase()}</span></p>
            </div>
          </div>
        </Html>
      )}
    </mesh>
  );
};

const OrbitRing = ({ radius }: { radius: number }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]}>
    <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
    <meshBasicMaterial color="#ffffff" opacity={0.15} transparent side={THREE.DoubleSide} />
  </mesh>
);

interface SolarSystemProps {
  selectedAsteroid: Asteroid | null;
  onSelectAsteroid: (asteroid: Asteroid) => void;
}

export const SolarSystem = ({ selectedAsteroid, onSelectAsteroid }: SolarSystemProps) => {
  const planets = useMemo(() => [
    { name: 'Mercury', size: 0.2, color: '#A0522D', orbitRadius: 5, orbitSpeed: 0.5 },
    { name: 'Venus', size: 0.35, color: '#DEB887', orbitRadius: 7, orbitSpeed: 0.35 },
    { name: 'Earth', size: 0.4, color: '#4169E1', orbitRadius: 10, orbitSpeed: 0.25, emissive: '#1E90FF', emissiveIntensity: 0.2 },
    { name: 'Mars', size: 0.3, color: '#CD5C5C', orbitRadius: 13, orbitSpeed: 0.2 },
    { name: 'Jupiter', size: 1.2, color: '#DEB887', orbitRadius: 20, orbitSpeed: 0.1 },
    { name: 'Saturn', size: 1, color: '#F4A460', orbitRadius: 28, orbitSpeed: 0.07 },
  ], []);

  return (
    <Canvas
      camera={{ position: [0, 30, 50], fov: 60 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.1} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Sun />
      
      {/* Orbit rings */}
      {planets.map((planet) => (
        <OrbitRing key={`orbit-${planet.name}`} radius={planet.orbitRadius} />
      ))}
      
      {/* Planets */}
      {planets.map((planet) => (
        <Planet
          key={planet.name}
          position={[planet.orbitRadius, 0, 0]}
          size={planet.size}
          color={planet.color}
          name={planet.name}
          orbitRadius={planet.orbitRadius}
          orbitSpeed={planet.orbitSpeed}
          emissive={planet.emissive}
          emissiveIntensity={planet.emissiveIntensity}
        />
      ))}

      {/* Saturn's rings */}
      <Ring args={[1.3, 2, 64]} rotation={[-Math.PI / 3, 0, 0]} position={[28, 0, 0]}>
        <meshBasicMaterial color="#C2B280" opacity={0.6} transparent side={THREE.DoubleSide} />
      </Ring>

      {/* Asteroids */}
      {mockAsteroids.map((asteroid, index) => (
        <AsteroidMesh
          key={asteroid.id}
          asteroid={asteroid}
          baseOrbitRadius={10 + (index % 5) * 1.5 + Math.random() * 2}
          onClick={onSelectAsteroid}
          isSelected={selectedAsteroid?.id === asteroid.id}
        />
      ))}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={10}
        maxDistance={100}
        autoRotate
        autoRotateSpeed={0.2}
      />
    </Canvas>
  );
};
