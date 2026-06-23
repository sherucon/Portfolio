"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader, extend } from "@react-three/fiber";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ─── Replace with your actual Cloudflare R2 URL ───────────────────────────────
const MODEL_URL = "https://r2.sherucon.tech/losill.stl";

// ─── Glass material ───────────────────────────────────────────────────────────
const glassMaterial = new THREE.MeshPhysicalMaterial({
  transmission: 1,
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
  // ── These two drive the bloom glow ──────────────────
  emissive: new THREE.Color(0xff1500), // surface radiates red
  emissiveIntensity: 2, // ↑ raise for stronger surface glow
});

// ─── Studio lighting ──────────────────────────────────────────────────────────
function StudioLights() {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Key light — large area, rear-left (135°)
  const keyPos = new THREE.Vector3(
    Math.sin(toRad(45)) * 6,
    3,
    Math.cos(toRad(45)) * 6,
  );

  // Fill light — large area, rear-right (-135°)
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
      <directionalLight position={[0, 0, 8]} intensity={0.4} color="#e8f0ff" />

      {/* Top rim */}
      <directionalLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />

      {/* Object-source light — makes surroundings feel lit by the object */}
      {/* <pointLight
        position={[0, 0, 0]}
        intensity={20}
        distance={8}
        color="#ff2200"
      /> */}
    </>
  );
}

// ─── HDRI environment (hidden bg, visible reflections) ───────────────────────
function HiddenEnvironment() {
  const { scene, gl } = useThree();

  useEffect(() => {
    // Use PMREMGenerator to create a basic studio-like env from a gradient
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    // Build a simple 2-tone sky sphere as a stand-in env map
    // (avoids needing an external .hdr file)
    const envScene = new THREE.Scene();

    const topLight = new THREE.DirectionalLight(0xffffff, 2);
    topLight.position.set(0, 1, 0);
    envScene.add(topLight);

    const rimL = new THREE.DirectionalLight(0xaaaaff, 1.5);
    rimL.position.set(1, 0.5, -1);
    envScene.add(rimL);

    const rimR = new THREE.DirectionalLight(0xaaaaff, 1.5);
    rimR.position.set(-1, 0.5, -1);
    envScene.add(rimR);

    // Gradient sphere for environment
    const sphereGeo = new THREE.SphereGeometry(50, 32, 16);
    const topColor = new THREE.Color(0x333333);
    const botColor = new THREE.Color(0x000000);
    const colors: number[] = [];
    const posArr = sphereGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < posArr.length / 3; i++) {
      const y = posArr[i * 3 + 1];
      const t = (y / 50 + 1) / 2;
      const c = botColor.clone().lerp(topColor, t);
      colors.push(c.r, c.g, c.b);
    }
    sphereGeo.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3),
    );

    const sphereMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      side: THREE.BackSide,
    });
    envScene.add(new THREE.Mesh(sphereGeo, sphereMat));

    const envMap = pmrem.fromScene(envScene).texture;

    // Apply env to scene (reflections) but keep background BLACK
    scene.environment = envMap;
    scene.background = new THREE.Color("#000000");

    return () => {
      pmrem.dispose();
      envMap.dispose();
    };
  }, [scene, gl]);

  return null;
}

// ─── STL model ────────────────────────────────────────────────────────────────
function Model() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geometry = useLoader(STLLoader, MODEL_URL);

  useEffect(() => {
    if (!geometry) return;

    // Compute normals for smooth shading
    geometry.computeVertexNormals();

    // Center the geometry
    geometry.center();

    // Auto-scale to ~45% viewport height
    const box = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);

    // Camera is at z=5, fov 42. At z=0, visible height = 2 * tan(21°) * 5 ≈ 3.84
    const targetHeight = 3.84 * 0.45;
    const scale = targetHeight / maxDim;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
  }, [geometry]);

  // Slow Y-axis rotation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0225;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={glassMaterial}
      position={[0, 0, 0]}
    />
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
      <HiddenEnvironment />
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
    <div className="w-full h-full" style={{ background: "#000000" }}>
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
