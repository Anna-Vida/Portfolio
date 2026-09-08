import { useEffect, useRef, useState } from "react";
import "./index.css";

import {
  FaReact,
  FaNodeJs,
  FaPython,
  FaJava,
  FaGithub,
  FaDocker,
  FaAndroid,
  FaCompress,
  FaDesktop,
  FaExpand,
  FaMousePointer,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";

import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFirebase,
  SiFlutter,
  SiMysql,
  SiSupabase,
  SiTensorflow,
  SiArduino,
  SiKotlin,
  SiVite,
  SiRedux,
} from "react-icons/si";


const DEFAULT_THEME = "original";

const ACCENT_OPTIONS = [
  { name: "Original", value: "original", swatch: "#f2f2f2" },
  { name: "Ember", value: "#b45309", swatch: "#b45309" },
  { name: "Forest", value: "#166534", swatch: "#166534" },
  { name: "Midnight", value: "#1e3a8a", swatch: "#1e3a8a" },
  { name: "Burgundy", value: "#7f1d1d", swatch: "#7f1d1d" },
  { name: "Plum", value: "#581c87", swatch: "#581c87" },
];

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [flippedSkill, setFlippedSkill] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [compactView, setCompactView] = useState(() => {
    return localStorage.getItem("portfolio-compact-view") === "true";
  });
  const [showCursor, setShowCursor] = useState(() => {
    const saved = localStorage.getItem("portfolio-show-cursor");
    return saved === null ? true : saved === "true";
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("portfolio-accent-color") || DEFAULT_THEME;
  });

  const settingsRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    if (accentColor === "original") {
      document.documentElement.dataset.theme = "original";
      document.documentElement.style.removeProperty("--accent");
      localStorage.removeItem("portfolio-accent-color");
    } else {
      document.documentElement.dataset.theme = "accent";
      document.documentElement.style.setProperty("--accent", accentColor);
      localStorage.setItem("portfolio-accent-color", accentColor);
    }
  }, [accentColor]);

  useEffect(() => {
    document.body.classList.toggle("compact-mode", compactView);
    localStorage.setItem("portfolio-compact-view", String(compactView));

    return () => {
      document.body.classList.remove("compact-mode");
    };
  }, [compactView]);

  useEffect(() => {
    document.body.classList.toggle("custom-cursor-enabled", showCursor);
    localStorage.setItem("portfolio-show-cursor", String(showCursor));

    return () => {
      document.body.classList.remove("custom-cursor-enabled");
    };
  }, [showCursor]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!showCursor || !cursorRef.current) return;

      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    };

    const handlePointerOver = (event) => {
      if (
        cursorRef.current &&
        event.target.closest("a, button, .orbit-icon, .tech-pill")
      ) {
        cursorRef.current.classList.add("is-hovering");
      }
    };

    const handlePointerOut = (event) => {
      if (
        cursorRef.current &&
        event.target.closest("a, button, .orbit-icon, .tech-pill")
      ) {
        cursorRef.current.classList.remove("is-hovering");
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
    };
  }, [showCursor]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        settingsOpen &&
        settingsRef.current &&
        !settingsRef.current.contains(event.target)
      ) {
        setSettingsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [settingsOpen]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen mode could not be changed:", error);
    }
  };

  const resetAppearance = () => {
    setCompactView(false);
    setShowCursor(true);
    setAccentColor(DEFAULT_THEME);

    localStorage.removeItem("portfolio-compact-view");
    localStorage.removeItem("portfolio-show-cursor");
    localStorage.removeItem("portfolio-accent-color");
  };

  return (
    <>
      <div
        ref={cursorRef}
        className={`custom-cursor ${showCursor ? "is-visible" : ""}`}
        aria-hidden="true"
      />

      {/* =========================
          NAVBAR
      ========================== */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#home" className="brand">
            APV.
          </a>

          <div className="nav-right">
            <nav>
              <a href="#about">About</a>
              <a href="#work">Work</a>
              <a href="#experience">Experience</a>
              <a href="#skills">Skills</a>
              <a href="#certifications">Certifications</a>
              <a href="#contact">Contact</a>
            </nav>

            <div className="portfolio-settings" ref={settingsRef}>
              <button
                type="button"
                className={`settings-trigger ${settingsOpen ? "is-active" : ""}`}
                onClick={() => setSettingsOpen((open) => !open)}
                aria-expanded={settingsOpen}
                aria-controls="portfolio-settings-panel"
              >
                <FaSlidersH />
                <span>Settings</span>
              </button>

              {settingsOpen && (
                <div
                  className="settings-panel"
                  id="portfolio-settings-panel"
                  role="dialog"
                  aria-label="Portfolio settings"
                >
                  <div className="settings-panel-header">
                    <h3>Settings</h3>

                    <button
                      type="button"
                      className="settings-close"
                      onClick={() => setSettingsOpen(false)}
                      aria-label="Close settings"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="setting-row"
                    onClick={toggleFullscreen}
                  >
                    <span className="setting-row-label">
                      {isFullscreen ? <FaCompress /> : <FaDesktop />}
                      <span>Full screen</span>
                    </span>

                    <span className={`setting-switch ${isFullscreen ? "is-on" : ""}`}>
                      {isFullscreen ? "On" : "Off"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="setting-row"
                    onClick={() => setCompactView((value) => !value)}
                  >
                    <span className="setting-row-label">
                      <FaExpand />
                      <span>Compact view</span>
                    </span>

                    <span className={`setting-switch ${compactView ? "is-on" : ""}`}>
                      {compactView ? "On" : "Off"}
                    </span>
                  </button>

                  <div className="setting-group">
                    <div className="setting-group-title">
                      <span className="accent-palette-icon">◉</span>
                      <span>Accent Theme</span>
                    </div>

                    <div className="accent-options">
                      {ACCENT_OPTIONS.map((accent) => (
                        <button
                          type="button"
                          key={accent.value}
                          className={`accent-option ${
                            accentColor === accent.value ? "is-selected" : ""
                          }`}
                          style={{ "--swatch": accent.swatch }}
                          onClick={() => setAccentColor(accent.value)}
                          aria-label={`Use ${accent.name} theme`}
                          title={accent.name}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="setting-row"
                    onClick={() => setShowCursor((value) => !value)}
                  >
                    <span className="setting-row-label">
                      <FaMousePointer />
                      <span>Show cursor</span>
                    </span>

                    <span className={`setting-switch ${showCursor ? "is-on" : ""}`}>
                      {showCursor ? "On" : "Off"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="settings-reset"
                    onClick={resetAppearance}
                  >
                    Reset appearance
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* =========================
            HERO
        ========================== */}
        <section className="hero" id="home">
          <div className="hero-inner">
            <p className="eyebrow">
              SOFTWARE DEVELOPER — QUEZON CITY, PHILIPPINES
            </p>

            <h1 className="hero-title">
              ANNA
              <span>PATRICIA VIDA</span>
            </h1>

            <div className="hero-bottom">
              <p className="hero-copy">
                I build software that connects
                <span> people, systems, and intelligent technology.</span>
              </p>

              <div className="hero-actions">
                <a href="#work" className="btn btn-primary">
                  View my work
                </a>

                <a
                  href="/Anna-Patricia-Vida-Resume.pdf"
                  className="btn"
                  download
                >
                  Download CV
                </a>
              </div>
            </div>

            <div className="hero-meta">
              <div className="socials">
                <a
                  href="https://github.com/Anna-Vida"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>

                <a
                  href="https://www.linkedin.com/in/annavida12/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              </div>

              <span>SCROLL TO EXPLORE</span>
            </div>
          </div>
        </section>

        {/* =========================
            SELECTED WORK
        ========================== */}
        <section className="work-section" id="work">
          <div className="work-container">
            <div className="work-heading">
              <p className="section-kicker">SELECTED WORK</p>

              <h2>
                Projects built across
                <span> mobile, AI, IoT and full-stack development.</span>
              </h2>
            </div>

            <div className="project-list">
              {/* PROJECT 01 */}
              <article className="project-card project-featured">
                <div className="project-number">01</div>

                <div className="project-content">
                  <p className="project-type">
                    AI · IOT · MOBILE
                  </p>

                  <h3>EchoWear</h3>

                  <p className="project-description">
                    A smart wearable glove designed for two-way Filipino Sign
                    Language communication using ESP32 hardware, motion
                    sensors, machine learning, and real-time translation.
                  </p>

                  <div className="project-tags">
                    <span>React Native</span>
                    <span>ESP32</span>
                    <span>TensorFlow Lite</span>
                    <span>Supabase</span>
                    <span>IoT</span>
                  </div>

                  <a
                    href="https://github.com/Anna-Vida/EchoWear"
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    View project ↗
                  </a>
                </div>

                <div className="project-visual">
                  <span>ECHOWEAR</span>
                </div>
              </article>

              {/* PROJECT 02 */}
              <article className="project-card">
                <div className="project-number">02</div>

                <div className="project-content">
                  <p className="project-type">
                    MOBILE · FINTECH · AI
                  </p>

                  <h3>PocketHive</h3>

                  <p className="project-description">
                    An AI-powered personal finance application built for
                    expense management, budgeting, bill tracking, and financial
                    insights.
                  </p>

                  <div className="project-tags">
                    <span>Mobile</span>
                    <span>Firebase</span>
                    <span>AI</span>
                    <span>Authentication</span>
                  </div>

                  <a
                    href="https://github.com/Anna-Vida/pockethive"
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    View project ↗
                  </a>
                </div>

                <div className="project-visual">
                  <span>POCKETHIVE</span>
                </div>
              </article>

              {/* PROJECT 03 */}
              <article className="project-card">
                <div className="project-number">03</div>

                <div className="project-content">
                  <p className="project-type">
                    HEALTHCARE · MOBILE
                  </p>

                  <h3>Medimate</h3>

                  <p className="project-description">
                    A healthcare-focused application project centered around
                    accessible mobile workflows and intelligent health-related
                    functionality.
                  </p>

                  <div className="project-tags">
                    <span>Mobile</span>
                    <span>Healthcare</span>
                    <span>AI</span>
                  </div>

                  <a
                    href="https://github.com/Anna-Vida/Medimate"
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    View project ↗
                  </a>
                </div>

                <div className="project-visual">
                  <span>MEDIMATE</span>
                </div>
              </article>
            </div>

            <div className="all-projects">
              <a
                href="https://github.com/Anna-Vida"
                target="_blank"
                rel="noreferrer"
              >
                Explore all projects on GitHub ↗
              </a>
            </div>
          </div>
        </section>

        {/* =========================
    ABOUT
========================== */}
<section className="about-section" id="about">
  <div className="about-container">

    {/* LEFT SIDE */}
    <div className="about-side">
      <p className="about-label">ABOUT</p>

      <div className="about-orbit-wrap">
        <div className="tech-orbit about-orbit">
          <div className="orbit-center">
            <span>TECH</span>
          </div>

          <div className="orbit-ring orbit-ring-one">
            <div className="orbit-icon orbit-1">
              <FaReact />
            </div>

            <div className="orbit-icon orbit-2">
              <SiJavascript />
            </div>

            <div className="orbit-icon orbit-3">
              <SiTypescript />
            </div>

            <div className="orbit-icon orbit-4">
              <SiFirebase />
            </div>
          </div>

          <div className="orbit-ring orbit-ring-two">
            <div className="orbit-icon orbit-5">
              <FaAndroid />
            </div>

            <div className="orbit-icon orbit-6">
              <FaNodeJs />
            </div>

            <div className="orbit-icon orbit-7">
              <SiTailwindcss />
            </div>

            <div className="orbit-icon orbit-8">
              <FaGithub />
            </div>

            <div className="orbit-icon orbit-9">
              <SiVite />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="about-content">
      <h2>
        I build digital products that combine
        <span>
          {" "}
          software, intelligent systems, and connected technology.
        </span>
      </h2>

      <div className="about-grid">
        <p>
          I'm Anna Patricia Vida, an Information Technology graduate and
          software developer with experience in mobile development,
          full-stack systems, AI, IoT, and offline-first applications.
        </p>

        <p>
          My work spans healthcare, agriculture, finance, computer vision,
          embedded systems, and wearable technology. I enjoy turning complex
          technical ideas into practical applications that people can
          actually use.
        </p>
      </div>
    </div>

  </div>
</section>
        {/* =========================
            EXPERIENCE
        ========================== */}
        <section className="experience-section" id="experience">
          <div className="experience-container">
            <div className="experience-heading">
              <p className="section-kicker">EXPERIENCE</p>

              <h2>
                Building across
                <span> software, AI, mobile, and connected systems.</span>
              </h2>
            </div>

            <div className="experience-list">
              <article className="experience-item">
                <div className="experience-year">
                  JAN 2026 — APR 2026
                </div>

                <div className="experience-role">
                  <h3>Software Developer Intern</h3>

                  <p className="experience-company">
                    Ateneo Innovation Center
                  </p>
                </div>

                <div className="experience-description">
                  <p>
                    Developed offline-first mobile applications for healthcare
                    and AgTech, integrating local caching, OCR, cloud
                    synchronization, and responsive mobile workflows.
                  </p>

                  <p>
                    Built computer vision interfaces and control dashboards
                    integrating Meta Ray-Ban AI Glasses for real-time obstacle
                    and debris detection.
                  </p>

                  <p>
                    Worked with machine learning pipelines, microcontrollers,
                    cloud backends, and environmental weather station systems
                    for real-time data streaming.
                  </p>
                </div>
              </article>

              <article className="experience-item">
                <div className="experience-year">
                  JUNE 2026
                </div>

                <div className="experience-role">
                  <h3>Bachelor of Science in Information Technology</h3>

                  <p className="experience-company">
                    Technological Institute of the Philippines
                  </p>
                </div>

                <div className="experience-description">
                  <p>
                    Completed a Bachelor of Science in Information Technology
                    with hands-on work across software development, mobile
                    engineering, databases, artificial intelligence, IoT, and
                    systems development.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* =========================
            SKILLS / TECH STACK
        ========================== */}
        <section className="skills-section" id="skills">
          <div className="skills-container">
            <div className="skills-heading">
              <p className="section-kicker">TECH STACK</p>

              <h2>
                Tools I use to build
                <span> practical, scalable software.</span>
              </h2>
            </div>

            {/* =========================
                MOVING TECH WALL
            ========================== */}
            <div className="tech-marquee">
              <div className="tech-marquee-row tech-marquee-row-one">
                <div className="tech-marquee-track">
                  <div className="tech-pill"><FaReact /><span>React.js</span></div>
                  <div className="tech-pill"><FaNodeJs /><span>Node.js</span></div>
                  <div className="tech-pill"><SiTypescript /><span>TypeScript</span></div>
                  <div className="tech-pill"><SiJavascript /><span>JavaScript</span></div>
                  <div className="tech-pill"><SiTailwindcss /><span>Tailwind CSS</span></div>
                  <div className="tech-pill"><SiFirebase /><span>Firebase</span></div>
                  <div className="tech-pill"><SiSupabase /><span>Supabase</span></div>
                  <div className="tech-pill"><SiMysql /><span>MySQL</span></div>
                  <div className="tech-pill"><SiFlutter /><span>Flutter</span></div>

                  <div className="tech-pill"><FaReact /><span>React.js</span></div>
                  <div className="tech-pill"><FaNodeJs /><span>Node.js</span></div>
                  <div className="tech-pill"><SiTypescript /><span>TypeScript</span></div>
                  <div className="tech-pill"><SiJavascript /><span>JavaScript</span></div>
                  <div className="tech-pill"><SiTailwindcss /><span>Tailwind CSS</span></div>
                  <div className="tech-pill"><SiFirebase /><span>Firebase</span></div>
                  <div className="tech-pill"><SiSupabase /><span>Supabase</span></div>
                  <div className="tech-pill"><SiMysql /><span>MySQL</span></div>
                  <div className="tech-pill"><SiFlutter /><span>Flutter</span></div>
                </div>
              </div>

              <div className="tech-marquee-row tech-marquee-row-two">
                <div className="tech-marquee-track">
                  <div className="tech-pill"><FaAndroid /><span>Android</span></div>
                  <div className="tech-pill"><SiTensorflow /><span>TensorFlow</span></div>
                  <div className="tech-pill"><SiArduino /><span>Arduino</span></div>
                  <div className="tech-pill"><FaPython /><span>Python</span></div>
                  <div className="tech-pill"><FaJava /><span>Java</span></div>
                  <div className="tech-pill"><SiKotlin /><span>Kotlin</span></div>
                  <div className="tech-pill"><FaDocker /><span>Docker</span></div>
                  <div className="tech-pill"><SiRedux /><span>Redux Toolkit</span></div>
                  <div className="tech-pill"><SiVite /><span>Vite</span></div>

                  <div className="tech-pill"><FaAndroid /><span>Android</span></div>
                  <div className="tech-pill"><SiTensorflow /><span>TensorFlow</span></div>
                  <div className="tech-pill"><SiArduino /><span>Arduino</span></div>
                  <div className="tech-pill"><FaPython /><span>Python</span></div>
                  <div className="tech-pill"><FaJava /><span>Java</span></div>
                  <div className="tech-pill"><SiKotlin /><span>Kotlin</span></div>
                  <div className="tech-pill"><FaDocker /><span>Docker</span></div>
                  <div className="tech-pill"><SiRedux /><span>Redux Toolkit</span></div>
                  <div className="tech-pill"><SiVite /><span>Vite</span></div>
                </div>
              </div>
            </div>

            {/* =========================
                NORMAL SKILLS GRID
            ========================== */}
            <div className="skills-grid skills-flip-grid">
              <button
                type="button"
                className={`skill-flip-card ${flippedSkill === 0 ? "is-flipped" : ""}`}
                onClick={() =>
                  setFlippedSkill((current) => (current === 0 ? null : 0))
                }
                aria-pressed={flippedSkill === 0}
                aria-label="Flip Mobile skill card"
              >
                <span className="skill-card-inner">
                  <span className="skill-card-face skill-card-front">
                    <span className="skill-number">01</span>
                    <span className="skill-card-title">Mobile</span>
                    <span className="skill-card-hint">Click to flip ↻</span>
                  </span>

                  <span className="skill-card-face skill-card-back">
                    <span className="skill-card-back-label">Mobile</span>
                    <span className="skill-tags">
                      <span>React Native</span>
                      <span>Jetpack Compose</span>
                      <span>Ionic</span>
                      <span>Flutter</span>
                      <span>Dart</span>
                      <span>Android Studio</span>
                    </span>
                    <span className="skill-card-hint">Click to return ↺</span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`skill-flip-card ${flippedSkill === 1 ? "is-flipped" : ""}`}
                onClick={() =>
                  setFlippedSkill((current) => (current === 1 ? null : 1))
                }
                aria-pressed={flippedSkill === 1}
                aria-label="Flip Frontend skill card"
              >
                <span className="skill-card-inner">
                  <span className="skill-card-face skill-card-front">
                    <span className="skill-number">02</span>
                    <span className="skill-card-title">Frontend</span>
                    <span className="skill-card-hint">Click to flip ↻</span>
                  </span>

                  <span className="skill-card-face skill-card-back">
                    <span className="skill-card-back-label">Frontend</span>
                    <span className="skill-tags">
                      <span>React.js</span>
                      <span>Next.js</span>
                      <span>TypeScript</span>
                      <span>JavaScript</span>
                      <span>HTML5</span>
                      <span>Tailwind CSS</span>
                      <span>Vite</span>
                      <span>MUI</span>
                      <span>Redux</span>
                    </span>
                    <span className="skill-card-hint">Click to return ↺</span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`skill-flip-card ${flippedSkill === 2 ? "is-flipped" : ""}`}
                onClick={() =>
                  setFlippedSkill((current) => (current === 2 ? null : 2))
                }
                aria-pressed={flippedSkill === 2}
                aria-label="Flip Backend & APIs skill card"
              >
                <span className="skill-card-inner">
                  <span className="skill-card-face skill-card-front">
                    <span className="skill-number">03</span>
                    <span className="skill-card-title">Backend & APIs</span>
                    <span className="skill-card-hint">Click to flip ↻</span>
                  </span>

                  <span className="skill-card-face skill-card-back">
                    <span className="skill-card-back-label">Backend & APIs</span>
                    <span className="skill-tags">
                      <span>Node.js</span>
                      <span>PHP</span>
                      <span>REST APIs</span>
                      <span>GraphQL</span>
                      <span>Python</span>
                      <span>Java</span>
                      <span>Kotlin</span>
                      <span>C/C++</span>
                    </span>
                    <span className="skill-card-hint">Click to return ↺</span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`skill-flip-card ${flippedSkill === 3 ? "is-flipped" : ""}`}
                onClick={() =>
                  setFlippedSkill((current) => (current === 3 ? null : 3))
                }
                aria-pressed={flippedSkill === 3}
                aria-label="Flip Databases skill card"
              >
                <span className="skill-card-inner">
                  <span className="skill-card-face skill-card-front">
                    <span className="skill-number">04</span>
                    <span className="skill-card-title">Databases</span>
                    <span className="skill-card-hint">Click to flip ↻</span>
                  </span>

                  <span className="skill-card-face skill-card-back">
                    <span className="skill-card-back-label">Databases</span>
                    <span className="skill-tags">
                      <span>Supabase</span>
                      <span>PostgreSQL</span>
                      <span>Firebase</span>
                      <span>MySQL</span>
                      <span>SQLite</span>
                    </span>
                    <span className="skill-card-hint">Click to return ↺</span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`skill-flip-card ${flippedSkill === 4 ? "is-flipped" : ""}`}
                onClick={() =>
                  setFlippedSkill((current) => (current === 4 ? null : 4))
                }
                aria-pressed={flippedSkill === 4}
                aria-label="Flip Cloud & Tools skill card"
              >
                <span className="skill-card-inner">
                  <span className="skill-card-face skill-card-front">
                    <span className="skill-number">05</span>
                    <span className="skill-card-title">Cloud & Tools</span>
                    <span className="skill-card-hint">Click to flip ↻</span>
                  </span>

                  <span className="skill-card-face skill-card-back">
                    <span className="skill-card-back-label">Cloud & Tools</span>
                    <span className="skill-tags">
                      <span>Git</span>
                      <span>GitHub</span>
                      <span>Docker</span>
                      <span>CI/CD</span>
                      <span>AWS</span>
                      <span>Cypress</span>
                      <span>Playwright</span>
                      <span>Linux</span>
                      <span>Bash</span>
                      <span>GitHub Copilot</span>
                      <span>Cursor</span>
                    </span>
                    <span className="skill-card-hint">Click to return ↺</span>
                  </span>
                </span>
              </button>

              <button
                type="button"
                className={`skill-flip-card ${flippedSkill === 5 ? "is-flipped" : ""}`}
                onClick={() =>
                  setFlippedSkill((current) => (current === 5 ? null : 5))
                }
                aria-pressed={flippedSkill === 5}
                aria-label="Flip AI, IoT & Security skill card"
              >
                <span className="skill-card-inner">
                  <span className="skill-card-face skill-card-front">
                    <span className="skill-number">06</span>
                    <span className="skill-card-title">AI, IoT & Security</span>
                    <span className="skill-card-hint">Click to flip ↻</span>
                  </span>

                  <span className="skill-card-face skill-card-back">
                    <span className="skill-card-back-label">AI, IoT & Security</span>
                    <span className="skill-tags">
                      <span>TensorFlow Lite</span>
                      <span>Edge Computing</span>
                      <span>OCR</span>
                      <span>Image Recognition</span>
                      <span>Arduino</span>
                      <span>Raspberry Pi</span>
                      <span>Wearable Tech</span>
                    </span>
                    <span className="skill-card-hint">Click to return ↺</span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================
            CERTIFICATIONS
        ========================== */}
        <section
          className="certifications-section"
          id="certifications"
        >
          <div className="certifications-container">
            <div className="certifications-heading">
              <p className="section-kicker">
                CERTIFICATIONS
              </p>

              <h2>
                Continuous learning across
                <span>
                  {" "}
                  development, systems, and cybersecurity.
                </span>
              </h2>
            </div>

            <div className="certification-list">
              <a
                href="https://www.coursera.org/account/accomplishments/verify/8RIIRZ2R9Z98"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  Google
                </div>

                <div className="certification-title">
                  <h3>
                    Using Python to Interact with the Operating System
                  </h3>
                </div>

                <div className="certification-date">
                  AUG 2026
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://learn.opswatacademy.com/certificate/YKGWHt_m9w"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  OPSWAT Academy
                </div>

                <div className="certification-title">
                  <h3>Introduction to CIP</h3>
                </div>

                <div className="certification-date">
                  AUG 2026 — JUL 2027
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://www.appkademiya.online/verify/CERT-WINOPS-CERTIFIED-ENGINEER-WNO101-20260815-975AF137D63B"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  Appkademiya
                </div>

                <div className="certification-title">
                  <h3>
                    WinOps Certified Engineer (WNO-101)
                  </h3>
                </div>

                <div className="certification-date">
                  AUG 2026
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://www.coursera.org/account/accomplishments/verify/C6N2EHHSNU4K"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  Google
                </div>

                <div className="certification-title">
                  <h3>Crash Course on Python</h3>
                </div>

                <div className="certification-date">
                  FEB 2026
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://www.hackerrank.com/certificates/iframe/4875c3806a5c"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  HackerRank
                </div>

                <div className="certification-title">
                  <h3>Java (Basic) Certificate</h3>
                </div>

                <div className="certification-date">
                  APR 2026
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://www.hackerrank.com/certificates/iframe/4d61bd0470ac"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  HackerRank
                </div>

                <div className="certification-title">
                  <h3>
                    Software Engineer Certificate
                  </h3>
                </div>

                <div className="certification-date">
                  APR 2026
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://www.hackerrank.com/certificates/be43a2286ab2"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  HackerRank
                </div>

                <div className="certification-title">
                  <h3>
                    Frontend Developer (React)
                  </h3>
                </div>

                <div className="certification-date">
                  APR 2026 — APR 2036
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <div className="certification-item no-link">
                <div className="certification-company">
                  Ateneo de Manila University
                </div>

                <div className="certification-title">
                  <h3>
                    Workshop on Advanced Photonics Technologies for Emerging
                    ICT and Sensing Applications
                  </h3>
                </div>

                <div className="certification-date">
                  FEB 2026 — DEC 2036
                </div>

                <div className="certification-arrow">
                  —
                </div>
              </div>

              <a
                href="https://www.credly.com/badges/7972d039-2d48-4e69-8d83-44e21a4f345d/linked_in_profile"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  Cisco
                </div>

                <div className="certification-title">
                  <h3>Operating Systems Basics</h3>
                </div>

                <div className="certification-date">
                  JUN 2025
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>

              <a
                href="https://www.credly.com/badges/abfdca56-2a8f-44d4-a753-a4143cf6da5f/linked_in_profile"
                target="_blank"
                rel="noreferrer"
                className="certification-item"
              >
                <div className="certification-company">
                  Cisco
                </div>

                <div className="certification-title">
                  <h3>Cyber Threat Management</h3>
                </div>

                <div className="certification-date">
                  OCT 2025
                </div>

                <div className="certification-arrow">
                  ↗
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* =========================
            CONTACT
        ========================== */}
        <section className="contact-section" id="contact">
          <div className="contact-container">
            <p className="section-kicker">
              CONTACT
            </p>

            <div className="contact-content">
              <h2>
                Have a project, opportunity,
                <span> or idea worth building?</span>
              </h2>

              <p className="contact-description">
                I'm open to software development opportunities,
                collaborations, internships, freelance projects, and
                conversations around mobile, AI, IoT, and full-stack
                development.
              </p>

              <div className="contact-actions">
                <a
                  href="mailto:annapatriciavida12@gmail.com"
                  className="contact-button contact-button-primary"
                >
                  Send me an email ↗
                </a>

                <a
                  href="https://www.linkedin.com/in/annavida12/"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-button"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>

            <div className="contact-details">
              <div>
                <p className="contact-label">
                  EMAIL
                </p>

                <a href="mailto:annapatriciavida12@gmail.com">
                  annapatriciavida12@gmail.com
                </a>
              </div>

              <div>
                <p className="contact-label">
                  LOCATION
                </p>

                <p>
                  Quezon City, Philippines
                </p>
              </div>

              <div>
                <p className="contact-label">
                  GITHUB
                </p>

                <a
                  href="https://github.com/Anna-Vida"
                  target="_blank"
                  rel="noreferrer"
                >
                  github.com/Anna-Vida ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-brand">
            <h2>
              ANNA PATRICIA VIDA
            </h2>

            <p>
              Software Developer
            </p>
          </div>

          <div className="footer-links">
            <a href="#home">
              Back to top ↑
            </a>

            <a
              href="https://github.com/Anna-Vida"
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>

            <a
              href="https://www.linkedin.com/in/annavida12/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </div>

          <div className="footer-bottom">
            <p>
              © 2026 Anna Patricia Vida
            </p>

            <p>
              Designed & developed by Anna Patricia Vida
            </p>
          </div>

        </div>
      </footer>
    </>
  );
}

export default App;