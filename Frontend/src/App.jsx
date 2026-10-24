import { useState, useEffect, useRef, useMemo } from "react";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import "./index.css";

// ----------------- RIGHT SIDE 3D LOADER -----------------
function Particles() {
  const particlesRef = useRef();

  const { positions, colors } = useMemo(() => {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;

      const shade = Math.random();
      col.set([shade, shade, shade], i * 3);
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.7;
      particlesRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;

      particlesRef.current.material.size = 0.04 + Math.sin(t * 6) * 0.02;
      particlesRef.current.material.color.setHSL((t * 0.1) % 1, 0.9, 0.6);
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ----------------- LEFT SIDE ADVANCED LOADER -----------------
function ParticlesLoader() {
  const particlesRef = useRef();
  const count = 1200;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5;

      col.set([1, 1, 1], i * 3);
    }
    return { positions: pos, colors: col };
  }, []);

  const colorAttr = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (particlesRef.current && colorAttr.current) {
      for (let i = 0; i < count; i++) {
        const hue = (t * 0.1 + i * 0.002) % 1;
        const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      colorAttr.current.needsUpdate = true;

      particlesRef.current.rotation.y = t * 0.8;
      particlesRef.current.rotation.x = Math.sin(t * 0.6) * 0.4;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          ref={colorAttr}
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FancyLoader() {
  return (
    <div className="h-48 mb-4 rounded-lg overflow-hidden bg-black relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.6} />
        <ParticlesLoader />
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.8, 64]} />
          <meshBasicMaterial
            color="cyan"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      </Canvas>
      <p className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 font-semibold animate-pulse text-sm sm:text-base">
        ⚡ AI is building your website...
      </p>
    </div>
  );
}

function Loader3D() {
  return (
    <div className="w-full h-[300px] sm:h-[400px] flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black rounded-lg shadow-inner relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 7], fov: 70 }}>
        <ambientLight intensity={0.5} />
        <Particles />
      </Canvas>
      <div className="absolute bottom-6 text-sm sm:text-lg font-semibold text-white animate-pulse tracking-wide">
        ⚡ Generating your website...
      </div>
    </div>
  );
}

// ----------------- MAIN APP -----------------
function App() {
  const [prompt, setPrompt] = useState(
    "Build a login page with email and password fields and a submit button."
  );
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, [generatedCode]);

  const API_URL = import.meta.env.VITE_API_URL;

  async function generateWebsite() {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedCode("");
    try {
      const response = await axios.post(`${API_URL}/ai/generate-website`, {
        prompt,
      });
      typeWriterEffect(response.data.code);
    } catch (err) {
      console.error(err);
      setGeneratedCode("❌ Error while generating website.");
      setLoading(false);
    }
  }

  function typeWriterEffect(text) {
    let i = 0;
    setIsTyping(true);
    setGeneratedCode("");
    const speed = 0;
    function typing() {
      if (i < text.length) {
        setGeneratedCode((prev) => prev + text.charAt(i));
        i++;
        setTimeout(typing, speed);
      } else {
        setIsTyping(false);
        setLoading(false);
      }
    }
    typing();
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }

  function downloadCode() {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-website.html";
    a.click();
  }

  return (
    <div
      className={
        darkMode
          ? "bg-gray-950 text-gray-100 min-h-screen flex flex-col"
          : "bg-gray-100 text-gray-900 min-h-screen flex flex-col"
      }
    >
      {/* NAVBAR */}
      <nav className="backdrop-blur-2xl bg-white/5 border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-4">
          {/* Left Section: Logo + Title */}
          <div className="flex items-center gap-4">
            {/* Logo Image with glow and border */}
            <div className="relative">
              <img
                src="https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/27feb2bb-aeb4-4a83-9fb6-8f3f2a15885e/4a6b20f1-93d6-46c9-8160-82a790687788.png"
                alt="NeuroWeb Logo"
                className="w-12 h-12 object-contain rounded-2xl border border-cyan-300/30 shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 rounded-2xl blur-md bg-cyan-400/20 opacity-50"></div>
            </div>

            {/* Title */}
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight 
          bg-gradient-to-r from-blue-400 via-cyan-300 to-white 
          text-transparent bg-clip-text 
          drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
            >
              ⚡ NeuroWeb
            </h1>
          </div>

          {/* Right Section: Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg hover:scale-105 hover:opacity-90 transition-all duration-300 text-sm sm:text-base"
            >
              {darkMode ? "🌞 Light" : "🌙 Dark"}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white focus:outline-none text-2xl hover:scale-110 transition-transform duration-300"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {menuOpen && (
          <div className="md:hidden bg-gray-900/95 text-white px-6 py-4 space-y-3">
            <p className="text-gray-400 text-sm">Menu is empty</p>
          </div>
        )}
      </nav>

      {/* MAIN */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 sm:p-6">
        {/* LEFT: Prompt */}
        <div
          className={
            darkMode
              ? "bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col relative"
              : "bg-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col relative"
          }
        >
          {isTyping && <FancyLoader />}

          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            📝 <span>Prompt</span>
          </h2>

          {/* Modern landing-page style input area */}
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 opacity-30 blur-lg"></div>
            <div
              className={
                darkMode
                  ? "relative bg-gray-950/80 border border-white/10 rounded-2xl backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.15)] p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]"
                  : "relative bg-white/80 border border-gray-300/30 rounded-2xl backdrop-blur-xl shadow-[0_0_25px_rgba(56,189,248,0.1)] p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]"
              }
            >
              <Editor
                value={prompt}
                onValueChange={setPrompt}
                highlight={(code) =>
                  prism.highlight(
                    code,
                    prism.languages.javascript,
                    "javascript"
                  )
                }
                padding={12}
                placeholder="✨ Describe the website you want to generate... (e.g., 'A modern landing page for a tech startup with hero section and CTA button')"
                style={{
                  fontFamily: '"Fira Code", monospace',
                  fontSize: 15,
                  color: darkMode ? "#e0e0e0" : "#111",
                  minHeight: "160px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end flex-wrap">
            <button
              onClick={() => setPrompt("")}
              className="px-4 py-2 w-full sm:w-auto rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium shadow-md transition"
            >
              Clear
            </button>
            <button
              onClick={generateWebsite}
              className="px-6 py-2 w-full sm:w-auto rounded-lg bg-gradient-to-r from-indigo-500 to-green-500 text-white font-semibold shadow-md hover:scale-105 transform transition"
            >
              {loading ? "⏳ Generating..." : "🚀 Generate"}
            </button>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div
          className={
            darkMode
              ? "bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col"
              : "bg-white p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col"
          }
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
            <h2 className="text-lg sm:text-xl font-semibold">🌍 Output</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => copyToClipboard(generatedCode)}
                className="px-3 py-1 w-full sm:w-auto bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                Copy
              </button>
              <button
                onClick={downloadCode}
                className="px-3 py-1 w-full sm:w-auto bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Download
              </button>
              <button
                onClick={() => setGeneratedCode("")}
                className="px-3 py-1 w-full sm:w-auto bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto space-y-6">
            {loading && !isTyping ? (
              <Loader3D />
            ) : generatedCode ? (
              <>
                <div>
                  <h3 className="font-semibold mb-2">📄 Editable Code</h3>
                  <div
                    className={
                      darkMode
                        ? "rounded-xl bg-gray-800 p-2 sm:p-3"
                        : "rounded-xl bg-gray-100 p-2 sm:p-3"
                    }
                  >
                    <Editor
                      value={generatedCode}
                      onValueChange={setGeneratedCode}
                      highlight={(code) =>
                        prism.highlight(code, prism.languages.html, "html")
                      }
                      padding={10}
                      style={{
                        fontFamily: '"Fira Code", monospace',
                        fontSize: 14,
                        minHeight: "180px",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">🔍 Live Preview</h3>
                  <iframe
                    title="preview"
                    srcDoc={generatedCode}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    className="w-full h-[300px] sm:h-[400px] border rounded-lg bg-white shadow-inner"
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-500">⚡ No output yet.</p>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className={`relative mt-6 sm:mt-8 py-6 px-4 text-center overflow-hidden
  ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-600"}`}
      >
        {/* Gradient border top line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 animate-border-glow"></div>

        {/* Glowing gradient background overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 blur-3xl"></div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p className="text-sm sm:text-base font-medium">
            Made by{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold hover:scale-105 inline-block transition-transform duration-300">
              Shashi
            </span>{" "}
            | Powered by{" "}
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              AI ⚡
            </span>
          </p>
        </div>

        {/* Social icons row */}
        <div className="relative z-10 mt-3 flex justify-center gap-5">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition-transform transform hover:scale-125 duration-300"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-400 transition-transform transform hover:scale-125 duration-300"
          >
            <i className="fab fa-linkedin text-xl"></i>
          </a>
          <a
            href="mailto:youremail@example.com"
            className="text-gray-400 hover:text-purple-400 transition-transform transform hover:scale-125 duration-300"
          >
            <i className="fas fa-envelope text-xl"></i>
          </a>
        </div>

        <p className="mt-3 text-xs sm:text-sm opacity-70">
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </footer>
    </div>
  );
}

export default App;
