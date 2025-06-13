import { useState, useEffect } from "react";

interface UseShowcaseScrollProps {
  projectCount: number;
  containerSelector?: string;
}

export function useShowcaseScroll({
  projectCount,
  containerSelector = ".showcase__fullscreen",
}: UseShowcaseScrollProps) {
  const [currentProject, setCurrentProject] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(containerSelector);
      if (!container) return;

      const projectSections = container.querySelectorAll(".project-section");
      let newCurrentProject = 0;

      projectSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();

        // If section is in viewport center, it's active
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom > window.innerHeight / 2
        ) {
          newCurrentProject = index;
        }
      });

      if (newCurrentProject !== currentProject) {
        setCurrentProject(newCurrentProject);
      }
    };

    const container = document.querySelector(containerSelector);
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [currentProject, projectCount, containerSelector]);

  const scrollToProject = (index: number) => {
    const container = document.querySelector(containerSelector);
    if (container) {
      const projectSections = container.querySelectorAll(".project-section");
      const targetSection = projectSections[index] as HTMLElement;

      if (targetSection) {
        const scrollTop =
          container.scrollTop + targetSection.getBoundingClientRect().top;
        container.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }
  };

  return { currentProject, scrollToProject };
}
