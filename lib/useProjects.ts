import { useState, useEffect } from "react";

export interface ProjectImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  images?: ProjectImage[];
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        // Transform the data to match our interface
        const transformedProjects = data.map(
          (project: Record<string, unknown>) => ({
            ...project,
            techStack: JSON.parse((project.techStack as string) || "[]"),
            createdAt: project.createdAt || new Date().toISOString(),
            updatedAt: project.updatedAt || new Date().toISOString(),
          })
        );
        setProjects(transformedProjects);
      } else {
        console.error("Failed to load projects from API");
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "images">
  ) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const newProject = await response.json();
        const transformedProject = {
          ...newProject,
          techStack: JSON.parse(newProject.techStack || "[]"),
        };
        await loadProjects(); // Reload all projects to ensure consistency
        return transformedProject;
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      throw error;
    }
  };

  const updateProject = async (id: number, updates: Partial<Project>) => {
    try {
      const project = projects.find((p) => p.id === id);
      if (!project) {
        throw new Error("Project not found");
      }

      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        await loadProjects(); // Reload all projects to ensure consistency
      } else {
        throw new Error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const project = projects.find((p) => p.id === id);
      if (!project) {
        throw new Error("Project not found");
      }

      const response = await fetch(`/api/projects/${project.slug}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await loadProjects(); // Reload all projects to ensure consistency
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  };

  const getProjectBySlug = (slug: string) => {
    return projects.find((project) => project.slug === slug);
  };

  const getFeaturedProjects = () => {
    return projects.filter((project) => project.featured);
  };

  const getProjectsByCategory = (category: string) => {
    return projects.filter((project) => project.category === category);
  };

  const resetToMockData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Reload projects after successful reset
        await loadProjects();
        console.log("Database reset to mock data successfully");
      } else {
        console.error("Failed to reset database");
        throw new Error("Failed to reset database");
      }
    } catch (error) {
      console.error("Error resetting to mock data:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    addProject,
    updateProject,
    deleteProject,
    getProjectBySlug,
    getFeaturedProjects,
    getProjectsByCategory,
    resetToMockData,
    loadProjects, // Expose loadProjects for manual refresh
  };
}
