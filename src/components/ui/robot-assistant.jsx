import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { createPortal } from "react-dom";
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
      <sphereGeometry args={[0.026, 14, 14]} />
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
        <capsuleGeometry args={[0.055, 0.24, 7, 12]} />
        <meshPhysicalMaterial
          color="#f3f0f7"
          roughness={0.28}
          metalness={0.04}
          clearcoat={0.72}
          clearcoatRoughness={0.22}
        />
      </mesh>

      <mesh position={[side * 0.33, 0.01, 0]}>
        <sphereGeometry args={[0.065, 14, 14]} />
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
        <sphereGeometry args={[0.43, 22, 22]} />
      </mesh>

      <mesh position={[0, 0.22, 0]} material={shellMaterial}>
        <cylinderGeometry args={[0.17, 0.21, 0.10, 24]} />
      </mesh>

      <RobotArm side={-1} waving />
      <RobotArm side={1} />

      <group ref={headRef} position={[0, 0.58, 0]}>
        <mesh scale={[1.05, 0.90, 0.72]} material={shellMaterial}>
          <sphereGeometry args={[0.34, 22, 22]} />
        </mesh>

        <mesh
          position={[0, -0.005, 0.255]}
          scale={[0.97, 0.66, 0.20]}
          material={faceMaterial}
        >
          <sphereGeometry args={[0.30, 20, 20]} />
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

const RESUME_PROFILE = {
  summary:
    "Anna Patricia Bolor Vida is an entry-level Software and Mobile Developer with practical internship and project experience, ready to contribute clean code and fresh problem-solving skills to a collaborative team.",
  education:
    "Anna earned a Bachelor of Science in Information Technology from the Technological Institute of the Philippines in June 2026.",
  experience:
    "Anna worked as a Software Developer Intern at the Ateneo Innovation Center in Quezon City from January 2026 to April 2026. Her resume highlights offline-first healthcare and AgTech mobile applications, OCR and cloud synchronization, computer vision dashboards using Meta Ray-Ban smart glasses, disaster-resilience data and machine-learning workflows, and microcontroller/backend work for environmental monitoring.",
  projects: {
    echowear:
      "EchoWear is a 2026 smart glove translator for Filipino Sign Language. Anna developed a wearable and mobile prototype using ESP32, flex sensors, motion sensing, Bluetooth Low Energy, on-device machine-learning inference, and speech output for gesture-to-speech interaction.",
    servease:
      "ServEase is a 2026 full-stack business operations platform. Anna built role-based customer, staff, and admin workflows using React, TypeScript, Supabase Auth, and PostgreSQL Row Level Security, including service management, payments, analytics, staff assignment, audit logging, database-driven workflows, and Vercel deployment.",
    pockethive:
      "PocketHive is a 2025 AI-powered personal finance and expense management application. Anna developed a mobile budgeting application with automated expense tracking and AI-driven financial insights, using Firebase for real-time synchronization and secure user authentication.",
  },
  skills: {
    programming:
      "JavaScript, TypeScript, Python, Java, C#, C, C++, Dart, PHP, SQL, and Bash.",
    frontend:
      "React.js, React Native, Flutter, Ionic, HTML5, CSS3, Tailwind CSS, Vite, Expo, and Android Studio.",
    backend:
      "Node.js, Express.js, .NET and .NET Core, ASP.NET Core, RESTful APIs, CRUD operations, Supabase, Firebase, authentication, and authorization.",
    databases: "PostgreSQL, MySQL, and SQLite.",
    cloud:
      "Git, GitHub, Docker, CI/CD, AWS, Vercel, and Render.",
    testing:
      "Postman, Swagger/OpenAPI, Jest, Visual Studio Code, and Linux.",
    embedded:
      "Arduino C/C++, Arduino boards including Uno, Nano, Mega, and MKR Series, ESP32, Raspberry Pi, microcontroller firmware, I2C, SPI, UART, sensor integration, and Bluetooth Low Energy.",
    ai:
      "Agile/Scrum, TensorFlow Lite, computer vision including OCR and CNNs, deep learning, and AI API integration.",
  },
  certifications:
    "Google Crash Course on Python, issued February 2026, and Using Python to Interact with the Operating System, issued August 2026.",
  contact:
    "Anna is based in Quezon City. Her resume lists annapatriciavida12@gmail.com, LinkedIn at linkedin.com/in/annavida12, GitHub at github.com/Anna-Vida, and her portfolio at apv-portfolio.vercel.app.",
};

const RESUME_QUICK_QUESTIONS = [
  "Professional summary",
  "Internship experience",
  "Projects",
  "Technical skills",
  "Certifications",
];

