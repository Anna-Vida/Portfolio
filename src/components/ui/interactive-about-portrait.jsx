import { useEffect, useRef } from "react";

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
      { threshold: 0.25 }
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

    wrap.style.setProperty("--portrait-x", `${px * 18}px`);
    wrap.style.setProperty("--portrait-y", `${py * 12}px`);
    wrap.style.setProperty("--portrait-ry", `${px * -15}deg`);
    wrap.style.setProperty("--portrait-rx", `${py * 11}deg`);
    wrap.style.setProperty("--comet-glare-x", `${(px + 0.5) * 100}%`);
    wrap.style.setProperty("--comet-glare-y", `${(py + 0.5) * 100}%`);
  };

  const resetPointer = () => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    wrap.style.setProperty("--portrait-x", "0px");
    wrap.style.setProperty("--portrait-y", "0px");
    wrap.style.setProperty("--portrait-ry", "0deg");
    wrap.style.setProperty("--portrait-rx", "0deg");
    wrap.style.setProperty("--comet-glare-x", "50%");
    wrap.style.setProperty("--comet-glare-y", "50%");
  };

  return (
    <div
      ref={wrapRef}
      className="about-portrait-wrap about-portrait-interactive"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="about-portrait-glow" aria-hidden="true" />

      <div className="about-comet-card">
        <div className="about-comet-glare" aria-hidden="true" />

        <div className="about-comet-photo">
          <img src={src} alt={alt} className="about-portrait" />
        </div>

        <div className="about-comet-meta">
          <div>
            <p className="about-comet-title">Software Developer</p>
            <p className="about-comet-subtitle">Anna Patricia Vida</p>
          </div>

          <span className="about-comet-index">01</span>
        </div>
      </div>
    </div>
  );
}
