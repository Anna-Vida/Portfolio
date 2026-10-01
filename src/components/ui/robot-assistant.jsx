import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  FaCommentDots,
  FaPaperPlane,
  FaVolumeMute,
  FaVolumeUp,
  FaTimes,
} from "react-icons/fa";

class HeartCurve extends THREE.Curve {
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const angle = t * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y =
      13 * Math.cos(angle) -
      5 * Math.cos(2 * angle) -
      2 * Math.cos(3 * angle) -
      Math.cos(4 * angle);

    return optionalTarget.set(x * 0.004, (y + 6) * 0.004, 0);
  }
}

const heartCurve = new HeartCurve();

function RobotEye({ position, loved, phase = 0 }) {
  const eyeRef = useRef();
  const heartRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() + phase;
    const blink = elapsed % 3.8;
    const blinkScale = blink < 0.13 ? Math.max(0.08, blink / 0.13) : 1;

    if (eyeRef.current) {
      eyeRef.current.visible = !loved;
      eyeRef.current.scale.y = blinkScale;
    }

    if (heartRef.current) {
      heartRef.current.visible = loved;
    }
  });

  return (
    <group position={position}>
      <mesh ref={eyeRef} rotation={[0, 0, position[0] < 0 ? -0.14 : 0.14]}>
        <boxGeometry args={[0.075, 0.038, 0.018]} />
        <meshStandardMaterial
          color="#fbfbff"
          emissive="#f7f4ff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      <mesh
        ref={heartRef}
        visible={false}
        rotation={[0, 0, Math.PI]}
        scale={0.82}
      >
        <tubeGeometry args={[heartCurve, 48, 0.006, 8, true]} />
        <meshStandardMaterial
          color="#d8b7ff"
          emissive="#c59aff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function FloatingHeart() {
  const heartRef = useRef();

  useFrame(({ clock }) => {
    if (!heartRef.current) return;
    const t = clock.getElapsedTime();
    heartRef.current.position.y = 0.36 + Math.sin(t * 1.65) * 0.035;
    heartRef.current.rotation.z = -0.18 + Math.sin(t * 1.05) * 0.08;
    heartRef.current.scale.setScalar(1 + Math.sin(t * 2.1) * 0.045);
  });

  return (
    <mesh
      ref={heartRef}
      position={[-0.63, 0.36, 0.02]}
      rotation={[0, 0, Math.PI]}
      scale={1.12}
    >
      <tubeGeometry args={[heartCurve, 64, 0.012, 10, true]} />
      <meshStandardMaterial
        color="#cda4ff"
        emissive="#a86eff"
        emissiveIntensity={1.45}
        roughness={0.24}
        metalness={0.02}
        toneMapped={false}
      />
    </mesh>
  );
}

function RobotArm({ side = 1, waving = false }) {
  const armRef = useRef();

  useFrame(({ clock }) => {
    if (!armRef.current) return;

    const t = clock.getElapsedTime();
    const base = side * 0.56;

    armRef.current.rotation.z = waving
      ? base + Math.sin(t * 2.6) * 0.20
      : base + Math.sin(t * 1.5) * 0.045;

    armRef.current.rotation.x = waving
      ? -0.16 + Math.sin(t * 2.6 + 0.5) * 0.10
      : 0;
  });

  return (
    <group
      ref={armRef}
      position={[side * 0.35, 0.02, 0]}
      rotation={[0, 0, side * 0.56]}
    >
      <mesh position={[side * 0.17, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.055, 0.24, 10, 20]} />
        <meshPhysicalMaterial
          color="#f3f0f7"
          roughness={0.28}
          metalness={0.04}
          clearcoat={0.72}
          clearcoatRoughness={0.22}
        />
      </mesh>

      <mesh position={[side * 0.33, 0.01, 0]}>
        <sphereGeometry args={[0.065, 24, 24]} />
        <meshPhysicalMaterial
          color="#f7f4fa"
          roughness={0.26}
          metalness={0.03}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>
    </group>
  );
}

