"use client";

import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { buildMeshToPartMap } from "@/lib/flower-data";
import { flower3dTokens } from "@/lib/flower-tokens";

export type Variety3D = "fabiola" | "claire";

interface ProceduralFlowerProps {
  variety: Variety3D;
  selectedPartId: string | null;
  hoveredPartId: string | null;
  reducedMotion: boolean;
  onSelectPart: (partId: string, input: "mouse" | "touch") => void;
  onHoverPart: (partId: string | null) => void;
  flowerGroupRef?: React.RefObject<THREE.Group | null>;
}

function createHeartPetalGeometry(width: number, height: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-width * 0.68, height * 0.28, -width * 0.88, height * 0.88, -width * 0.24, height * 0.98);
  s.bezierCurveTo(-width * 0.08, height, -width * 0.02, height * 0.88, 0, height * 0.84);
  s.bezierCurveTo(width * 0.02, height * 0.88, width * 0.08, height, width * 0.24, height * 0.98);
  s.bezierCurveTo(width * 0.88, height * 0.88, width * 0.68, height * 0.28, 0, 0);

  const geom = new THREE.ExtrudeGeometry(s, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 2,
    curveSegments: 14,
  });
  geom.center();
  geom.translate(0, height * 0.42, 0);
  return geom;
}

function createSerratedLeafGeometry(length: number, width: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  // Sisi kiri bergerigi halus
  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const w = Math.sin(t * Math.PI) * width * 0.5;
    const notch = i < steps ? 0.035 : 0;
    s.lineTo(-w - notch, length * (t - 0.04));
    s.lineTo(-w, length * t);
  }
  s.lineTo(0, length * 1.04);
  // Sisi kanan bergerigi halus
  for (let i = steps; i >= 1; i--) {
    const t = i / steps;
    const w = Math.sin(t * Math.PI) * width * 0.5;
    const notch = i < steps ? 0.035 : 0;
    s.lineTo(w, length * t);
    s.lineTo(w + notch, length * (t - 0.04));
  }
  s.closePath();

  const geom = new THREE.ExtrudeGeometry(s, {
    depth: 0.018,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 1,
    curveSegments: 8,
  });
  return geom;
}

function createSpurGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.36, -0.02),
    new THREE.Vector3(0, 0.28, -0.34),
    new THREE.Vector3(0.03, 0.14, -0.62),
    new THREE.Vector3(0.14, -0.04, -0.74),
    new THREE.Vector3(0.24, -0.16, -0.64),
  ]);
  const geom = new THREE.TubeGeometry(curve, 24, 0.055, 10, false);
  const pos = geom.attributes.position;
  if (pos) {
    // Runcingkan taji menuju ujung nektar.
    for (let i = 0; i < pos.count; i++) {
      const ringIndex = Math.floor(i / 11);
      const t = ringIndex / 24;
      const point = curve.getPointAt(Math.min(1, Math.max(0, t)));
      const factor = 1 - t * 0.72;
      pos.setXYZ(
        i,
        point.x + (pos.getX(i) - point.x) * factor,
        point.y + (pos.getY(i) - point.y) * factor,
        point.z + (pos.getZ(i) - point.z) * factor,
      );
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  }
  return geom;
}

function createTaperedTube(points: THREE.Vector3[], radiusStart: number, radiusEnd: number): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3(points);
  const segments = 16;
  const radial = 8;
  const geom = new THREE.TubeGeometry(curve, segments, radiusStart, radial, false);
  const pos = geom.attributes.position;
  if (pos) {
    for (let i = 0; i < pos.count; i++) {
      const ring = Math.floor(i / (radial + 1));
      const t = ring / segments;
      const center = curve.getPointAt(Math.min(1, Math.max(0, t)));
      const factor = (radiusStart + (radiusEnd - radiusStart) * t) / radiusStart;
      pos.setXYZ(
        i,
        center.x + (pos.getX(i) - center.x) * factor,
        center.y + (pos.getY(i) - center.y) * factor,
        center.z + (pos.getZ(i) - center.z) * factor,
      );
    }
    pos.needsUpdate = true;
    geom.computeVertexNormals();
  }
  return geom;
}

/**
 * Model prosedural Pacar Air v1 (Rule 02).
 * Seluruh nama mesh mengikuti kontrak tepat di data/flower-hotspots.json agar v2 GLB tinggal menukar geometri.
 */
