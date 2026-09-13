import { forwardRef, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaArrowUp,
  FaEnvelope,
  FaFilePdf,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const footerStyles = `
  .cinematic-footer-shell {
    --footer-foreground: #f4f4f1;
    --footer-muted: #878783;
    --footer-line: rgba(255, 255, 255, 0.13);
    --footer-panel: rgba(255, 255, 255, 0.045);
    position: relative;
    width: 100%;
    height: 100vh;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    background: #0b0b0b;
    color: var(--footer-foreground);
    font-family: "Manrope", sans-serif;
  }

  .cinematic-footer {
    position: fixed;
    inset: auto 0 0;
    display: flex;
    width: 100%;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    background: #0b0b0b;
  }

  .cinematic-footer::before {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: linear-gradient(to bottom, transparent, black 28%, black 72%, transparent);
    content: "";
    pointer-events: none;
  }

  .cinematic-footer::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: min(80vw, 1000px);
    height: 55vh;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(144, 144, 132, 0.15), transparent 68%);
    filter: blur(60px);
    animation: footer-breathe 8s ease-in-out infinite alternate;
    content: "";
    pointer-events: none;
  }

  .cinematic-footer__marquee {
    position: relative;
    z-index: 2;
    width: 110%;
    margin-top: 48px;
    margin-left: -5%;
    overflow: hidden;
    border-top: 1px solid var(--footer-line);
    border-bottom: 1px solid var(--footer-line);
    background: rgba(11, 11, 11, 0.68);
    backdrop-filter: blur(14px);
    padding: 15px 0;
    transform: rotate(-2deg);
  }

  .cinematic-footer__marquee-track {
    display: flex;
    width: max-content;
    animation: footer-marquee 34s linear infinite;
    color: var(--footer-muted);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .cinematic-footer__marquee-item {
    display: flex;
    gap: 2.5rem;
    padding: 0 2.5rem;
  }

  .cinematic-footer__marquee-item span:nth-child(even) {
    color: var(--footer-foreground);
    opacity: 0.55;
  }

  .cinematic-footer__content {
    position: relative;
    z-index: 2;
    display: flex;
    width: min(92%, 1050px);
    flex: 1;
    margin: 0 auto;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0 20px;
    text-align: center;
  }

  .cinematic-footer__giant-text {
    position: absolute;
    bottom: -4vh;
    left: 50%;
    color: transparent;
    font-size: clamp(7rem, 25vw, 24rem);
    font-weight: 900;
    letter-spacing: -0.08em;
    line-height: 0.75;
    pointer-events: none;
    transform: translateX(-50%);
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.055);
    white-space: nowrap;
  }

  .cinematic-footer__heading {
    position: relative;
    margin-bottom: 42px;
    background: linear-gradient(180deg, #fff, rgba(255,255,255,0.42));
    background-clip: text;
    color: transparent;
    font-size: clamp(2.8rem, 7vw, 7rem);
    font-weight: 800;
    letter-spacing: -0.075em;
    line-height: 0.95;
    filter: drop-shadow(0 0 22px rgba(255,255,255,0.12));
    -webkit-background-clip: text;
  }

  .cinematic-footer__links {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
  }

  .cinematic-footer__pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 54px;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 999px;
    background: linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.012));
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1), 0 12px 30px -16px rgba(0,0,0,0.9);
    color: var(--footer-foreground);
    padding: 0 24px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: border-color 0.3s ease, background 0.3s ease, color 0.3s ease;
  }

  .cinematic-footer__pill:hover {
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.1);
    color: #fff;
  }

  .cinematic-footer__pill svg {
    color: var(--footer-muted);
    font-size: 1rem;
  }

  .cinematic-footer__bottom {
    position: relative;
    z-index: 2;
    display: grid;
    width: min(92%, 1450px);
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 24px;
    margin: 0 auto;
    padding: 0 0 30px;
    color: var(--footer-muted);
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .cinematic-footer__bottom p:last-child {
    text-align: right;
  }

  .cinematic-footer__heart {
    display: inline-block;
    margin: 0 4px;
    color: #e6e6df;
    animation: footer-heartbeat 2s ease-in-out infinite;
  }

  .cinematic-footer__top {
    width: 44px;
    height: 44px;
    padding: 0;
  }

  @keyframes footer-breathe {
    from { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
  }

  @keyframes footer-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  @keyframes footer-heartbeat {
    0%, 100% { transform: scale(1); }
    15%, 45% { transform: scale(1.18); }
    30% { transform: scale(1); }
  }

  @media (max-width: 700px) {
    .cinematic-footer__marquee { margin-top: 35px; }
    .cinematic-footer__content { padding-top: 40px; }
    .cinematic-footer__links { flex-direction: column; width: min(100%, 320px); }
    .cinematic-footer__pill { width: 100%; }
    .cinematic-footer__bottom { grid-template-columns: 1fr; justify-items: center; gap: 16px; padding-bottom: 22px; text-align: center; }
    .cinematic-footer__bottom p:last-child { text-align: center; }
    .cinematic-footer__top { order: -1; }
  }
`;

const MarqueeItem = () => (
  <div className="cinematic-footer__marquee-item">
    <span>Mobile Development</span><span>✦</span>
    <span>AI & IoT</span><span>✦</span>
    <span>Full-Stack Systems</span><span>✦</span>
    <span>Connected Technology</span><span>✦</span>
  </div>
);

const MagneticLink = forwardRef(function MagneticLink(
  { as: Component = "a", className = "", children, ...props },
  forwardedRef
) {
  const localRef = useRef(null);

  useEffect(() => {
    const element = localRef.current;
    if (!element) return undefined;

    const move = (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      gsap.to(element, { x: x * 0.18, y: y * 0.18, duration: 0.35, ease: "power2.out" });
    };

    const leave = () => {
      gsap.to(element, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.35)" });
    };

    element.addEventListener("mousemove", move);
    element.addEventListener("mouseleave", leave);
    return () => {
      element.removeEventListener("mousemove", move);
      element.removeEventListener("mouseleave", leave);
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <Component
      ref={(node) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      }}
      className={`cinematic-footer__pill ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
});

function CinematicFooter() {
  const wrapperRef = useRef(null);
  const giantTextRef = useRef(null);
  const headingRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    const context = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.82, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: wrapper, start: "top 80%", end: "bottom bottom", scrub: 1 },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapper, start: "top 45%", end: "bottom bottom", scrub: 1 },
        }
      );
    }, wrapper);

    return () => context.revert();
  }, []);

  return (
    <>
      <style>{footerStyles}</style>
      <div ref={wrapperRef} className="cinematic-footer-shell">
        <footer className="cinematic-footer">
          <div className="cinematic-footer__marquee" aria-hidden="true">
            <div className="cinematic-footer__marquee-track">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          <div className="cinematic-footer__content">
            <div ref={giantTextRef} className="cinematic-footer__giant-text" aria-hidden="true">
              APV
            </div>
            <h2 ref={headingRef} className="cinematic-footer__heading">
              Let&apos;s build something useful.
            </h2>

            <div ref={linksRef} className="cinematic-footer__links">
              <MagneticLink href="mailto:annapatriciavida12@gmail.com">
                <FaEnvelope /> Email me
              </MagneticLink>
              <MagneticLink href="/Anna-Patricia-Vida-Resume.pdf" download>
                <FaFilePdf /> Download resume
              </MagneticLink>
              <MagneticLink href="https://github.com/Anna-Vida" target="_blank" rel="noreferrer">
                <FaGithub /> GitHub
              </MagneticLink>
              <MagneticLink href="https://www.linkedin.com/in/annavida12/" target="_blank" rel="noreferrer">
                <FaLinkedinIn /> LinkedIn
              </MagneticLink>
            </div>
          </div>

          <div className="cinematic-footer__bottom">
            <p>© 2026 Anna Patricia Vida</p>
            <MagneticLink as="a" href="#home" className="cinematic-footer__top" aria-label="Back to top">
              <FaArrowUp />
            </MagneticLink>
            <p>Crafted with <span className="cinematic-footer__heart">♥</span> in Quezon City</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