function answerResumeQuestion(value) {
  const question = cleanSpeechText(value).toLowerCase();
  if (!question) return "";

  const has = (...terms) => terms.some((term) => question.includes(term));

  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(question)) {
    return "Hi! I'm Anna's resume assistant. Ask me about her education, internship, projects, technical skills, certifications, or contact information.";
  }

  if (has("echowear", "echo wear")) return RESUME_PROFILE.projects.echowear;
  if (has("servease", "serv ease")) return RESUME_PROFILE.projects.servease;
  if (has("pockethive", "pocket hive")) return RESUME_PROFILE.projects.pockethive;

  if (has("education", "degree", "school", "college", "university", "graduate", "graduated", "tip", "technological institute")) {
    return RESUME_PROFILE.education;
  }

  if (has("certification", "certifications", "certificate", "google course", "crash course")) {
    return RESUME_PROFILE.certifications;
  }

  if (has("email", "linkedin", "github", "portfolio link", "contact", "reach anna", "location", "where is anna")) {
    return RESUME_PROFILE.contact;
  }

  if (has("programming language", "languages", "javascript", "typescript", "python", "java", "c#", "c++", "dart", "php", "sql", "bash")) {
    return `Anna's programming languages include ${RESUME_PROFILE.skills.programming}`;
  }

  if (has("frontend", "mobile", "react", "flutter", "ionic", "html", "css", "tailwind", "vite", "expo", "android")) {
    return `For frontend and mobile development, Anna lists ${RESUME_PROFILE.skills.frontend}`;
  }

  if (has("backend", "api", "node", "express", ".net", "asp.net", "supabase", "firebase", "authentication", "authorization")) {
    return `For backend and APIs, Anna lists ${RESUME_PROFILE.skills.backend}`;
  }

  if (has("database", "postgres", "postgresql", "mysql", "sqlite")) {
    return `Anna's database skills include ${RESUME_PROFILE.skills.databases}`;
  }

  if (has("cloud", "devops", "docker", "ci/cd", "aws", "vercel", "render", "git")) {
    return `For cloud and DevOps, Anna lists ${RESUME_PROFILE.skills.cloud}`;
  }

  if (has("testing", "postman", "swagger", "openapi", "jest", "linux", "visual studio code", "vs code")) {
    return `For testing and development tools, Anna lists ${RESUME_PROFILE.skills.testing}`;
  }

  if (has("embedded", "hardware", "arduino", "esp32", "raspberry", "microcontroller", "sensor", "bluetooth", "ble", "i2c", "spi", "uart")) {
    return `For embedded and hardware systems, Anna lists ${RESUME_PROFILE.skills.embedded}`;
  }

  if (has("ai", "machine learning", "ml", "tensorflow", "computer vision", "ocr", "cnn", "deep learning")) {
    return `For AI and machine learning, Anna lists ${RESUME_PROFILE.skills.ai}`;
  }

  if (has("skills", "skill", "tech stack", "technologies", "technology")) {
    return `Anna's resume covers programming (${RESUME_PROFILE.skills.programming}), frontend/mobile (${RESUME_PROFILE.skills.frontend}), backend/APIs (${RESUME_PROFILE.skills.backend}), databases (${RESUME_PROFILE.skills.databases}), cloud/DevOps (${RESUME_PROFILE.skills.cloud}), testing tools, embedded systems, and AI/ML.`;
  }

  if (has("project", "projects", "portfolio projects")) {
    return `Anna's resume highlights three projects: EchoWear, a Filipino Sign Language smart glove; ServEase, a full-stack business operations platform; and PocketHive, an AI-powered personal finance mobile application. Ask me about any one of them for details.`;
  }

  if (has("ateneo", "aic", "intern", "internship", "work experience", "professional experience", "experience")) {
    return RESUME_PROFILE.experience;
  }

  if (has("summary", "professional summary", "about anna", "who is anna", "tell me about anna", "profile", "software developer", "mobile developer")) {
    return RESUME_PROFILE.summary;
  }

  return "I can only answer questions supported by Anna's resume. Try asking about her education, Ateneo Innovation Center internship, EchoWear, ServEase, PocketHive, technical skills, certifications, or contact information.";
}

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
  const lastCursorTextRef = useRef("");
  const chatLogRef = useRef(null);
  const chatMessageIdRef = useRef(1);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: 0,
      role: "assistant",
      text: "Hi — I'm Anna's resume assistant. Ask me anything about the information in her resume.",
    },
  ]);
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
    speechStartTimerRef.current = window.setTimeout(() => {
      if (
        sessionId !== speechSessionRef.current ||
        activeUtteranceRef.current !== utterance ||
        !soundEnabledRef.current
      ) {
        return;
      }

      // Some browsers expose a voice that fails to start. Retry the same
      // chunk once with the browser default voice instead of going silent.
      if (!useDefaultVoice && !synth.speaking) {
        activeUtteranceRef.current = null;
        speechQueueRef.current.unshift(nextChunk);
        synth.cancel();
        speakNextChunk(sessionId, { useDefaultVoice: true });
      }
    }, 1600);

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
      window.sessionStorage.setItem("apv-robot-welcomed", "1");
    }

    return undefined;
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const visibleRatios = new Map();

    const setFromHash = () => {
      const id = window.location.hash.replace("#", "");
      if (sectionIds.includes(id) && document.getElementById(id)) {
        setActiveSection(id);
        return true;
      }
      return false;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRatios.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId = "";
        let bestRatio = 0;

        for (const [id, ratio] of visibleRatios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId && bestRatio > 0) {
          setActiveSection(bestId);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -42% 0px",
        threshold: [0, 0.15, 0.35, 0.55, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    const handleHashChange = () => {
      setFromHash();
    };

    setFromHash();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!soundEnabledRef.current) return undefined;
    if (!activeSection) return undefined;

    // Only restart narration when the section itself changes.
    // This prevents the sound button's initial user-gesture speech from
    // being immediately cancelled by a second React effect.
    stopSpeech();
    lastCursorTextRef.current = "";

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
        `You're in the ${label} section. I'm reading it now. Click any text if you want me to read that specific part instead.`,
      );

      speak(`You are now in the ${label} section. ${sectionText}`);
    }, 180);

    return () => {
      if (sectionTimerRef.current) {
        window.clearTimeout(sectionTimerRef.current);
        sectionTimerRef.current = null;
      }
    };
  }, [activeSection]);

  useEffect(() => {
    if (!chatOpen || !chatLogRef.current) return undefined;

    const frame = window.requestAnimationFrame(() => {
      if (chatLogRef.current) {
        chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [chatOpen, chatMessages]);

  useEffect(() => {
    if (!chatOpen) return undefined;

    const handleChatEscape = (event) => {
      if (event.key === "Escape") setChatOpen(false);
    };

    document.addEventListener("keydown", handleChatEscape);
    return () => document.removeEventListener("keydown", handleChatEscape);
  }, [chatOpen]);

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

    const handleContentClick = (event) => {
      if (!soundEnabledRef.current) return;
      if (!(event.target instanceof Element)) return;
      if (event.target.closest(".robot-assistant")) return;

      const section = document.getElementById(activeSection);
      if (!section || !section.contains(event.target)) return;

      const text = getCursorSpeech(event.target, activeSection);

      if (!text || text === lastCursorTextRef.current) return;

      lastCursorTextRef.current = text;
      setMessage("Reading the part you selected.");
      speak(text);
    };

    document.addEventListener("click", handleContentClick);

    return () => {
      document.removeEventListener("click", handleContentClick);
    };
  }, [activeSection, soundEnabled]);

  useEffect(() => {
    if (!soundEnabled) return undefined;
    if (!("speechSynthesis" in window)) return undefined;

    // Chromium may silently pause long speech queues. A lightweight resume
    // watchdog keeps section narration moving without creating new utterances.
    const synth = window.speechSynthesis;
    const watchdog = window.setInterval(() => {
      if (soundEnabledRef.current && synth.speaking) {
        synth.resume();
      }
    }, 4000);

    return () => window.clearInterval(watchdog);
  }, [soundEnabled]);


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

  const appendAssistantMessage = (text) => {
    const id = chatMessageIdRef.current++;
    setChatMessages((current) => [...current, { id, role: "assistant", text }]);
  };

  const askResumeQuestion = (question) => {
    const value = String(question || "").trim();
    if (!value) return;

    const userId = chatMessageIdRef.current++;
    const reply = answerResumeQuestion(value);
    const assistantId = chatMessageIdRef.current++;

    setChatMessages((current) => [
      ...current,
      { id: userId, role: "user", text: value },
      { id: assistantId, role: "assistant", text: reply },
    ]);
    setChatInput("");

    if (soundEnabledRef.current) {
      speak(reply);
    }
  };

  const submitResumeQuestion = (event) => {
    event.preventDefault();
    askResumeQuestion(chatInput);
  };

  const submitName = (event) => {
    event.preventDefault();
    const value = nameInput.trim();
    if (!value) return;

    setVisitorName(value);
    window.sessionStorage.setItem("apv-visitor-name", value);

    const reply = `Nice to meet you, ${value}! Ask me anything about Anna's resume. I can explain her education, internship, projects, skills, certifications, and contact information.`;

    setMessage(reply);
    appendAssistantMessage(reply);
    setNameInput("");

    if (soundEnabledRef.current) {
      speak(reply);
    }
  };

  const chatTablet =
    chatOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="robot-chat-overlay"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setChatOpen(false);
            }}
          >
            <section
              className="robot-cyber-tablet"
              role="dialog"
              aria-modal="true"
              aria-label="Anna Vida resume assistant"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="robot-tablet-scanlines" aria-hidden="true" />

              <header className="robot-tablet-header">
                <div className="robot-tablet-identity">
                  <span className="robot-tablet-status-dot" aria-hidden="true" />
                  <span>APV // RESUME CORE</span>
                </div>

                <div className="robot-tablet-header-actions">
                  <span className="robot-tablet-mode">RESUME-ONLY</span>
                  <button
                    type="button"
                    className="robot-tablet-close"
                    onClick={() => setChatOpen(false)}
                    aria-label="Close resume assistant"
                  >
                    <FaTimes />
                  </button>
                </div>
              </header>

              <div className="robot-tablet-body">
                <aside className="robot-tablet-sidebar">
                  <div className="robot-tablet-profile-mark">APV</div>
                  <p className="robot-tablet-kicker">CANDIDATE FILE</p>
                  <h2>Anna Patricia Vida</h2>
                  <p className="robot-tablet-role">Software & Mobile Developer</p>

                  <div className="robot-tablet-readout">
                    <span>DATA SOURCE</span>
                    <strong>Current Resume</strong>
                  </div>

                  <div className="robot-tablet-readout">
                    <span>ACTIVE SECTION</span>
                    <strong>{sectionLabels[activeSection] || "Portfolio"}</strong>
                  </div>

                  {!visitorName ? (
                    <form className="robot-tablet-name-form" onSubmit={submitName}>
                      <label htmlFor="robot-visitor-name">VISITOR ID · OPTIONAL</label>
                      <div>
                        <input
                          id="robot-visitor-name"
                          type="text"
                          value={nameInput}
                          onChange={(event) => setNameInput(event.target.value)}
                          placeholder="Your name"
                          maxLength={40}
                        />
                        <button type="submit" aria-label="Save visitor name">
                          <FaPaperPlane />
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="robot-tablet-readout">
                      <span>VISITOR</span>
                      <strong>{visitorName}</strong>
                    </div>
                  )}

                  <button
                    type="button"
                    className={`robot-tablet-sound ${soundEnabled ? "is-on" : ""}`}
                    onClick={toggleSound}
                    aria-pressed={soundEnabled}
                  >
                    {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                    <span>{soundEnabled ? "VOICE ONLINE" : "VOICE OFFLINE"}</span>
                  </button>
                </aside>

                <div className="robot-tablet-chat">
                  <div className="robot-tablet-chat-head">
                    <div>
                      <span className="robot-tablet-kicker">SECURE CHANNEL // 01</span>
                      <h3>Resume Assistant</h3>
                    </div>
                    <span className="robot-tablet-online">● ONLINE</span>
                  </div>

                  <div
                    className="robot-tablet-chat-log"
                    ref={chatLogRef}
                    aria-live="polite"
                  >
                    {chatMessages.map((item) => (
                      <div
                        key={item.id}
                        className={`robot-chat-row robot-chat-row--${item.role}`}
                      >
                        <span className="robot-chat-speaker">
                          {item.role === "assistant" ? "APV.AI" : "YOU"}
                        </span>
                        <div className="robot-chat-bubble">{item.text}</div>
                      </div>
                    ))}
                  </div>

                  <div className="robot-tablet-quick">
                    {RESUME_QUICK_QUESTIONS.map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => askResumeQuestion(question)}
                      >
                        {question}
                      </button>
                    ))}
                  </div>

                  <form className="robot-tablet-input" onSubmit={submitResumeQuestion}>
                    <span className="robot-tablet-prompt" aria-hidden="true">
                      &gt;_
                    </span>
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(event) => setChatInput(event.target.value)}
                      placeholder="Ask about Anna's resume..."
                      maxLength={220}
                      aria-label="Ask a question about Anna's resume"
                    />
                    <button type="submit" aria-label="Send resume question">
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </div>

              <footer className="robot-tablet-footer">
                <span>SYS: {message}</span>
                <span>NO EXTERNAL KNOWLEDGE // RESUME DATA ONLY</span>
              </footer>
            </section>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <aside
        className={`robot-assistant robot-section-${activeSection}`}
        aria-label="Interactive portfolio guide"
      >
        <div
          className="robot-stage"
          onClick={() => setChatOpen(true)}
          aria-label="Floating happy robot portfolio guide"
        >
          <Canvas
            camera={{ position: [0, 0.18, 4.35], fov: 38 }}
            dpr={[0.75, 1]}
            performance={{ min: 0.45, max: 1, debounce: 220 }}
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
            className={`robot-action-button ${chatOpen ? "is-active" : ""}`}
            onClick={() => setChatOpen((open) => !open)}
            aria-label="Open resume chatbot"
            aria-expanded={chatOpen}
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

      {chatTablet}
    </>
  );

}