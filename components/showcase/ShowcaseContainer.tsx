import ProjectSection from "./ProjectSection";
import { Project } from "../../types/project";

interface ShowcaseContainerProps {
  projects: Project[];
  currentProject: number;
  // onScroll?: (scrollY: number) => void;
}

export default function ShowcaseContainer({
  projects,
  currentProject,
}: // onScroll,
Readonly<ShowcaseContainerProps>) {
  return (
    <div className="showcase__fullscreen">
      {projects.map((project, index) => (
        <ProjectSection
          key={project.id}
          project={project}
          isActive={index === currentProject}
        />
      ))}
    </div>
  );
}
