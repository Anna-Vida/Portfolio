import { useEffect, useRef, useState } from "react";

export const ABOUT_STATS = [
  {
    id: "internship",
    value: "4 MO",
    label: "Software Internship",
    position: "top-left",
    eyebrow: "JAN — APR 2026",
    title: "Software Developer Intern",
    organization: "Ateneo Innovation Center",
    description:
      "Built practical software across healthcare, AgTech, computer vision, embedded systems, and real-time data workflows.",
    items: ["Mobile", "OCR", "AI / ML", "Computer Vision", "IoT"],
    cta: { label: "View experience", href: "#experience" },
  },
  {
    id: "education",
    value: "2026",
    label: "BSIT Graduate",
    position: "top-right",
    eyebrow: "EDUCATION",
    title: "BS Information Technology",
    organization: "Technological Institute of the Philippines",
    description:
      "Completed hands-on work across software development, mobile engineering, databases, artificial intelligence, IoT, and systems development.",
    items: ["Software", "Mobile", "Databases", "AI", "IoT"],
  },
  {
    id: "projects",
    value: "6",
    label: "Featured Projects",
    position: "bottom-left",
    eyebrow: "SELECTED WORK",
    title: "Projects built across multiple systems",
    organization: "Portfolio 2025 — 2026",
    description:
      "A focused collection of mobile, full-stack, AI, workflow, finance, and connected-technology projects.",
    items: [
      "EchoWear",
      "ServEase",
      "NexFlow",
      "Stock Price Prediction",
      "PocketHive",
      "Medimate",
    ],
    cta: { label: "Explore projects", href: "#work" },
  },
  {
    id: "domains",
    value: "6",
    label: "Tech Domains",
    position: "bottom-right",
    eyebrow: "CORE DOMAINS",
    title: "A cross-disciplinary software toolkit",
    organization: "Current focus",
    description:
      "I work across product engineering and intelligent connected systems, choosing tools based on the problem rather than staying inside one stack.",
    items: [
      "Mobile",
      "Full-stack",
      "AI / ML",
      "Computer Vision",
      "IoT",
      "Cloud & Data",
    ],
    cta: { label: "See tech stack", href: "#skills" },
  },
];

export default function InteractiveAboutPortrait({
  src,
  alt,
  activeStat,
  onStatChange,
}) {
  const wrapRef = useRef(null);
  const [identityVisible, setIdentityVisible] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      wrap.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          wrap.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.22 }
    );

    observer.observe(wrap);

    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    const rect = wrap.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const px = x - 0.5;
    const py = y - 0.5;

    wrap.style.setProperty("--about-shift-x", `${px * 8}px`);
    wrap.style.setProperty("--about-shift-y", `${py * 6}px`);
    wrap.style.setProperty("--about-pointer-x", `${x * 100}%`);
    wrap.style.setProperty("--about-pointer-y", `${y * 100}%`);
  };

  const resetPointer = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.style.setProperty("--about-shift-x", "0px");
    wrap.style.setProperty("--about-shift-y", "0px");
    wrap.style.setProperty("--about-pointer-x", "50%");
    wrap.style.setProperty("--about-pointer-y", "42%");
  };

  return (
    <div
      ref={wrapRef}
      className="about-portrait-wrap about-portrait-interactive about-showcase"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="about-showcase-stage" aria-hidden="true">
        <div className="about-showcase-orbit" />
        <div className="about-showcase-glow" />
      </div>

      <button
        type="button"
        className={`about-showcase-photo-wrap about-showcase-photo-button ${
          identityVisible ? "is-identity-visible" : ""
        }`}
        onClick={() => setIdentityVisible((current) => !current)}
        aria-pressed={identityVisible}
        aria-label="Show or hide Anna Patricia Vida profile identity"
      >
        <img
          src={src}
          alt={alt}
          className="about-showcase-photo"
          draggable="false"
        />
        <span className="about-showcase-photo-fade" aria-hidden="true" />

        <span className="about-showcase-identity" aria-hidden={!identityVisible}>
          <span>ANNA PATRICIA VIDA</span>
          <small>SOFTWARE DEVELOPER</small>
        </span>
      </button>

      <div
        className="about-showcase-stats"
        aria-label="Anna Patricia Vida highlights"
      >
        {ABOUT_STATS.map((stat, index) => {
          const isActive = activeStat === stat.id;

          return (
            <button
              type="button"
              key={stat.id}
              className={`about-showcase-stat about-showcase-stat--${stat.position} ${
                isActive ? "is-active" : ""
              }`}
              style={{ "--about-stat-index": index }}
              onClick={() => onStatChange?.(isActive ? null : stat.id)}
              aria-expanded={isActive}
              aria-controls="about-highlight-panel"
            >
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <em>{isActive ? "Close" : "Explore"} ↗</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
