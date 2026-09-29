import { useEffect, useRef } from "react";

export function ParticleTextEffect({
  text,
  colors = ["#f2f2f2", "#d8d8d8", "#8d8d8d", "#5d5d5d"],
  className = "",
  animationForce = 34,
  particleDensity = 4,
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const wrapper = canvas.parentElement;
    const ctx = canvas.getContext("2d");
    if (!wrapper || !ctx) return;

    let frameId;
    let resizeObserver;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const hexToRgb = (hex) => {
      const clean = hex.replace("#", "");
      const value = Number.parseInt(clean, 16);
      return [
        (value >> 16) & 255,
        (value >> 8) & 255,
        value & 255,
      ];
    };

    const palette = colors.map(hexToRgb);

    const colorAt = (ratio) => {
      const scaled = ratio * (palette.length - 1);
      const index = Math.min(Math.floor(scaled), palette.length - 2);
      const local = scaled - index;
      const a = palette[index];
      const b = palette[index + 1];

      return [
        Math.round(a[0] + (b[0] - a[0]) * local),
        Math.round(a[1] + (b[1] - a[1]) * local),
        Math.round(a[2] + (b[2] - a[2]) * local),
      ];
    };

    const buildParticles = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.round(width * dpr));
      offscreen.height = Math.max(1, Math.round(height * dpr));

      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.scale(dpr, dpr);
      offCtx.clearRect(0, 0, width, height);

      const fontSize = Math.min(72, Math.max(31, width * 0.075));
      const lineHeight = fontSize * 0.98;
      const lines = text.split("\n");
      const top = Math.max(0, (height - lineHeight * lines.length) / 2);

      offCtx.textAlign = "left";
      offCtx.textBaseline = "top";
      offCtx.font = `500 ${fontSize}px Manrope, sans-serif`;

      lines.forEach((line, lineIndex) => {
        const y = top + lineIndex * lineHeight;
        const metrics = offCtx.measureText(line);
        const lineWidth = Math.max(metrics.width, 1);
        const gradient = offCtx.createLinearGradient(0, y, lineWidth, y);

        colors.forEach((color, index) => {
          gradient.addColorStop(
            colors.length === 1 ? 0 : index / (colors.length - 1),
            color
          );
        });

        offCtx.fillStyle = gradient;
        offCtx.fillText(line, 0, y);
      });

      const data = offCtx.getImageData(
        0,
        0,
        offscreen.width,
        offscreen.height
      );

      const particles = [];
      const step = Math.max(3, particleDensity);

      for (let y = 0; y < offscreen.height; y += step * dpr) {
        for (let x = 0; x < offscreen.width; x += step * dpr) {
          const px = Math.floor(x);
          const py = Math.floor(y);
          const index = (py * offscreen.width + px) * 4;

          if (data.data[index + 3] > 80) {
            const cssX = x / dpr;
            const cssY = y / dpr;
            const ratio = width > 0 ? Math.min(1, cssX / width) : 0;
            const rgb = colorAt(ratio);

            particles.push({
              ox: cssX,
              oy: cssY,
              x: cssX,
              y: cssY,
              vx: 0,
              vy: 0,
              r: Math.max(0.75, step * 0.22),
              rgb,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles();
    };

    const movePointer = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = event.clientX - rect.left;
      pointerRef.current.y = event.clientY - rect.top;
      pointerRef.current.active = true;
    };

    const clearPointer = () => {
      pointerRef.current.active = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      for (const particle of particlesRef.current) {
        if (pointerRef.current.active && !reduceMotion) {
          const dx = particle.x - pointerRef.current.x;
          const dy = particle.y - pointerRef.current.y;
          const distance = Math.hypot(dx, dy);
          const radius = 105;

          if (distance < radius && distance > 0.01) {
            const strength = (1 - distance / radius) * animationForce;
            particle.vx += (dx / distance) * strength * 0.055;
            particle.vy += (dy / distance) * strength * 0.055;
          }
        }

        particle.vx += (particle.ox - particle.x) * 0.045;
        particle.vy += (particle.oy - particle.y) * 0.045;
        particle.vx *= 0.84;
        particle.vy *= 0.84;

        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.beginPath();
        ctx.fillStyle = `rgb(${particle.rgb.join(",")})`;
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(animate);
    };

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);

    canvas.addEventListener("pointermove", movePointer);
    canvas.addEventListener("pointerenter", movePointer);
    canvas.addEventListener("pointerleave", clearPointer);

    resize();
    frameId = requestAnimationFrame(animate);

    return () => {
      resizeObserver?.disconnect();
      canvas.removeEventListener("pointermove", movePointer);
      canvas.removeEventListener("pointerenter", movePointer);
      canvas.removeEventListener("pointerleave", clearPointer);
      cancelAnimationFrame(frameId);
    };
  }, [text, colors, animationForce, particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`interactive-text-particle ${className}`}
      aria-hidden="true"
    />
  );
}
