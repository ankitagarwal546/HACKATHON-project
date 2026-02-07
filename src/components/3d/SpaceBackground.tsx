import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// ============================================
// EARTH COMPONENT
// ============================================
const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Earth core */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#1a3a5c"
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Ocean layer */}
      <mesh rotation={[0.1, 0.5, 0]}>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshStandardMaterial
          color="#0d4f6e"
          roughness={0.6}
          metalness={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Landmass layer */}
      <mesh rotation={[0.2, 1.2, 0.1]}>
        <sphereGeometry args={[2.02, 64, 64]} />
        <meshStandardMaterial
          color="#1a4a2e"
          roughness={0.8}
          metalness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={atmosphereRef} rotation={[0, 0.3, 0]}>
        <sphereGeometry args={[2.08, 64, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={1}
          metalness={0}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.15, 64, 64]} />
        <meshBasicMaterial
          color="#4da6ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.4, 64, 64]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
};

// ============================================
// ORBIT RING COMPONENT
// ============================================
interface OrbitRingProps {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  rotation: number;
  color?: string;
}

const OrbitRing = ({ semiMajorAxis, eccentricity, inclination, rotation, color = '#00d4ff' }: OrbitRingProps) => {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle));
      points.push(new THREE.Vector3(
        r * Math.cos(angle),
        0,
        r * Math.sin(angle)
      ));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [semiMajorAxis, eccentricity]);

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 });
  }, [color]);

  return (
    <primitive 
      ref={lineRef}
      object={new THREE.Line(geometry, material)} 
      rotation={[inclination, rotation, 0]} 
    />
  );
};

// ============================================
// ORBITING ASTEROID COMPONENT
// ============================================
interface OrbitingAsteroidProps {
  semiMajorAxis: number;
  eccentricity: number;
  inclination: number;
  rotationOffset: number;
  speed: number;
  size: number;
  isHazardous: boolean;
  startAngle: number;
}

