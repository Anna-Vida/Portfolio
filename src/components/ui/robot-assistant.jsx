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

function RobotEye({ position, pointerRef, loved, phase = 0 }) {
  const eyeRef = useRef();
  const heartRef = useRef();

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() + phase;
    const blink = elapsed % 3.6;
    const blinkScale = blink < 0.12 ? Math.max(0.08, blink / 0.12) : 1;

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
      <mesh ref={eyeRef}>
        <boxGeometry args={[0.07, 0.04, 0.018]} />
        <meshStandardMaterial
          color="#f2f2f2"
          emissive="#f2f2f2"
          emissiveIntensity={1.8}
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
          color="#f2f2f2"
          emissive="#f2f2f2"
          emissiveIntensity={1.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function RobotEar({ side = 1 }) {
  return (
    <group position={[side * 0.315, 0.17, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.055, 0.055, 0.034, 32]} />
        <meshStandardMaterial color="#bcbcbc" roughness={0.45} metalness={0.18} />
      </mesh>

      <mesh position={[side * 0.018, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.041, 0.008, 14, 28]} />
        <meshStandardMaterial color="#efefef" roughness={0.3} metalness={0.2} />
      </mesh>

      <group
        position={[side * 0.012, 0.07, 0]}
        rotation={[0, 0, side * -0.18]}
      >
        <mesh position={[0, 0.055, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.11, 10]} />
          <meshStandardMaterial color="#cfcfcf" roughness={0.4} metalness={0.25} />
        </mesh>
        <mesh position={[0, 0.112, 0]}>
          <sphereGeometry args={[0.011, 16, 16]} />
          <meshStandardMaterial
            color="#f2f2f2"
            emissive="#f2f2f2"
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

function RobotModel({ pointerRef, loved }) {
  const robotRef = useRef();
  const headRef = useRef();

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c7c7c7",
        roughness: 0.68,
        metalness: 0.08,
      }),
    [],
  );

  const headMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#111111",
        roughness: 0.42,
        metalness: 0.12,
      }),
    [],
  );

  useEffect(
    () => () => {
      bodyMaterial.dispose();
      headMaterial.dispose();
    },
    [bodyMaterial, headMaterial],
  );

  useFrame(({ clock }, delta) => {
    if (!robotRef.current || !headRef.current) return;

    const dt = Math.min(delta, 0.1);
    const px = pointerRef.current.x;
    const py = pointerRef.current.y;

    const targetX = px * 0.12;
    const targetY = -0.18 + py * 0.045;
    const bob = Math.sin(clock.getElapsedTime() * 1.6) * 0.018;

    robotRef.current.position.x = THREE.MathUtils.lerp(
      robotRef.current.position.x,
      targetX,
      4.5 * dt,
    );

    robotRef.current.position.y = THREE.MathUtils.lerp(
      robotRef.current.position.y,
      targetY + bob,
      4.5 * dt,
    );

    robotRef.current.rotation.y = THREE.MathUtils.lerp(
      robotRef.current.rotation.y,
      -px * 0.28,
      5.5 * dt,
    );

    robotRef.current.rotation.z = THREE.MathUtils.lerp(
      robotRef.current.rotation.z,
      -px * 0.05,
      4 * dt,
    );

    headRef.current.rotation.y = THREE.MathUtils.lerp(
      headRef.current.rotation.y,
      px * 0.65,
      8 * dt,
    );

    headRef.current.rotation.x = THREE.MathUtils.lerp(
      headRef.current.rotation.x,
      -py * 0.22,
      8 * dt,
    );
  });

  return (
    <group ref={robotRef} position={[0, -0.18, 0]} scale={1.55}>
      <mesh material={bodyMaterial}>
        <sphereGeometry
          args={[0.43, 48, 48, 0, Math.PI * 2, Math.PI * 0.15, Math.PI * 0.84]}
        />
      </mesh>

      <mesh position={[0, 0.34, 0]} material={bodyMaterial}>
        <cylinderGeometry args={[0.19, 0.23, 0.11, 36]} />
      </mesh>

      <group ref={headRef} position={[0, 0.68, 0]}>
        <mesh material={headMaterial}>
          <sphereGeometry args={[0.29, 48, 48]} />
        </mesh>

        <mesh position={[0, -0.01, 0.272]} scale={[1.02, 0.72, 0.22]}>
          <sphereGeometry args={[0.275, 40, 40]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            roughness={0.14}
            metalness={0.08}
            clearcoat={1}
            clearcoatRoughness={0.12}
          />
        </mesh>

        <group position={[0, -0.005, 0.338]}>
          <RobotEye
            position={[-0.082, 0, 0]}
            pointerRef={pointerRef}
            loved={loved}
          />
          <RobotEye
            position={[0.082, 0, 0]}
            pointerRef={pointerRef}
            loved={loved}
            phase={0.08}
          />
        </group>

        <RobotEar side={-1} />
        <RobotEar side={1} />
      </group>
    </group>
  );
}

