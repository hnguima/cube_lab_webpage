"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useProjects } from "../lib/useProjects";
import { mockSkills } from "../lib/mockData";

interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency?: number;
}

export default function Home() {
  const { projects, loading: projectsLoading, getFeaturedProjects } = useProjects();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [showAllProjects, setShowAllProjects] = useState(false);

  useEffect(() => {
    // Load skills from mock data (you could also create a useSkills hook)
    setSkills(mockSkills);
    setSkillsLoading(false);
  }, []);

  const loading = projectsLoading || skillsLoading;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-screen__text">Loading...</div>
      </div>
    );
  }

  const featuredProjects = getFeaturedProjects();
  const displayedProjects = showAllProjects ? projects : featuredProjects;
  const skillsByCategory = skills.reduce((acc: Record<string, Skill[]>, skill: Skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="home-page">
      {/* Admin Link */}
      <Link 
        href="/admin"
        className="admin-link"
      >
        Admin
      </Link>

      {/* Hero Section */}
      <header className="hero">
        <h1 className="hero__title">
          Cube Lab
        </h1>
        <p className="hero__subtitle">
          Software Engineer with Electrical Engineering Background
        </p>
        <p className="hero__description">
          Solving complex issues with elegant solutions
        </p>
      </header>

      {/* Featured Projects Section */}
      <section className="projects-section">
        <h2 className="projects-section__title">
          {showAllProjects ? 'All Projects' : 'Featured Projects'}
        </h2>
        <div className="projects-section__grid">
          {displayedProjects.map((project) => (
            <div key={project.id} data-testid="project-card" className="project-card">
              <div className="project-card__category">
                <span className="project-card__tag">
                  {project.category}
                </span>
              </div>
              <h3 className="project-card__title">{project.title}</h3>
              <p className="project-card__description">{project.description}</p>
              <div className="project-card__tech-stack">
                {project.techStack.map((tech: string, index: number) => (
                  <span key={index} className="project-card__tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-card__actions">
                <Link 
                  href={`/projects/${project.slug}`}
                  className="project-card__link"
                >
                  View Details
                </Link>
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link project-card__link--github"
                  >
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link project-card__link--demo"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {projects.length > featuredProjects.length && !showAllProjects && (
          <div className="projects-section__toggle">
            <button 
              onClick={() => setShowAllProjects(true)}
              className="btn btn--primary"
            >
              View All Projects ({projects.length})
            </button>
          </div>
        )}
        {showAllProjects && (
          <div className="projects-section__toggle">
            <button 
              onClick={() => setShowAllProjects(false)}
              className="btn btn--secondary"
            >
              Show Featured Only
            </button>
          </div>
        )}
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <h2 className="skills-section__title">Skills & Technologies</h2>
        <div className="skills-section__grid">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, Skill[]]) => (
            <div key={category} className="skill-category">
              <h3 className="skill-category__title">
                {category.toLowerCase()}
              </h3>
              <div className="skill-category__skills">
                {categorySkills.map((skill: Skill) => (
                  <div key={skill.id} className="skill-category__skill">
                    <span>{skill.name}</span>
                    {skill.proficiency && (
                      <div className="skill-category__proficiency">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`skill-category__dot ${
                              i < (skill.proficiency || 0)
                                ? 'skill-category__dot--filled'
                                : 'skill-category__dot--empty'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="contact-section__title">Get In Touch</h2>
        <p className="contact-section__description">
          Interested in working together? Let&apos;s connect!
        </p>
        <div className="contact-section__links">
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-section__link"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-section__link"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
