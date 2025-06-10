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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
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
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Admin Link */}
      <div className="fixed top-4 right-4 z-10">
        <Link 
          href="/admin"
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          Admin
        </Link>
      </div>

      {/* Hero Section */}
      <header className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Cube Lab
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Software Engineer with Electrical Engineering Background
        </p>
        <p className="text-lg max-w-2xl mx-auto">
          Solving complex issues with elegant solutions
        </p>
      </header>

      {/* Featured Projects Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">
          {showAllProjects ? 'All Projects' : 'Featured Projects'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div key={project.id} data-testid="project-card" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {project.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map((tech: string, index: number) => (
                  <span key={index} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link 
                  href={`/projects/${project.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Details
                </Link>
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a 
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 dark:text-green-400 hover:underline"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        {projects.length > featuredProjects.length && !showAllProjects && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAllProjects(true)}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Projects ({projects.length})
            </button>
          </div>
        )}
        {showAllProjects && (
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowAllProjects(false)}
              className="inline-block px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Show Featured Only
            </button>
          </div>
        )}
      </section>

      {/* Skills Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Skills & Technologies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(skillsByCategory).map(([category, categorySkills]: [string, Skill[]]) => (
            <div key={category} className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {category.toLowerCase()}
              </h3>
              <div className="space-y-2">
                {categorySkills.map((skill: Skill) => (
                  <div key={skill.id} className="flex justify-between items-center">
                    <span>{skill.name}</span>
                    {skill.proficiency && (
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < (skill.proficiency || 0)
                                ? 'bg-blue-500'
                                : 'bg-gray-300 dark:bg-gray-600'
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
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Interested in working together? Let&apos;s connect!
        </p>
        <div className="flex justify-center gap-6">
          <a 
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