export function ProceduralFlower({
  variety,
  selectedPartId,
  hoveredPartId,
  reducedMotion,
  onSelectPart,
  onHoverPart,
  flowerGroupRef,
}: ProceduralFlowerProps) {
  const corollaRef = useRef<THREE.Group>(null);
  const bloomElapsed = useRef(reducedMotion ? 1 : 0);
  const meshToPart = useMemo(() => buildMeshToPartMap(), []);
  const varietyColors = flower3dTokens[variety];
  const isClaire = variety === "claire";
  const petalScale = isClaire ? 1.16 : 1.0;

  const geometries = useMemo(() => {
    const upperPetal = createHeartPetalGeometry(0.56, 0.62);
    const wingPetal = createHeartPetalGeometry(0.62, 0.72);
    const lateralSepal = createSerratedLeafGeometry(0.26, 0.14);
    const leaf = createSerratedLeafGeometry(0.66, 0.34);
    const spur = createSpurGeometry();
    const stem = createTaperedTube(
      [
        new THREE.Vector3(0, -1.72, 0),
        new THREE.Vector3(-0.04, -1.1, 0.02),
        new THREE.Vector3(0.03, -0.4, 0.04),
        new THREE.Vector3(0, 0.32, 0),
      ],
      0.068,
      0.042,
    );
    const capsulePedicel = createTaperedTube(
      [
        new THREE.Vector3(-0.01, -0.25, 0.03),
        new THREE.Vector3(-0.22, -0.3, 0.1),
        new THREE.Vector3(-0.38, -0.44, 0.14),
      ],
      0.022,
      0.016,
    );
    const rootA = createTaperedTube(
      [
        new THREE.Vector3(0, -1.7, 0),
        new THREE.Vector3(-0.18, -1.96, 0.1),
        new THREE.Vector3(-0.34, -2.28, 0.16),
      ],
      0.038,
      0.008,
    );
    const rootB = createTaperedTube(
      [
        new THREE.Vector3(0, -1.7, 0),
        new THREE.Vector3(0.04, -2.02, -0.06),
        new THREE.Vector3(0.08, -2.38, -0.14),
      ],
      0.042,
      0.009,
    );
    const rootC = createTaperedTube(
      [
        new THREE.Vector3(0, -1.7, 0),
        new THREE.Vector3(0.22, -1.94, 0.14),
        new THREE.Vector3(0.36, -2.24, 0.2),
      ],
      0.034,
      0.008,
    );
    const capsule = new THREE.SphereGeometry(0.13, 14, 12);
    capsule.scale(0.82, 1.65, 0.82);

    const node = new THREE.TorusGeometry(0.064, 0.022, 8, 16);
    node.rotateX(Math.PI / 2);

    const anther = new THREE.SphereGeometry(0.11, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62);
    const pistil = new THREE.CylinderGeometry(0.042, 0.064, 0.22, 10);
    const bud = new THREE.SphereGeometry(0.11, 10, 10);
    bud.scale(0.9, 1.35, 0.9);

    return {
      upperPetal,
      wingPetal,
      lateralSepal,
      leaf,
      spur,
      stem,
      capsulePedicel,
      rootA,
      rootB,
      rootC,
      capsule,
      node,
      anther,
      pistil,
      bud,
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((g) => g.dispose());
    };
  }, [geometries]);

  const materials = useMemo(() => {
    const mk = (color: string, roughness = 0.55) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness: 0.04,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0,
      });
    return {
      mahkota: mk(varietyColors.petal, 0.45),
      taji: mk(varietyColors.petalEdge, 0.5),
      benangsari: mk(flower3dTokens.pollen, 0.4),
      putik: mk(varietyColors.throat, 0.45),
      kapsul: mk(flower3dTokens.stem, 0.5),
      daun: mk(flower3dTokens.leaf, 0.58),
      batang: mk(flower3dTokens.stem, 0.62),
      akar: mk(flower3dTokens.root, 0.72),
    };
  }, [varietyColors]);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  useFrame((_, delta) => {
    // Mekar satu kali saat pertama kali dibuka (XP-01, anti-slop #5).
    if (corollaRef.current) {
      if (reducedMotion) {
        corollaRef.current.scale.setScalar(petalScale);
      } else if (bloomElapsed.current < 1) {
        bloomElapsed.current = Math.min(1, bloomElapsed.current + delta / 0.85);
        const eased = 1 - (1 - bloomElapsed.current) ** 3;
        const s = (0.18 + 0.82 * eased) * petalScale;
        corollaRef.current.scale.setScalar(s);
      } else {
        corollaRef.current.scale.setScalar(petalScale);
      }
    }

    // Sorot bagian terpilih atau yang di-hover.
    for (const [partKey, mat] of Object.entries(materials)) {
      const target = selectedPartId === partKey ? 0.5 : hoveredPartId === partKey ? 0.2 : 0;
      mat.emissiveIntensity += (target - mat.emissiveIntensity) * Math.min(1, delta * 12);
    }
  });

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation();
    // Abaikan lepas seret orbit agar memutar bunga tidak membuka info secara tidak sengaja.
    if (e.delta > 6) return;
    const partId = meshToPart.get(e.object.name);
    if (!partId) return;
    const pointerType = (e.nativeEvent as PointerEvent | undefined)?.pointerType === "touch" ? "touch" : "mouse";
    onSelectPart(partId, pointerType);
  }

  function handlePointerOver(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    const partId = meshToPart.get(e.object.name);
    if (partId) {
      document.body.style.cursor = "pointer";
      onHoverPart(partId);
    }
  }

  function handlePointerOut(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    onHoverPart(null);
  }

  return (
    <group ref={flowerGroupRef} onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      {/* Kepala bunga: mahkota, taji, benang sari, putik */}
      <group ref={corollaRef} position={[0, 0.36, 0]}>
        <mesh name="petal_upper" geometry={geometries.upperPetal} material={materials.mahkota} position={[0, 0.24, 0.08]} rotation={[-0.22, 0, 0]} />
        <mesh
          name="petal_wing_l"
          geometry={geometries.wingPetal}
          material={materials.mahkota}
          position={[-0.14, 0.08, 0.14]}
          rotation={[0.25, 0.22, 1.32]}
        />
        <mesh
          name="petal_wing_r"
          geometry={geometries.wingPetal}
          material={materials.mahkota}
          position={[0.14, 0.08, 0.14]}
          rotation={[0.25, -0.22, -1.32]}
        />

        {/* Sepal bertaji melengkung ke belakang dan dua sepal lateral */}
        <mesh name="sepal_spur" geometry={geometries.spur} material={materials.taji} position={[0, -0.34, 0]} />
        <mesh
          name="sepal_lateral_l"
          geometry={geometries.lateralSepal}
          material={materials.taji}
          position={[-0.14, 0.02, -0.08]}
          rotation={[0.3, 0.4, 0.9]}
        />
        <mesh
          name="sepal_lateral_r"
          geometry={geometries.lateralSepal}
          material={materials.taji}
          position={[0.14, 0.02, -0.08]}
          rotation={[0.3, -0.4, -0.9]}
        />

        {/* Benang sari (tudung) dan putik/bakal buah */}
        <mesh name="anthers_cap" geometry={geometries.anther} material={materials.benangsari} position={[0, 0.0, 0.28]} rotation={[0.55, 0, 0]} />
        <mesh name="pistil_ovary" geometry={geometries.pistil} material={materials.putik} position={[0, -0.1, 0.2]} rotation={[0.45, 0, 0]} />

        {/* Ciri Fabiola: percabangan sekunder & kuncup tambahan (PRD §5.3) */}
        {variety === "fabiola" ? (
          <group>
            <mesh name="petal_wing_l" geometry={geometries.bud} material={materials.mahkota} position={[-0.56, -0.34, -0.05]} rotation={[0.2, 0, 0.4]} />
            <mesh name="petal_wing_r" geometry={geometries.bud} material={materials.mahkota} position={[0.56, -0.22, 0.04]} rotation={[0.1, 0, -0.45]} />
          </group>
        ) : null}
      </group>

      {/* Kapsul buah di tangkai samping */}
      <mesh geometry={geometries.capsulePedicel} material={materials.batang} />
      <mesh name="capsule" geometry={geometries.capsule} material={materials.kapsul} position={[-0.38, -0.54, 0.14]} rotation={[0.12, 0, 0.25]} />

      {/* Daun bergerigi halus */}
      <mesh
        name="leaf_a"
        geometry={geometries.leaf}
        material={materials.daun}
        position={[-0.04, -0.74, 0.04]}
        rotation={[0.55, 0.35, 1.15]}
      />
      <mesh
        name="leaf_b"
        geometry={geometries.leaf}
        material={materials.daun}
        position={[0.04, -0.95, 0.02]}
        rotation={[0.48, -0.4, -1.18]}
      />
      <mesh
        name="leaf_c"
        geometry={geometries.leaf}
        material={materials.daun}
        position={[-0.03, -1.26, 0.06]}
        rotation={[0.62, 0.25, 1.05]}
      />

      {/* Batang utama dan ruas */}
      <mesh name="stem" geometry={geometries.stem} material={materials.batang} />
      <mesh name="node_a" geometry={geometries.node} material={materials.batang} position={[-0.01, -0.74, 0.03]} />
      <mesh name="node_b" geometry={geometries.node} material={materials.batang} position={[-0.02, -1.25, 0.02]} />

      {/* Akar stek berakar */}
      <mesh name="root_a" geometry={geometries.rootA} material={materials.akar} />
      <mesh name="root_b" geometry={geometries.rootB} material={materials.akar} />
      <mesh name="root_c" geometry={geometries.rootC} material={materials.akar} />
    </group>
  );
}
