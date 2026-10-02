import { lazy, Suspense, useEffect, useRef, useState } from "react";
import "./index.css";
import HeroHexBackground from "./components/ui/hero-hex-background";
import { AnimatedText } from "./components/ui/animated-text";
import { ParticleTextEffect } from "./components/ui/interactive-text-particle";
import CinematicFooter from "./components/ui/motion-footer";
import annaAboutPortrait from "./assets/anna-about-portrait.png.png";
import InteractiveAboutPortrait from "./components/ui/interactive-about-portrait";
import TextShimmer from "./components/ui/text-shimmer";
import FolderCard from "./components/ui/folder-card";
import TechStackPager from "./components/ui/tech-stack-pager";
import HeroShutterText from "./components/ui/hero-shutter-text";
import CertificationPinCard from "./components/ui/certification-pin-card";
import ScrollRevealController from "./components/ui/scroll-reveal-controller";
import ProjectsBrowser from "./components/ui/projects-browser";

const RobotAssistant = lazy(() => import("./components/ui/robot-assistant"));

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



const PROJECTS = [
  {
    number: "01",
    title: "EchoWear",
    type: "AI · IOT · MOBILE",
    categories: ["Mobile Apps", "AI & IoT"],
    shortDescription:
      "A smart wearable glove for two-way Filipino Sign Language communication using real-time gesture recognition.",
    description:
      "EchoWear combines wearable hardware and a mobile application to translate Filipino Sign Language gestures into speech and support two-way communication. The project uses ESP32 hardware, motion sensing, Bluetooth Low Energy, and on-device TensorFlow Lite inference.",
    tags: ["React Native", "Expo", "ESP32", "TensorFlow Lite", "BLE", "Three.js"],
    github: "https://github.com/Anna-Vida/EchoWear",
    live: null,
    year: "2026",
  },
  {
    number: "02",
    title: "ServEase",
    type: "FULL-STACK · BUSINESS OPERATIONS",
    categories: ["Fullstack"],
    shortDescription:
      "A full-stack appointment and business operations platform for customers, staff, services, bookings, and payments.",
    description:
      "ServEase is a full-stack service-business platform with dedicated customer, staff, and admin workflows. It includes authentication, role-based access, appointment management, payments, analytics, audit logging, email notifications, and PostgreSQL Row Level Security.",
    tags: ["React 19", "TypeScript", "Node.js", "Express", "Supabase", "PostgreSQL"],
    github: "https://github.com/Anna-Vida/ServEase",
    live: "https://servease-iota.vercel.app/",
    year: "2026",
  },
  {
    number: "03",
    title: "NexFlow",
    type: "FULL-STACK · WORKFLOW AUTOMATION",
    categories: ["Fullstack"],
    shortDescription:
      "A visual workflow automation engine with webhooks, schedules, background workers, retries, and execution history.",
    description:
      "NexFlow lets users build directed workflow graphs, trigger them through webhooks or schedules, execute actions, inspect execution history, and recover safely from worker failures. PostgreSQL stores durable state while Redis and BullMQ handle background delivery.",
    tags: ["React", "TypeScript", "NestJS", "PostgreSQL", "Redis", "BullMQ"],
    github: "https://github.com/Anna-Vida/Nexflow",
    live: "https://nexflow-one.vercel.app/",
    year: "2026",
  },
  {
    number: "04",
    title: "Stock Price Prediction",
    type: "FULL-STACK · MARKET RESEARCH",
    categories: ["Fullstack"],
    shortDescription:
      "A stock and crypto research workspace with live market data, analytics, forecasts, watchlists, and alerts.",
    description:
      "A market research workspace combining a JavaScript stock interface, a React and TypeScript crypto dashboard, and a Python Flask API. It supports historical analytics, statistical forecasts, evaluation metrics, watchlists, research notes, alerts, and optional Supabase accounts.",
    tags: ["JavaScript", "React", "TypeScript", "Python", "Flask", "Supabase"],
    github: "https://github.com/Anna-Vida/Stock-Price-Prediction",
    live: "https://stock-price-prediction-bice.vercel.app/",
    year: "2026",
  },
  {
    number: "05",
    title: "PocketHive",
    type: "MOBILE · FINTECH",
    categories: ["Mobile Apps", "AI & IoT"],
    shortDescription:
      "A mobile personal-finance application for expense tracking, budgeting, charts, and intelligent financial insights.",
    description:
      "PocketHive is a React Native finance application built around practical personal-money workflows. It combines authentication, local mobile interactions, finance visualizations, Firebase services, and a responsive dashboard experience.",
    tags: ["React Native", "Expo", "Firebase", "Authentication", "Charts", "Mobile"],
    github: "https://github.com/Anna-Vida/pockethive",
    live: null,
    year: "2025",
  },
  {
    number: "06",
    title: "Medimate",
    type: "MOBILE · HEALTHCARE · AI",
    categories: ["Mobile Apps", "AI & IoT"],
    shortDescription:
      "A healthcare-focused mobile application using OCR, camera workflows, speech features, and generative AI assistance.",
    description:
      "Medimate is an Expo and React Native healthcare application that combines camera-based workflows, ML Kit text recognition, Google Generative AI, speech features, notifications, and Firebase-backed functionality in a mobile-first experience.",
    tags: ["React Native", "Expo", "Gemini AI", "ML Kit OCR", "Firebase", "TypeScript"],
    github: "https://github.com/Anna-Vida/Medimate",
    live: null,
    year: "2026",
  },
];

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
  const [activeNav, setActiveNav] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
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
    const navSectionIds = [
      "about",
      "work",
      "experience",
      "skills",
      "certifications",
      "contact",
    ];

    const navSections = navSectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!navSections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveNav(visible[0].target.id);
        }
      },
      {
        rootMargin: "-24% 0px -58% 0px",
        threshold: [0.08, 0.2, 0.4, 0.6],
      }
    );

    navSections.forEach((section) => observer.observe(section));

    const handleTop = () => {
      if (window.scrollY < window.innerHeight * 0.45) {
        setActiveNav("");
      }
    };

    window.addEventListener("scroll", handleTop, { passive: true });
    handleTop();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleTop);
    };
  }, []);

  useEffect(() => {
    const section = document.querySelector(".experience-section");
    const items = document.querySelectorAll(".experience-item");

    if (!section || !items.length) return undefined;

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("is-visible");
          sectionObserver.disconnect();
        }
      },
      { threshold: 0.14 }
    );

    const itemObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            itemObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionObserver.observe(section);
    items.forEach((item) => itemObserver.observe(item));

    return () => {
      sectionObserver.disconnect();
      itemObserver.disconnect();
    };
  }, []);

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
    let cursorFrame = null;
    let cursorX = 0;
    let cursorY = 0;

    const paintCursor = () => {
      cursorFrame = null;
      if (!showCursor || !cursorRef.current) return;

      cursorRef.current.style.transform =
        `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    };

    const handlePointerMove = (event) => {
      if (!showCursor || !cursorRef.current) return;

      cursorX = event.clientX;
      cursorY = event.clientY;

      if (!cursorFrame) {
        cursorFrame = window.requestAnimationFrame(paintCursor);
      }
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
      if (cursorFrame) window.cancelAnimationFrame(cursorFrame);
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

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (selectedProject) {
      document.body.style.overflow = "hidden";
    }

    const handleProjectModalKey = (event) => {
      if (event.key === "Escape") {
        setSelectedProject(null);
      }
    };

    document.addEventListener("keydown", handleProjectModalKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleProjectModalKey);
    };
  }, [selectedProject]);

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

      <div className="site-hex-background" aria-hidden="true">
        <HeroHexBackground />
      </div>

      {/* =========================
          NAVBAR
      ========================== */}
      <header className="navbar">
        <div className="nav-container">
          <a href="#home" className="brand">
            APV.
          </a>

          <div className="nav-right">
            <nav className="limelight-nav" aria-label="Primary navigation">
              {[
                ["about", "About"],
                ["experience", "Experience"],
                ["work", "Work"],
                ["skills", "Skills"],
                ["certifications", "Certifications"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={activeNav === id ? "is-active" : ""}
                  aria-current={activeNav === id ? "page" : undefined}
                >
                  <span className="nav-limelight" aria-hidden="true" />
                  <span className="nav-label">{label}</span>
                </a>
              ))}
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

            <HeroShutterText />

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
            ABOUT
        ========================== */}
        <section className="about-section about-section-premium" id="about">
          <div className="about-shell" data-scroll-reveal="up">
            <div className="about-topline">
              <p>ABOUT</p>
              <span>01</span>
            </div>

            <div className="about-premium-grid">
              <div className="about-visual-column">
                <InteractiveAboutPortrait
                  src={annaAboutPortrait}
                  alt="Anna Patricia Vida in graduation attire"
                />
              </div>

              <div className="about-copy-column">
                <h2 className="about-premium-heading">
                  <span className="about-premium-heading-light">
                    I build digital products that
                  </span>
                  <span className="about-premium-heading-muted">
                    combine software,
                    <br />
                    intelligent systems, and
                    <br />
                    connected technology.
                  </span>
                </h2>

                <div className="about-info-grid">
                  <article className="about-info-card">
                    <div className="about-info-heading">
                      <span className="about-info-number">01</span>
                      <span className="about-info-label">PROFILE</span>
                      <span className="about-info-line" />
                    </div>

                    <p>
                      I'm Anna Patricia Vida, an Information Technology graduate
                      and software developer with experience in mobile
                      development, full-stack systems, AI, IoT, and offline-first
                      applications.
                    </p>
                  </article>

                  <article className="about-info-card">
                    <div className="about-info-heading">
                      <span className="about-info-number">02</span>
                      <span className="about-info-label">FOCUS</span>
                      <span className="about-info-line" />
                    </div>

                    <p>
                      My work spans healthcare, agriculture, finance, computer
                      vision, embedded systems, and wearable technology. I enjoy
                      turning complex technical ideas into practical applications
                      that people can actually use.
                    </p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            EXPERIENCE
        ========================== */}
        <section className="experience-section" id="experience">
          <div className="experience-container" data-scroll-reveal="left">
            <div className="experience-heading">
              <p className="section-kicker">EXPERIENCE</p>

              <h2>
                Building across
                <span> software, AI, mobile, and connected systems.</span>
              </h2>
            </div>

            <div className="experience-bento">
              <article className="experience-item experience-card experience-card-featured">
                <div className="experience-card-top">
                  <span className="experience-card-index">01</span>
                  <span className="experience-year">JAN 2026 — APR 2026</span>
                </div>

                <div className="experience-card-main">
                  <div className="experience-role">
                    <p className="experience-company">Ateneo Innovation Center</p>
                    <h3>Software Developer Intern</h3>
                  </div>

                  <div className="experience-description experience-description-lead">
                    <p>
                      Built practical software across healthcare, AgTech,
                      computer vision, embedded systems, and real-time data
                      workflows.
                    </p>
                  </div>
                </div>

                <div className="experience-highlights">
                  <div className="experience-highlight">
                    <span>01</span>
                    <p>
                      Developed offline-first mobile applications with OCR,
                      local caching, cloud synchronization, and responsive
                      workflows.
                    </p>
                  </div>

                  <div className="experience-highlight">
                    <span>02</span>
                    <p>
                      Built computer-vision interfaces and dashboards integrating
                      Meta Ray-Ban AI Glasses for obstacle and debris detection.
                    </p>
                  </div>

                  <div className="experience-highlight">
                    <span>03</span>
                    <p>
                      Worked with machine-learning pipelines, microcontrollers,
                      cloud backends, and live environmental weather-station data.
                    </p>
                  </div>
                </div>

                <div className="experience-tags" aria-label="Internship technologies">
                  <span>Mobile</span>
                  <span>OCR</span>
                  <span>Computer Vision</span>
                  <span>AI / ML</span>
                  <span>IoT</span>
                  <span>Cloud</span>
                </div>

                <span className="experience-card-mark" aria-hidden="true">AIC</span>
              </article>

              <article className="experience-item experience-card experience-card-education">
                <div className="experience-card-top">
                  <span className="experience-card-index">02</span>
                  <span className="experience-year">JUNE 2026</span>
                </div>

                <div className="experience-role">
                  <p className="experience-company">
                    Technological Institute of the Philippines
                  </p>
                  <h3>Bachelor of Science in Information Technology</h3>
                </div>

                <div className="experience-description">
                  <p>
                    Completed a BSIT degree with hands-on work in software
                    development, mobile engineering, databases, artificial
                    intelligence, IoT, and systems development.
                  </p>
                </div>

                <div className="experience-tags" aria-label="Education focus areas">
                  <span>Software</span>
                  <span>Mobile</span>
                  <span>Databases</span>
                  <span>AI</span>
                  <span>IoT</span>
                </div>

                <div className="experience-education-footer">
                  <span>QUEZON CITY</span>
                  <span>2026</span>
                </div>

                <span className="experience-card-mark" aria-hidden="true">TIP</span>
              </article>
            </div>
          </div>
        </section>


        {/* =========================
            SELECTED WORK
        ========================== */}
        <ProjectsBrowser
          projects={PROJECTS}
          onOpenProject={setSelectedProject}
        />

        {selectedProject && (
          <div
            className="project-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedProject(null);
              }
            }}
          >
            <div
              className="project-modal-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
            >
              <button
                type="button"
                className="project-modal-close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
              >
                ×
              </button>

              <div className="project-modal-preview project-modal-text-preview">
                <span className="project-modal-preview-index" aria-hidden="true">
                  PROJECT {selectedProject.number}
                </span>

                <AnimatedText
                  text={selectedProject.title}
                  fontSize={
                    selectedProject.title.length > 18
                      ? "clamp(3rem, 7vw, 6.6rem)"
                      : "clamp(4rem, 9vw, 8.4rem)"
                  }
                  minWeight={240}
                  maxWeight={780}
                  animationDuration={1.9}
                  delayMultiplier={0.08}
                  className="animated-text--modal"
                />
              </div>

              <div className="project-modal-body">
                <div className="project-modal-meta">
                  <span>{selectedProject.type}</span>
                  <span>{selectedProject.year}</span>
                </div>

                <h3 id="project-modal-title">{selectedProject.title}</h3>

                <p>{selectedProject.description}</p>

                <div className="project-modal-tech">
                  <span className="project-modal-label">TECHNOLOGIES USED</span>

                  <div className="project-modal-tags">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="project-modal-actions">
                  {selectedProject.live && (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noreferrer"
                      className="project-modal-primary"
                    >
                      Live project ↗
                    </a>
                  )}

                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal-secondary"
                  >
                    View GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================
            SKILLS / TECH STACK
        ========================== */}
        <section className="skills-section" id="skills">
          <div className="skills-container" data-scroll-reveal="scale">
            <div className="skills-heading">
              <p className="section-kicker">TECH STACK</p>

              <h2>
                <TextShimmer
                  text="Tools I use to build"
                  className="skills-shimmer-primary"
                  baseColor="#f2f2f2"
                  shimmerColor="#ffffff"
                  duration={3.4}
                />
                <TextShimmer
                  text=" practical, scalable software."
                  className="skills-shimmer-muted"
                  baseColor="#666666"
                  shimmerColor="#f2f2f2"
                  duration={3.4}
                />
              </h2>
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
                  <span className="skill-card-face skill-card-front skill-folder-front">
                    <FolderCard
                      number="01"
                      title="Mobile"
                      count="6 technologies"
                      open={flippedSkill === 0}
                    />
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
                    <span className="skill-card-hint">Close folder ↺</span>
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
                  <span className="skill-card-face skill-card-front skill-folder-front">
                    <FolderCard
                      number="02"
                      title="Frontend"
                      count="9 technologies"
                      open={flippedSkill === 1}
                    />
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
                    <span className="skill-card-hint">Close folder ↺</span>
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
                  <span className="skill-card-face skill-card-front skill-folder-front">
                    <FolderCard
                      number="03"
                      title="Backend & APIs"
                      count="8 technologies"
                      open={flippedSkill === 2}
                    />
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
                    <span className="skill-card-hint">Close folder ↺</span>
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
                  <span className="skill-card-face skill-card-front skill-folder-front">
                    <FolderCard
                      number="04"
                      title="Databases"
                      count="5 technologies"
                      open={flippedSkill === 3}
                    />
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
                    <span className="skill-card-hint">Close folder ↺</span>
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
                  <span className="skill-card-face skill-card-front skill-folder-front">
                    <FolderCard
                      number="05"
                      title="Cloud & Tools"
                      count="11 technologies"
                      open={flippedSkill === 4}
                    />
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
                    <span className="skill-card-hint">Close folder ↺</span>
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
                  <span className="skill-card-face skill-card-front skill-folder-front">
                    <FolderCard
                      number="06"
                      title="AI, IoT & Security"
                      count="7 technologies"
                      open={flippedSkill === 5}
                    />
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
                    <span className="skill-card-hint">Close folder ↺</span>
                  </span>
                </span>
              </button>
            </div>


            {/* =========================
                PAGED TECH LIBRARY
            ========================== */}
            <TechStackPager />

          </div>
        </section>

        {/* =========================
            CERTIFICATIONS
        ========================== */}
        <section
          className="certifications-section"
          id="certifications"
        >
          <div className="certifications-container" data-scroll-reveal="up">
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

            <div className="certification-list certification-pin-grid">
              <CertificationPinCard
                index={1}
                company="Google"
                title="Using Python to Interact with the Operating System"
                date="AUG 2026"
                href="https://www.coursera.org/account/accomplishments/verify/8RIIRZ2R9Z98"
              />

              <CertificationPinCard
                index={2}
                company="OPSWAT Academy"
                title="Introduction to CIP"
                date="AUG 2026 — JUL 2027"
                href="https://learn.opswatacademy.com/certificate/YKGWHt_m9w"
              />

              <CertificationPinCard
                index={3}
                company="Appkademiya"
                title="WinOps Certified Engineer (WNO-101)"
                date="AUG 2026"
                href="https://www.appkademiya.online/verify/CERT-WINOPS-CERTIFIED-ENGINEER-WNO101-20260815-975AF137D63B"
              />

              <CertificationPinCard
                index={4}
                company="Google"
                title="Crash Course on Python"
                date="FEB 2026"
                href="https://www.coursera.org/account/accomplishments/verify/C6N2EHHSNU4K"
              />

              <CertificationPinCard
                index={5}
                company="HackerRank"
                title="Java (Basic) Certificate"
                date="APR 2026"
                href="https://www.hackerrank.com/certificates/iframe/4875c3806a5c"
              />

              <CertificationPinCard
                index={6}
                company="HackerRank"
                title="Software Engineer Certificate"
                date="APR 2026"
                href="https://www.hackerrank.com/certificates/iframe/4d61bd0470ac"
              />

              <CertificationPinCard
                index={7}
                company="HackerRank"
                title="Frontend Developer (React)"
                date="APR 2026 — APR 2036"
                href="https://www.hackerrank.com/certificates/be43a2286ab2"
              />

              <CertificationPinCard
                index={8}
                company="Ateneo de Manila University"
                title="Workshop on Advanced Photonics Technologies for Emerging ICT and Sensing Applications"
                date="FEB 2026 — DEC 2036"
              />

              <CertificationPinCard
                index={9}
                company="Cisco"
                title="Operating Systems Basics"
                date="JUN 2025"
                href="https://www.credly.com/badges/7972d039-2d48-4e69-8d83-44e21a4f345d/linked_in_profile"
              />

              <CertificationPinCard
                index={10}
                company="Cisco"
                title="Cyber Threat Management"
                date="OCT 2025"
                href="https://www.credly.com/badges/abfdca56-2a8f-44d4-a753-a4143cf6da5f/linked_in_profile"
              />
            </div>
          </div>
        </section>

      </main>

      <ScrollRevealController />
      <CinematicFooter />

      <Suspense fallback={null}>
        <RobotAssistant />
      </Suspense>
    </>
  );
}

export default App;