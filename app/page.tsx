"use client";
import CuteFormatterStarter from "@/components/CuteFormatterStarter";
// import Header from "@/components/Header";
import MouseParallax from "@/components/MouseParallax";
import PastelDreamScene from "@/components/PastelDreamScene";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      <MouseParallax />

      <div className="absolute inset-0 -z-10 parallax-slow">
        <PastelDreamScene />
      </div>

      <main className="relative z-10 parallax-layer">
        <CuteFormatterStarter />
      </main>

    </div>
  );
}

