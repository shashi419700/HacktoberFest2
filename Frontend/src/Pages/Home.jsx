import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";
import { ArrowRight, Zap, Code2, Cpu, Globe2, Send } from "lucide-react";

// ----------------- BACKGROUND PARTICLES -----------------
function ParticlesBackground() {
  const ref = useRef();
  const count = 1500;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00f5ff"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ----------------- HERO SECTION -----------------
function HeroSection() {
  const prompts = [
    "Build a portfolio website with neon theme and smooth animations...",
    "Create a SaaS landing page with glassmorphism UI...",
    "Design a dark-themed dashboard with charts and stats..."
  ];
  const [displayedText, setDisplayedText] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    const text = prompts[promptIndex];
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i++));
      if (i > text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDisplayedText("");
          setPromptIndex((prev) => (prev + 1) % prompts.length);
        }, 2000);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [promptIndex]);

  return (
    <section className="relative h-[95vh] flex flex-col justify-center items-center text-center overflow-hidden bg-gradient-to-b from-[#030303] via-[#080808] to-[#000000]">
      <Canvas className="absolute inset-0 z-0">
        <ambientLight intensity={0.3} />
        <ParticlesBackground />
      </Canvas>

      <div className="relative z-10 max-w-3xl px-6">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight 
          bg-gradient-to-r from-cyan-400 via-blue-400 to-white text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(56,189,248,0.35)]"
        >
          The Future of Web Creation <br />
          <span className="text-cyan-400">Powered by AI ⚡</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
        >
          NeuroWeb instantly transforms your ideas into fully functional,
          responsive websites — designed, optimized, and coded by AI.
        </motion.p>

        {/* 🌐 DUMMY PROMPT BOX */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-10 relative max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-3 bg-gradient-to-r from-[#0b0b0b] to-[#111] border border-cyan-400/30 rounded-xl px-4 py-3 shadow-[0_0_30px_rgba(0,255,255,0.2)] backdrop-blur-lg">
            <input
              type="text"
              readOnly
              value={displayedText}
              className="flex-1 bg-transparent text-gray-200 text-lg outline-none placeholder:text-gray-500 caret-cyan-400"
              placeholder="Describe your website idea..."
            />
            <button className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
              <Send className="text-black" size={22} />
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-10 flex flex-wrap justify-center gap-5"
        >
          <a
            href="#features"
            className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-lg font-semibold shadow-[0_0_25px_rgba(0,255,255,0.25)] hover:shadow-[0_0_35px_rgba(0,255,255,0.4)] hover:scale-105 transition-all duration-300"
          >
            🚀 Get Started
          </a>
          <a
            href="#demo"
            className="px-8 py-3.5 border border-cyan-400/50 text-cyan-300 rounded-xl text-lg font-semibold hover:bg-cyan-400/10 hover:scale-105 transition-all duration-300"
          >
            🎥 Watch Demo
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-cyan-500/10 to-transparent blur-3xl" />
    </section>
  );
}

// ----------------- FEATURE CARD -----------------
function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 180 }}
      className="p-6 bg-gradient-to-br from-[#111]/90 to-[#1a1a1a]/50 
      rounded-2xl border border-gray-800/60 shadow-[0_0_25px_rgba(56,189,248,0.15)] text-center backdrop-blur-md hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all"
    >
      <div className="flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-400/10 border border-cyan-400/30">
        <Icon className="text-cyan-400" size={32} />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ----------------- FEATURES SECTION -----------------
function FeaturesSection() {
  const features = [
    { icon: Zap, title: "Instant Generation", desc: "Type your idea — get a ready, responsive website within seconds." },
    { icon: Code2, title: "Editable Code", desc: "Export clean, readable code you can modify anytime." },
    { icon: Cpu, title: "AI Optimization", desc: "Optimized for SEO, accessibility, and lightning-fast load times." },
    { icon: Globe2, title: "Live Preview", desc: "Instantly see design changes in real-time within your browser." },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-[#000000] via-[#080808] to-[#0b0b0b] text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl font-extrabold mb-14 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text"
      >
        ✨ AI-Powered Features
      </motion.h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>
    </section>
  );
}

// ----------------- CTA SECTION -----------------
function CTASection() {
  return (
    <section className="relative py-28 text-center bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.2),transparent_70%)]" />
      <div className="relative z-10 px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 text-transparent bg-clip-text drop-shadow-[0_0_25px_rgba(0,255,255,0.3)]"
        >
          Ready to Build the Future?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Experience next-gen web creation with{" "}
          <span className="font-semibold text-cyan-300">NeuroWeb</span> — create,
          edit, and launch stunning websites in minutes.
        </motion.p>

        <a
          href="/app"
          className="inline-flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-black rounded-xl font-bold hover:scale-110 transition-all duration-300 shadow-[0_0_40px_rgba(0,255,255,0.3)]"
        >
          Launch App <ArrowRight size={22} />
        </a>
      </div>
    </section>
  );
}

// ----------------- MAIN LANDING PAGE -----------------
export default function LandingPage() {
  return (
    <div className="bg-[#030303] text-white min-h-screen font-[Inter] overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <footer className="py-8 text-center text-gray-500 text-sm bg-[#0a0a0a] border-t border-gray-800">
        © {new Date().getFullYear()}{" "}
        <span className="text-cyan-400 font-medium">NeuroWeb</span>. All Rights Reserved ⚡
      </footer>
    </div>
  );
}
