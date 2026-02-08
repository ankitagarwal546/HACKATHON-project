import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sphere, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, Suspense, useState } from 'react';

/* 🛸 BEAM MATERIAL - green light that “reveals” the title (synced with landing page delay 2.1s) */
const beamMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    color: { value: new THREE.Color('#22ff22') },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      float gradient = smoothstep(0.0, 1.0, vUv.y);
      float scanline = sin(vUv.y * 50.0 - time * 10.0) * 0.1;
      gl_FragColor = vec4(color, (gradient + scanline) * 0.25);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});

/* 🛸 UFO – flies in, hovers and sheds light (beam), then exits. Title reveal on landing page is synced to beam at 2.1s. */
function SleekUFO() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const [shooting, setShooting] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    beamMaterial.uniforms.time.value = t;

    if (groupRef.current) {
      if (t < 2) {
        groupRef.current.position.set(
          THREE.MathUtils.lerp(-25, 0, t / 2),
          THREE.MathUtils.lerp(12, 4.5, t / 2),
          THREE.MathUtils.lerp(-10, 0, t / 2)
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(-0.5, 0, t / 2);
      } else if (t >= 2 && t < 4.0) {
        groupRef.current.position.y = 4.5 + Math.sin(t * 2) * 0.1;
        groupRef.current.rotation.z = Math.sin(t) * 0.05;
        if (!shooting) setShooting(true);
      } else {
        setShooting(false);
        const exitProgress = (t - 4.0) / 2.5;
        if (exitProgress <= 1) {
          groupRef.current.position.set(
            THREE.MathUtils.lerp(0, 30, exitProgress),
            THREE.MathUtils.lerp(4.5, 15, exitProgress),
            THREE.MathUtils.lerp(0, -10, exitProgress)
          );
          groupRef.current.rotation.z = THREE.MathUtils.lerp(0, -0.8, exitProgress);
          groupRef.current.rotation.x = THREE.MathUtils.lerp(0.2, 0.5, exitProgress);
        } else {
          groupRef.current.position.x += 0.3;
          groupRef.current.position.y += 0.2;
        }
      }
    }

    if (ringRef.current) ringRef.current.rotation.z += 0.15;

    if (beamRef.current) {
      if (shooting) {
        beamRef.current.visible = true;
        const openProgress = Math.min(1, (t - 2) * 3);
        beamRef.current.scale.set(openProgress, 1, openProgress);
      } else {
        beamRef.current.visible = false;
        beamRef.current.scale.set(0, 1, 0);
      }
    }
  });

  return (
    <group ref={groupRef} position={[-25, 12, 0]} scale={[0.5, 0.5, 0.5]}>
      <group rotation={[0.2, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#0088ff"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={[1, 0.3, 1]}>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshStandardMaterial color="#333" metalness={1} roughness={0.1} />
        </mesh>
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.05, 16, 100]} />
          <meshBasicMaterial color="#00ff00" toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={beamRef} position={[0, -8, 0]} visible={false} material={beamMaterial}>
        <cylinderGeometry args={[0.1, 9, 16, 32, 1, true]} />
      </mesh>
    </group>
  );
}

/* Earth + Moon system */
function EarthSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const earthMap = useTexture('/textures/earth.jpg', () => {}, () => {});
  const moonMap = useTexture('/textures/moon.jpg', () => {}, () => {});

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) groupRef.current.rotation.y = t * 0.05;
    if (earthRef.current) earthRef.current.rotation.y = t * 0.08;
    if (moonRef.current) {
      moonRef.current.position.x = Math.sin(t * 0.2) * 6;
      moonRef.current.position.z = Math.cos(t * 0.2) * 6;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={earthRef} args={[1.6, 64, 64]}>
        {earthMap ? (
          <meshStandardMaterial map={earthMap} metalness={0.1} roughness={0.7} />
        ) : (
          <meshStandardMaterial color="#1E90FF" />
        )}
      </Sphere>
      <Sphere ref={moonRef} args={[0.45, 32, 32]}>
        {moonMap ? (
          <meshStandardMaterial map={moonMap} metalness={0.1} roughness={0.8} />
        ) : (
          <meshStandardMaterial color="#888888" />
        )}
      </Sphere>
    </group>
  );
}

