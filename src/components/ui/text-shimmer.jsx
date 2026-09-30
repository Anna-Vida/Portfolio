import { useEffect, useRef } from "react";

export default function TextShimmer({
  text,
  className = "",
  baseColor = "#666666",
  shimmerColor = "#f2f2f2",
  duration = 3.2,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        node.dataset.shimmerPaused = entry.isIntersecting ? "false" : "true";
      },
      { threshold: 0.01 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`portfolio-text-shimmer ${className}`}
      data-shimmer-paused="false"
      style={{
        "--shimmer-base": baseColor,
        "--shimmer-highlight": shimmerColor,
        "--shimmer-duration": `${duration}s`,
      }}
    >
      {text}
    </span>
  );
}
