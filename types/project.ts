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
  createdAt?: string;
  updatedAt?: string;
  images?: ProjectImage[];
}
