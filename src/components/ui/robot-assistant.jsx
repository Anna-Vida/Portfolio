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

function RobotEye({ position, phase = 0 }) {
  const eyeRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() + phase;
    const blink = elapsed % 3.8;
    const blinkScale = blink < 0.13 ? Math.max(0.08, blink / 0.13) : 1;

    if (eyeRef.current) {
      eyeRef.current.scale.y = blinkScale;
    }
  });

  return (
    <mesh
      ref={eyeRef}
      position={position}
      rotation={[0, 0, position[0] < 0 ? -0.16 : 0.16]}
    >
      <capsuleGeometry args={[0.018, 0.052, 8, 18]} />
      <meshStandardMaterial
        color="#fbfbff"
        emissive="#f7f4ff"
        emissiveIntensity={2.15}
        toneMapped={false}
      />
    </mesh>
  );
}

function FloatingTablet() {
  const tabletRef = useRef();

  useFrame(({ clock }) => {
    if (!tabletRef.current) return;

    const t = clock.getElapsedTime();
    tabletRef.current.position.y = 0.28 + Math.sin(t * 1.45) * 0.032;
    tabletRef.current.rotation.z = -0.14 + Math.sin(t * 0.9) * 0.055;
    tabletRef.current.rotation.y = -0.34 + Math.sin(t * 0.72) * 0.08;
  });

  return (
    <group
      ref={tabletRef}
      position={[-0.64, 0.28, 0.02]}
      rotation={[0.04, -0.34, -0.14]}
      scale={1.08}
    >
      <mesh>
        <boxGeometry args={[0.34, 0.46, 0.035]} />
        <meshPhysicalMaterial
          color="#17151c"
          roughness={0.2}
          metalness={0.08}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
        />
      </mesh>

      <mesh position={[0, 0.008, 0.023]}>
        <boxGeometry args={[0.295, 0.385, 0.012]} />
        <meshStandardMaterial
          color="#cdb9ee"
          emissive="#7b5ca7"
          emissiveIntensity={0.35}
          roughness={0.42}
        />
      </mesh>

      <mesh position={[0, -0.135, 0.032]}>
        <boxGeometry args={[0.18, 0.018, 0.008]} />
        <meshStandardMaterial color="#f4efff" emissive="#d9c8ff" emissiveIntensity={0.6} />
      </mesh>

      <mesh position={[0, -0.075, 0.032]}>
        <boxGeometry args={[0.12, 0.018, 0.008]} />
        <meshStandardMaterial color="#f4efff" emissive="#d9c8ff" emissiveIntensity={0.5} />
      </mesh>

      <mesh position={[0, 0.18, 0.031]}>
        <circleGeometry args={[0.012, 18]} />
        <meshStandardMaterial color="#3d3746" />
      </mesh>
    </group>
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

function RobotModel({ pointerRef }) {
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
      <FloatingTablet />

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
          <RobotEye position={[-0.09, 0, 0]} />
          <RobotEye position={[0.09, 0, 0]} phase={0.09} />

          <mesh position={[-0.145, -0.055, -0.002]} scale={[1.25, 0.58, 1]}>
            <circleGeometry args={[0.020, 18]} />
            <meshStandardMaterial
              color="#b994e7"
              emissive="#9c75cb"
              emissiveIntensity={0.55}
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>

          <mesh position={[0.145, -0.055, -0.002]} scale={[1.25, 0.58, 1]}>
            <circleGeometry args={[0.020, 18]} />
            <meshStandardMaterial
              color="#b994e7"
              emissive="#9c75cb"
              emissiveIntensity={0.55}
              transparent
              opacity={0.8}
              toneMapped={false}
            />
          </mesh>

          <mesh
            position={[0, -0.086, 0]}
            rotation={[0, 0, Math.PI]}
            scale={[1.15, 0.62, 1]}
          >
            <torusGeometry args={[0.041, 0.008, 10, 28, Math.PI]} />
            <meshStandardMaterial
              color="#f7f4ff"
              emissive="#f7f4ff"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function RobotScene({ pointerRef }) {
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
      <RobotModel pointerRef={pointerRef} />
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

function chunkSpeechText(text, maxLength = 180) {
  const cleaned = cleanSpeechText(text);
  if (!cleaned) return [];

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if (sentence.length > maxLength) {
      if (current) {
        chunks.push(current);
        current = "";
      }

      const words = sentence.split(/\s+/);
      let wordChunk = "";

      for (const word of words) {
        const candidate = wordChunk ? `${wordChunk} ${word}` : word;

        if (candidate.length > maxLength && wordChunk) {
          chunks.push(wordChunk);
          wordChunk = word;
        } else {
          wordChunk = candidate;
        }
      }

      if (wordChunk) chunks.push(wordChunk);
      continue;
    }

    const candidate = current ? `${current} ${sentence}` : sentence;

    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current);
  return chunks;
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
  const speechQueueRef = useRef([]);
  const activeUtteranceRef = useRef(null);
  const speechStartTimerRef = useRef(null);
  const speechRetryRef = useRef(false);
  const speechConfirmedRef = useRef(false);
  const voicesRef = useRef([]);
  const lastSpokenRef = useRef("");
  const lastSectionSpokenRef = useRef("");
  const soundEnabledRef = useRef(false);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [message, setMessage] = useState(
    "Hello! Welcome to Anna's portfolio. What's your name?",
  );

  const getPreferredVoice = () => {
    if (!("speechSynthesis" in window)) return null;

    const synth = window.speechSynthesis;
    const available = synth.getVoices();

    if (available.length) {
      voicesRef.current = available;
    }

    const voices = voicesRef.current;

    return (
      voices.find(
        (voice) =>
          voice.localService &&
          /^en-PH/i.test(voice.lang),
      ) ||
      voices.find(
        (voice) =>
          voice.localService &&
          /^en-(US|GB|AU|CA)/i.test(voice.lang),
      ) ||
      voices.find(
        (voice) =>
          voice.localService &&
          /^en/i.test(voice.lang),
      ) ||
      voices.find((voice) => voice.default && /^en/i.test(voice.lang)) ||
      voices.find((voice) => /^en/i.test(voice.lang)) ||
      voices.find((voice) => voice.localService) ||
      voices[0] ||
      null
    );
  };

  const clearSpeechStartTimer = () => {
    if (speechStartTimerRef.current) {
      window.clearTimeout(speechStartTimerRef.current);
      speechStartTimerRef.current = null;
    }
  };

  const speakNextChunk = ({ useDefaultVoice = false } = {}) => {
    if (!("speechSynthesis" in window)) return;
    if (!soundEnabledRef.current) return;

    const nextChunk = speechQueueRef.current.shift();

    if (!nextChunk) {
      activeUtteranceRef.current = null;
      clearSpeechStartTimer();
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(nextChunk);
    const preferred = useDefaultVoice ? null : getPreferredVoice();

    utterance.rate = 0.94;
    utterance.pitch = 1.04;
    utterance.volume = 1;
    utterance.lang = preferred?.lang || "en-US";

    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => {
      clearSpeechStartTimer();
      speechRetryRef.current = false;

      if (!speechConfirmedRef.current) {
        speechConfirmedRef.current = true;
        setMessage(
          "Sound is working. I'll read each section as you move through the portfolio.",
        );
      }
    };

    utterance.onend = () => {
      clearSpeechStartTimer();
      activeUtteranceRef.current = null;

      if (soundEnabledRef.current) {
        window.setTimeout(() => speakNextChunk(), 35);
      }
    };

    utterance.onerror = (event) => {
      clearSpeechStartTimer();
      activeUtteranceRef.current = null;

      const harmless =
        event.error === "interrupted" ||
        event.error === "canceled";

      if (harmless) return;

      // Some Chromium/Windows installations expose an online voice that
      // appears valid but produces no sound. Retry once with the browser's
      // default local voice before giving up.
      if (!speechRetryRef.current && soundEnabledRef.current) {
        speechRetryRef.current = true;
        speechQueueRef.current.unshift(nextChunk);
        window.setTimeout(
          () => speakNextChunk({ useDefaultVoice: true }),
          90,
        );
        return;
      }

      speechRetryRef.current = false;
      setMessage(
        "Voice could not start. Please make sure this tab/site is not muted, then tap the speaker once more.",
      );
    };

    activeUtteranceRef.current = utterance;

    synth.resume();
    synth.speak(utterance);

    // If onstart never fires, Chrome can be stuck after a cancel() or can
    // choose an unavailable cloud voice. Retry this chunk once with the
    // browser default voice.
    clearSpeechStartTimer();
    speechStartTimerRef.current = window.setTimeout(() => {
      if (
        activeUtteranceRef.current === utterance &&
        !speechConfirmedRef.current &&
        !synth.speaking
      ) {
        synth.cancel();
        activeUtteranceRef.current = null;

        if (!speechRetryRef.current && soundEnabledRef.current) {
          speechRetryRef.current = true;
          speechQueueRef.current.unshift(nextChunk);
          window.setTimeout(
            () => speakNextChunk({ useDefaultVoice: true }),
            120,
          );
        }
      }
    }, 1400);
  };

  const speak = (text, { force = false } = {}) => {
    if (!("speechSynthesis" in window)) {
      setMessage(
        "Your browser does not support speech output, but I can still guide you visually.",
      );
      return;
    }

    if (!force && !soundEnabledRef.current) return;

    const chunks = chunkSpeechText(text);
    if (!chunks.length) return;

    const synth = window.speechSynthesis;

    speechQueueRef.current = chunks;
    activeUtteranceRef.current = null;
    speechRetryRef.current = false;
    clearSpeechStartTimer();

    const startSpeech = () => {
      if (!soundEnabledRef.current) return;
      synth.resume();
      speakNextChunk();
    };

    // Avoid Chrome's cancel() -> speak() race. Only cancel when something is
    // actually queued/playing, then give the engine a short reset window.
    if (synth.speaking || synth.pending || synth.paused) {
      synth.cancel();
      window.setTimeout(startSpeech, 110);
    } else {
      startSpeech();
    }
  };

  useEffect(() => {
    if (!("speechSynthesis" in window)) return undefined;

    const preloadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length) voicesRef.current = voices;
    };

    preloadVoices();
    // Chromium sometimes populates voices a moment after page load.
    const voiceTimer = window.setTimeout(preloadVoices, 350);

    window.speechSynthesis.addEventListener?.("voiceschanged", preloadVoices);

    return () => {
      window.clearTimeout(voiceTimer);
      window.speechSynthesis.removeEventListener?.(
        "voiceschanged",
        preloadVoices,
      );
    };
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

        setActiveSection(visible[0].target.id);
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
    }, 650);

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

      speechQueueRef.current = [];
      activeUtteranceRef.current = null;
      clearSpeechStartTimer();

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
      speechQueueRef.current = [];
      activeUtteranceRef.current = null;
      speechRetryRef.current = false;
      speechConfirmedRef.current = false;
      clearSpeechStartTimer();

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      setMessage("Sound is off. I can still follow you around the portfolio.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      soundEnabledRef.current = false;
      setSoundEnabled(false);
      setMessage(
        "Speech is not available in this browser. Try Chrome, Edge, or Safari.",
      );
      return;
    }

    const greeting = visitorName
      ? `Sound is on, ${visitorName}. I'll read each section as you visit it.`
      : "Sound is on. I'll read each section as you visit it.";

    lastSectionSpokenRef.current = "";
    speechConfirmedRef.current = false;
    speechRetryRef.current = false;
    setMessage("Testing voice…");

    // Called directly from the speaker-button user gesture. The speech
    // pipeline prefers a local installed voice and retries with the browser
    // default if the selected voice cannot start.
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
        onClick={() => setChatOpen(true)}
        aria-label="Floating happy robot portfolio guide"
      >
        <Canvas
          camera={{ position: [0, 0.18, 4.35], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <RobotScene pointerRef={pointerRef} />
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