function RobotModel({ pointerRef, loved }) {
  const robotRef = useRef();
  const headRef = useRef();

  const shellMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f3f0f6",
        roughness: 0.3,
        metalness: 0.03,
        clearcoat: 0.78,
        clearcoatRoughness: 0.18,
      }),
    [],
  );

  const faceMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#17131f",
        roughness: 0.16,
        metalness: 0.04,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    [],
  );

  useEffect(
    () => () => {
      shellMaterial.dispose();
      faceMaterial.dispose();
    },
    [shellMaterial, faceMaterial],
  );

  useFrame(({ clock }, delta) => {
    if (!robotRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;
    const t = clock.getElapsedTime();

    const targetX = px * 0.07;
    const targetY = -0.12 + py * 0.025;
    const bob = Math.sin(t * 1.55) * 0.035;
    const sway = Math.sin(t * 0.72) * 0.018;

    robotRef.current.position.x = THREE.MathUtils.lerp(
      robotRef.current.position.x,
      targetX + sway,
      3.8 * dt,
    );

    robotRef.current.position.y = THREE.MathUtils.lerp(
      robotRef.current.position.y,
      targetY + bob,
      4 * dt,
    );

    robotRef.current.rotation.y = THREE.MathUtils.lerp(
      robotRef.current.rotation.y,
      -px * 0.20,
      5 * dt,
    );

    robotRef.current.rotation.z = THREE.MathUtils.lerp(
      robotRef.current.rotation.z,
      -px * 0.035 + Math.sin(t * 0.85) * 0.015,
      4 * dt,
    );

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      px * 0.5,
      7 * dt,
    );

    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      -py * 0.16,
      7 * dt,
    );
  });

  return (
    <group ref={robotRef} position={[0, -0.12, 0]} scale={1.42}>
      <FloatingHeart />

      <mesh
        position={[0, -0.10, 0]}
        scale={[0.72, 0.94, 0.58]}
        material={shellMaterial}
      >
        <sphereGeometry args={[0.43, 48, 48]} />
      </mesh>

      <mesh position={[0, 0.22, 0]} material={shellMaterial}>
        <cylinderGeometry args={[0.17, 0.21, 0.10, 36]} />
      </mesh>

      <RobotArm side={-1} waving />
      <RobotArm side={1} />

      <group ref={headRef} position={[0, 0.58, 0]}>
        <mesh scale={[1.05, 0.90, 0.72]} material={shellMaterial}>
          <sphereGeometry args={[0.34, 48, 48]} />
        </mesh>

        <mesh
          position={[0, -0.005, 0.255]}
          scale={[0.97, 0.66, 0.20]}
          material={faceMaterial}
        >
          <sphereGeometry args={[0.30, 42, 42]} />
        </mesh>

        <group position={[0, 0.015, 0.337]}>
          <RobotEye position={[-0.09, 0, 0]} loved={loved} />
          <RobotEye
            position={[0.09, 0, 0]}
            loved={loved}
            phase={0.09}
          />

          <mesh position={[0, -0.082, 0]} scale={[1, 0.52, 1]}>
            <torusGeometry args={[0.037, 0.008, 10, 24, Math.PI]} />
            <meshStandardMaterial
              color="#f7f4ff"
              emissive="#f7f4ff"
              emissiveIntensity={1.6}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function RobotScene({ pointerRef, loved }) {
  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight position={[3, 5, 4]} intensity={2.35} color="#ffffff" />
      <directionalLight
        position={[-4, 2, 2]}
        intensity={0.85}
        color="#d5c0ff"
      />
      <pointLight position={[0, -1, 2]} intensity={0.65} color="#b17cff" />
      <RobotModel pointerRef={pointerRef} loved={loved} />
    </>
  );
}

const readableSelector =
  "h1, h2, h3, p, li, .project-title, .project-description, .experience-role, .experience-description, .cert-pin-copy, .skill-card-back";

const sectionIds = [
  "home",
  "about",
  "experience",
  "work",
  "skills",
  "certifications",
  "contact",
];

const sectionLabels = {
  home: "Home",
  about: "About",
  experience: "Experience",
  work: "Work",
  skills: "Skills",
  certifications: "Certifications",
  contact: "Contact",
};

