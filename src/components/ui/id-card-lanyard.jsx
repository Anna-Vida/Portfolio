import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function IDCardLanyard({
  photoSrc,
  name = "Anna Patricia Vida",
  role = "Software Programmer",
  facebookUrl,
  instagramUrl,
}) {
  const sceneRef = useRef(null);
  const cardRef = useRef(null);
  const ropePathRef = useRef(null);
  const rafRef = useRef(null);

  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    moved: 0,
  });

  const motionRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
  });

  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const ropePath = ropePathRef.current;
    const scene = sceneRef.current;
    if (!card || !ropePath || !scene) return;

    const motion = motionRef.current;

    const animate = () => {
      const dragging = dragRef.current.active;

      // While dragging, the card follows quickly.
      // After release, a damped spring gives one gentle swing and returns home.
      const spring = dragging ? 0.28 : 0.065;
      const damping = dragging ? 0.7 : 0.84;

      motion.vx += (motion.targetX - motion.x) * spring;
      motion.vy += (motion.targetY - motion.y) * spring;

      motion.vx *= damping;
      motion.vy *= damping;

      motion.x += motion.vx;
      motion.y += motion.vy;

      const rotate = Math.max(-7, Math.min(7, motion.x * 0.045));

      card.style.transform =
        `translateX(-50%) translate3d(${motion.x}px, ${motion.y}px, 0) rotate(${rotate}deg)`;

      const sceneRect = scene.getBoundingClientRect();
      const anchorX = sceneRect.width / 2;
      const anchorY = 10;
      const cardTop = 72 + motion.y;
      const cardX = anchorX + motion.x;
      const attachY = cardTop + 4;

      const bendX = anchorX + motion.x * 0.24;
      const bendY = Math.max(30, (anchorY + attachY) * 0.5);

      const ropeD =
        `M ${anchorX} ${anchorY} Q ${bendX} ${bendY}, ${cardX} ${attachY}`;

      ropeLayers.forEach((layer) => layer.setAttribute("d", ropeD));

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onPointerDown = (event) => {
    if (event.target.closest("a")) return;

    const drag = dragRef.current;
    drag.active = true;
    drag.pointerId = event.pointerId;
    drag.startX = event.clientX;
    drag.startY = event.clientY;
    drag.moved = 0;

    cardRef.current?.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));

    // Let the visitor visibly stretch/swing the badge,
    // but keep it inside the About composition.
    const maxX = 118;
    const maxUp = -34;
    const maxDown = 92;

    motionRef.current.targetX = Math.max(
      -maxX,
      Math.min(maxX, dx * 0.82)
    );

    motionRef.current.targetY = Math.max(
      maxUp,
      Math.min(maxDown, dy * 0.62)
    );
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    drag.active = false;

    // A small release impulse creates a brief swing.
    motionRef.current.vx *= 1.12;
    motionRef.current.vy *= 0.9;

    motionRef.current.targetX = 0;
    motionRef.current.targetY = 0;

    if (drag.moved < 7 && !event.target.closest("a")) {
      setFlipped((current) => !current);
    }

    if (cardRef.current?.hasPointerCapture?.(event.pointerId)) {
      cardRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div ref={sceneRef} className="about-id-lanyard">
      <style>{`
        .about-id-lanyard {
          --id-card-bg: #f3f3f0;
          --id-card-bg-2: #e8e8e4;
          --id-card-ink: #101010;
          --id-card-muted: #747474;
          position: relative;
          width: min(100%, 560px);
          height: 650px;
          margin: 0 auto;
          overflow: visible;
          perspective: 1400px;
        }

        .about-id-rail {
          position: absolute;
          top: 0;
          left: 50%;
          width: 68px;
          height: 7px;
          transform: translateX(-50%);
          border-radius: 0 0 5px 5px;
          background: linear-gradient(180deg, #3d3d3d, #151515);
          box-shadow: 0 3px 10px rgba(0,0,0,.38);
          z-index: 4;
        }

        .about-id-rope-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
          z-index: 1;
        }

        .about-id-rope-shadow {
          fill: none;
          stroke: rgba(0,0,0,.34);
          stroke-width: 17px;
          stroke-linecap: round;
          transform: translate(2px, 4px);
        }

        .about-id-rope-main {
          fill: none;
          stroke: #202020;
          stroke-width: 13px;
          stroke-linecap: round;
        }

        .about-id-rope-highlight {
          fill: none;
          stroke: rgba(255,255,255,.08);
          stroke-width: 3px;
          stroke-linecap: round;
        }

        .about-id-clip {
          position: absolute;
          top: 54px;
          left: 50%;
          width: 34px;
          height: 23px;
          transform: translateX(-50%);
          border-radius: 8px;
          background: linear-gradient(145deg, #e2e2e2, #8a8a8a 58%, #414141);
          box-shadow: 0 5px 12px rgba(0,0,0,.32);
          z-index: 5;
          pointer-events: none;
        }

        .about-id-card {
          position: absolute;
          top: 72px;
          left: 50%;
          width: min(84vw, 390px);
          height: 530px;
          transform: translateX(-50%);
          transform-origin: 50% 6px;
          cursor: grab;
          touch-action: none;
          user-select: none;
          will-change: transform;
          z-index: 3;
        }

        .about-id-card:active {
          cursor: grabbing;
        }

        .about-id-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform .58s cubic-bezier(.2,.72,.2,1);
        }

        .about-id-card.is-flipped .about-id-card-inner {
          transform: rotateY(180deg);
        }

        .about-id-face {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 26px;
          backface-visibility: hidden;
          background: linear-gradient(160deg, var(--id-card-bg), var(--id-card-bg-2));
          color: var(--id-card-ink);
          border: 1px solid rgba(255,255,255,.55);
          box-shadow:
            0 32px 72px -26px rgba(0,0,0,.72),
            0 14px 28px -14px rgba(0,0,0,.5),
            inset 0 1px rgba(255,255,255,.9);
        }

        .about-id-back {
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 30px;
          text-align: center;
        }

        .about-id-hole {
          position: absolute;
          top: 13px;
          left: 50%;
          width: 44px;
          height: 10px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #232323;
          opacity: .9;
          z-index: 4;
        }

        .about-id-photo {
          width: 100%;
          height: 53%;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 30%, #fff 0%, #ecece8 58%, #d9d9d4 100%);
          border-bottom: 1px solid rgba(0,0,0,.09);
        }

        .about-id-photo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: 50% 18%;
          filter: grayscale(1) contrast(1.03);
          transform: scale(1.09);
        }

        .about-id-front-body {
          height: 47%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 26px 22px;
          text-align: center;
        }

        .about-id-name {
          margin: 0;
          font-family: "Manrope", sans-serif;
          font-size: 1.9rem;
          line-height: 1.03;
          font-weight: 650;
          letter-spacing: -.05em;
        }

        .about-id-role {
          margin: 10px 0 0;
          font-size: .78rem;
          font-weight: 650;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: var(--id-card-muted);
        }

        .about-id-tap {
          margin-top: 24px;
          font-size: .62rem;
          letter-spacing: .15em;
          text-transform: uppercase;
          color: #9c9c9c;
        }

        .about-id-back-mark {
          width: 52px;
          height: 7px;
          margin-bottom: 34px;
          border-radius: 999px;
          background: #222;
        }

        .about-id-back-name {
          margin: 0;
          max-width: 260px;
          font-family: "Manrope", sans-serif;
          font-size: 2.2rem;
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 650;
        }

        .about-id-back-role {
          margin: 14px 0 38px;
          color: var(--id-card-muted);
          font-size: .76rem;
          font-weight: 650;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .about-id-socials {
          display: flex;
          gap: 14px;
        }

        .about-id-socials a {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(17,17,17,.18);
          color: #333;
          background: rgba(255,255,255,.28);
          font-size: 1.12rem;
          transition:
            transform .2s ease,
            color .2s ease,
            background .2s ease,
            border-color .2s ease;
        }

        .about-id-socials a:hover {
          transform: translateY(-3px);
          background: #111;
          color: #fff;
          border-color: #111;
        }

        html[data-theme="accent"] .about-id-socials a:hover {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
        }

        .about-id-back-note {
          margin: 32px 0 0;
          font-size: .62rem;
          line-height: 1.6;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #969696;
        }

        @media (max-width: 1100px) {
          .about-id-lanyard {
            height: 600px;
          }

          .about-id-card {
            width: min(82vw, 350px);
            height: 485px;
          }
        }

        @media (max-width: 600px) {
          .about-id-lanyard {
            height: 545px;
          }

          .about-id-card {
            top: 68px;
            width: min(86vw, 310px);
            height: 430px;
          }

          .about-id-photo {
            height: 52%;
          }

          .about-id-front-body {
            height: 48%;
          }

          .about-id-name {
            font-size: 1.55rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-id-card-inner,
          .about-id-socials a {
            transition: none;
          }
        }
      `}</style>

      <div className="about-id-rail" aria-hidden="true" />

      <svg className="about-id-rope-svg" aria-hidden="true">
        <path className="about-id-rope-layer about-id-rope-shadow" />
        <path ref={ropePathRef} className="about-id-rope-layer about-id-rope-main" />
        <path className="about-id-rope-layer about-id-rope-highlight" />
      </svg>

      <div className="about-id-clip" aria-hidden="true" />

      <div
        ref={cardRef}
        className={`about-id-card ${flipped ? "is-flipped" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        role="button"
        tabIndex={0}
        aria-label="Anna Patricia Vida profile card. Drag to swing or click to flip."
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setFlipped((current) => !current);
          }
        }}
      >
        <div className="about-id-card-inner">
          <div className="about-id-face about-id-front">
            <div className="about-id-hole" />

            <div className="about-id-photo">
              <img src={photoSrc} alt={name} />
            </div>

            <div className="about-id-front-body">
              <h3 className="about-id-name">{name}</h3>
              <p className="about-id-role">{role}</p>
              <p className="about-id-tap">Drag to swing · click to flip</p>
            </div>
          </div>

          <div className="about-id-face about-id-back">
            <div className="about-id-hole" />
            <div className="about-id-back-mark" />

            <h3 className="about-id-back-name">{name}</h3>
            <p className="about-id-back-role">{role}</p>

            <div className="about-id-socials" aria-label="Social links">
              {facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                >
                  <FaFacebookF />
                </a>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <FaInstagram />
                </a>
              )}
            </div>

            <p className="about-id-back-note">
              Drag to swing · click to return
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
