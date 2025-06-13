import { useState, useEffect } from "react";
import { Project } from "../types/project";

async function getProjects() {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Failed to fetch projects");
    return await response.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export function useProjectData() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await getProjects();

        // Parse techStack if it's a string
        const processedProjects = projectData.map((project: any) => ({
          ...project,
          techStack:
            typeof project.techStack === "string"
              ? JSON.parse(project.techStack)
              : project.techStack || [],
        }));

        setProjects(processedProjects);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error, refetch: () => setLoading(true) };
}
