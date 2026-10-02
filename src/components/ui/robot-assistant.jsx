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
    const blink = elapsed % 4.2;
    const blinkScale = blink < 0.12 ? Math.max(0.12, blink / 0.12) : 1;

    if (eyeRef.current) {
      eyeRef.current.scale.y = blinkScale;
    }
  });

  return (
    <mesh
      ref={eyeRef}
      position={position}
      rotation={[0, 0, position[0] < 0 ? -0.12 : 0.12]}
      scale={[1.35, 0.82, 1]}
    >
      <sphereGeometry args={[0.026, 20, 20]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={2.3}
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
          color="#e8e4ef"
          emissive="#a99bbc"
          emissiveIntensity={0.16}
          roughness={0.38}
        />
      </mesh>

      <mesh position={[0, 0.060, 0.032]}>
        <boxGeometry args={[0.19, 0.12, 0.007]} />
        <meshStandardMaterial
          color="#1a1820"
          emissive="#2b2633"
          emissiveIntensity={0.22}
          roughness={0.36}
        />
      </mesh>

      <mesh position={[0, 0.082, 0.038]}>
        <boxGeometry args={[0.11, 0.016, 0.006]} />
        <meshStandardMaterial color="#f4f1f8" emissive="#f4f1f8" emissiveIntensity={0.55} />
      </mesh>

      <mesh position={[0, 0.040, 0.038]}>
        <boxGeometry args={[0.145, 0.012, 0.006]} />
        <meshStandardMaterial color="#a9a3b0" emissive="#a9a3b0" emissiveIntensity={0.18} />
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
        <sphereGeometry args={[0.065, 18, 18]} />
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
        <sphereGeometry args={[0.43, 32, 32]} />
      </mesh>

      <mesh position={[0, 0.22, 0]} material={shellMaterial}>
        <cylinderGeometry args={[0.17, 0.21, 0.10, 36]} />
      </mesh>

      <RobotArm side={-1} waving />
      <RobotArm side={1} />

      <group ref={headRef} position={[0, 0.58, 0]}>
        <mesh scale={[1.05, 0.90, 0.72]} material={shellMaterial}>
          <sphereGeometry args={[0.34, 32, 32]} />
        </mesh>

        <mesh
          position={[0, -0.005, 0.255]}
          scale={[0.97, 0.66, 0.20]}
          material={faceMaterial}
        >
          <sphereGeometry args={[0.30, 30, 30]} />
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
            position={[0, -0.090, 0]}
            rotation={[0, 0, Math.PI]}
            scale={[1.45, 0.72, 1]}
          >
            <torusGeometry args={[0.045, 0.008, 10, 30, Math.PI]} />
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

const speechIgnoreSelector = [
  ".robot-assistant",
  ".hero-actions",
  ".socials",
  ".project-filters",
  ".project-preview-badge",
  ".skill-card-hint",
  ".cert-pin-tooltip",
  ".cert-pin-line",
  ".cert-pin-ripples",
  ".cert-pin-footer",
  ".tech-library-group[aria-hidden=\"true\"]",
  "[aria-hidden=\"true\"]",
  "script",
  "style",
  "noscript",
].join(",");

const naturalVoiceHints = [
  /natural/i,
  /aria/i,
  /jenny/i,
  /ava/i,
  /samantha/i,
  /serena/i,
  /google.*english/i,
  /zira/i,
  /susan/i,
];

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

const robotSoundStorageKey = "apv-robot-sound-enabled";

const cursorReadableSelector = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  ".project-showcase-card",
  ".experience-item",
  ".skill-folder-surface",
  ".cert-pin-card",
  ".about-copy",
  ".footer-main",
].join(",");

function cleanSpeechText(value) {
  return String(value || "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .replace(/[↗↺]/g, "")
    .replace(/\bIoT\b/g, "Internet of Things")
    .replace(/\bUI\/UX\b/g, "user interface and user experience")
    .trim();
}

function chunkSpeechText(text, maxLength = 260) {
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

function getCursorSpeech(target, sectionId) {
  const section = document.getElementById(sectionId);
  if (!section || !(target instanceof Element) || !section.contains(target)) {
    return "";
  }

  const readable = target.closest(cursorReadableSelector);
  if (!readable || !section.contains(readable)) return "";
  if (readable.closest(".robot-assistant")) return "";
  if (!isVisibleElement(readable)) return "";

  const clone = readable.cloneNode(true);
  clone.querySelectorAll(speechIgnoreSelector).forEach((node) => node.remove());
  clone
    .querySelectorAll("button, input, textarea, select, option")
    .forEach((node) => node.remove());

  return cleanSpeechText(clone.textContent).slice(0, 520);
}

function getSectionSpeech(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return "";

  const clone = section.cloneNode(true);

  clone.querySelectorAll(speechIgnoreSelector).forEach((node) => node.remove());

  // Buttons mostly contain navigation/action copy rather than page content.
  // Keep project cards because their text contains the project information,
  // but remove ordinary controls so they are not narrated repeatedly.
  clone
    .querySelectorAll(
      "button:not(.project-showcase-card), input, textarea, select, option",
    )
    .forEach((node) => node.remove());

  if (sectionId === "home") {
    const title = clone.querySelector(".hero-shutter-title");
    if (title) {
      title.replaceWith(document.createTextNode(" Anna Patricia Vida. "));
    }
  }

  const parts = [];
  const seen = new Set();
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);

  let textNode = walker.nextNode();

  while (textNode) {
    const text = cleanSpeechText(textNode.nodeValue);

    if (text && text.length > 1 && !seen.has(text)) {
      seen.add(text);
      parts.push(text);
    }

    textNode = walker.nextNode();
  }

  const joined = cleanSpeechText(parts.join(". "));

  // Read the complete section. Chunking happens later so long sections do
  // not overwhelm the browser speech engine.
  return joined;
}

export default function RobotAssistant() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const sectionTimerRef = useRef(null);
  const speechQueueRef = useRef([]);
  const activeUtteranceRef = useRef(null);
  const speechStartTimerRef = useRef(null);
  const speechRetryRef = useRef(false);
  const speechConfirmedRef = useRef(false);
  const speechSessionRef = useRef(0);
  const voicesRef = useRef([]);
  const lastSpokenRef = useRef("");
  const lastSectionSpokenRef = useRef("");
  const soundEnabledRef = useRef(false);
  const cursorSpeechTimerRef = useRef(null);
  const lastCursorTextRef = useRef("");
  const currentCursorElementRef = useRef(null);

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

    const available = window.speechSynthesis.getVoices();

    if (available.length) {
      voicesRef.current = available;
    }

    const englishVoices = voicesRef.current.filter((voice) =>
      /^en/i.test(voice.lang),
    );

    const ranked = englishVoices
      .map((voice) => {
        const name = voice.name || "";
        let score = 0;

        if (/^en-(US|GB|AU|CA|PH)/i.test(voice.lang)) score += 24;
        if (voice.localService) score += 80;
        if (voice.default) score += 28;

        naturalVoiceHints.forEach((hint, index) => {
          if (hint.test(name)) score += 40 - index * 3;
        });

        // Local voices are much more reliable for long automatic narration.
        if (!voice.localService && /online|neural|premium/i.test(name)) score -= 24;
        if (/legacy|compact/i.test(name)) score -= 8;

        return { voice, score };
      })
      .sort((a, b) => b.score - a.score);

    return ranked[0]?.voice || englishVoices[0] || voicesRef.current[0] || null;
  };

  const clearSpeechStartTimer = () => {
    if (speechStartTimerRef.current) {
      window.clearTimeout(speechStartTimerRef.current);
      speechStartTimerRef.current = null;
    }
  };

  const stopSpeech = () => {
    speechSessionRef.current += 1;
    speechQueueRef.current = [];
    activeUtteranceRef.current = null;
    speechRetryRef.current = false;
    clearSpeechStartTimer();

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    return speechSessionRef.current;
  };

  const speakNextChunk = (
    sessionId,
    { useDefaultVoice = false } = {},
  ) => {
    if (!("speechSynthesis" in window)) return;
    if (!soundEnabledRef.current) return;
    if (sessionId !== speechSessionRef.current) return;

    const nextChunk = speechQueueRef.current.shift();

    if (!nextChunk) {
      activeUtteranceRef.current = null;
      clearSpeechStartTimer();
      return;
    }

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(nextChunk);
    const preferred = useDefaultVoice ? null : getPreferredVoice();

    utterance.rate = 0.98;
    utterance.pitch = 1.03;
    utterance.volume = 1;
    utterance.lang = preferred?.lang || "en-US";

    if (preferred) {
      utterance.voice = preferred;
    }

    utterance.onstart = () => {
      if (sessionId !== speechSessionRef.current) {
        synth.cancel();
        return;
      }

      clearSpeechStartTimer();
      speechRetryRef.current = false;

      if (!speechConfirmedRef.current) {
        speechConfirmedRef.current = true;
        setMessage(
          "Sound is working. I'll read the whole section and switch immediately when you move to another one.",
        );
      }
    };

    utterance.onend = () => {
      clearSpeechStartTimer();

      if (sessionId !== speechSessionRef.current) return;

      activeUtteranceRef.current = null;

      if (soundEnabledRef.current && speechQueueRef.current.length) {
        window.setTimeout(() => {
          if (sessionId === speechSessionRef.current) {
            speakNextChunk(sessionId);
          }
        }, 18);
      }
    };

    utterance.onerror = (event) => {
      clearSpeechStartTimer();

      if (sessionId !== speechSessionRef.current) return;

      activeUtteranceRef.current = null;

      const harmless =
        event.error === "interrupted" ||
        event.error === "canceled";

      if (harmless) return;

      if (!speechRetryRef.current && soundEnabledRef.current) {
        speechRetryRef.current = true;
        speechQueueRef.current.unshift(nextChunk);

        window.setTimeout(() => {
          if (sessionId === speechSessionRef.current) {
            speakNextChunk(sessionId, { useDefaultVoice: true });
          }
        }, 80);

        return;
      }

      speechRetryRef.current = false;
      setMessage(
        "I couldn't start the browser voice. Check that this tab is not muted, then tap the speaker again.",
      );
    };

    activeUtteranceRef.current = utterance;

    synth.resume();
    synth.speak(utterance);

    clearSpeechStartTimer();

  };

  const speak = (text, { force = false } = {}) => {
    if (!("speechSynthesis" in window)) {
      setMessage(
        "Your browser does not support speech output, but I can still guide you visually.",
      );
      return;
    }

    if (!force && !soundEnabledRef.current) return;

    const chunks = chunkSpeechText(text, 220);
    if (!chunks.length) return;

    // A new narration always owns the speech engine. This prevents chunks
    // from a previous section from resuming after navigation.
    const sessionId = stopSpeech();
    speechQueueRef.current = chunks;
    speechConfirmedRef.current = false;
    speechRetryRef.current = false;

    const synth = window.speechSynthesis;
    synth.resume();

    // Starting synchronously when called from the sound button preserves the
    // browser's user-gesture permission for speech.
    speakNextChunk(sessionId);
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
    const storedSound =
      window.sessionStorage.getItem(robotSoundStorageKey) === "1";

    if (storedName) {
      setVisitorName(storedName);
      setMessage(
        storedSound
          ? `Welcome back, ${storedName}! Sound is still on. I'll keep reading as you move through the portfolio.`
          : `Welcome back, ${storedName}! Turn sound on once and I'll keep reading as you move through the portfolio.`,
      );
    }

    if (storedSound) {
      soundEnabledRef.current = false;
      setSoundEnabled(false);

      if (storedName) {
        setMessage(
          `Welcome back, ${storedName}! Tap the speaker once to enable voice for this visit.`,
        );
      }
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

    let frameId = null;

    const setFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (sectionIds.includes(id) && document.getElementById(id)) {
        setActiveSection(id);
        return true;
      }
      return false;
    };

    const updateFromViewport = () => {
      frameId = null;
      const focusY = window.innerHeight * 0.42;

      let bestSection = sections[0];
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();

        if (rect.top <= focusY && rect.bottom >= focusY) {
          bestSection = section;
          bestDistance = 0;
          break;
        }

        const distance = Math.min(
          Math.abs(rect.top - focusY),
          Math.abs(rect.bottom - focusY),
        );

        if (distance < bestDistance) {
          bestDistance = distance;
          bestSection = section;
        }
      }

      if (bestSection) {
        setActiveSection(bestSection.id);
      }
    };

    const requestUpdate = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateFromViewport);
      }
    };

    const handleHashChange = () => {
      if (!setFromHash()) requestUpdate();
    };

    setFromHash();
    requestUpdate();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", handleHashChange);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    if (!soundEnabled) return undefined;
    if (!activeSection) return undefined;

    // Switch narration immediately when the visitor changes sections.
    stopSpeech();
    lastCursorTextRef.current = "";
    currentCursorElementRef.current = null;

    if (cursorSpeechTimerRef.current) {
      window.clearTimeout(cursorSpeechTimerRef.current);
      cursorSpeechTimerRef.current = null;
    }

    if (sectionTimerRef.current) {
      window.clearTimeout(sectionTimerRef.current);
    }

    sectionTimerRef.current = window.setTimeout(() => {
      if (!soundEnabledRef.current) return;

      const sectionText = getSectionSpeech(activeSection);
      const label = sectionLabels[activeSection] || "this";

      if (!sectionText) {
        setMessage(`You're in the ${label} section.`);
        return;
      }

      lastSectionSpokenRef.current = activeSection;
      lastSpokenRef.current = sectionText;

      setMessage(
        `You're in the ${label} section. I'm reading it now. Point at any text and I'll read that exact part.`,
      );

      speak(`You are now in the ${label} section. ${sectionText}`);
    }, 70);

    return () => {
      if (sectionTimerRef.current) {
        window.clearTimeout(sectionTimerRef.current);
        sectionTimerRef.current = null;
      }
    };
  }, [activeSection, soundEnabled]);

  useEffect(() => {
    let frameId = null;
    let latestX = 0;
    let latestY = 0;

    const applyPointer = () => {
      frameId = null;
      pointerRef.current.x = (latestX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (latestY / window.innerHeight) * 2 - 1;
    };

    const handlePointerMove = (event) => {
      latestX = event.clientX;
      latestY = event.clientY;

      if (!frameId) {
        frameId = window.requestAnimationFrame(applyPointer);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);


  useEffect(() => {
    if (!soundEnabled) return undefined;

    const handlePointerOver = (event) => {
      if (!soundEnabledRef.current) return;
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".robot-assistant")) return;

      const section = document.getElementById(activeSection);
      if (!section || !section.contains(event.target)) return;

      const readable = event.target.closest(cursorReadableSelector);
      if (!readable || !section.contains(readable)) return;

      if (currentCursorElementRef.current === readable) return;
      currentCursorElementRef.current = readable;

      if (cursorSpeechTimerRef.current) {
        window.clearTimeout(cursorSpeechTimerRef.current);
      }

      cursorSpeechTimerRef.current = window.setTimeout(() => {
        const text = getCursorSpeech(readable, activeSection);

        if (
          !text ||
          !soundEnabledRef.current ||
          text === lastCursorTextRef.current
        ) {
          return;
        }

        lastCursorTextRef.current = text;
        setMessage("Reading what you're pointing at.");
        speak(text);
      }, 170);
    };

    const handlePointerOut = (event) => {
      if (!(event.target instanceof Element)) return;
      const readable = event.target.closest(cursorReadableSelector);

      if (readable && readable === currentCursorElementRef.current) {
        currentCursorElementRef.current = null;
      }
    };

    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("pointerout", handlePointerOut, {
      passive: true,
    });

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);

      if (cursorSpeechTimerRef.current) {
        window.clearTimeout(cursorSpeechTimerRef.current);
        cursorSpeechTimerRef.current = null;
      }
    };
  }, [activeSection, soundEnabled]);

  useEffect(
    () => () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      speechSessionRef.current += 1;
      speechQueueRef.current = [];
      activeUtteranceRef.current = null;
      clearSpeechStartTimer();

      if (sectionTimerRef.current) {
        window.clearTimeout(sectionTimerRef.current);
      }

      if (cursorSpeechTimerRef.current) {
        window.clearTimeout(cursorSpeechTimerRef.current);
      }
    },
    [],
  );

  const toggleSound = () => {
    const next = !soundEnabledRef.current;

    soundEnabledRef.current = next;
    setSoundEnabled(next);
    window.sessionStorage.setItem(robotSoundStorageKey, next ? "1" : "0");

    if (!next) {
      stopSpeech();
      speechConfirmedRef.current = false;
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

    const sectionText = getSectionSpeech(activeSection);
    const label = sectionLabels[activeSection] || "current";
    const greeting = visitorName
      ? `Sound is on, ${visitorName}. You're in the ${label} section.`
      : `Sound is on. You're in the ${label} section.`;

    lastSectionSpokenRef.current = activeSection;
    speechConfirmedRef.current = false;
    speechRetryRef.current = false;
    setMessage(
      `Sound is on. I'm reading the ${label} section now.`,
    );

    const synth = window.speechSynthesis;
    synth.cancel();
    synth.resume();

    const primer = new SpeechSynthesisUtterance("Sound on.");
    const preferred = getPreferredVoice();
    primer.rate = 1;
    primer.pitch = 1.04;
    primer.volume = 1;
    primer.lang = preferred?.lang || "en-US";
    if (preferred) primer.voice = preferred;

    primer.onend = () => {
      if (!soundEnabledRef.current) return;

      window.setTimeout(() => {
        speak(sectionText ? `${greeting} ${sectionText}` : greeting, {
          force: true,
        });
      }, 40);
    };

    primer.onerror = () => {
      if (!soundEnabledRef.current) return;

      speak(sectionText ? `${greeting} ${sectionText}` : greeting, {
        force: true,
      });
    };

    synth.speak(primer);
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
                ? "Sound on · follows section + cursor"
                : "Sound off · tap once to enable"}
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
          dpr={[1, 1.25]}
          gl={{
            alpha: true,
            antialias: false,
            powerPreference: "high-performance",
          }}
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
