import { useEffect, useRef } from "react";

const ABOUT_STATS = [
  {
    value: "4 MO",
    label: "Software Internship",
    position: "top-left",
  },
  {
    value: "2026",
    label: "BSIT Graduate",
    position: "top-right",
  },
  {
    value: "6",
    label: "Featured Projects",
    position: "bottom-left",
  },
  {
    value: "6",
    label: "Tech Domains",
    position: "bottom-right",
  },
];

export default function InteractiveAboutPortrait({ src, alt }) {
  const wrapRef = useRef(null);

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
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    wrap.style.setProperty("--about-shift-x", `${px * 8}px`);
    wrap.style.setProperty("--about-shift-y", `${py * 6}px`);
  };

  const resetPointer = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.style.setProperty("--about-shift-x", "0px");
    wrap.style.setProperty("--about-shift-y", "0px");
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

      <div className="about-showcase-photo-wrap">
        <img
          src={src}
          alt={alt}
          className="about-showcase-photo"
          draggable="false"
        />
        <div className="about-showcase-photo-fade" aria-hidden="true" />
      </div>

      <div className="about-showcase-stats" aria-label="Anna Patricia Vida highlights">
        {ABOUT_STATS.map((stat) => (
          <article
            key={stat.position}
            className={`about-showcase-stat about-showcase-stat--${stat.position}`}
          >
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
