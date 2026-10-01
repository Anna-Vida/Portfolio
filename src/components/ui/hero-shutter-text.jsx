import { useEffect, useRef, useState } from "react";

function ShutterLine({ text, tone, runKey, lineIndex }) {
  return (
    <span className={`hero-shutter-line hero-shutter-line-${tone}`}>
      {text.split("").map((char, index) => (
        <span
          className="hero-shutter-char"
          key={`${runKey}-${lineIndex}-${index}`}
          style={{ "--shutter-delay": `${index * 38 + lineIndex * 90}ms` }}
        >
          <span className="hero-shutter-base">
            {char === " " ? "\u00A0" : char}
          </span>

          {char !== " " && (
            <>
              <span
                className="hero-shutter-slice hero-shutter-slice-top"
                aria-hidden="true"
              >
                {char}
              </span>
              <span
                className="hero-shutter-slice hero-shutter-slice-middle"
                aria-hidden="true"
              >
                {char}
              </span>
              <span
                className="hero-shutter-slice hero-shutter-slice-bottom"
                aria-hidden="true"
              >
                {char}
              </span>
            </>
          )}
        </span>
      ))}
    </span>
  );
}

export default function HeroShutterText() {
  const rootRef = useRef(null);
  const [runKey, setRunKey] = useState(0);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    const replay = () => setRunKey((value) => value + 1);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.45;

        if (isVisible && !wasVisibleRef.current) {
          replay();
        }

        wasVisibleRef.current = isVisible;
      },
      {
        threshold: [0, 0.45, 0.7],
      },
    );

    observer.observe(node);

    const handleHashChange = () => {
      if (window.location.hash === "#home" || window.location.hash === "") {
        replay();
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <h1 className="hero-title hero-shutter-title" ref={rootRef}>
      <ShutterLine text="ANNA" tone="primary" runKey={runKey} lineIndex={0} />
      <ShutterLine
        text="PATRICIA VIDA"
        tone="secondary"
        runKey={runKey}
        lineIndex={1}
      />
    </h1>
  );
}
