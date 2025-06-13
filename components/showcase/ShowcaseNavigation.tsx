import Link from "next/link";

interface ShowcaseNavigationProps {
  readonly projectCount: number;
  readonly currentProject: number;
  readonly onProjectSelect?: (index: number) => void;
}

export default function ShowcaseNavigation({
  projectCount,
  currentProject,
  onProjectSelect,
}: ShowcaseNavigationProps) {
  const handleProjectClick = (index: number) => {
    if (onProjectSelect) {
      onProjectSelect(index);
    } else {
      // Default scroll behavior if no custom handler provided
      const container = document.querySelector(".showcase__fullscreen");
      if (container) {
        container.scrollTo({
          top: index * window.innerHeight,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <nav className="showcase-nav__fixed">
      <Link href="/" className="showcase-nav__home">
        ← Portfolio
      </Link>
      <div className="showcase-nav__indicators">
        {Array.from({ length: projectCount }, (_, index) => (
          <button
            key={index}
            className={`showcase-nav__dot ${
              index === currentProject ? "showcase-nav__dot--active" : ""
            }`}
            onClick={() => handleProjectClick(index)}
          />
        ))}
      </div>
    </nav>
  );
}
