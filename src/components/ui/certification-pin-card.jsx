import { useRef } from "react";

export default function CertificationPinCard({
  company,
  title,
  date,
  href,
  index,
}) {
  const cardRef = useRef(null);

  const handlePointerMove = (event) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const node = cardRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    node.style.setProperty("--pin-rx", `${py * -8}deg`);
    node.style.setProperty("--pin-ry", `${px * 10}deg`);
    node.style.setProperty("--pin-glow-x", `${(px + 0.5) * 100}%`);
    node.style.setProperty("--pin-glow-y", `${(py + 0.5) * 100}%`);
  };

  const resetPointer = () => {
    const node = cardRef.current;
    if (!node) return;

    node.style.setProperty("--pin-rx", "0deg");
    node.style.setProperty("--pin-ry", "0deg");
    node.style.setProperty("--pin-glow-x", "50%");
    node.style.setProperty("--pin-glow-y", "50%");
  };

  const content = (
    <>
      <div className="cert-pin-tooltip" aria-hidden="true">
        <span>{href ? "VIEW CERTIFICATE" : "CERTIFICATION"}</span>
      </div>

      <div className="cert-pin-line" aria-hidden="true">
        <span className="cert-pin-point" />
      </div>

      <div className="cert-pin-ripples" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="cert-pin-card">
        <div className="cert-pin-glare" aria-hidden="true" />

        <div className="cert-pin-copy">
          <p className="cert-pin-company">{company}</p>
          <h3>{title}</h3>
          <p className="cert-pin-date">{date}</p>
        </div>

        <div className="cert-pin-art" aria-hidden="true">
          <span className="cert-pin-art-ring cert-pin-art-ring-one" />
          <span className="cert-pin-art-ring cert-pin-art-ring-two" />
          <span className="cert-pin-art-index">
            {String(index).padStart(2, "0")}
          </span>
        </div>

        <div className="cert-pin-footer">
          <span>{href ? "OPEN CERTIFICATE" : "COMPLETED"}</span>
          <span>{href ? "↗" : "—"}</span>
        </div>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        ref={cardRef}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="cert-pin"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      ref={cardRef}
      className="cert-pin cert-pin-static"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      {content}
    </div>
  );
}
