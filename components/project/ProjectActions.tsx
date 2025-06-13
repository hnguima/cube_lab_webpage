import Link from "next/link";

interface ProjectActionsProps {
  readonly githubUrl?: string;
  readonly demoUrl?: string;
  readonly projectSlug: string;
  readonly variant?: "horizontal" | "vertical";
  readonly actionType?: "title" | "details";
}

export default function ProjectActions({
  githubUrl,
  demoUrl,
  projectSlug,
  variant = "horizontal",
  actionType = "title",
}: ProjectActionsProps) {
  const containerClass =
    actionType === "title" ? "title__actions" : "details__actions";
  const buttonClass = actionType === "title" ? "btn" : "action-btn";

  const getButtonSizeClass = (type: string) => {
    if (actionType === "title") {
      return `${buttonClass} ${buttonClass}--${type}`;
    }
    return `${buttonClass} ${buttonClass}--${type}`;
  };

  return (
    <div
      className={`${containerClass} ${
        variant === "vertical" ? "vertical" : ""
      }`}
    >
      {githubUrl && (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={getButtonSizeClass(
            actionType === "title" ? "primary" : "github"
          )}
        >
          {actionType === "title" ? "View Code" : <span>View Source Code</span>}
        </a>
      )}
      {demoUrl && (
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={getButtonSizeClass(
            actionType === "title" ? "secondary" : "demo"
          )}
        >
          {actionType === "title" ? "Live Demo" : <span>Live Demo</span>}
        </a>
      )}
      <Link
        href={`/projects/${projectSlug}`}
        className={getButtonSizeClass(
          actionType === "title" ? "outline" : "details"
        )}
      >
        {actionType === "title" ? (
          "Learn More"
        ) : (
          <span>Full Project Details</span>
        )}
      </Link>
    </div>
  );
}
