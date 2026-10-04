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
  const [typingActive, setTypingActive] = useState(false);
  const [typingProgress, setTypingProgress] = useState(0);

  const containerRef = useRef(null);
  const introRef = useRef(null);
  const browserRef = useRef(null);
  const activeTabRef = useRef(0);
  const openedTabsRef = useRef(1);
  const browserVisibleRef = useRef(false);

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

        if (browserVisibleRef.current) {
          browserVisibleRef.current = false;
          setTypingActive(false);
        }

        return;
      }

      if (!browserVisibleRef.current) {
        browserVisibleRef.current = true;
        setTypingActive(true);
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
  const activeRepo = repoSlug(activeProject);

  const typingPlan = useMemo(() => {
    const repoPause = 7;
    const titlePause = 10;
    const descriptionPause = 10;

    const titleStart = activeRepo.length + repoPause;
    const descriptionStart = titleStart + activeProject.title.length + titlePause;
    const tagsStart =
      descriptionStart + activeProject.description.length + descriptionPause;
    const total = tagsStart + activeProject.tags.length * 4;

    return {
      titleStart,
      descriptionStart,
      tagsStart,
      total,
    };
  }, [activeProject, activeRepo]);

  useEffect(() => {
    if (!typingActive) {
      setTypingProgress(0);
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      setTypingProgress(typingPlan.total);
      return undefined;
    }

    setTypingProgress(0);
    return undefined;
  }, [activeTab, typingActive, typingPlan.total]);

  useEffect(() => {
    if (!typingActive || typingProgress >= typingPlan.total) {
      return undefined;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) return undefined;

    const timer = window.setTimeout(() => {
      setTypingProgress((current) =>
        Math.min(current + 1, typingPlan.total),
      );
    }, 12);

    return () => window.clearTimeout(timer);
  }, [typingActive, typingProgress, typingPlan.total]);

  const repoProgress = Math.min(typingProgress, activeRepo.length);
  const titleProgress = Math.min(
    Math.max(typingProgress - typingPlan.titleStart, 0),
    activeProject.title.length,
  );
  const descriptionProgress = Math.min(
    Math.max(typingProgress - typingPlan.descriptionStart, 0),
    activeProject.description.length,
  );
  const visibleTagCount = Math.min(
    activeProject.tags.length,
    Math.floor(
      Math.max(typingProgress - typingPlan.tagsStart, 0) / 4,
    ),
  );

  const typedRepo = activeRepo.slice(0, repoProgress);
  const typedTitle = activeProject.title.slice(0, titleProgress);
  const typedDescription = activeProject.description.slice(
    0,
    descriptionProgress,
  );
  const typingComplete = typingProgress >= typingPlan.total;
  const typingRepo = typingActive && repoProgress < activeRepo.length;
  const typingTitle =
    typingActive &&
    repoProgress >= activeRepo.length &&
    titleProgress < activeProject.title.length;
  const typingDescription =
    typingActive &&
    titleProgress >= activeProject.title.length &&
    descriptionProgress < activeProject.description.length;

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
              <span
                className="work-browser-type-inline"
                aria-label={activeRepo}
              >
                <span className="work-browser-type-ghost" aria-hidden="true">
                  {activeRepo}
                </span>
                <span className="work-browser-type-live" aria-hidden="true">
                  {typingActive ? typedRepo : activeRepo}
                  {typingRepo && <span className="work-browser-typing-caret" />}
                </span>
              </span>
            </div>
          </div>

          <div className="work-browser-repo">
            <div className="work-browser-repo-head">
              <div className="work-browser-repo-name">
                <span className="is-muted">Anna-Vida</span>
                <span className="is-muted">/</span>
                <strong
                  className="work-browser-type-inline"
                  aria-label={activeRepo}
                >
                  <span className="work-browser-type-ghost" aria-hidden="true">
                    {activeRepo}
                  </span>
                  <span className="work-browser-type-live" aria-hidden="true">
                    {typingActive ? typedRepo : activeRepo}
                  </span>
                </strong>
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
                  <strong
                    className="work-browser-type-block"
                    aria-label={activeProject.title}
                  >
                    <span className="work-browser-type-ghost" aria-hidden="true">
                      {activeProject.title}
                    </span>
                    <span className="work-browser-type-live" aria-hidden="true">
                      {typingActive ? typedTitle : activeProject.title}
                      {typingTitle && <span className="work-browser-typing-caret" />}
                    </span>
                  </strong>
                  <span className="work-browser-media-type">
                    {activeProject.type}
                  </span>
                </div>

                <div className="work-browser-narrative">
                  <span className="work-browser-label">PROJECT OVERVIEW</span>
                  <h3
                    className="work-browser-type-block"
                    aria-label={activeProject.title}
                  >
                    <span className="work-browser-type-ghost" aria-hidden="true">
                      {activeProject.title}
                    </span>
                    <span className="work-browser-type-live" aria-hidden="true">
                      {typingActive ? typedTitle : activeProject.title}
                    </span>
                  </h3>

                  <p
                    className="work-browser-type-block work-browser-type-paragraph"
                    aria-label={activeProject.description}
                  >
                    <span className="work-browser-type-ghost" aria-hidden="true">
                      {activeProject.description}
                    </span>
                    <span className="work-browser-type-live" aria-hidden="true">
                      {typingActive
                        ? typedDescription
                        : activeProject.description}
                      {typingDescription && (
                        <span className="work-browser-typing-caret" />
                      )}
                    </span>
                  </p>

                  <div
                    className={`work-browser-tech ${
                      typingComplete ? "is-typing-complete" : ""
                    }`}
                  >
                    {activeProject.tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={
                          !typingActive || index < visibleTagCount
                            ? "is-typed"
                            : "is-pending"
                        }
                      >
                        {tag}
                      </span>
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
