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

  const containerRef = useRef(null);
  const introRef = useRef(null);
  const browserRef = useRef(null);
  const activeTabRef = useRef(0);
  const openedTabsRef = useRef(1);

  useEffect(() => {
    let frameId = null;

    const updateFromScroll = () => {
      frameId = null;

      const section = containerRef.current;
      const intro = introRef.current;
      const browser = browserRef.current;

      if (!section || !intro || !browser) return;

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
        const introOpacity = Math.max(0, 1 - currentStage * 1.45);
        const introY = currentStage * -70;
        const browserY = 105 - currentStage * 105;

        intro.style.opacity = String(introOpacity);
        intro.style.transform = `translate3d(0, ${introY}px, 0)`;
        browser.style.transform = `translate3d(0, ${browserY}vh, 0)`;

        if (activeTabRef.current !== 0) {
          activeTabRef.current = 0;
          setActiveTab(0);
        }

        if (openedTabsRef.current !== 1) {
          openedTabsRef.current = 1;
          setOpenedTabs(1);
        }

        return;
      }

      intro.style.opacity = "0";
      intro.style.transform = "translate3d(0, -70px, 0)";
      browser.style.transform = "translate3d(0, 0, 0)";

      const tabIndex = Math.min(
        featuredProjects.length - 1,
        Math.floor(currentStage - 1 + 0.04),
      );

      if (activeTabRef.current !== tabIndex) {
        activeTabRef.current = tabIndex;
        setActiveTab(tabIndex);
      }

      const nextOpenedTabs = Math.max(openedTabsRef.current, tabIndex + 1);

      if (nextOpenedTabs !== openedTabsRef.current) {
        openedTabsRef.current = nextOpenedTabs;
        setOpenedTabs(nextOpenedTabs);
      }
    };

    const requestUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    requestUpdate();

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
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
          ref={introRef}
          className="work-browser-intro"
          style={{
            opacity: 1,
            transform: "translate3d(0, 0, 0)",
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
          ref={browserRef}
          className="work-browser-window"
          style={{ transform: "translate3d(0, 105vh, 0)" }}
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
