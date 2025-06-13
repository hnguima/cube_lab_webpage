interface TechStackProps {
  readonly technologies: string[];
  readonly maxVisible?: number;
  readonly variant?: "pills" | "tags" | "badges";
  readonly showCount?: boolean;
  readonly className?: string;
}

export default function TechStack({
  technologies,
  maxVisible = 4,
  variant = "pills",
  showCount = true,
  className = "",
}: TechStackProps) {
  const safeArray = Array.isArray(technologies) ? technologies : [];
  const visibleTech = safeArray.slice(0, maxVisible);
  const remainingCount = safeArray.length - maxVisible;

  const getItemClass = () => {
    switch (variant) {
      case "tags":
        return "tech-tag";
      case "badges":
        return "tech-badge";
      default:
        return "tech-pill";
    }
  };

  const containerClass =
    variant === "pills" ? "title__tech-stack" : "details__tech-stack";

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      {visibleTech.map((tech) => (
        <span key={tech} className={getItemClass()}>
          {tech}
        </span>
      ))}
      {showCount && remainingCount > 0 && (
        <span
          className={`${getItemClass()} ${
            variant === "pills" ? "tech-pill--more" : ""
          }`}
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  );
}
