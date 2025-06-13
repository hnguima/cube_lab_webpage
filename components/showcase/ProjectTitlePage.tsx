import TechStack from "../project/TechStack";
import ProjectActions from "../project/ProjectActions";
import { Project } from "../../types/project";

interface ProjectTitlePageProps {
  readonly project: Project;
  readonly showScrollIndicator?: boolean;
}

export default function ProjectTitlePage({
  project,
  showScrollIndicator = true,
}: ProjectTitlePageProps) {
  return (
    <div className="project-title-page">
      <div className="title__background">
        <div
          className={`title__gradient title__gradient--${project.category.toLowerCase()}`}
        />
        <div className="title__pattern" />
      </div>

      <div className="title__content">
        <div className="title__badges">
          <span className={`badge badge--${project.category.toLowerCase()}`}>
            {project.category}
          </span>
          {project.featured && (
            <span className="badge badge--featured">Featured</span>
          )}
        </div>

        <h1 className="project__title">{project.title}</h1>

        <p className="project__subtitle">{project.description}</p>

        <TechStack
          technologies={project.techStack}
          maxVisible={4}
          variant="pills"
        />

        <ProjectActions
          githubUrl={project.githubUrl}
          demoUrl={project.demoUrl}
          projectSlug={project.slug}
          actionType="title"
        />
      </div>

      {showScrollIndicator && (
        <div className="scroll-indicator">
          <div className="scroll-indicator__arrow">↓</div>
          <span>Scroll within project</span>
        </div>
      )}
    </div>
  );
}
