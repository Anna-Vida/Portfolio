import { useState } from "react";
import {
  FaReact,
  FaNodeJs,
  FaAndroid,
  FaPython,
  FaJava,
  FaDocker,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFirebase,
  SiSupabase,
  SiMysql,
  SiFlutter,
  SiTensorflow,
  SiArduino,
  SiKotlin,
  SiRedux,
  SiVite,
} from "react-icons/si";

const pages = [
  [
    { label: "React.js", icon: FaReact },
    { label: "Node.js", icon: FaNodeJs },
    { label: "TypeScript", icon: SiTypescript },
    { label: "JavaScript", icon: SiJavascript },
    { label: "Tailwind CSS", icon: SiTailwindcss },
    { label: "Firebase", icon: SiFirebase },
  ],
  [
    { label: "Supabase", icon: SiSupabase },
    { label: "MySQL", icon: SiMysql },
    { label: "Flutter", icon: SiFlutter },
    { label: "Android", icon: FaAndroid },
    { label: "TensorFlow", icon: SiTensorflow },
    { label: "Arduino", icon: SiArduino },
  ],
  [
    { label: "Python", icon: FaPython },
    { label: "Java", icon: FaJava },
    { label: "Kotlin", icon: SiKotlin },
    { label: "Docker", icon: FaDocker },
    { label: "Redux Toolkit", icon: SiRedux },
    { label: "Vite", icon: SiVite },
  ],
];

export default function TechStackPager() {
  const [page, setPage] = useState(0);

  const goPrevious = () => {
    setPage((current) => (current === 0 ? pages.length - 1 : current - 1));
  };

  const goNext = () => {
    setPage((current) => (current + 1) % pages.length);
  };

  return (
    <div className="tech-stack-pager">
      <div className="tech-stack-pager-head">
        <span className="tech-stack-pager-label">TECH LIBRARY</span>

        <div className="tech-stack-pager-controls">
          <button
            type="button"
            className="tech-stack-page-arrow"
            onClick={goPrevious}
            aria-label="Previous technology page"
          >
            ←
          </button>

          <span className="tech-stack-page-count">
            {String(page + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
          </span>

          <button
            type="button"
            className="tech-stack-page-arrow"
            onClick={goNext}
            aria-label="Next technology page"
          >
            →
          </button>
        </div>
      </div>

      <div className="tech-stack-page-window">
        <div
          className="tech-stack-page-track"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {pages.map((items, pageIndex) => (
            <div
              className="tech-stack-page"
              key={pageIndex}
              aria-hidden={pageIndex !== page}
            >
              {items.map(({ label, icon: Icon }) => (
                <div className="tech-stack-page-card" key={label}>
                  <Icon />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="tech-stack-page-dots" aria-label="Technology pages">
        {pages.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`tech-stack-page-dot ${index === page ? "is-active" : ""}`}
            onClick={() => setPage(index)}
            aria-label={`Go to technology page ${index + 1}`}
            aria-current={index === page ? "page" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