function cleanSpeechText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[↗↺]/g, "")
    .trim();
}

function isVisibleElement(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();

  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    Number(style.opacity || 1) > 0 &&
    rect.width > 0 &&
    rect.height > 0
  );
}

function getSectionSpeech(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return "";

  const candidates = Array.from(section.querySelectorAll(readableSelector));
  const parts = [];
  const seen = new Set();

  for (const node of candidates) {
    if (!isVisibleElement(node)) continue;
    if (node.closest(".robot-assistant")) continue;

    const text = cleanSpeechText(node.innerText || node.textContent);
    if (text.length < 3 || seen.has(text)) continue;

    seen.add(text);
    parts.push(text);

    if (parts.join(". ").length >= 850) break;
  }

  const joined = parts.join(". ");
  return joined.length > 900 ? `${joined.slice(0, 897)}...` : joined;
}

export default function RobotAssistant() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoverTimerRef = useRef(null);
  const sectionTimerRef = useRef(null);
  const lastSpokenRef = useRef("");
  const lastSectionSpokenRef = useRef("");
  const loveTimerRef = useRef(null);
  const soundEnabledRef = useRef(false);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loved, setLoved] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [message, setMessage] = useState(
    "Hello! Welcome to Anna's portfolio. What's your name?",
  );

  const speak = (text, { force = false } = {}) => {
    if (!("speechSynthesis" in window)) return;
    if (!force && !soundEnabledRef.current) return;

    const cleaned = cleanSpeechText(text);
    if (!cleaned) return;

    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 0.94;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.lang = "en-US";

    const voices = synth.getVoices();
    const preferred =
      voices.find((voice) => /aria|zira|samantha|female/i.test(voice.name)) ||
      voices.find((voice) => /^en/i.test(voice.lang));

    if (preferred) utterance.voice = preferred;

    synth.speak(utterance);
  };

  useEffect(() => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.getVoices();

      const preloadVoices = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.addEventListener?.("voiceschanged", preloadVoices);

      return () => {
        window.speechSynthesis.removeEventListener?.(
          "voiceschanged",
          preloadVoices,
        );
      };
    }

    return undefined;
  }, []);

  useEffect(() => {
    const storedName = window.sessionStorage.getItem("apv-visitor-name");
    if (storedName) {
      setVisitorName(storedName);
      setMessage(
        `Welcome back, ${storedName}! Turn sound on and I can read each section as you move through the portfolio.`,
      );
    }

    const welcomed = window.sessionStorage.getItem("apv-robot-welcomed");
    if (!welcomed) {
      const timer = window.setTimeout(() => {
        setChatOpen(true);
        window.sessionStorage.setItem("apv-robot-welcomed", "1");
      }, 1400);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible[0]) return;

        const nextSection = visible[0].target.id;
        setActiveSection(nextSection);
      },
      {
        rootMargin: "-22% 0px -52% 0px",
        threshold: [0.08, 0.18, 0.35, 0.55],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!soundEnabled) return undefined;
    if (!activeSection || lastSectionSpokenRef.current === activeSection) {
      return undefined;
    }

    if (sectionTimerRef.current) {
      window.clearTimeout(sectionTimerRef.current);
    }

    sectionTimerRef.current = window.setTimeout(() => {
      const sectionText = getSectionSpeech(activeSection);
      if (!sectionText) return;

      lastSectionSpokenRef.current = activeSection;
      lastSpokenRef.current = sectionText;

      const label = sectionLabels[activeSection] || "this";
      setMessage(`You're in the ${label} section. I'm reading it for you now.`);
      speak(sectionText);
    }, 850);

    return () => {
      if (sectionTimerRef.current) {
        window.clearTimeout(sectionTimerRef.current);
      }
    };
  }, [activeSection, soundEnabled]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;

      if (!soundEnabledRef.current) return;

      const target = document
        .elementFromPoint(event.clientX, event.clientY)
        ?.closest(readableSelector);

      if (!target || target.closest(".robot-assistant")) {
        if (hoverTimerRef.current) {
          window.clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
        return;
      }

      const text = cleanSpeechText(target.innerText || target.textContent);
      if (
        text.length < 4 ||
        text.length > 320 ||
        text === lastSpokenRef.current
      ) {
        return;
      }

      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }

      hoverTimerRef.current = window.setTimeout(() => {
        lastSpokenRef.current = text;
        speak(text);
      }, 900);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(
    () => () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (loveTimerRef.current) {
        window.clearTimeout(loveTimerRef.current);
      }

      if (sectionTimerRef.current) {
        window.clearTimeout(sectionTimerRef.current);
      }
    },
    [],
  );

  const toggleSound = () => {
    const next = !soundEnabledRef.current;

    soundEnabledRef.current = next;
    setSoundEnabled(next);

    if (!next) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setMessage("Sound is off. I can still follow you around the portfolio.");
      return;
    }

    const greeting = visitorName
      ? `Sound is on, ${visitorName}. I'll read each section as you visit it, and you can still hover over text to hear individual content.`
      : "Sound is on. I'll read each section as you visit it, and you can still hover over text to hear individual content.";

    lastSectionSpokenRef.current = "";
    setMessage(greeting);

    // This first utterance runs directly from the user's click, which
    // satisfies browser audio restrictions before automatic section reading.
    speak(greeting, { force: true });
  };

  const submitName = (event) => {
    event.preventDefault();
    const value = nameInput.trim();
    if (!value) return;

    setVisitorName(value);
    window.sessionStorage.setItem("apv-visitor-name", value);

    const reply = `Nice to meet you, ${value}! I'm Anna's portfolio guide. Turn sound on and I'll read each section while I follow you around the page.`;
    setMessage(reply);
    setNameInput("");

    if (soundEnabledRef.current) {
      speak(reply);
    }
  };

  const showLove = () => {
    setLoved(true);
    if (loveTimerRef.current) window.clearTimeout(loveTimerRef.current);
    loveTimerRef.current = window.setTimeout(() => setLoved(false), 1500);
  };

  return (
    <aside
      className={`robot-assistant robot-section-${activeSection}`}
      aria-label="Interactive portfolio guide"
    >
      {chatOpen && (
        <div className="robot-chat-card">
          <button
            type="button"
            className="robot-chat-close"
            onClick={() => setChatOpen(false)}
            aria-label="Close robot message"
          >
            <FaTimes />
          </button>

          <p className="robot-chat-eyebrow">PORTFOLIO GUIDE</p>
          <p className="robot-chat-message">{message}</p>

          {!visitorName && (
            <form className="robot-name-form" onSubmit={submitName}>
              <input
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Your name"
                maxLength={40}
                aria-label="Your name"
              />
              <button type="submit" aria-label="Send name">
                <FaPaperPlane />
              </button>
            </form>
          )}

          <button
            type="button"
            className={`robot-sound-switch ${soundEnabled ? "is-on" : ""}`}
            onClick={toggleSound}
            aria-pressed={soundEnabled}
          >
            <span className="robot-sound-switch-icon">
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
            </span>
            <span>
              {soundEnabled
                ? "Sound on · reading each section"
                : "Sound off · tap to enable"}
            </span>
            <span className="robot-toggle-track" aria-hidden="true">
              <span />
            </span>
          </button>
        </div>
      )}

      <div
        className="robot-stage"
        onClick={showLove}
        aria-label="Floating robot portfolio guide"
      >
        <Canvas
          camera={{ position: [0, 0.18, 4.35], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <RobotScene pointerRef={pointerRef} loved={loved} />
        </Canvas>
      </div>

      <div className="robot-actions">
        <button
          type="button"
          className="robot-action-button"
          onClick={() => setChatOpen((open) => !open)}
          aria-label="Open robot message"
        >
          <FaCommentDots />
          <span className="robot-notification-dot" />
        </button>

        <button
          type="button"
          className={`robot-action-button ${soundEnabled ? "is-active" : ""}`}
          onClick={toggleSound}
          aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </div>
    </aside>
  );
}
