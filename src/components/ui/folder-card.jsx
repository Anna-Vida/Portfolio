import { FaFolderOpen } from "react-icons/fa";

export default function FolderCard({
  number,
  title,
  count,
  open = false,
}) {
  return (
    <span className="skill-folder-shell" aria-hidden="true">
      <span className="skill-folder-tab" />
      <span className="skill-folder-surface">
        <span className="skill-folder-top">
          <span className="skill-folder-number">{number}</span>
          <FaFolderOpen className="skill-folder-icon" />
        </span>

        <span className="skill-folder-copy">
          <span className="skill-folder-title">{title}</span>
          <span className="skill-folder-count">{count}</span>
        </span>

        <span className="skill-folder-action">
          {open ? "Folder open" : "Open folder"} ↗
        </span>
      </span>
    </span>
  );
}
