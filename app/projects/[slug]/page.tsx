"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useProjects } from "../../../lib/useProjects";

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getProjectBySlug, loading } = useProjects();

  const project = getProjectBySlug(slug);

  if (loading) {
    return (
      <div className="home-page">
        <nav className="project-nav">
          <Link href="/" className="project-nav__link">
            &larr; Back to Portfolio
          </Link>
        </nav>
        <div className="loading-screen">
          <div className="loading-screen__text">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="home-page">
        <nav className="project-nav">
          <Link href="/" className="project-nav__link">
            &larr; Back to Portfolio
          </Link>
        </nav>
        <div className="project-not-found">
          <h1 className="project-not-found__title">Project Not Found</h1>
          <p className="project-not-found__text">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="project-nav">
        <Link href="/" className="project-nav__link">
          &larr; Back to Portfolio
        </Link>
      </nav>

      {/* Project Header */}
      <header className="project-header">
        <div className="project-header__badges">
          <span
            className={`project-card__badge project-card__badge--${project.category.toLowerCase()}`}
          >
            {project.category}
          </span>
          {project.featured && (
            <span className="project-card__badge project-card__badge--featured">
              Featured
            </span>
          )}
        </div>

        <h1 className="project-header__title">{project.title}</h1>

        <p className="project-header__description">{project.description}</p>

        {/* Tech Stack */}
        <div className="project-header__tech-stack">
          {project.techStack.map((tech, techIndex) => (
            <span
              key={`tech-${techIndex}-${tech}`}
              className="project-card__tech-tag"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="project-header__actions">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary project-card__link--github"
            >
              View on GitHub
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--secondary project-card__link--demo"
            >
              Live Demo
            </a>
          )}
        </div>
      </header>

      {/* Project Content */}
      <article className="project-content">
        <div className="project-content__markdown">
          {project.content.split("\n").map((paragraph, paragraphIndex) => {
            // Create a more robust key using content hash
            const contentKey = `${paragraphIndex}-${paragraph
              .slice(0, 10)
              .replace(/\s+/g, "-")}`;

            if (paragraph.startsWith("# ")) {
              return (
                <h1 key={`h1-${contentKey}`} className="project-content__h1">
                  {paragraph.slice(2)}
                </h1>
              );
            } else if (paragraph.startsWith("## ")) {
              return (
                <h2 key={`h2-${contentKey}`} className="project-content__h2">
                  {paragraph.slice(3)}
                </h2>
              );
            } else if (paragraph.startsWith("### ")) {
              return (
                <h3 key={`h3-${contentKey}`} className="project-content__h3">
                  {paragraph.slice(4)}
                </h3>
              );
            } else if (paragraph.startsWith("- ")) {
              return (
                <ul key={`ul-${contentKey}`} className="project-content__list">
                  <li className="project-content__list-item">
                    {paragraph.slice(2)}
                  </li>
                </ul>
              );
            } else if (paragraph.trim() === "") {
              // For empty paragraphs, use a unique identifier
              return <br key={`br-${project.slug}-${paragraphIndex}`} />;
            } else {
              return (
                <p
                  key={`p-${contentKey}`}
                  className="project-content__paragraph"
                >
                  {paragraph}
                </p>
              );
            }
          })}
        </div>
      </article>

      {/* Project Images */}
      {project.images && project.images.length > 0 && (
        <section className="project-images">
          <h2 className="project-images__title">Project Images</h2>
          <div className="project-images__grid">
            {project.images.map((image) => (
              <div
                key={`img-${project.slug}-${image.url.split("/").pop()}`}
                className="project-images__item"
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${project.title} screenshot`}
                  width={800}
                  height={600}
                  className="project-images__img"
                />
                {image.caption && (
                  <div className="project-images__caption">
                    <p>{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Projects */}
      <section className="related-projects">
        <div className="related-projects__content">
          <h2 className="related-projects__title">Explore More Projects</h2>
          <Link href="/" className="btn btn--primary">
            View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
