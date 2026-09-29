import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function IDCardLanyard({
  photoSrc,
  name = "Anna Patricia Vida",
  role = "Software Programmer",
  facebookUrl,
  instagramUrl,
}) {
  const cardRef = useRef(null);
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
    if (!card) return;

    const motion = motionRef.current;

    const animate = () => {
      // Deliberately soft motion: low spring force + strong damping.
      const spring = 0.035;
      const damping = 0.72;

      motion.vx += (motion.targetX - motion.x) * spring;
      motion.vy += (motion.targetY - motion.y) * spring;

      motion.vx *= damping;
      motion.vy *= damping;

      motion.x += motion.vx;
      motion.y += motion.vy;

      const rotateZ = motion.x * 0.035;
      const rotateY = flipped ? 180 : 0;

      card.style.transform =
        `translateX(-50%) translate3d(${motion.x}px, ${motion.y}px, 0) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg)`;

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [flipped]);

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

    // Keep the badge close to center. It can move, but never fly around.
    motionRef.current.targetX = Math.max(-18, Math.min(18, dx * 0.16));
    motionRef.current.targetY = Math.max(-8, Math.min(10, dy * 0.08));
  };

  const finishPointer = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;

    drag.active = false;

    // Always spring gently back to the center.
    motionRef.current.targetX = 0;
    motionRef.current.targetY = 0;

    if (drag.moved < 8 && !event.target.closest("a")) {
      setFlipped((current) => !current);
    }

    if (
      cardRef.current?.hasPointerCapture?.(event.pointerId)
    ) {
      cardRef.current.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <div className="about-id-lanyard">
      <style>{`
        .about-id-lanyard {
          --id-card-bg: #f2f2ef;
          --id-card-bg-2: #e8e8e4;
          --id-card-ink: #111;
          --id-card-muted: #707070;
          position: relative;
          width: min(100%, 420px);
          height: 565px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          overflow: visible;
          perspective: 1300px;
        }

        .about-id-anchor {
          position: absolute;
          top: 0;
          left: 50%;
          width: 56px;
          height: 7px;
          transform: translateX(-50%);
          border-radius: 0 0 5px 5px;
          background: linear-gradient(180deg, #383838, #151515);
          box-shadow: 0 3px 9px rgba(0,0,0,.35);
        }

        .about-id-rope {
          position: absolute;
          top: 6px;
          left: 50%;
          width: 12px;
          height: 44px;
          transform: translateX(-50%);
          border-radius: 999px;
          background:
            linear-gradient(90deg,
              #121212 0%,
              #353535 36%,
              #0e0e0e 58%,
              #262626 100%);
          box-shadow:
            inset 1px 0 rgba(255,255,255,.08),
            0 6px 12px rgba(0,0,0,.28);
        }

        .about-id-clip {
          position: absolute;
          top: 42px;
          left: 50%;
          width: 30px;
          height: 20px;
          transform: translateX(-50%);
          border-radius: 7px;
          background: linear-gradient(145deg, #d8d8d8, #747474 58%, #3d3d3d);
          box-shadow: 0 4px 10px rgba(0,0,0,.28);
          z-index: 3;
        }

        .about-id-card {
          position: absolute;
          top: 56px;
          left: 50%;
          width: min(78vw, 300px);
          height: 430px;
          margin-left: 0;
          transform-style: preserve-3d;
          transform-origin: 50% 8px;
          cursor: grab;
          touch-action: none;
          user-select: none;
          will-change: transform;
        }

        .about-id-card:active {
          cursor: grabbing;
        }

        .about-id-face {
          position: absolute;
          inset: 0;
          overflow: hidden;
          border-radius: 24px;
          backface-visibility: hidden;
          background:
            linear-gradient(160deg, var(--id-card-bg), var(--id-card-bg-2));
          color: var(--id-card-ink);
          border: 1px solid rgba(255,255,255,.5);
          box-shadow:
            0 28px 55px -24px rgba(0,0,0,.72),
            0 12px 22px -12px rgba(0,0,0,.5),
            inset 0 1px rgba(255,255,255,.85);
        }

        .about-id-back {
          transform: rotateY(180deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 26px;
          text-align: center;
        }

        .about-id-hole {
          position: absolute;
          top: 12px;
          left: 50%;
          width: 42px;
          height: 9px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #242424;
          z-index: 4;
          opacity: .9;
        }

        .about-id-photo {
          height: 51%;
          width: 100%;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 28%, #fff, #dededb 78%);
          border-bottom: 1px solid rgba(0,0,0,.09);
        }

        .about-id-photo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          object-position: center bottom;
          filter: grayscale(1) contrast(1.03);
          transform: scale(1.025);
        }

        .about-id-front-body {
          height: 49%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 22px 22px;
          text-align: center;
        }

        .about-id-name {
          margin: 0;
          font-family: "Manrope", sans-serif;
          font-size: 1.55rem;
          line-height: 1.05;
          font-weight: 650;
          letter-spacing: -.045em;
        }

        .about-id-role {
          margin: 9px 0 0;
          font-size: .72rem;
          font-weight: 650;
          letter-spacing: .17em;
          text-transform: uppercase;
          color: var(--id-card-muted);
        }

        .about-id-tap {
          margin-top: 23px;
          font-size: .62rem;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: #989898;
        }

        .about-id-back-mark {
          width: 46px;
          height: 7px;
          margin-bottom: 30px;
          border-radius: 999px;
          background: #222;
        }

        .about-id-back-name {
          margin: 0;
          max-width: 220px;
          font-family: "Manrope", sans-serif;
          font-size: 2rem;
          line-height: .98;
          letter-spacing: -.055em;
          font-weight: 650;
        }

        .about-id-back-role {
          margin: 12px 0 34px;
          color: var(--id-card-muted);
          font-size: .72rem;
          font-weight: 650;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .about-id-socials {
          display: flex;
          gap: 13px;
        }

        .about-id-socials a {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(17,17,17,.18);
          color: #323232;
          background: rgba(255,255,255,.24);
          font-size: 1.08rem;
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
          margin: 30px 0 0;
          font-size: .62rem;
          line-height: 1.6;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: #969696;
        }

        @media (max-width: 900px) {
          .about-id-lanyard {
            height: 520px;
          }

          .about-id-card {
            width: min(76vw, 280px);
            height: 405px;
            margin-left: 0;
          }
        }

        @media (max-width: 520px) {
          .about-id-lanyard {
            height: 490px;
          }

          .about-id-rope {
            height: 40px;
          }

          .about-id-clip {
            top: 38px;
          }

          .about-id-card {
            top: 52px;
            width: min(78vw, 260px);
            height: 380px;
            margin-left: 0;
          }

          .about-id-name {
            font-size: 1.35rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-id-card,
          .about-id-socials a {
            transition: none;
          }
        }
      `}</style>

      <div className="about-id-anchor" aria-hidden="true" />
      <div className="about-id-rope" aria-hidden="true" />
      <div className="about-id-clip" aria-hidden="true" />

      <div
        ref={cardRef}
        className="about-id-card"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
        role="button"
        tabIndex={0}
        aria-label="Anna Patricia Vida profile card. Click to flip."
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setFlipped((current) => !current);
          }
        }}
      >
        <div className="about-id-face about-id-front">
          <div className="about-id-hole" />
          <div className="about-id-photo">
            <img src={photoSrc} alt={name} />
          </div>

          <div className="about-id-front-body">
            <h3 className="about-id-name">{name}</h3>
            <p className="about-id-role">{role}</p>
            <p className="about-id-tap">Click to flip</p>
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
            Drag gently to move · click to return
          </p>
        </div>
      </div>
    </div>
  );
}
