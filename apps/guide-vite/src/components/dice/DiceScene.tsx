import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, RigidBody, CuboidCollider, ConvexHullCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { getDieModel, type DieKind } from './geometry';
import { readUpFace } from './readFace';

export interface ThrowSpec {
  id: string;
  kind: DieKind;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w: number };
  linvel: { x: number; y: number; z: number };
  angvel: { x: number; y: number; z: number };
}

export interface FaceRead {
  value: number;
  label: string;
  confidence: number;
}

const LOOK: Record<DieKind, { color: string; ink: string; roughness: number; metalness: number; clearcoat: number }> = {
  d4: { color: '#f4e7c8', ink: '#6a3d12', roughness: 0.4, metalness: 0.06, clearcoat: 0.35 },
  d6: { color: '#f6f1e6', ink: '#1c1917', roughness: 0.36, metalness: 0.05, clearcoat: 0.3 },
  d8: { color: '#d5eee3', ink: '#0d3b32', roughness: 0.3, metalness: 0.08, clearcoat: 0.5 },
  d10: { color: '#e3eef8', ink: '#16324f', roughness: 0.28, metalness: 0.1, clearcoat: 0.55 },
  d12: { color: '#f0e3f6', ink: '#4a1d68', roughness: 0.28, metalness: 0.12, clearcoat: 0.58 },
  d20: { color: '#8c1c28', ink: '#f8e7b0', roughness: 0.2, metalness: 0.24, clearcoat: 0.72 },
  d10ones: { color: '#1b2430', ink: '#f4d48a', roughness: 0.26, metalness: 0.22, clearcoat: 0.6 },
  d10tens: { color: '#2a3548', ink: '#f4d48a', roughness: 0.26, metalness: 0.22, clearcoat: 0.6 }
};

const textureCache = new Map<string, THREE.CanvasTexture>();

function numberTexture(label: string, ink: string) {
  const key = `${label}|${ink}`;
  const cached = textureCache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    const fallback = new THREE.CanvasTexture(canvas);
    textureCache.set(key, fallback);
    return fallback;
  }
  ctx.clearRect(0, 0, 256, 256);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = label.length > 2 ? '700 92px Cinzel, Palatino, Georgia, serif' : '700 138px Cinzel, Palatino, Georgia, serif';
  ctx.lineWidth = 10;
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.strokeText(label, 128, 142);
  ctx.fillStyle = ink;
  ctx.fillText(label, 128, 142);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  textureCache.set(key, tex);
  return tex;
}

function feltTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);
  ctx.fillStyle = '#641826';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 214, 170, 0.045)' : 'rgba(0, 0, 0, 0.07)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1.5, 1.5);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2.2, 1.6);
  return tex;
}

