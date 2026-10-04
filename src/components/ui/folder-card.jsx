export default function FolderCard({
  number,
  title,
  count,
  open = false,
}) {
  const technologyCount = String(count).match(/\d+/)?.[0] || count;

  return (
    <span
      className={`skill-folder-shell ${open ? "is-open" : ""}`}
      aria-hidden="true"
    >
      <span className="skill-folder-surface">
        <span className="skill-folder-copy">
          <span className="skill-folder-title">{title}</span>
          <span className="skill-folder-subtitle">Technology stack</span>
        </span>

        <span className="skill-folder-footer">
          <span className="skill-folder-count">
            <strong>{technologyCount}</strong>
            <span>Technologies</span>
          </span>

          <span className="skill-folder-number">{number}</span>
        </span>

        <span className="skill-folder-action">
          {open ? "Close stack ↓" : "Open stack ↑"}
        </span>
      </span>
    </span>
  );
}
