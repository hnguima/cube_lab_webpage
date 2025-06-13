import TechStack from "../project/TechStack";
import ProjectActions from "../project/ProjectActions";
import { MarkdownInterpreter } from "../ui";
import { Project } from "../../types/project";

interface ProjectDetailsSectionProps {
  readonly project: Project;
  readonly features?: readonly string[];
  // readonly variant?: "showcase" | "standalone";
}

export default function ProjectDetailsSection({
  project,
  features = [
    "Modern, responsive design",
    "Optimized performance",
    "Clean, maintainable code",
    "Cross-platform compatibility",
  ],
}: // variant = "showcase",

ProjectDetailsSectionProps) {
  return (
    <div className="project-details-section">
      <div className="details__container">
        <div className="details__header">
          <h2>Project Overview</h2>
          <TechStack
            technologies={project.techStack}
            variant="tags"
            showCount={false}
          />
        </div>

        <div className="details__content">
          <div className="content-block">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>

          {project.content && (
            <div className="content-block">
              <h3>Technical Details</h3>
              <MarkdownInterpreter
                content={project.content}
                uniqueKey={`project-${project.slug}`}
                className="project-content"
              />
            </div>
          )}

          {/* <div className="content-block">
            <h3>Key Features</h3>
            <ul className="features-list">
              {features.map((feature, index) => (
                <li key={`feature-${index}-${feature.slice(0, 10)}`}>
                  {feature}
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        <ProjectActions
          githubUrl={project.githubUrl}
          demoUrl={project.demoUrl}
          projectSlug={project.slug}
          actionType="details"
        />
      </div>
    </div>
  );
}
