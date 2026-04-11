import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HeroImage } from "../images";
import { Typewriter } from "react-simple-typewriter";

function FloatingShape({ color, position, scale = 1 }) {
  const ref = useRef();
  useFrame(({ clock, mouse }) => {
    const mesh = ref.current;
    if (!mesh) return;
    mesh.rotation.x = clock.getElapsedTime() / 2.5;
    mesh.rotation.y = clock.getElapsedTime() / 2;
    mesh.position.x = position[0] + mouse.x * 0.4;
    mesh.position.y = position[1] - mouse.y * 0.4;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color={color} flatShading emissive={color} emissiveIntensity={0.3} />
    </mesh>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const up = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22,1,0.36,1] } } };

export default function Hero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => requestAnimationFrame(() => setScrollY(window.scrollY));
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center flex-col overflow-hidden bg-[#120b1f] py-16">

    <Canvas
        className="absolute inset-0 z-0  pt-6   text-2xl mb-[-32px] "
        camera={{ position: [0, 0, 3.2], fov: 60 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <FloatingShape color="#1a1030" position={[-2, 1, -5]}  scale={2} />
        <FloatingShape color="#f97316" position={[0, 0, -5]} className="floating-shape" scale={2} />
        <FloatingShape color="#1a1030" position={[2, -1, -5]} className="floating-shape" scale={2} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Hero image tint */}
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.06]" style={{ backgroundImage: `url(${HeroImage})` }} />

      {/* Glow blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[520px] h-[520px] rounded-full bg-primary1 opacity-[0.12] blur-[100px] pointer-events-none z-0"
        style={{ transform: `translateY(${scrollY * 0.16}px)` }}
      />
      <div className="absolute bottom-[-80px] left-[-60px] w-[380px] h-[380px] rounded-full bg-[#8700ff] opacity-[0.07] blur-[90px] pointer-events-none z-0"
        style={{ transform: `translateY(${scrollY * -0.14}px)` }}
      />

      {/* Content */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-16 pb-24 text-center"
        style={{ transform: `translateY(${scrollY * 0.04}px)` }}
      >
        <motion.div variants={stagger} initial="hidden" animate="visible">

         

         

          {/* Headline */}
          <motion.h1 variants={up}

            className="font-bold text-[clamp(2.8rem,7vw,4rem)]  mx-auto text-center max-w-4xl text-white leading-[1.02] tracking-tight mb-6">
       Digital  Service Providers<br></br>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-Secondarycolor to-Secondarycolor">
              <Typewriter
                words={[
                  "For All Businesses ",
                  "For Startups Ready to Scale",
                  "For Creators Building Brands",
                  "For Founders & Entrepreneurs",
                  "For Modern Digital Brands",
                  "For Vision-Driven Teams"
                ]}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={90}
                deleteSpeed={40}
                delaySpeed={1500}
              />
            </span>
           
          </motion.h1>

          {/* Sub */}
          <motion.p variants={up} className="text-base md:text-lg text-[#9b8cb5] max-w-3xl mx-auto leading-relaxed mb-10">
            At Lasglowtech, we help businesses grow with powerful websites, 
  scalable applications, and creative digital solutions that drive 
  visibility, engagement, and real results
          </motion.p>

          {/* CTAs */}
          <motion.div variants={up} className="flex flex-wrap items-center justify-center gap-4 mb-20">
            <Link to="/catalogues" className="btn-primary">Explore Services & Pricing</Link>
            <Link to="/portfolio" className="btn-outline">View our Work →</Link>
          </motion.div>

          {/* Stats */}
          <motion.div variants={up} className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { num: "100+", label: "Projects delivered" },
              { num: "48h", label: "Avg. turnaround" },
              { num: "4.9★", label: "Client rating" },
              { num: "2021", label: "Year founded" },
            ].map(({ num, label }) => (
              <div key={label} className="rounded-full bg-[#120b1f]/70 p-4 sm:p-5">
                <p className="font-extrabold text-xl sm:text-2xl text-white">{num}</p>
                <p className="text-xs text-[#9b8cb5] mt-2 uppercase tracking-[0.18em]">{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-30">
        <span className="text-xs text-[#9b8cb5]">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#8700ff] to-transparent" />
      </div>
    </div>
  );
}