const OrbitingAsteroid = ({ 
  semiMajorAxis, 
  eccentricity, 
  inclination, 
  rotationOffset, 
  speed, 
  size, 
  isHazardous,
  startAngle 
}: OrbitingAsteroidProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const angle = useRef(startAngle);

  useFrame((_, delta) => {
    if (meshRef.current) {
      angle.current += speed * delta;
      
      // Elliptical orbit calculation
      const r = (semiMajorAxis * (1 - eccentricity * eccentricity)) / (1 + eccentricity * Math.cos(angle.current));
      
      const x = r * Math.cos(angle.current);
      const z = r * Math.sin(angle.current);
      
      // Apply inclination
      const y = z * Math.sin(inclination);
      const zFinal = z * Math.cos(inclination);
      
      // Apply rotation offset
      const cosRot = Math.cos(rotationOffset);
      const sinRot = Math.sin(rotationOffset);
      meshRef.current.position.x = x * cosRot - zFinal * sinRot;
      meshRef.current.position.z = x * sinRot + zFinal * cosRot;
      meshRef.current.position.y = y;
      
      // Tumbling rotation
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const baseColor = isHazardous ? '#ff3333' : '#888888';
  const emissiveColor = isHazardous ? '#ff0000' : '#00d4ff';
  const emissiveIntensity = hovered ? (isHazardous ? 2 : 1) : (isHazardous ? 0.5 : 0.1);

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <dodecahedronGeometry args={[size, 0]} />
      <meshStandardMaterial
        color={baseColor}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
};

// ============================================
// FLY-BY ASTEROID COMPONENT
// ============================================
const FlyByAsteroid = ({ delay }: { delay: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(delay);
  const active = useRef(false);
  
  const trajectory = useMemo(() => ({
    startX: (Math.random() - 0.5) * 30,
    startY: (Math.random() - 0.5) * 10,
    startZ: -50,
    endX: (Math.random() - 0.5) * 30,
    endY: (Math.random() - 0.5) * 10,
    endZ: 50,
    speed: 0.02 + Math.random() * 0.03,
    size: 0.02 + Math.random() * 0.05,
  }), []);

  const progress = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (state.clock.elapsedTime < startTime.current) return;
    
    if (!active.current) {
      active.current = true;
      progress.current = 0;
    }

    progress.current += trajectory.speed * delta * 60;
    
    if (progress.current > 1) {
      // Reset for next pass
      startTime.current = state.clock.elapsedTime + 10 + Math.random() * 20;
      active.current = false;
      meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    meshRef.current.position.x = THREE.MathUtils.lerp(trajectory.startX, trajectory.endX, progress.current);
    meshRef.current.position.y = THREE.MathUtils.lerp(trajectory.startY, trajectory.endY, progress.current);
    meshRef.current.position.z = THREE.MathUtils.lerp(trajectory.startZ, trajectory.endZ, progress.current);
    meshRef.current.rotation.x += delta * 2;
    meshRef.current.rotation.y += delta * 1.5;
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <dodecahedronGeometry args={[trajectory.size, 0]} />
      <meshStandardMaterial
        color="#666666"
        emissive="#00aaff"
        emissiveIntensity={0.3}
        roughness={0.9}
      />
    </mesh>
  );
};

// ============================================
// PARALLAX CAMERA CONTROLLER
// ============================================
const ParallaxCamera = () => {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    // Smooth interpolation
    target.current.x += (mouse.current.x - target.current.x) * 0.02;
    target.current.y += (mouse.current.y - target.current.y) * 0.02;
    
    camera.position.x = target.current.x * 1.5;
    camera.position.y = target.current.y * 0.8 + 1;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

// ============================================
// PARALLAX STARFIELD
// ============================================
const ParallaxStars = () => {
  const starsRef = useRef<THREE.Points>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.x += (mouse.current.y * 0.1 - starsRef.current.rotation.x) * 0.01;
      starsRef.current.rotation.y += (mouse.current.x * 0.1 - starsRef.current.rotation.y) * 0.01;
    }
  });

  return (
    <Stars
      ref={starsRef}
      radius={150}
      depth={100}
      count={4000}
      factor={4}
      saturation={0.1}
      fade
      speed={0.3}
    />
  );
};

// ============================================
// SCENE CONTENT
// ============================================
const SceneContent = () => {
  // Generate asteroid orbital data
  const asteroids = useMemo(() => {
    const data: OrbitingAsteroidProps[] = [];
    const count = 12;
    
    for (let i = 0; i < count; i++) {
      const isHazardous = Math.random() < 0.25; // 25% chance hazardous
      data.push({
        semiMajorAxis: 4 + Math.random() * 6,
        eccentricity: 0.1 + Math.random() * 0.4,
        inclination: (Math.random() - 0.5) * 0.5,
        rotationOffset: Math.random() * Math.PI * 2,
        speed: 0.05 + Math.random() * 0.15,
        size: 0.03 + Math.random() * 0.08,
        isHazardous,
        startAngle: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  // Fly-by asteroids
  const flyBys = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({ delay: 5 + i * 8 + Math.random() * 5 })),
  []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 5, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#4da6ff" distance={5} />

      {/* Starfield with parallax */}
      <ParallaxStars />

      {/* Earth */}
      <Earth />

      {/* Orbit rings */}
      {asteroids.map((asteroid, i) => (
        <OrbitRing
          key={`orbit-${i}`}
          semiMajorAxis={asteroid.semiMajorAxis}
          eccentricity={asteroid.eccentricity}
          inclination={asteroid.inclination}
          rotation={asteroid.rotationOffset}
          color={asteroid.isHazardous ? '#ff3333' : '#00d4ff'}
        />
      ))}

      {/* Orbiting asteroids */}
      {asteroids.map((asteroid, i) => (
        <OrbitingAsteroid key={`asteroid-${i}`} {...asteroid} />
      ))}

      {/* Fly-by asteroids */}
      {flyBys.map((flyBy, i) => (
        <FlyByAsteroid key={`flyby-${i}`} delay={flyBy.delay} />
      ))}

      {/* Camera controller */}
      <ParallaxCamera />

      {/* Post-processing */}
      <EffectComposer>
        <Bloom
          intensity={0.8}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const SpaceBackground = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Pause when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: 'none' }}
    >
      <Canvas
        camera={{ position: [0, 1, 12], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        frameloop={isVisible ? 'always' : 'never'}
        style={{ 
          background: 'radial-gradient(ellipse at center, #0a1628 0%, #050a12 50%, #000000 100%)',
          pointerEvents: 'auto'
        }}
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default SpaceBackground;
