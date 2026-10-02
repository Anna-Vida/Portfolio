import { useEffect, useMemo, useRef, useState } from "react";

function repoSlug(project) {
  try {
    const url = new URL(project.github);
    return url.pathname.split("/").filter(Boolean).at(-1) || project.title;
  } catch {
    return project.title.toLowerCase().replace(/\s+/g, "-");
  }
}

export default function ProjectsBrowser({ projects, onOpenProject }) {
  const featuredProjects = useMemo(() => projects.slice(0, 5), [projects]);
  const totalScrollStages = featuredProjects.length + 1;

  const [activeTab, setActiveTab] = useState(0);
  const [openedTabs, setOpenedTabs] = useState(1);
  const [scrollAnim, setScrollAnim] = useState({
    introOpacity: 1,
    introY: 0,
    browserY: 105,
  });

  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const section = containerRef.current;
      if (!section) return;

      const scrollableDistance = Math.max(
        section.offsetHeight - window.innerHeight,
        1,
      );

      const scrolledDistance = Math.min(
        Math.max(-section.getBoundingClientRect().top, 0),
        scrollableDistance,
      );

      const progress = scrolledDistance / scrollableDistance;
      const currentStage = progress * totalScrollStages;

      if (currentStage <= 1) {
        setScrollAnim({
          introOpacity: Math.max(0, 1 - currentStage * 1.45),
          introY: currentStage * -70,
          browserY: 105 - currentStage * 105,
        });
        setActiveTab(0);
        setOpenedTabs(1);
        return;
      }

      setScrollAnim({
        introOpacity: 0,
        introY: -70,
        browserY: 0,
      });

      const tabIndex = Math.min(
        featuredProjects.length - 1,
        Math.floor(currentStage - 1 + 0.04),
      );

      setActiveTab(tabIndex);
      setOpenedTabs((count) => Math.max(count, tabIndex + 1));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [featuredProjects.length, totalScrollStages]);

  const activeProject = featuredProjects[activeTab];

  const scrollToTab = (index) => {
    const section = containerRef.current;
    if (!section) return;

    const scrollableDistance = Math.max(
      section.offsetHeight - window.innerHeight,
      1,
    );
    const targetStage = index + 1 + 0.12;
    const progress = targetStage / totalScrollStages;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;

    window.scrollTo({
      top: sectionTop + scrollableDistance * progress,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="work"
      ref={containerRef}
      className="work-browser-section"
      style={{ "--work-stages": totalScrollStages }}
    >
      <div className="work-browser-sticky">
        <div
          className="work-browser-intro"
          style={{
            opacity: scrollAnim.introOpacity,
            transform: `translateY(${scrollAnim.introY}px)`,
          }}
        >
          <span className="work-browser-kicker">PROJECTS CREATED</span>

          <div className="work-browser-intro-lines">
            <span>Selected work,</span>
            <span>built across software,</span>
            <span>AI, mobile & connected systems.</span>
          </div>

          <div className="work-browser-scroll-note">
            <span>SCROLL TO EXPLORE</span>
            <span aria-hidden="true">↓</span>
          </div>
        </div>

        <div
          className="work-browser-window"
          style={{ transform: `translateY(${scrollAnim.browserY}vh)` }}
        >
          <div className="work-browser-tabs">
            <div className="work-browser-tab-list">
              {featuredProjects.slice(0, openedTabs).map((project, index) => (
                <button
                  type="button"
                  key={project.number}
                  className={`work-browser-tab ${
                    activeTab === index ? "is-active" : ""
                  }`}
                  onClick={() => scrollToTab(index)}
                >
                  <span className="work-browser-tab-dot" />
                  <span>WORK {project.number}</span>
                  {activeTab === index && (
                    <span className="work-browser-tab-close" aria-hidden="true">
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>

            <a
              href="https://github.com/Anna-Vida?tab=repositories"
              target="_blank"
              rel="noreferrer"
              className="work-browser-all"
            >
              VIEW ALL ↗
            </a>
          </div>

          <div className="work-browser-address">
            <div className="work-browser-nav-icons" aria-hidden="true">
              <span>←</span>
              <span className="is-muted">→</span>
              <span>↻</span>
            </div>

            <div className="work-browser-url">
              <span aria-hidden="true">⌁</span>
              <span className="work-browser-domain">github.com/Anna-Vida/</span>
              <span>{repoSlug(activeProject)}</span>
            </div>
          </div>

          <div className="work-browser-repo">
            <div className="work-browser-repo-head">
              <div className="work-browser-repo-name">
                <span className="is-muted">Anna-Vida</span>
                <span className="is-muted">/</span>
                <strong>{repoSlug(activeProject)}</strong>
                <span className="work-browser-public">Public</span>
              </div>

              <div className="work-browser-repo-actions">
                {activeProject.live && (
                  <a
                    href={activeProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="work-browser-live-link"
                  >
                    Live ↗
                  </a>
                )}

                <a
                  href={activeProject.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
              </div>
            </div>

            <div className="work-browser-readme">
              <div className="work-browser-readme-head">
                <span>☰&nbsp;&nbsp;README.md</span>

                <div className="work-browser-statuses">
                  <span>{activeProject.year}</span>
                  <span>{activeProject.type}</span>
                </div>
              </div>

              <div className="work-browser-readme-body">
                <div className="work-browser-media">
                  <span className="work-browser-media-index">
                    PROJECT {activeProject.number}
                  </span>
                  <strong>{activeProject.title}</strong>
                  <span className="work-browser-media-type">
                    {activeProject.type}
                  </span>
                </div>

                <div className="work-browser-narrative">
                  <span className="work-browser-label">PROJECT OVERVIEW</span>
                  <h3>{activeProject.title}</h3>
                  <p>{activeProject.description}</p>

                  <div className="work-browser-tech">
                    {activeProject.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="work-browser-access">
                  <span className="work-browser-label">PROJECT ACCESS</span>

                  {activeProject.live && (
                    <a
                      href={activeProject.live}
                      target="_blank"
                      rel="noreferrer"
                      className="work-browser-primary"
                    >
                      Open live project ↗
                    </a>
                  )}

                  <button
                    type="button"
                    className="work-browser-secondary"
                    onClick={() => onOpenProject(activeProject)}
                  >
                    View details
                  </button>

                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="work-browser-secondary"
                  >
                    View GitHub ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="work-browser-progress" aria-hidden="true">
            {featuredProjects.map((project, index) => (
              <span
                key={project.number}
                className={activeTab === index ? "is-active" : ""}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
