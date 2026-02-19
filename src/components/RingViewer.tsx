import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    useGLTF,
    useEnvironment,
    MeshRefractionMaterial,
    ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import type { GLTF } from 'three-stdlib';

// ─── Asset Paths ───────────────────────────────────────────────────────────────
const MODEL_PATH = '/3d_models/Ring_Raw.glb';
const HDR_PATH = '/hdr/brown_photostudio_02_4k_copy.exr';

// ─── Types ──────────────────────────────────────────────────────────────────────
type GLTFResult = GLTF & {
    nodes: Record<string, THREE.Mesh>;
};

// ─── Ring (Gold) ──────────────────────────────────────────────────────────────
// Uses a fresh <mesh> with cloned geometry to avoid potential matrix/shader issues.
// Added debug sphere for comparison.
function Ring({ node, envMap }: { node: THREE.Mesh; envMap: THREE.Texture }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    const geometry = useMemo(() => {
        const geo = node.geometry.clone();
        if (!geo.attributes.normal) {
            geo.computeVertexNormals();
        }
        return geo;
    }, [node.geometry]);

    useEffect(() => {
        if (meshRef.current) {
            node.updateWorldMatrix(true, false);
            meshRef.current.matrix.copy(node.matrixWorld);
            meshRef.current.matrixAutoUpdate = false;
        }
    }, [node]);

    return (
        <group>
            {/* Real GLB Ring - using DoubleSide to ensure visibility */}
            <mesh
                ref={meshRef}
                geometry={geometry}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial
                    color="#C0C0C0"
                    metalness={1}
                    roughness={0.1}
                    envMap={envMap}
                    envMapIntensity={2.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Debug Procedural Sphere - offset to the left */}
            {/* <mesh position={[-2, 0, 0]} castShadow receiveShadow>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={1}
                    roughness={0.15}
                    envMap={envMap}
                    envMapIntensity={2}
                />
            </mesh> */}
        </group>
    );
}

// ─── Diamond ──────────────────────────────────────────────────────────────────
function Diamond({ node, envMap }: { node: THREE.Mesh; envMap: THREE.Texture }) {
    const meshRef = useRef<THREE.Mesh>(null!);

    // ─── ГЕОМЕТРИЯ ────────────────────────────────────────────────────────
    const geometry = useMemo(() => {
        const geo = node.geometry.clone();
        // Превращаем в Flat Shading (Острые грани)
        const flatGeo = geo.toNonIndexed();
        flatGeo.computeVertexNormals();
        return flatGeo;
    }, [node.geometry]);

    // ─── ПОЗИЦИОНИРОВАНИЕ ─────────────────────────────────────────────────
    // Если алмаз улетает, лучше использовать <primitive object={node} /> 
    // вместо создания нового меша. Но если нужен этот способ:
    useLayoutEffect(() => {
        if (meshRef.current) {
            // Копируем трансформации из исходного узла
            meshRef.current.position.copy(node.position);
            meshRef.current.rotation.copy(node.rotation);
            meshRef.current.scale.copy(node.scale);

            // Если у узла есть родители, нужно копировать world matrix, 
            // но проще просто скопировать локальные, если иерархия простая.
        }
    }, [node]);

    return (
        <group>
            {/* Реальный алмаз из GLB */}
            <mesh
                ref={meshRef}
                geometry={geometry}
                castShadow
            // receiveShadow // Алмазы обычно не принимают тени, они их преломляют
            >
                <MeshRefractionMaterial
                    envMap={envMap}
                    bounces={2}
                    ior={2.4}
                    aberrationStrength={0.02}
                    color="#E0E5E9"
                    fastChroma={true}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Дебаг (справа) */}
            {/* <mesh position={[2, 0, 0]} castShadow>
                <icosahedronGeometry args={[0.5, 0]} />
                <MeshRefractionMaterial
                    envMap={envMap}
                    bounces={3}
                    ior={2.4}
                    aberrationStrength={0.03}
                    color="white"
                    fastChroma={true}
                />
            </mesh> */}
        </group>
    );
}

// ─── Model ──────────────────────────────────────────────────────────────────────
function Model({ envMap }: { envMap: THREE.Texture }) {
    const { nodes } = useGLTF(MODEL_PATH) as unknown as GLTFResult;

    return (
        <group dispose={null}>
            {Object.entries(nodes).map(([name, node]) => {
                if (!node.isMesh) return null;

                const key = name.toLowerCase();
                const isRing = key.includes('ring');
                const isDiamond = key.includes('diamond') || key.includes('gem');

                if (isRing) {
                    return <Ring key={name} node={node} envMap={envMap} />;
                }

                if (isDiamond) {
                    return <Diamond key={name} node={node} envMap={envMap} />;
                }

                return <primitive key={name} object={node} />;
            })}
        </group>
    );
}

// ─── Scene Content ──────────────────────────────────────────────────────────────
// Exact same pattern as DebugScene: useEnvironment → directly into envMap prop.
// No PMREMGenerator, no Bvh wrapper — those caused the CUBEUV macro conflict.
function SceneContent() {
    const envMap = useEnvironment({ files: HDR_PATH });

    return (
        <>
            <Environment map={envMap} />
            <Model envMap={envMap} />
            <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                blur={2.5}
                far={4}
            />
            <OrbitControls makeDefault />
        </>
    );
}

// ─── Public Component ───────────────────────────────────────────────────────────
export default function RingViewer() {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 1], fov: 45 }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ width: '100vw', height: '100vh' }}
        >
            <Suspense fallback={null}>
                <SceneContent />
            </Suspense>
        </Canvas>
    );
}

useGLTF.preload(MODEL_PATH);
