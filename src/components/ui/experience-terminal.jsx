import { useEffect, useMemo, useRef, useState } from "react";

const TERMINAL_LINES = [
  { kind: "prompt", text: "PS C:\\Users\\Anna\\Portfolio> Get-Experience -Latest" },
  { kind: "system", text: "Loading professional experience..." },
  { kind: "blank", text: "" },
  { kind: "label", text: "[ EXPERIENCE 01 ]  JAN 2026 — APR 2026" },
  { kind: "title", text: "Ateneo Innovation Center" },
  { kind: "value", text: "Role: Software Developer Intern" },
  { kind: "blank", text: "" },
  {
    kind: "output",
    text: "Built practical software across healthcare, AgTech, computer vision, embedded systems, and real-time data workflows.",
  },
  {
    kind: "output",
    text: "01  Developed offline-first mobile applications with OCR, local caching, cloud synchronization, and responsive workflows.",
  },
  {
    kind: "output",
    text: "02  Built computer-vision interfaces and dashboards integrating Meta Ray-Ban AI Glasses for obstacle and debris detection.",
  },
  {
    kind: "output",
    text: "03  Worked with machine-learning pipelines, microcontrollers, cloud backends, and live environmental weather-station data.",
  },
  { kind: "blank", text: "" },
  {
    kind: "meta",
    text: "TECH: Mobile · OCR · Computer Vision · AI / ML · IoT · Cloud",
  },
  { kind: "blank", text: "" },
  { kind: "prompt", text: "PS C:\\Users\\Anna\\Portfolio> Get-Education -Latest" },
  { kind: "system", text: "Loading education record..." },
  { kind: "blank", text: "" },
  { kind: "label", text: "[ EDUCATION 02 ]  JUNE 2026" },
  { kind: "title", text: "Technological Institute of the Philippines" },
  { kind: "value", text: "Bachelor of Science in Information Technology" },
  {
    kind: "output",
    text: "Completed a BSIT degree with hands-on work in software development, mobile engineering, databases, artificial intelligence, IoT, and systems development.",
  },
  { kind: "meta", text: "FOCUS: Software · Mobile · Databases · AI · IoT" },
  { kind: "meta", text: "LOCATION: Quezon City" },
  { kind: "blank", text: "" },
  { kind: "success", text: "✓ Experience profile loaded successfully." },
];

function ExperienceTerminalLine({ line, text, active }) {
  return (
    <div className={`experience-terminal-line experience-terminal-line--${line.kind}`}>
      <span>{text}</span>
      {active && <span className="experience-terminal-caret" aria-hidden="true" />}
    </div>
  );
}

export default function ExperienceTerminal() {
  const rootRef = useRef(null);
  const outputRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const reduceMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.22) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: [0.12, 0.22, 0.38],
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return undefined;

    if (reduceMotion) {
      setLineIndex(TERMINAL_LINES.length);
      setCompleted(true);
      return undefined;
    }

    if (lineIndex >= TERMINAL_LINES.length) {
      setCompleted(true);
      return undefined;
    }

    const line = TERMINAL_LINES[lineIndex];

    if (line.text.length === 0) {
      const timer = window.setTimeout(() => {
        setLineIndex((current) => current + 1);
        setCharIndex(0);
      }, 70);

      return () => window.clearTimeout(timer);
    }

    if (charIndex < line.text.length) {
      const speed =
        line.kind === "prompt"
          ? 18
          : line.kind === "title"
            ? 22
            : line.kind === "output"
              ? 9
              : 12;

      const timer = window.setTimeout(() => {
        setCharIndex((current) => current + 1);
      }, speed);

      return () => window.clearTimeout(timer);
    }

    const lineDelay =
      line.kind === "prompt" ? 260 : line.kind === "success" ? 0 : 105;

    const timer = window.setTimeout(() => {
      setLineIndex((current) => current + 1);
      setCharIndex(0);
    }, lineDelay);

    return () => window.clearTimeout(timer);
  }, [started, reduceMotion, lineIndex, charIndex]);

  useEffect(() => {
    if (!started || !outputRef.current) return;

    const frame = window.requestAnimationFrame(() => {
      outputRef.current?.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: "auto",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [started, lineIndex, charIndex]);

  const visibleLines =
    reduceMotion && started
      ? TERMINAL_LINES
      : TERMINAL_LINES.slice(
          0,
          Math.min(lineIndex + 1, TERMINAL_LINES.length),
        );

  return (
    <div
      ref={rootRef}
      className={`experience-terminal-shell ${started ? "is-running" : ""} ${
        completed ? "is-complete" : ""
      }`}
    >
      <div className="experience-terminal-titlebar">
        <div className="experience-terminal-tabs" aria-hidden="true">
          <button
            type="button"
            className="experience-terminal-tab is-active"
            tabIndex={-1}
          >
            <span className="experience-terminal-tab-icon">&gt;_</span>
            <span>PowerShell</span>
            <span className="experience-terminal-tab-close">×</span>
          </button>
          <span className="experience-terminal-new-tab">+</span>
          <span className="experience-terminal-chevron">⌄</span>
        </div>

        <div className="experience-terminal-window-actions" aria-hidden="true">
          <span>—</span>
          <span>□</span>
          <span className="experience-terminal-window-close">×</span>
        </div>
      </div>

      <div className="experience-terminal-toolbar">
        <span>Windows PowerShell</span>
        <span className="experience-terminal-status">
          <i />
          {completed ? "COMPLETE" : started ? "RUNNING" : "WAITING"}
        </span>
      </div>

      <div
        ref={outputRef}
        className="experience-terminal-output"
        aria-live="polite"
        aria-label="Experience terminal output"
      >
        {!started && (
          <div className="experience-terminal-await">
            <span className="experience-terminal-await-icon">&gt;_</span>
            <p>Scroll into this section to initialize experience.exe</p>
          </div>
        )}

        {started &&
          visibleLines.map((line, index) => {
            const isCurrent =
              !reduceMotion &&
              index === lineIndex &&
              lineIndex < TERMINAL_LINES.length;
            const text = isCurrent ? line.text.slice(0, charIndex) : line.text;

            return (
              <ExperienceTerminalLine
                key={`${index}-${line.kind}`}
                line={line}
                text={text}
                active={isCurrent}
              />
            );
          })}
      </div>

      <div className="experience-terminal-footer">
        <span>PowerShell</span>
        <span>UTF-8</span>
        <span>{completed ? "Ready" : started ? "Typing…" : "Standby"}</span>
      </div>
    </div>
  );
}
