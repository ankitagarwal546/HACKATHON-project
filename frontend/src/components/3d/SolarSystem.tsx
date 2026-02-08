import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Text, Billboard, Line, Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { fetchBrowseNeos, NasaNeo } from '@/services/nasa';
import { getHeliocentricPosition, getEarthPosition, posToVector3, AU_SCALE } from '@/utils/orbitalPhysics';
import { Loader2, Calendar, Info, Shield, MousePointer2, ExternalLink, Target, Ruler, AlertTriangle } from 'lucide-react';

/* 🌍 REALISTIC EARTH WITH TEXTURES */
const Earth = () => {
    // Official Three.js Example Textures
    const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
    ]);

    const earthRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime();
        if (earthRef.current) earthRef.current.rotation.y = t * 0.1; // Rotating on axis
        if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.14; // Clouds move faster
    });

    const EARTH_SCALE = 20; // Make Earth 20x larger than physics scale to be "HUMONGOUS"

    return (
        <group ref={earthRef} scale={[EARTH_SCALE, EARTH_SCALE, EARTH_SCALE]}>
            {/* Core Planet */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 23.5 * Math.PI / 180]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshPhongMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    specularMap={specularMap}
                    specular={new THREE.Color(0x333333)}
                    shininess={15}
                />
            </mesh>
            {/* Clouds / Atmosphere Layer */}
            <mesh ref={cloudsRef} position={[0, 0, 0]} scale={[1.01, 1.01, 1.01]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={cloudsMap}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
            {/* Atmospheric Glow (Shader) */}
            <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
                <sphereGeometry args={[1, 32, 32]} />
                <shaderMaterial
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    uniforms={{
                        c: { value: 0.5 },
                        p: { value: 4.0 },
                        glowColor: { value: new THREE.Color(0x0088ff) },
                        viewVector: { value: new THREE.Vector3(0, 0, 15) }
                    }}
                    vertexShader={`
                        uniform vec3 viewVector;
                        varying float intensity;
                        void main() {
                            vec3 vNormal = normalize(normalMatrix * normal);
                            vec3 vNormel = normalize(normalMatrix * viewVector);
                            intensity = pow(0.6 - dot(vNormal, vNormel), 4.0);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `}
                    fragmentShader={`
                        uniform vec3 glowColor;
                        varying float intensity;
                        void main() {
                            gl_FragColor = vec4(glowColor, intensity * 0.8);
                        }
                    `}
                />
            </mesh>
        </group>
    );
};

