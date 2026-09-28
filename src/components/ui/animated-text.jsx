import { useEffect, useRef } from "react";

export function AnimatedText({
  text,
  fontSize = 150,
  minWeight = 0,
  maxWeight = 840,
  animationDuration = 1.5,
  delayMultiplier = 0.25,
  className = "",
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const spans = containerRef.current.querySelectorAll(
      ".animated-text__char"
    );
    const numLetters = spans.length;

    spans.forEach((span, index) => {
      const mappedIndex = index - numLetters / 2;
      span.style.animationDelay =
        mappedIndex * delayMultiplier + "s";
    });
  }, [text, delayMultiplier]);

  const resolvedFontSize =
    typeof fontSize === "number" ? `${fontSize}px` : fontSize;

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={`animated-text ${className}`.trim()}
      style={{
        fontSize: resolvedFontSize,
        "--animated-min-weight": minWeight,
        "--animated-max-weight": maxWeight,
        "--animated-duration": `${animationDuration}s`,
      }}
    >
      {text.split("").map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="animated-text__char"
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}
