import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, Suspense } from 'react';

/* ☄️ HEAD MATERIAL - Bright Golden/White Core */
const headMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
      // Radial glow from center
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center);
      float alpha = smoothstep(0.5, 0.0, dist);
      
      // Intense white core -> Golden Outer
      vec3 core = vec3(1.0, 1.0, 1.0);
      vec3 gold = vec3(1.0, 0.8, 0.2);
      
      vec3 color = mix(gold, core, smoothstep(0.2, 0.0, dist));
      float glow = exp(-dist * 8.0);
      
      gl_FragColor = vec4(color, alpha * glow * 3.0); 
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

/* ☄️ TAIL MATERIAL - Gold -> Blue Gradient (Removed Green Band) */
const cometMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
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
    varying vec2 vUv;
    
    void main() {
      float sideGlow = exp(-pow(abs(vUv.x - 0.5) * 4.0, 2.0));
      
      vec3 gold = vec3(1.0, 0.8, 0.1);
      vec3 blue = vec3(0.0, 0.5, 1.0);
      
      // Smooth mix from Blue (bottom) to Gold (top)
      vec3 color = mix(blue, gold, pow(vUv.y, 0.5));
      
      float alpha = sideGlow * smoothstep(0.0, 0.3, vUv.y) * 0.8;
      
      gl_FragColor = vec4(color, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
});

/* ☄️ SHOOTING COMET - Organized diagonal fall */
function ShootingComet({ delay, startX, speed }: { delay: number; startX: number; speed: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const adjustedTime = t - delay;

    if (groupRef.current && adjustedTime > 0) {
      const cycleTime = 5.0 / speed; // Full cycle duration
      const progress = (adjustedTime % cycleTime) / cycleTime;

      // Strict Diagonal Trajectory (Top Left -> Bottom Rightish)
      const y = 25 - progress * 50; 
      const x = startX + progress * 25; // Move right as it falls
      const z = -5; // Keep them slightly behind content

      groupRef.current.position.set(x, y, z);
      
      // Rotate to match the diagonal vector CORRECTLY
      // Subtract PI/2 to align +Y axis (Head) with velocity vector
      const angle = Math.atan2(-50, 25);
      groupRef.current.rotation.z = angle - Math.PI / 2;

      // Scale up at start, dim at end
      const brightness = Math.sin(progress * Math.PI) * 0.8 + 0.2;
      groupRef.current.scale.set(1, 1, brightness);
    }
  });

  return (
    <group ref={groupRef} position={[startX, 30, -5]}>
      {/* 
         Comet Head (Coma) - Uses a plane with a radial glow shader 
         to simulate a fuzzy ball of gas, rather than a hard geometric sphere.
         Facing the camera mostly (billboarding not strictly needed if we rotate the whole group carefully, 
         but here we just use a plane flat against the view or just flat in the group).
         Since the group rotates, we counter-rotate the head or just make it a sphere with the fuzzy shader.
         Actually, a sphere with the shader works well for 3D rotation.
      */}
      <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={headMaterial} attach="material" />
      </mesh>

      {/* Comet tail - Seamlessly attached */}
      <mesh position={[0, -3.5, 0]}>
        <planeGeometry args={[1.0, 8]} /> {/* Narrower width to match head, longer tail */}
        <shaderMaterial attach="material" {...cometMaterial} />
      </mesh>
    </group>
  );
}

/* ⭐ FALLING STAR - Minute twinkling stars */
function TwinklingStar({ id, x, y, size }: { id: number; x: number; y: number; size: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Rapid twinkling
      const twinkle = Math.sin(t * (3 + Math.random() * 5) + id) * 0.5 + 0.5;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = twinkle * 0.8 + 0.2;
      material.emissiveIntensity = twinkle * 1.5;
    }
  });

  return (
    <mesh ref={meshRef} position={[x, y, -25]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1}
        transparent
        opacity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

/* 🌌 NEBULA CLOUD EFFECT - Dark Steel/Cold */
function NebulaClouds() {
  const meshRef = useRef<THREE.Mesh>(null);

  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
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
        varying vec2 vUv;
        
        float noise(vec2 uv) {
          return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        void main() {
          vec2 uv = vUv + time * 0.02;
          float n1 = noise(uv * 2.0);
          float n2 = noise(uv * 4.0 + time * 0.1);
          float n3 = noise(uv * 8.0 + time * 0.15);
          
          float nebula = mix(n1, mix(n2, n3, 0.5), 0.5);
          
          // Color gradient: Deep black/blue -> Steel Grey -> Hint of Red
          vec3 color = mix(
            vec3(0.02, 0.02, 0.05),   // Deep dark
            mix(
              vec3(0.1, 0.12, 0.15),  // Steel grey
              vec3(0.2, 0.0, 0.05),   // Very faint deep red
              nebula
            ),
            nebula * 0.4
          );
          
          gl_FragColor = vec4(color, nebula * 0.1);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current && meshRef.current.material instanceof THREE.ShaderMaterial) {
      nebulaMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -30]} scale={[40, 30, 1]}>
      <planeGeometry args={[1, 1]} />
      <primitive attach="material" object={nebulaMaterial} />
    </mesh>
  );
}

/* 🌟 BACKGROUND GRADIENT - Dark and Steel */
function BackgroundGradient() {
  const meshRef = useRef<THREE.Mesh>(null);

  const gradientMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
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
        varying vec2 vUv;
        
        void main() {
          // Cold steel dark background
          float y = vUv.y;
          
          vec3 color1 = vec3(0.0, 0.0, 0.02);    // Pitch black/blue
          vec3 color2 = vec3(0.05, 0.05, 0.08);  // Dark steel
          
          // Very subtle pulse
          float pulse = sin(time * 0.2) * 0.02;
          
          vec3 color = mix(color1, color2, y + pulse);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      depthWrite: false,
      side: THREE.BackSide,
    });
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current && meshRef.current.material instanceof THREE.ShaderMaterial) {
      gradientMaterial.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={meshRef} scale={[100, 100, 100]}>
      <sphereGeometry args={[1, 32, 32]} />
      <primitive attach="material" object={gradientMaterial} />
    </mesh>
  );
}


export const LoginSpaceScene = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <BackgroundGradient />
          <NebulaClouds />

          {/* Minute Twinkling Background Stars */}
          {[...Array(150)].map((_, i) => (
            <TwinklingStar
              key={`star-${i}`}
              id={i}
              x={Math.random() * 60 - 30}
              y={Math.random() * 40 - 20}
              size={Math.random() * 0.05 + 0.02}
            />
          ))}

          {/* Diagonal Golden/Green Comets */}
          {/* Organized flow: Top Left -> Bottom Rightish */}
          <ShootingComet delay={0} startX={-15} speed={0.8} />
          <ShootingComet delay={2} startX={-5} speed={0.7} />
          <ShootingComet delay={1.2} startX={-25} speed={1.0} />
          <ShootingComet delay={3.5} startX={-10} speed={0.6} />
          <ShootingComet delay={0.5} startX={0} speed={0.9} />

          {/* Static stars background for depth */}
          <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
          
          {/* Cold Lighting */}
          <ambientLight intensity={0.1} color="#ffffff" />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#bdc3c7" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#4a90e2" />
        </Suspense>
      </Canvas>
    </div>
  );
};