/* ☀️ SUN COMPONENT */
const Sun = ({ position }: { position: [number, number, number] }) => {
    // Large, luminous sphere - scaled to be massive but distant
    const SUN_SCALE = 500;
    return (
        <group position={position}>
            {/* Core Sun */}
            <mesh scale={[SUN_SCALE, SUN_SCALE, SUN_SCALE]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color={[10, 5, 1]} // Overdriven color for bloom
                    toneMapped={false}
                />
            </mesh>
            {/* External Halo/Glow - simpler billboard or shader could work, but bloom handles it well */}

            {/* Main Light Source emitting from Sun */}
            <pointLight intensity={2.5} distance={100000} decay={0} color="#fff8e7" />
        </group>
    );
};

/* ☄️ ASTEROID FIELD (Instanced & Textured) */
/* 
   We use low-poly Icosahedrons. 
   To make them look like "rocks", we can't easily displace vertices in InstancedMesh 
   without a custom shader material that reads instance ID.
   For now, we'll stick to a rocky-colored standard material.
*/
const AsteroidField = ({
    neos,
    date,
    onSelect,
    onHover
}: {
    neos: NasaNeo[];
    date: Date;
    onSelect: (neo: NasaNeo) => void;
    onHover: (neo: NasaNeo | null) => void;
}) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    // 🪨 CUSTOM ASTEROID GEOMETRY GENERATION
    const rockGeometry = useMemo(() => {
        // Icosahedron with detail=1 (80 faces) gives enough vertices to distort
        const geometry = new THREE.IcosahedronGeometry(1, 4);
        const positionAttribute = geometry.getAttribute('position');
        const count = positionAttribute.count;
        const vertex = new THREE.Vector3();

        // Simplex-like noise function (simplified)
        // We want coherent noise so adjacent vertices move similarly (lumps) rather than spikes
        for (let i = 0; i < count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);

            // Simple noise based on position
            const noise = Math.sin(vertex.x * 2.5) * Math.sin(vertex.y * 2.5) * Math.sin(vertex.z * 2.5);
            const distortion = 1.0 + noise * 0.3; // -30% to +30% variation

            vertex.multiplyScalar(distortion);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }

        geometry.computeVertexNormals();
        return geometry;
    }, []);

    // Pre-calculate random shape variations so they don't jitter every frame
    const shapeModifiers = useMemo(() => {
        return Array.from({ length: Math.max(neos.length, 1000) }).map(() => ({
            scaleX: 0.8 + Math.random() * 0.4, // 0.8 - 1.2 stretch
            scaleY: 0.6 + Math.random() * 0.6, // 0.6 - 1.2 stretch
            scaleZ: 0.8 + Math.random() * 0.4,
            rotSpeedX: (Math.random() - 0.5) * 0.005,
            rotSpeedY: (Math.random() - 0.5) * 0.005
        }));
    }, [neos.length]);

    useFrame(() => {
        if (!meshRef.current) return;

        // 1. Get Earth Heliocentric Position
        const earthPosHelio = getEarthPosition(date);

        neos.forEach((neo, i) => {
            if (!neo.orbital_data) return;

            const elements = {
                semi_major_axis: parseFloat(neo.orbital_data.semi_major_axis),
                eccentricity: parseFloat(neo.orbital_data.eccentricity),
                inclination: parseFloat(neo.orbital_data.inclination),
                ascending_node_longitude: parseFloat(neo.orbital_data.ascending_node_longitude),
                perihelion_argument: parseFloat(neo.orbital_data.perihelion_argument),
                mean_anomaly: parseFloat(neo.orbital_data.mean_anomaly),
                epoch_osculation: parseFloat(neo.orbital_data.epoch_osculation),
                mean_motion: parseFloat(neo.orbital_data.mean_motion)
            };

            const neoPosHelio = getHeliocentricPosition(elements, date);

            // Re-Scaling for visibility without losing relative positions
            // Basic AU_SCALE is 100.
            // Asteroids are FAR.

            let x = (neoPosHelio.x - earthPosHelio.x) * AU_SCALE;
            let y = (neoPosHelio.y - earthPosHelio.y) * AU_SCALE;
            let z = (neoPosHelio.z - earthPosHelio.z) * AU_SCALE;

            // EARTH SCALE CORRECTION:
            // Earth is now radius 20 (scale 20).
            // We must ensure asteroids don't clip inside the giant Earth.
            // Push them out if they are within 22 units.
            const minSafeDist = 22; // Earth is 20 + clouds + aura
            const distSq = x * x + y * y + z * z;
            const dist = Math.sqrt(distSq);

            if (dist < minSafeDist) {
                // Determine direction and push
                const factor = minSafeDist / dist;
                x *= factor;
                y *= factor;
                z *= factor;
            }

            dummy.position.set(x, z, -y);

            // Random rotations
            const mod = shapeModifiers[i] || { scaleX: 1, scaleY: 1, scaleZ: 1, rotSpeedX: 0.01, rotSpeedY: 0.01 };

            // Continuous rotation based on interaction or frame? 
            // We can't easily accumulate here without state.
            // Using time-based rotation
            const time = Date.now() * 0.0005;
            dummy.rotation.x = i * 10 + time * (mod.rotSpeedX * 100);
            dummy.rotation.y = i * 20 + time * (mod.rotSpeedY * 100);

            // VISIBILITY FIX:
            // Real physics makes them invisible dots.
            // We apply "Game Logic" scaling.
            // 1. Clamp distance to visual range? No, we want accurate positions.
            // 2. Scale up inversely to distance? (Perspective compensation)
            // 3. Just make them huge.

            const scaleFactor = Math.max(1, dist / 50); // Objects further away get bigger so they are visible pixels

            const isHovered = hoveredId === i;
            // Base size: Earth is 10 units wide now.
            // We'll make asteroids 0.5 to 1.5 units. HUGE relative to real life, but good for UI.
            const realSizeLog = Math.log10(parseFloat(neo.estimated_diameter.meters.estimated_diameter_max.toFixed(0)));
            const baseSize = Math.max(0.8, realSizeLog * 0.4) * scaleFactor;

            const scale = isHovered ? baseSize * 1.5 : baseSize;

            // Apply Non-Uniform Scaling for "Potato" shape
            dummy.scale.set(
                scale * mod.scaleX,
                scale * mod.scaleY,
                scale * mod.scaleZ
            );

            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);

            // Update Color for Hover
            const color = new THREE.Color();
            if (isHovered) color.setHex(0x00ffff); // Cyan hover
            else if (neo.is_potentially_hazardous_asteroid) color.setHex(0xffaa00); // Orange/Red warning
            else color.setHex(0xaaaaaa); // Lighter grey for visible rocky look

            meshRef.current.setColorAt(i, color);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[rockGeometry, undefined, neos.length]}
            frustumCulled={false}
            onPointerOver={(e) => {
                e.stopPropagation();
                const id = e.instanceId !== undefined ? e.instanceId : null;
                setHoveredId(id);
                if (id !== null && neos[id]) onHover(neos[id]);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                setHoveredId(null);
                onHover(null);
                document.body.style.cursor = 'default';
            }}
            onClick={(e) => {
                e.stopPropagation();
                const instanceId = e.instanceId;
                if (instanceId !== undefined && neos[instanceId]) {
                    onSelect(neos[instanceId]);
                }
            }}
        >
            <meshStandardMaterial
                roughness={0.8}
                metalness={0.2}
                flatShading={true}
                color="#aaaaaa"
                envMapIntensity={1}
            />
        </instancedMesh>
    );
};

