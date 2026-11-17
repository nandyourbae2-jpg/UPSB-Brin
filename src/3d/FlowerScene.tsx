"use client";

import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { FlowerPartData } from "@/lib/flower-data";
import { flowerMotionTokens } from "@/lib/flower-tokens";
import { PART_ANCHORS } from "@/3d/anchors";
import { ProceduralFlower, type Variety3D } from "@/3d/ProceduralFlower";

interface FlowerSceneProps {
  variety: Variety3D;
  parts: readonly FlowerPartData[];
  selectedPartId: string | null;
  reducedMotion: boolean;
  resetSignal: number;
  maxDprCap?: number;
  ariaLabel: string;
  onSelectPart: (partId: string, input: "mouse" | "touch") => void;
  onFpsDegrade: (level: 1 | 2) => void;
  onWebGLError: () => void;
}

const DEFAULT_CAMERA: { position: readonly [number, number, number]; target: readonly [number, number, number] } = {
  position: [0.2, -0.3, 4.4],
  target: [0, -0.45, 0],
};

function SceneRig({
  selectedPart,
  reducedMotion,
  resetSignal,
  userInteracted,
  onUserInteract,
  controlsRef,
  flowerGroupRef,
  pinButtonsRef,
  parts,
  onDegrade,
}: {
  selectedPart: FlowerPartData | null;
  reducedMotion: boolean;
  resetSignal: number;
  userInteracted: boolean;
  onUserInteract: () => void;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  flowerGroupRef: React.RefObject<THREE.Group | null>;
  pinButtonsRef: React.RefObject<Map<string, HTMLButtonElement>>;
  parts: readonly FlowerPartData[];
  onDegrade: (level: 1 | 2) => void;
}) {
  const { camera, gl, size } = useThree();
  const flyRef = useRef<{
    active: boolean;
    elapsed: number;
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
  }>({
    active: false,
    elapsed: 0,
    fromPos: new THREE.Vector3(),
    toPos: new THREE.Vector3(),
    fromTarget: new THREE.Vector3(),
    toTarget: new THREE.Vector3(),
  });

  const projVec = useMemo(() => new THREE.Vector3(), []);
  const rayDir = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const fpsWindow = useRef({ frames: 0, time: 0, degradedLevel: 0 });

  useEffect(() => {
    const goal = selectedPart?.camera ?? DEFAULT_CAMERA;
    const toPos = new THREE.Vector3(...goal.position);
    const toTarget = new THREE.Vector3(...goal.target);
    const controls = controlsRef.current;

    if (reducedMotion) {
      camera.position.copy(toPos);
      if (controls) {
        controls.target.copy(toTarget);
        controls.update();
      }
      flyRef.current.active = false;
      return;
    }

    flyRef.current = {
      active: true,
      elapsed: 0,
      fromPos: camera.position.clone(),
      toPos,
      fromTarget: controls ? controls.target.clone() : new THREE.Vector3(...DEFAULT_CAMERA.target),
      toTarget,
    };
  }, [selectedPart, resetSignal, reducedMotion, camera, controlsRef]);

  useFrame((_, delta) => {
    // 1. Terbang kamera 600 ms (PRD §5.3).
    const fly = flyRef.current;
    const controls = controlsRef.current;
    if (fly.active) {
      fly.elapsed += delta * 1000;
      const t = Math.min(1, fly.elapsed / flowerMotionTokens.cameraFlyMs);
      const ease = 1 - (1 - t) ** 3;
      camera.position.lerpVectors(fly.fromPos, fly.toPos, ease);
      if (controls) {
        controls.target.lerpVectors(fly.fromTarget, fly.toTarget, ease);
        controls.update();
      }
      if (t >= 1) fly.active = false;
    }

    // 2. Pantau FPS & turunkan kualitas otomatis bila < 28 fps (PRD §5.5).
    const fps = fpsWindow.current;
    fps.frames += 1;
    fps.time += delta;
    if (fps.time >= 1.5) {
      const avg = fps.frames / fps.time;
      if (avg < 28 && fps.degradedLevel < 2) {
        fps.degradedLevel += 1;
        onDegrade(fps.degradedLevel as 1 | 2);
      }
      fps.frames = 0;
      fps.time = 0;
    }

    // 3. Catat metrik draw call untuk audit performa.
    if (typeof window !== "undefined") {
      const w = window as unknown as { __upsb3dDebug?: { drawCalls: number; dpr: number } };
      w.__upsb3dDebug = { drawCalls: gl.info.render.calls, dpr: gl.getPixelRatio() };
    }

    // 4. Proyeksikan pin hotspot ke koordinat layar dan sembunyikan bila terhalang objek lain.
    const pins = pinButtonsRef.current;
    const meshes = flowerGroupRef.current ? flowerGroupRef.current.children : [];
    for (const part of parts) {
      const btn = pins.get(part.id);
      if (!btn) continue;
      const anchor = PART_ANCHORS[part.id];
      if (!anchor) continue;

      projVec.set(anchor[0], anchor[1], anchor[2]);
      const distToAnchor = camera.position.distanceTo(projVec);

      // Cek apakah terhalang bagian bunga lain.
      let occluded = false;
      if (meshes.length > 0 && distToAnchor > 0.4) {
        rayDir.copy(projVec).sub(camera.position).normalize();
        raycaster.set(camera.position, rayDir);
        const hits = raycaster.intersectObjects(meshes, true);
        const firstHit = hits[0];
        if (firstHit && firstHit.distance < distToAnchor - 0.35) {
          occluded = true;
        }
      }

      projVec.project(camera);
      const inFront = projVec.z >= -1 && projVec.z <= 1;
      const x = (projVec.x * 0.5 + 0.5) * size.width;
      const y = (-projVec.y * 0.5 + 0.5) * size.height;
      const visible = !occluded && inFront && x >= 16 && x <= size.width - 16 && y >= 16 && y <= size.height - 16;

      btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%)`;
      btn.style.opacity = visible ? "1" : "0";
      btn.style.pointerEvents = visible ? "auto" : "none";
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      minDistance={1.2}
      maxDistance={6.2}
      minPolarAngle={0.2}
      maxPolarAngle={Math.PI * 0.85}
      autoRotate={!reducedMotion && !userInteracted && !selectedPart}
      autoRotateSpeed={0.9}
      onStart={() => {
        flyRef.current.active = false;
        onUserInteract();
      }}
    />
  );
}

/**
 * Kanvas WebGL interaktif dengan pengawasan FPS, batas orbit/zoom, dan pin hotspot 3D.
 */
export function FlowerScene({
  variety,
  parts,
  selectedPartId,
  reducedMotion,
  resetSignal,
  maxDprCap = 2,
  ariaLabel,
  onSelectPart,
  onFpsDegrade,
  onWebGLError,
}: FlowerSceneProps) {
  const [userInteracted, setUserInteracted] = useState(false);
  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [degradeLevel, setDegradeLevel] = useState<0 | 1 | 2>(0);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const flowerGroupRef = useRef<THREE.Group | null>(null);
  const pinButtonsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const selectedPart = useMemo(() => parts.find((p) => p.id === selectedPartId) ?? null, [parts, selectedPartId]);
  const dpr = degradeLevel === 0 ? maxDprCap : degradeLevel === 1 ? Math.min(1.5, maxDprCap) : 1;

  function handleDegrade(level: 1 | 2) {
    setDegradeLevel(level);
    onFpsDegrade(level);
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div role="img" aria-label={ariaLabel} className="h-full w-full">
        <Canvas
          dpr={[1, dpr]}
          camera={{ position: [...DEFAULT_CAMERA.position], fov: 42, near: 0.1, far: 40 }}
          gl={{ antialias: degradeLevel < 2, powerPreference: "default" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              onWebGLError();
            });
          }}
        >
          <ambientLight intensity={0.82} />
          <directionalLight position={[2.5, 4, 3.5]} intensity={1.15} />
          {degradeLevel < 2 ? <directionalLight position={[-3, -2, -2]} intensity={0.45} /> : null}

          <ProceduralFlower
            variety={variety}
            selectedPartId={selectedPartId}
            hoveredPartId={hoveredPartId}
            reducedMotion={reducedMotion}
            onSelectPart={onSelectPart}
            onHoverPart={setHoveredPartId}
            flowerGroupRef={flowerGroupRef}
          />

          <SceneRig
            selectedPart={selectedPart}
            reducedMotion={reducedMotion}
            resetSignal={resetSignal}
            userInteracted={userInteracted}
            onUserInteract={() => setUserInteracted(true)}
            controlsRef={controlsRef}
            flowerGroupRef={flowerGroupRef}
            pinButtonsRef={pinButtonsRef}
            parts={parts}
            onDegrade={handleDegrade}
          />
        </Canvas>
      </div>

      {/* Lapisan penanda HotspotPin (ikon teks, urutan tab tetap tenang karena jalur keyboard utama ada di PartChips) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {parts.map((part) => {
          const isSelected = selectedPartId === part.id;
          return (
            <button
              key={part.id}
              type="button"
              tabIndex={-1}
              ref={(el) => {
                if (el) pinButtonsRef.current.set(part.id, el);
                else pinButtonsRef.current.delete(part.id);
              }}
              onClick={() => onSelectPart(part.id, "mouse")}
              className={
                isSelected
                  ? "absolute top-0 left-0 inline-flex items-center gap-1 rounded-pill border border-primary bg-primary px-3 py-1 text-caption font-bold text-on-primary shadow-e2"
                  : "absolute top-0 left-0 inline-flex items-center gap-1 rounded-pill border border-line bg-surface px-3 py-1 text-caption font-bold text-ink shadow-e1 hover:border-primary"
              }
            >
              <span
                className={
                  reducedMotion
                    ? "size-2 rounded-pill bg-primary"
                    : "hotspot-dot size-2 rounded-pill bg-primary"
                }
                style={isSelected ? { backgroundColor: "currentColor" } : undefined}
              />
              <span>{part.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
