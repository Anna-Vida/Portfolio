import { useEffect } from "react";

export default function ScrollRevealController() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets = Array.from(
      document.querySelectorAll("[data-scroll-reveal]")
    );

    if (reduceMotion) {
      targets.forEach((target) => target.classList.add("is-scroll-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.14) {
            entry.target.classList.add("is-scroll-visible");
          } else if (!entry.isIntersecting) {
            entry.target.classList.remove("is-scroll-visible");
          }
        });
      },
      {
        threshold: [0, 0.14, 0.4],
        rootMargin: "0px 0px -6% 0px",
      },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return null;
}
