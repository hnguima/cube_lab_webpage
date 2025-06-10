'use client';

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
      <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <nav className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            &larr; Back to Portfolio
          </Link>
        </nav>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-2xl">Loading project...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <nav className="mb-8">
          <Link 
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            &larr; Back to Portfolio
          </Link>
        </nav>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Navigation */}
      <nav className="mb-8">
        <Link 
          href="/"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          &larr; Back to Portfolio
        </Link>
      </nav>

      {/* Project Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-sm rounded-full ${
            project.category === 'HARDWARE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
            project.category === 'WEB' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
          }`}>
            {project.category}
          </span>
          {project.featured && (
            <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Featured
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {project.title}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm">
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-4">
          {project.githubUrl && (
            <a 
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              View on GitHub
            </a>
          )}
          {project.demoUrl && (
            <a 
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Live Demo
            </a>
          )}
        </div>
      </header>

      {/* Project Content */}
      <article className="max-w-4xl">
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {project.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return (
                <h1 key={index} className="text-3xl font-bold mt-8 mb-4">
                  {paragraph.slice(2)}
                </h1>
              );
            } else if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">
                  {paragraph.slice(3)}
                </h2>
              );
            } else if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-semibold mt-4 mb-2">
                  {paragraph.slice(4)}
                </h3>
              );
            } else if (paragraph.startsWith('- ')) {
              return (
                <ul key={index} className="list-disc ml-6 mb-4">
                  <li>{paragraph.slice(2)}</li>
                </ul>
              );
            } else if (paragraph.trim() === '') {
              return <br key={index} />;
            } else {
              return (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            }
          })}
        </div>
      </article>

      {/* Project Images */}
      {project.images && project.images.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Project Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((image, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt || `${project.title} screenshot ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                {image.caption && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Projects */}
      <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Explore More Projects</h2>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </section>
    </div>
  );
}
