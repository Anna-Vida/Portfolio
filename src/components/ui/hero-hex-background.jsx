import { useEffect, useRef } from "react";

const HeroHexBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const hero = canvas.parentElement;
    const ctx = canvas.getContext("2d");

    if (!hero || !ctx) return;

    let animationFrameId;
    let resizeObserver;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const radius = 44;
    const hexWidth = Math.sqrt(3) * radius;
    const rowHeight = radius * 1.5;
    const hexagons = [];

    const createHexagons = () => {
      hexagons.length = 0;

      const columns = Math.ceil(width / hexWidth) + 4;
      const rows = Math.ceil(height / rowHeight) + 4;

      for (let row = -2; row < rows; row += 1) {
        for (let column = -2; column < columns; column += 1) {
          const baseX =
            column * hexWidth +
            (row % 2 !== 0 ? hexWidth / 2 : 0);

          const baseY = row * rowHeight;

          hexagons.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            velocityX: 0,
            velocityY: 0,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const resizeCanvas = () => {
      const rect = hero.getBoundingClientRect();

      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      createHexagons();
    };

    const drawHexagon = (x, y, size, opacity) => {
      ctx.beginPath();

      for (let side = 0; side < 6; side += 1) {
        const angle = side * (Math.PI / 3) + Math.PI / 6;
        const pointX = x + Math.cos(angle) * size;
        const pointY = y + Math.sin(angle) * size;

        if (side === 0) {
          ctx.moveTo(pointX, pointY);
        } else {
          ctx.lineTo(pointX, pointY);
        }
      }

      ctx.closePath();
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.stroke();
    };

    const handlePointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();

      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      for (const hexagon of hexagons) {
        let targetX = hexagon.baseX;
        let targetY = hexagon.baseY;
        let interactionStrength = 0;

        if (pointer.active && !reduceMotion) {
          const dx = hexagon.baseX - pointer.x;
          const dy = hexagon.baseY - pointer.y;
          const distance = Math.hypot(dx, dy);
          const interactionRadius = 185;

          if (distance < interactionRadius && distance > 0.01) {
            interactionStrength = 1 - distance / interactionRadius;

            const pushDistance = interactionStrength * 27;

            targetX += (dx / distance) * pushDistance;
            targetY += (dy / distance) * pushDistance;
          }
        }

        if (!reduceMotion) {
          targetY +=
            Math.sin(time * 0.0005 + hexagon.phase) * 1.4;
        }

        hexagon.velocityX += (targetX - hexagon.x) * 0.07;
        hexagon.velocityY += (targetY - hexagon.y) * 0.07;

        hexagon.velocityX *= 0.82;
        hexagon.velocityY *= 0.82;

        hexagon.x += hexagon.velocityX;
        hexagon.y += hexagon.velocityY;

        const opacity = 0.045 + interactionStrength * 0.18;

        drawHexagon(
          hexagon.x,
          hexagon.y,
          radius - 2,
          opacity
        );
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(resizeCanvas);
      resizeObserver.observe(hero);
    }

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      resizeObserver?.disconnect();

      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);

      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-hex-background"
      aria-hidden="true"
    />
  );
};

export default HeroHexBackground;
