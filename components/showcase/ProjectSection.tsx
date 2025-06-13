import ProjectTitlePage from "./ProjectTitlePage";
import ProjectDetailsSection from "./ProjectDetailsSection";
import { Project } from "../../types/project";

interface ProjectSectionProps {
  readonly project: Project;
  readonly isActive: boolean;
  readonly features?: string[];
}

export default function ProjectSection({
  project,
  isActive,
  features,
}: Readonly<ProjectSectionProps>) {
  return (
    <section
      className={`project-section ${isActive ? "project-section--active" : ""}`}
    >
      <div className="project-section__content">
        <div className="project-section__hero">
          <ProjectTitlePage project={project} />
        </div>
        <div className="project-section__info">
          <ProjectDetailsSection project={project} features={features} />
        </div>
      </div>
    </section>
  );
}
