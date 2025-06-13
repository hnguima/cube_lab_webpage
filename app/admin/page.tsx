"use client";

import { useState } from "react";
import { useProjects, Project } from "../../lib/useProjects";
import { Plus, Edit, Trash2, Save, X, RotateCcw } from "lucide-react";

interface ProjectFormData {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  techStack: string;
  githubUrl: string;
  demoUrl: string;
  featured: boolean;
}

const PROJECT_CATEGORIES = ["HARDWARE", "WEB", "MOBILE"];

export default function AdminPage() {
  const {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    resetToMockData,
  } = useProjects();

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    slug: "",
    description: "",
    content: "",
    category: "WEB",
    techStack: "",
    githubUrl: "",
    demoUrl: "",
    featured: false,
  });

  if (loading) {
    return (
      <div className="admin-page__loading">
        <div className="loading-text">Loading projects...</div>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      content: "",
      category: "WEB",
      techStack: "",
      githubUrl: "",
      demoUrl: "",
      featured: false,
    });
    setEditingProject(null);
    setShowForm(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Auto-generate slug when title changes
    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      techStack: project.techStack.join(", "),
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      featured: project.featured,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const techStackArray = formData.techStack
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    if (editingProject) {
      // Update existing project
      updateProject(editingProject.id, {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        techStack: techStackArray,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        featured: formData.featured,
      });
    } else {
      // Create new project
      addProject({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        techStack: techStackArray,
        githubUrl: formData.githubUrl || undefined,
        demoUrl: formData.demoUrl || undefined,
        featured: formData.featured,
      });
    }

    resetForm();
  };

  const handleDelete = (projectId: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__container">
        {/* Header */}
        <div className="admin-page__header">
          <h1 className="admin-page__title">Project Management</h1>
          <div className="admin-page__actions">
            <button
              onClick={() => {
                if (
                  confirm(
                    "Reset all projects to original mock data? This will delete any custom projects."
                  )
                ) {
                  resetToMockData();
                }
              }}
              className="btn btn--secondary"
            >
              <RotateCcw size={20} />
              Reset Data
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn--primary"
            >
              <Plus size={20} />
              Add New Project
            </button>
          </div>
        </div>

        {/* Project Form Modal */}
        {showForm && (
          <div className="modal">
            <div className="modal__content">
              <div className="modal__header">
                <h2 className="modal__title">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button onClick={resetForm} className="modal__close">
                  <X size={20} />
                </button>
              </div>

              <div className="modal__body">
                <form
                  id="project-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                >
                  <div className="form-content">
                    {/* Title */}
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        Title *
                      </label>
                      <input
                        id="title"
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    {/* Slug */}
                    <div className="form-group">
                      <label htmlFor="slug" className="form-label">
                        Slug *
                      </label>
                      <input
                        id="slug"
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label htmlFor="category" className="form-label">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="form-select"
                      >
                        {PROJECT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Featured */}
                    <div className="form-group">
                      <label className="form-label">
                        <input
                          id="featured"
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="form-checkbox"
                        />
                        Featured Project
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label htmlFor="description" className="form-label">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="form-group">
                    <label htmlFor="techStack" className="form-label">
                      Tech Stack (comma-separated)
                    </label>
                    <input
                      id="techStack"
                      type="text"
                      name="techStack"
                      value={formData.techStack}
                      onChange={handleInputChange}
                      placeholder="React, TypeScript, Node.js"
                      className="form-input"
                    />
                  </div>

                  <div className="form-grid">
                    {/* GitHub URL */}
                    <div className="form-group">
                      <label htmlFor="githubUrl" className="form-label">
                        GitHub URL
                      </label>
                      <input
                        id="githubUrl"
                        type="url"
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>

                    {/* Demo URL */}
                    <div className="form-group">
                      <label htmlFor="demoUrl" className="form-label">
                        Demo URL
                      </label>
                      <input
                        id="demoUrl"
                        type="url"
                        name="demoUrl"
                        value={formData.demoUrl}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="form-group">
                    <label htmlFor="content" className="form-label">
                      Content (Markdown) *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={10}
                      placeholder="# Project Title

## Overview
Describe your project here...

## Technical Implementation
- Feature 1
- Feature 2

## Challenges Solved
What problems did you solve?

## Results
What was the outcome?"
                      className="form-textarea form-textarea--large"
                    />
                  </div>
                </form>
              </div>

              <div className="modal__footer">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn--outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="project-form"
                  className="btn btn--primary"
                >
                  <Save size={20} />
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="admin-page__projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              data-testid="project-item"
              className="project-card"
            >
              <div className="project-card__header">
                <div className="project-card__badges">
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
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__description">
                  {project.description}
                </p>
                <div className="project-card__tech-stack">
                  {project.techStack.slice(0, 3).map((tech, index) => (
                    <span key={index} className="project-card__tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="project-card__tech-tag">
                      +{project.techStack.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="project-card__footer">
                <div className="project-card__links">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link--success"
                    >
                      Demo
                    </a>
                  )}
                </div>
                <div className="project-card__actions">
                  <button
                    onClick={() => handleEdit(project)}
                    aria-label={`Edit ${project.title}`}
                    className="project-card__action-btn project-card__action-btn--edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    aria-label={`Delete ${project.title}`}
                    className="project-card__action-btn project-card__action-btn--delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="admin-page__empty-state">
            <p>No projects found</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn--primary btn--lg"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