function DieBody({
  spec,
  highlight,
  onSettled
}: {
  spec: ThrowSpec;
  highlight: boolean;
  onSettled: (id: string, face: FaceRead) => void;
}) {
  const body = useRef<RapierRigidBody>(null);
  const blob = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const launched = useRef(false);
  const settled = useRef(false);
  const still = useRef(0);
  const frames = useRef(0);
  const model = useMemo(() => getDieModel(spec.kind), [spec.kind]);
  const look = LOOK[spec.kind];
  const labels = useMemo(
    () =>
      model.faces.map((face) => ({
        face,
        texture: numberTexture(face.label, look.ink)
      })),
    [model, look.ink]
  );

  useFrame(() => {
    const rb = body.current;
    if (!rb) return;
    if (!launched.current) {
      launched.current = true;
      rb.setTranslation(spec.position, true);
      rb.setRotation(spec.rotation, true);
      rb.setLinvel(spec.linvel, true);
      rb.setAngvel(spec.angvel, true);
      return;
    }
    const t = rb.translation();
    const v = rb.linvel();
    const a = rb.angvel();
    const speed = Math.hypot(v.x, v.y, v.z);
    const spin = Math.hypot(a.x, a.y, a.z);
    frames.current += 1;

    if (blob.current) {
      const air = THREE.MathUtils.clamp((t.y - 0.2) / 2.4, 0, 1);
      blob.current.position.set(t.x, 0.045, t.z);
      blob.current.scale.setScalar(1 + air * 0.85);
      const mat = blob.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.34 * (1 - air * 0.75);
    }
    if (ring.current) {
      ring.current.position.set(t.x, 0.06, t.z);
      ring.current.visible = highlight;
    }

    if (settled.current) return;

    if (t.y < -1.5 && frames.current < 90) {
      rb.setTranslation({ x: spec.position.x * 0.4, y: 2.2, z: spec.position.z * 0.4 }, true);
      rb.setLinvel({ x: 0, y: 1, z: 0 }, true);
      return;
    }

    const resting = speed < 0.06 && spin < 0.09 && t.y < 1.15;
    if (resting) still.current += 1;
    else still.current = 0;

    if (still.current > 16 || frames.current > 420) {
      const face = readUpFace(rb.rotation(), model.faces);
      if (face.confidence > 0.62 || frames.current > 420) {
        settled.current = true;
        rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
        rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
        onSettled(spec.id, face);
      }
    }
  });

  return (
    <group>
      <RigidBody
        ref={body}
        colliders={false}
        restitution={0.38}
        friction={0.72}
        linearDamping={0.18}
        angularDamping={0.32}
        ccd
        canSleep
      >
        <ConvexHullCollider args={[model.hull]} />
        <mesh geometry={model.geometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color={look.color}
            roughness={look.roughness}
            metalness={look.metalness}
            clearcoat={look.clearcoat}
            clearcoatRoughness={0.28}
          />
        </mesh>
        {labels.map(({ face, texture }) => (
          <mesh
            key={`${face.value}-${face.normal.x.toFixed(3)}-${face.normal.y.toFixed(3)}-${face.normal.z.toFixed(3)}`}
            position={face.center.clone().add(face.normal.clone().multiplyScalar(0.012))}
            quaternion={face.quaternion}
          >
            <planeGeometry args={[face.label.length > 1 ? face.labelSize * 0.92 : face.labelSize, face.labelSize]} />
            <meshBasicMaterial map={texture} transparent polygonOffset polygonOffsetFactor={-1} toneMapped={false} />
          </mesh>
        ))}
      </RigidBody>
      <mesh ref={blob} rotation={[-Math.PI / 2, 0, 0]} position={[spec.position.x, 0.045, spec.position.z]}>
        <circleGeometry args={[0.32, 24]} />
        <meshBasicMaterial color="#1a090c" transparent opacity={0.3} depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} visible={highlight}>
        <ringGeometry args={[0.42, 0.5, 40]} />
        <meshBasicMaterial color="#f5c451" transparent opacity={0.9} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Tray() {
  const felt = useMemo(() => feltTexture(), []);
  return (
    <group>
      <RigidBody type="fixed" colliders={false} friction={0.9} restitution={0.32}>
        <CuboidCollider args={[3.55, 0.28, 2.45]} position={[0, -0.2, 0]} />
        <CuboidCollider args={[0.12, 0.42, 2.45]} position={[-3.42, 0.32, 0]} />
        <CuboidCollider args={[0.12, 0.42, 2.45]} position={[3.42, 0.32, 0]} />
        <CuboidCollider args={[3.55, 0.42, 0.12]} position={[0, 0.32, -2.32]} />
        <CuboidCollider args={[3.55, 0.42, 0.12]} position={[0, 0.32, 2.32]} />
      </RigidBody>

      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[7.5, 0.32, 5.3]} />
        <meshStandardMaterial color="#4a2c16" roughness={0.72} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6.55, 4.35]} />
        <meshStandardMaterial map={felt} color="#7a2030" roughness={0.92} metalness={0} />
      </mesh>
      {/* wooden lip */}
      {[
        [0, 0.16, -2.28, 6.7, 0.22, 0.18],
        [0, 0.16, 2.28, 6.7, 0.22, 0.18],
        [-3.36, 0.16, 0, 0.18, 0.22, 4.5],
        [3.36, 0.16, 0, 0.18, 0.22, 4.5]
      ].map((b, i) => (
        <mesh key={i} position={[b[0], b[1], b[2]]} castShadow receiveShadow>
          <boxGeometry args={[b[3], b[4], b[5]]} />
          <meshStandardMaterial color="#6b4124" roughness={0.62} metalness={0.08} />
        </mesh>
      ))}
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

export function DiceScene({
  dice,
  highlightId,
  onSettled,
  onReady
}: {
  dice: ThrowSpec[];
  highlightId?: string | null;
  onSettled: (id: string, face: FaceRead) => void;
  onReady: () => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.6]}
      camera={{ position: [0, 5.7, 4.7], fov: 32, near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ camera }) => camera.lookAt(0, 0.15, 0)}
    >
      <color attach="background" args={['#140e0a']} />
      <ambientLight intensity={0.55} color="#fff3e4" />
      <directionalLight
        position={[4.5, 8.5, 3.2]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight position={[-3.2, 3.4, -1.5]} intensity={0.7} color="#ffb56a" />
      <pointLight position={[2.4, 2.2, 3]} intensity={0.35} color="#ffe7c2" />
      <Physics gravity={[0, -30, 0]} timeStep={1 / 60}>
        <Ready onReady={onReady} />
        <Tray />
        {dice.map((spec) => (
          <DieBody key={spec.id} spec={spec} highlight={highlightId === spec.id} onSettled={onSettled} />
        ))}
      </Physics>
      <OrbitControls
        enablePan={false}
        minPolarAngle={0.55}
        maxPolarAngle={1.15}
        minDistance={4.2}
        maxDistance={9}
        target={[0, 0.15, 0]}
        enableDamping
      />
    </Canvas>
  );
}
