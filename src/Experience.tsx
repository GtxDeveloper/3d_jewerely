import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';


export function Experience() {
    return (
        <Canvas
            shadows
            camera={{ position: [0, 2, 5], fov: 45 }}
            gl={{ antialias: true, toneMapping: 3 /* ACESFilmicToneMapping */ }}
        >
            <Suspense fallback={null}>
                <Environment
                    files="/hdr/brown_photostudio_02_4k.exr"
                    background
                />

            </Suspense>
            <OrbitControls makeDefault />
        </Canvas>
    );
}