function RobotScene({ pointerRef, loved }) {
  return (
    <>
      <ambientLight intensity={1.45} />
      <directionalLight position={[3, 5, 4]} intensity={2.1} color="#ffffff" />
      <directionalLight
        position={[-4, 2, 2]}
        intensity={0.65}
        color="#d7d7d7"
      />
      <RobotModel pointerRef={pointerRef} loved={loved} />
    </>
  );
}

const readableSelector =
  "h1, h2, h3, p, li, .project-title, .project-description, .experience-role, .experience-description, .cert-pin-copy, .skill-card-back";

function cleanSpeechText(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[↗↺]/g, "")
    .trim();
}

export default function RobotAssistant() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const hoverTimerRef = useRef(null);
  const lastSpokenRef = useRef("");
  const loveTimerRef = useRef(null);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [loved, setLoved] = useState(false);
  const [message, setMessage] = useState(
    "Hello! Welcome to Anna's portfolio. What's your name?",
  );

  const speak = (text) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;

    const cleaned = cleanSpeechText(text);
    if (!cleaned) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.rate = 0.96;
    utterance.pitch = 1.02;
    utterance.volume = 0.92;
    utterance.lang = "en-US";

    const voices = window.speechSynthesis.getVoices();
    const preferred =
      voices.find((voice) => /female|zira|samantha|aria/i.test(voice.name)) ||
      voices.find((voice) => /^en/i.test(voice.lang));

    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const storedName = window.sessionStorage.getItem("apv-visitor-name");
    if (storedName) {
      setVisitorName(storedName);
      setMessage(
        `Welcome back, ${storedName}! Turn sound on and hover over text if you'd like me to read it.`,
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
    const handlePointerMove = (event) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;

      if (!soundEnabled) return;

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
      if (text.length < 4 || text.length > 320 || text === lastSpokenRef.current) {
        return;
      }

      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }

      hoverTimerRef.current = window.setTimeout(() => {
        lastSpokenRef.current = text;
        speak(text);
      }, 850);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, [soundEnabled]);

  useEffect(
    () => () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      if (loveTimerRef.current) {
        window.clearTimeout(loveTimerRef.current);
      }
    },
    [],
  );

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);

    if (!next && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    if (next) {
      window.setTimeout(() => {
        const greeting = visitorName
          ? `Sound is on, ${visitorName}. Hover over text and I'll read it for you.`
          : "Sound is on. Hover over text and I'll read it for you.";
        speak(greeting);
      }, 0);
    }
  };

  const submitName = (event) => {
    event.preventDefault();
    const value = nameInput.trim();
    if (!value) return;

    setVisitorName(value);
    window.sessionStorage.setItem("apv-visitor-name", value);

    const reply = `Nice to meet you, ${value}! I'm Anna's portfolio guide. I can follow your cursor and read page content when sound is on.`;
    setMessage(reply);
    setNameInput("");

    if (soundEnabled) {
      window.setTimeout(() => speak(reply), 0);
    }
  };

  const showLove = () => {
    setLoved(true);
    if (loveTimerRef.current) window.clearTimeout(loveTimerRef.current);
    loveTimerRef.current = window.setTimeout(() => setLoved(false), 1500);
  };

  return (
    <aside className="robot-assistant" aria-label="Interactive portfolio guide">
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
              {soundEnabled ? "Sound on · hover text to read" : "Sound off"}
            </span>
            <span className="robot-toggle-track" aria-hidden="true">
              <span />
            </span>
          </button>
        </div>
      )}

      <div className="robot-stage" onClick={showLove}>
        <Canvas
          camera={{ position: [0, 0.25, 4.4], fov: 38 }}
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