// OrbitLines component removed as per user request to hide paths on click

/* 🕹️ SIMULATION CONTROLLER */
const SimulationController = ({ speed, setSimulationDate }: { speed: number, setSimulationDate: React.Dispatch<React.SetStateAction<Date>> }) => {
    useFrame((_, delta) => {
        if (speed !== 0) {
            setSimulationDate((prevDate) => new Date(prevDate.getTime() + (delta * speed * 24 * 60 * 60 * 1000)));
        }
    });
    return null;
};

export const SolarSystem = () => {
    const [neos, setNeos] = useState<NasaNeo[]>([]);
    const [simulationDate, setSimulationDate] = useState(new Date());
    const [speed, setSpeed] = useState(0.5); // Slower default speed
    const [loading, setLoading] = useState(true);
    const [activeNeo, setActiveNeo] = useState<NasaNeo | null>(null);
    const [hoveredNeo, setHoveredNeo] = useState<NasaNeo | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchBrowseNeos();
            setNeos(data.slice(0, 500)); // Limit for performance

            // Auto Select greatest hazard to show something cool
            const hazardous = data.find(n => n.is_potentially_hazardous_asteroid);
            if (hazardous) setActiveNeo(hazardous);

            setLoading(false);
        };
        loadData();
    }, []);

    const earthPos = useMemo(() => getEarthPosition(simulationDate), [simulationDate]);

    // Calculate Sun visual position (Far away but visibly large)
    const sunPosVisual = useMemo(() => {
        // Physical direction is opposite to Earth's Hiliocentric position
        const vec = new THREE.Vector3(-earthPos.x, -earthPos.z, earthPos.y).normalize();
        return vec.multiplyScalar(8000).toArray() as [number, number, number];
    }, [earthPos]);

    return (
        <div
            className="relative w-full h-full bg-black"
            onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
        >
            {/* 📌 LEFT SIDEBAR: HUD & DETAILS */}
            <div className="absolute top-4 left-4 z-10 w-[400px] flex flex-col gap-4 max-h-[calc(100vh-140px)] overflow-y-auto pointer-events-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">

                {/* 1. HUD SENSORS */}
                <div className="bg-black/80 border border-white/20 p-4 rounded-lg backdrop-blur-md w-full shadow-[0_0_20px_rgba(0,100,255,0.2)] shrink-0 pointer-events-auto">
                    <h2 className="text-cyan-400 font-orbitron text-lg font-bold mb-1 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        ORBITAL SENSORS
                    </h2>
                    <div className="flex items-center gap-2 text-white font-mono text-sm border-b border-white/10 pb-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {simulationDate.toLocaleDateString()}
                        <span className="text-xs text-gray-500 ml-auto">{simulationDate.toLocaleTimeString()}</span>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono mb-4 text-gray-400">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-cyan-400 box-shadow-cyan" /> SAFE</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500 box-shadow-red" /> HAZARDOUS</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white box-shadow-white" /> SUN</span>
                    </div>

                    <div className="mt-2">
                        <label className="text-xs text-gray-500 block mb-1">TIME WARP FACTOR</label>
                        <input
                            type="range"
                            min="0"
                            max="5"
                            step="0.1"
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 pointer-events-auto"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>PAUSED</span>
                            <span>MAX VELOCITY</span>
                        </div>
                    </div>
                </div>

                {/* 2. DETAILS PANEL (Priority) */}
                {activeNeo && (
                    <div className="bg-black/90 border border-cyan-500 rounded-xl p-4 w-full shadow-[0_0_30px_rgba(0,100,255,0.3)] backdrop-blur-xl pointer-events-auto flex flex-col gap-4 animate-in slide-in-from-left duration-500 shrink-0">
                        <div className="flex justify-between items-start border-b border-cyan-500/30 pb-3">
                            <div>
                                <h1 className="text-2xl text-white font-bold font-orbitron">{activeNeo.name}</h1>
                                <p className="text-cyan-400 font-mono text-xs mt-1">ID: {activeNeo.id}</p>
                            </div>
                            <button className="text-gray-500 hover:text-white transition-colors" onClick={() => setActiveNeo(null)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="space-y-4 font-rajdhani text-gray-300">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="text-gray-500 block text-[9px] uppercase tracking-wider mb-1">Max Diameter</span>
                                    <span className="text-lg text-white font-mono">{activeNeo.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} <span className="text-xs text-gray-500">m</span></span>
                                </div>
                                <div className="bg-white/5 p-2 rounded">
                                    <span className="text-gray-500 block text-[9px] uppercase tracking-wider mb-1">Est. MOID</span>
                                    <span className="text-lg text-orange-400 font-mono">{parseFloat(activeNeo.orbital_data.minimum_orbit_intersection).toFixed(4)} <span className="text-xs text-gray-500">AU</span></span>
                                </div>
                            </div>

                            {activeNeo.is_potentially_hazardous_asteroid ? (
                                <div className="flex items-center gap-3 bg-red-900/20 p-2 rounded border border-red-500/50">
                                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                                    <div>
                                        <span className="text-red-500 text-xs font-bold block tracking-wider">HAZARDOUS OBJECT</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 bg-cyan-900/20 p-2 rounded border border-cyan-500/50">
                                    <Shield className="w-5 h-5 text-cyan-500" />
                                    <div>
                                        <span className="text-cyan-500 text-xs font-bold block tracking-wider">SAFE ORBIT</span>
                                    </div>
                                </div>
                            )}

                            {/* Orbital Details Compact */}
                            {activeNeo.orbital_data && (
                                <div className="bg-white/5 p-3 rounded space-y-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <span className="text-gray-500 block">Period</span>
                                            <span className="text-cyan-300 font-mono">{parseFloat(activeNeo.orbital_data.orbital_period).toFixed(1)} d</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Inclination</span>
                                            <span className="text-cyan-300 font-mono">{parseFloat(activeNeo.orbital_data.inclination).toFixed(2)}°</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Eccentricity</span>
                                            <span className="text-cyan-300 font-mono">{parseFloat(activeNeo.orbital_data.eccentricity).toFixed(3)}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 block">Abs Mag</span>
                                            <span className="text-cyan-300 font-mono">{activeNeo.absolute_magnitude_h}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <a href={activeNeo.nasa_jpl_url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-center w-full bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-600/50 text-cyan-400 py-2 rounded transition-all text-xs font-bold tracking-widest">
                                OPEN NASA JPL DATA <ExternalLink className="w-3 h-3 ml-2" />
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {/* LEFT SIDEBAR END */}

            {/* Mouse Instruction */}
            {activeNeo === null && !loading && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                    <span className="bg-black/60 px-6 py-3 rounded-full border border-cyan-500/30 text-cyan-400 text-xs font-mono shadow-[0_0_20px_rgba(0,255,255,0.2)]">
                        <MousePointer2 className="w-3 h-3 inline mr-2 animate-bounce" />
                        INTERACTIVE RADAR: CLICK OBJECTS TO SCAN
                    </span>
                </div>
            )}

            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
                    <div className="text-center">
                        <Loader2 className="w-16 h-16 text-cyan-500 animate-spin mx-auto mb-6" />
                        <p className="text-cyan-400 font-orbitron tracking-[0.3em] text-xl animate-pulse">ESTABLISHING UPLINK...</p>
                        <p className="text-gray-500 font-mono text-xs mt-2">CALIBRATING ORBITAL SENSORS</p>
                    </div>
                </div>
            )}

            {/* 🎯 HOVER LABEL (Follows Mouse) */}
            {hoveredNeo && (
                <div
                    className="fixed z-50 pointer-events-none text-cyan-400 font-mono text-xs bg-black/80 px-2 py-1 border border-cyan-500/50 rounded transform -translate-x-1/2 -translate-y-full shadow-[0_0_10px_rgba(0,255,255,0.3)]"
                    style={{ left: mousePos.x, top: mousePos.y - 15 }}
                >
                    IDENTIFIED: {hoveredNeo.name}
                </div>
            )}

            <Canvas camera={{ position: [0, 50, 150], fov: 50, far: 50000 }}>
                <color attach="background" args={['#000000']} />

                <SimulationController speed={speed} setSimulationDate={setSimulationDate} />

                {/* Lighting */}
                <ambientLight intensity={0.02} />
                <Environment preset="city" intensity={0.2} /> {/* Subtle fill light */}

                <Suspense fallback={null}>
                    {/* Luminous Galaxy Background */}
                    <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
                    <Sparkles count={2000} scale={400} size={6} speed={0} opacity={0.6} noise={0.2} color="#ffffff" />

                    <EffectComposer>
                        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={2.0} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>

                    <Earth />

                    <Sun position={sunPosVisual} />
                    <ambientLight intensity={0.1} color="#202020" />

                    {!loading && (
                        <>
                            <AsteroidField
                                neos={neos}
                                date={simulationDate}
                                onSelect={(neo) => setActiveNeo(neo)}
                                onHover={(neo) => setHoveredNeo(neo)}
                            />
                            {/* OrbitLines removed */}
                        </>
                    )}

                    <OrbitControls
                        enablePan={true}
                        minDistance={30}
                        maxDistance={1000}
                        target={[0, 0, 0]}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};
