"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

function PastelBlob({ color, position, scale, speed = 1 }) {
  const mesh = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    
    mesh.current.position.y = position[1] + Math.sin(t * 0.6) * 0.15;
    mesh.current.position.x = position[0] + Math.cos(t * 0.4) * 0.15;

    mesh.current.rotation.x += 0.001;
    mesh.current.rotation.y += 0.001;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 3]} />
        <meshStandardMaterial
          color={color}
          roughness={0.35}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

export default function PastelDreamScene() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        
        {/* Soft pastel lights */}
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.6} color={"#ffd6f9"} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color={"#d9f1ff"} />

        {/* Cute pastel blobs */}
        <PastelBlob color="#ffb3ef" position={[-1.8, -0.6, -2]} scale={[1.2, 1.2, 1.2]} speed={0.4} />
        <PastelBlob color="#b7e3ff" position={[1.5, 0.5, -1.5]} scale={[1, 1, 1]} speed={0.5} />
        <PastelBlob color="#ffe3b3" position={[0.5, -1.2, -1.8]} scale={[0.9, 0.9, 0.9]} speed={0.35} />
        <PastelBlob color="#c4ffb3" position={[-1, 1.2, -1.5]} scale={[1.1, 1.1, 1.1]} speed={0.3} />

        {/* Magical star sparks */}
        <Stars
          radius={12}
          depth={8}
          count={900}
          factor={0.6}
          saturation={0}
          fade
          speed={0.2}
        />
      </Canvas>
    </div>
  );
}
