import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    Environment,
    useEnvironment,
    MeshRefractionMaterial,
} from '@react-three/drei';
import * as THREE from 'three';

const HDR_PATH = '/hdr/brown_photostudio_02_4k.exr';

function SceneContent() {
    const envMap = useEnvironment({ files: HDR_PATH });

    return (
        <>
            <Environment map={envMap} background />

            {/* Gold Sphere */}
            <mesh position={[-1.5, 0, 0]} castShadow receiveShadow>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial
                    color="#FFD700"
                    metalness={1}
                    roughness={0.1}
                    envMap={envMap}
                    envMapIntensity={1}
                />
            </mesh>

            {/* Diamond Polyhedron */}
            <mesh position={[1.5, 0, 0]}>
                <icosahedronGeometry args={[1, 0]} />
                <MeshRefractionMaterial
                    envMap={envMap}
                    bounces={3}
                    ior={2.4}
                    aberrationStrength={0.04}
                    color="white"
                    fastChroma={true}
                />
            </mesh>

            <OrbitControls makeDefault />
        </>
    );
}

export default function DebugScene() {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 5] }}
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            style={{ width: '100vw', height: '100vh' }}
        >
            <Suspense fallback={null}>
                <SceneContent />
            </Suspense>
        </Canvas>
    );
}
