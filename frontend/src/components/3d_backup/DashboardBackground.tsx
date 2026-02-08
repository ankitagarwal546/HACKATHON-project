import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useMemo, Suspense } from 'react';

/* Twinkling stars – per-star phase so they twinkle out of sync */
const TWINKLE_VERTEX = /* glsl */ `
  uniform float time;
  attribute float size;
  attribute float phase;
  varying vec3 vColor;
  varying float vPhase;
  void main() {
    vColor = color;
    vPhase = phase;
    vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
    gl_PointSize = size * (30.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const TWINKLE_FRAGMENT = /* glsl */ `
  uniform float time;
  varying vec3 vColor;
  varying float vPhase;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));
    float opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
    // Strong twinkle: brightness goes from 0.2 to 1.0, faster cycle so it's visible
    float twinkle = 0.2 + 0.8 * sin(time * 4.0 + vPhase * 6.28318);
    opacity *= twinkle;
    gl_FragColor = vec4(vColor, opacity);
  }
`;

function TwinklingStars({ radius = 200, depth = 100, count = 12000, factor = 5 }) {
  const timeUniform = useRef({ value: 0 });
  const { positions, colors, sizes, phases } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const siz: number[] = [];
    const pha: number[] = [];
    const color = new THREE.Color();
    let r = radius + depth;
    const increment = depth / count;
    for (let i = 0; i < count; i++) {
      r -= increment * Math.random();
      const spherical = new THREE.Spherical(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI);
      const vec = new THREE.Vector3().setFromSpherical(spherical);
      pos.push(vec.x, vec.y, vec.z);
      color.setHSL(i / count, 0, 0.9);
      col.push(color.r, color.g, color.b);
      siz.push((0.5 + 0.5 * Math.random()) * factor);
      pha.push(Math.random());
    }
    return {
      positions: new Float32Array(pos),
      colors: new Float32Array(col),
      sizes: new Float32Array(siz),
      phases: new Float32Array(pha),
    };
  }, [count, depth, factor, radius]);

  useFrame(({ clock }) => {
    timeUniform.current.value = clock.getElapsedTime();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-phase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
        uniforms={{
          time: timeUniform.current,
        }}
        vertexShader={TWINKLE_VERTEX}
        fragmentShader={TWINKLE_FRAGMENT}
      />
    </points>
  );
}

/* Faint orbit/range rings – mission-control tracking feel */
function OrbitRings() {
  const groupRef = useRef<THREE.Group>(null);
  const ringProps = [
    { innerRadius: 8, outerRadius: 10 },
    { innerRadius: 14, outerRadius: 16 },
    { innerRadius: 20, outerRadius: 22 },
  ];

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 2.4; // tilt like orbital plane
      groupRef.current.rotation.z = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -25]}>
      {ringProps.map(({ innerRadius, outerRadius }, i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
          <ringGeometry args={[innerRadius, outerRadius, 64]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Subtle radar sweep – thin scanning line */
function RadarSweep() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = -clock.getElapsedTime() * 0.35;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -12]}>
      <planeGeometry args={[0.4, 80]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* Twinkling starfield – two dense layers for depth */
function Starfield() {
  return (
    <>
      <TwinklingStars radius={200} depth={100} count={12000} factor={5} />
      <TwinklingStars radius={140} depth={60} count={6000} factor={4} />
    </>
  );
}

function SceneContent() {
  return (
    <>
      <Starfield />
      <OrbitRings />
      <RadarSweep />
    </>
  );
}

/**
 * Dashboard-only background: deep starfield + orbit rings + radar sweep.
 * Mission-control / tracking feel, distinct from the landing page.
 */
export default function DashboardBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#030712] pointer-events-none min-h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: false }}
        style={{ display: 'block' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