function SingleSatellite({
  speed,
  radius,
  offset,
  inclination,
  color,
}: {
  speed: number;
  radius: number;
  offset: number;
  inclination: number;
  color: string;
}) {
  const satRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (satRef.current) {
      const t = clock.getElapsedTime() * speed + offset;
      satRef.current.position.x = Math.sin(t) * radius;
      satRef.current.position.z = Math.cos(t) * radius;
      satRef.current.position.y = Math.sin(t * 3) * inclination;
      satRef.current.lookAt(0, 0, 0);
      satRef.current.rotateY(Math.PI / 2);
    }
  });

  return (
    <group ref={satRef} scale={[0.15, 0.15, 0.15]}>
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.8]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={1.0} />
      </mesh>
      <mesh position={[0, 0, 1.2]}>
        <boxGeometry args={[0.05, 0.8, 1.6]} />
        <meshStandardMaterial color="#101040" roughness={0.1} metalness={0.9} emissive="#000020" />
      </mesh>
      <mesh position={[0, 0, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <mesh position={[0, 0, -1.2]}>
        <boxGeometry args={[0.05, 0.8, 1.6]} />
        <meshStandardMaterial color="#101040" roughness={0.1} metalness={0.9} emissive="#000020" />
      </mesh>
      <mesh position={[0, 0, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4]} />
        <meshStandardMaterial color="#888" />
      </mesh>
      <pointLight
        position={[0, 0.6, 0]}
        intensity={3}
        color={color === '#FFD700' ? '#00ff00' : '#ff0000'}
        distance={1}
      />
    </group>
  );
}

function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const asteroidTexture = useTexture('/textures/asteroid.jpg', () => {}, () => {});
  const count = 3000;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp: { x: number; y: number; z: number; scale: number; speed: number; rot: number }[] = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const xBase = (t - 0.5) * 45;
      const zBase = xBase * xBase * 0.04 - 10;
      const x = xBase + (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 3;
      const z = zBase + (Math.random() - 0.5) * 4;
      const baseSize = Math.random() * 0.06 + 0.01;
      const scale = baseSize * (0.8 + Math.random() * 0.5);
      temp.push({
        x,
        y,
        z,
        scale,
        speed: (Math.random() - 0.5) * 0.002,
        rot: Math.random() * Math.PI,
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.rot += p.speed;
      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rot, p.rot, p.rot);
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      {asteroidTexture ? (
        <meshStandardMaterial
          map={asteroidTexture}
          color="#cccccc"
          emissive="#222222"
          roughness={0.6}
          metalness={0.2}
        />
      ) : (
        <meshStandardMaterial color="#666" />
      )}
    </instancedMesh>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={4.5} color="#ffffff" />
      <pointLight position={[0, -10, 0]} intensity={2.0} color="#aaccff" />
      <pointLight position={[-10, 5, -10]} intensity={5.0} color="#8080ff" distance={40} />
      <Stars radius={300} depth={60} count={6000} factor={4} fade speed={0.5} />
      <EarthSystem />
      <SleekUFO />
      <SingleSatellite speed={0.3} radius={2.2} offset={0} inclination={0.5} color="#FFD700" />
      <SingleSatellite speed={0.2} radius={2.8} offset={3} inclination={-0.5} color="#C0C0C0" />
      <AsteroidBelt />
    </>
  );
}

export default function CosmicSpaceScene() {
  return (
    <div className="absolute inset-0 z-0 bg-black pointer-events-none min-h-full w-full">
      <Canvas camera={{ position: [0, 1.5, 12], fov: 50 }} style={{ display: 'block' }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
