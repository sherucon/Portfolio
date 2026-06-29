"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ─── Replace with your actual Cloudflare R2 URL ───────────────────────────────
const MODEL_URL = "https://r2.sherucon.tech/losill.glb";

// ─── Glass material ───────────────────────────────────────────────────────────
const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1.3,
  roughness: 0.12,
  metalness: 0,
  ior: 1.52,
  thickness: 2.5,
  clearcoat: 1,
  clearcoatRoughness: 0,
  transparent: true,
  side: THREE.DoubleSide,
  color: new THREE.Color(0xff1500),
  attenuationColor: new THREE.Color(0xff1500),
  attenuationDistance: 3,
});

// ─── Studio lighting ──────────────────────────────────────────────────────────
function StudioLights() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Key light — large area, rear-left (45°)
  const keyPos = new THREE.Vector3(
    Math.sin(toRad(45)) * 6,
    3,
    Math.cos(toRad(45)) * 6,
  );

  // Fill light — large area, rear-right (-45°)
  const fillPos = new THREE.Vector3(
    Math.sin(toRad(-45)) * 6,
    2,
    Math.cos(toRad(-45)) * 6,
  );

  return (
    <>
      {/* Key light — red rim */}
      <rectAreaLight
        position={keyPos}
        intensity={180}
        width={8}
        height={8}
        color="#ff2200"
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      {/* Fill light — red rim */}
      <rectAreaLight
        position={fillPos}
        intensity={110}
        width={8}
        height={8}
        color="#ff2200"
        onUpdate={(self) => self.lookAt(0, 0, 0)}
      />

      {/* Soft front fill — prevents center going full black */}
      <directionalLight position={[0, 0, -8]} intensity={0.4} color="#e8f0ff" />

      {/* Top rim */}
      <directionalLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />
    </>
  );
}

// ─── GLB model ────────────────────────────────────────────────────────────────
function Model() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    if (!scene || !groupRef.current) return;

    // Apply glass material to every mesh in the GLB scene
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = glassMaterial;
      }
    });

    // Auto-scale to ~45% viewport height
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Camera is at z=5, fov 42. At z=0, visible height = 2 * tan(21°) * 5 ≈ 3.84
    const targetHeight = 3.84 * 0.45;
    const scale = (1.3 * targetHeight) / maxDim;

    // Center the scene and apply scale
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    groupRef.current.scale.setScalar(scale);
  }, [scene]);

  // Slow Y-axis rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0225;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

// ─── Loading fallback ─────────────────────────────────────────────────────────
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshBasicMaterial color="#333333" />
    </mesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* <HiddenEnvironment /> */}
      <StudioLights />
      <Suspense fallback={<Loader />}>
        <Model />
      </Suspense>
      <EffectComposer>
        <Bloom
          blendFunction={BlendFunction.ADD}
          intensity={1}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.5}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export default function LosIll() {
  return (
    <div className="w-full h-full" style={{ background: "#ffffff" }}>
      <Canvas
        camera={{ fov: 42, position: [0, 0, 5], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
