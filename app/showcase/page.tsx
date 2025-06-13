'use client';

import { useState, useEffect } from 'react';
import { prisma } from "../../lib/prisma";
import Link from "next/link";

interface Project {
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
}

async function getProjects() {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default function ShowcasePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectData = await getProjects();
      // Parse techStack if it's a string
      const processedProjects = projectData.map((project: any) => ({
        ...project,
        techStack: typeof project.techStack === 'string' 
          ? JSON.parse(project.techStack) 
          : project.techStack || []
      }));
      setProjects(processedProjects);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.showcase-fullscreen');
      if (!container) return;
      
      const scrollY = container.scrollTop;
      const windowHeight = window.innerHeight;
      // Use a threshold to determine which project is most visible
      const threshold = windowHeight * 0.5; // 50% of viewport
      let newCurrentProject = Math.floor((scrollY + threshold) / windowHeight);
      
      // Clamp to valid range
      newCurrentProject = Math.max(0, Math.min(newCurrentProject, projects.length - 1));
      
      if (newCurrentProject !== currentProject) {
        setCurrentProject(newCurrentProject);
      }
    };

    // Reduced throttling for better responsiveness
    let throttleTimer: NodeJS.Timeout | null = null;
    const throttledHandleScroll = () => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        handleScroll();
        throttleTimer = null;
      }, 10); // Higher frequency for better tracking
    };

    const container = document.querySelector('.showcase-fullscreen');
    if (container) {
      container.addEventListener('scroll', throttledHandleScroll, { passive: true });
      // Also listen to scroll end events
      let scrollEndTimer: NodeJS.Timeout;
      const handleScrollEnd = () => {
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(handleScroll, 50);
      };
      container.addEventListener('scroll', handleScrollEnd, { passive: true });
      
      return () => {
        container.removeEventListener('scroll', throttledHandleScroll);
        container.removeEventListener('scroll', handleScrollEnd);
        if (throttleTimer) clearTimeout(throttleTimer);
        clearTimeout(scrollEndTimer);
      };
    }
  }, [currentProject, projects.length]);

  if (loading) {
    return (
      <div className="fullscreen-loader">
        <div className="loader-content">
          <div className="loader-spinner"></div>
          <p>Loading Projects...</p>
        </div>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="fullscreen-empty">
        <div className="empty-content">
          <h1>No Projects Found</h1>
          <p>There are no projects to showcase.</p>
          <Link href="/" className="btn-home">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fixed Navigation */}
      <nav className="showcase-nav-fixed">
        <Link href="/" className="nav-home">
          ← Portfolio
        </Link>
        <div className="nav-indicators">
          {projects.map((_, index) => (
            <button
              key={index}
              className={`nav-dot ${index === currentProject ? 'active' : ''}`}
              onClick={() => {
                const container = document.querySelector('.showcase-fullscreen');
                if (container) {
                  container.scrollTo({
                    top: index * window.innerHeight,
                    behavior: 'smooth'
                  });
                }
              }}
            />
          ))}
        </div>
      </nav>

      {/* Full-page project sections */}
      <div className="showcase-fullscreen">
        {projects.map((project, index) => (
          <section
            key={project.id}
            className={`project-section ${index === currentProject ? 'active' : ''}`}
          >
            {/* Project Content Container - allows internal scrolling */}
            <div className="project-content-container">
              
              {/* Title Page */}
              <div className="project-title-page">
                <div className="title-background">
                  <div className={`title-gradient title-gradient--${project.category.toLowerCase()}`} />
                  <div className="title-pattern" />
                </div>
                
                <div className="title-content">
                  <div className="title-badges">
                    <span className={`badge badge--${project.category.toLowerCase()}`}>
                      {project.category}
                    </span>
                    {project.featured && (
                      <span className="badge badge--featured">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h1 className="project-title">
                    {project.title}
                  </h1>
                  
                  <p className="project-subtitle">
                    {project.description}
                  </p>
                  
                  <div className="title-tech-stack">
                    {(Array.isArray(project.techStack) ? project.techStack : []).slice(0, 4).map((tech, techIndex) => (
                      <span key={techIndex} className="tech-pill">
                        {tech}
                      </span>
                    ))}
                    {Array.isArray(project.techStack) && project.techStack.length > 4 && (
                      <span className="tech-pill tech-pill--more">
                        +{project.techStack.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  <div className="title-actions">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--primary"
                      >
                        View Code
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--secondary"
                      >
                        Live Demo
                      </a>
                    )}
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="btn btn--outline"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
                
                <div className="scroll-indicator">
                  <div className="scroll-arrow">↓</div>
                  <span>Scroll within project</span>
                </div>
              </div>

              {/* Project Details Section */}
              <div className="project-details-section">
                <div className="details-container">
                  <div className="details-header">
                    <h2>Project Overview</h2>
                    <div className="details-tech-stack">
                      {(Array.isArray(project.techStack) ? project.techStack : []).map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="details-content">
                    <div className="content-block">
                      <h3>Description</h3>
                      <p>{project.description}</p>
                    </div>
                    
                    {project.content && (
                      <div className="content-block">
                        <h3>Technical Details</h3>
                        <div className="content-text">
                          {project.content.split('\n').map((paragraph, pIndex) => (
                            <p key={pIndex}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="content-block">
                      <h3>Key Features</h3>
                      <ul className="features-list">
                        <li>Modern, responsive design</li>
                        <li>Optimized performance</li>
                        <li>Clean, maintainable code</li>
                        <li>Cross-platform compatibility</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="details-actions">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-btn--github"
                      >
                        <span>View Source Code</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-btn--demo"
                      >
                        <span>Live Demo</span>
                      </a>
                    )}
                    <Link 
                      href={`/projects/${project.slug}`}
                      className="action-btn action-btn--details"
                    >
                      <span>Full Project Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <style jsx>{`
        .fullscreen-loader, .fullscreen-empty {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          z-index: 1000;
        }

        .loader-content, .empty-content {
          text-align: center;
        }

        .loader-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .btn-home {
          display: inline-block;
          padding: 12px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 20px;
          transition: all 0.3s ease;
        }

        .btn-home:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .showcase-nav-fixed {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          z-index: 100;
          transition: all 0.3s ease;
        }

        .nav-home {
          color: #334155;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: color 0.3s ease;
        }

        .nav-home:hover {
          color: #2563eb;
        }

        .nav-indicators {
          display: flex;
          gap: 12px;
        }

        .nav-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid #cbd5e1;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .nav-dot:hover {
          border-color: #64748b;
        }

        .nav-dot.active {
          background: #2563eb;
          border-color: #2563eb;
          transform: scale(1.2);
        }

        .showcase-fullscreen {
          position: relative;
          scroll-snap-type: y mandatory;
          overflow-y: scroll;
          overflow-x: hidden;
          height: 100vh;
          width: 100vw;
          scroll-behavior: smooth;
        }

        .project-section {
          position: relative;
          width: 100%;
          max-width: 100vw;
          height: 100vh;
          scroll-snap-align: start;
          overflow: hidden;
          transition: all 0.5s ease-in-out;
        }

        .project-section.active {
          transform: scale(1);
        }

        .project-content-container {
          width: 100%;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
          scroll-snap-type: y mandatory;
        }

        .project-title-page {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 80px 40px 40px;
          scroll-snap-align: start;
        }

        .project-details-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 80px 40px 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          scroll-snap-align: start;
        }

        .details-container {
          max-width: 1000px;
          width: 100%;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          padding: 60px;
          margin: 40px 0;
        }

        .details-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .details-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #1a202c;
          margin: 0 0 30px;
        }

        .details-tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }

        .tech-tag {
          padding: 8px 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 15px;
          font-size: 14px;
          font-weight: 600;
        }

        .details-content {
          margin-bottom: 50px;
        }

        .content-block {
          margin-bottom: 40px;
        }

        .content-block h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 20px;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }

        .content-block p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a5568;
          margin: 0 0 15px;
        }

        .content-text {
          font-size: 1rem;
          line-height: 1.7;
          color: #4a5568;
        }

        .features-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .features-list li {
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 1.1rem;
          color: #4a5568;
          position: relative;
          padding-left: 30px;
        }

        .features-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .features-list li:last-child {
          border-bottom: none;
        }

        .details-actions {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .action-btn {
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
          display: inline-block;
          min-width: 180px;
          text-align: center;
        }

        .action-btn--github {
          background: #24292e;
          color: white;
        }

        .action-btn--github:hover {
          background: #1a1e22;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(36, 41, 46, 0.3);
        }

        .action-btn--demo {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-btn--demo:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .action-btn--details {
          background: transparent;
          color: #667eea;
          border-color: #667eea;
        }

        .action-btn--details:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .title-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .title-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0.9;
        }

        .title-gradient--hardware {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }

        .title-gradient--web {
          background: linear-gradient(135deg, #4ecdc4 0%, #2196f3 100%);
        }

        .title-gradient--mobile {
          background: linear-gradient(135deg, #a55eea 0%, #6c5ce7 100%);
        }

        .title-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0);
          background-size: 40px 40px;
          animation: patternMove 20s linear infinite;
        }

        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }

        .title-content {
          position: relative;
          z-index: 10;
          max-width: 800px;
          color: white;
          animation: titleFadeIn 1s ease-out;
        }

        @keyframes titleFadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .title-badges {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-bottom: 20px;
        }

        .badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .badge--hardware {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .badge--web {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .badge--mobile {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .badge--featured {
          background: rgba(255, 215, 0, 0.9);
          color: #1a1a1a;
        }

        .project-title {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 800;
          margin: 0 0 16px;
          line-height: 1.1;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          color: white;
        }

        .project-subtitle {
          font-size: clamp(1.1rem, 2.5vw, 1.3rem);
          margin: 0;
          opacity: 0.9;
          line-height: 1.6;
          color: white;
          max-width: 600px;
        }

        .title-tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-bottom: 40px;
        }

        .tech-pill {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          font-size: 14px;
          font-weight: 500;
          backdrop-filter: blur(10px);
        }

        .tech-pill--more {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
          font-style: italic;
        }

        .title-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          padding: 14px 28px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
          display: inline-block;
        }

        .btn--primary {
          background: white;
          color: #1a1a1a;
        }

        .btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }

        .btn--secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-color: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn--secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .btn--outline {
          background: transparent;
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }

        .btn--outline:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: rgba(255, 255, 255, 0.8);
          animation: scrollBounce 2s ease-in-out infinite;
        }

        .scroll-arrow {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .scroll-indicator span {
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        @keyframes scrollBounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          40% {
            transform: translateX(-50%) translateY(-10px);
          }
          60% {
            transform: translateX(-50%) translateY(-5px);
          }
        }

        @media (max-width: 768px) {
          .showcase-nav-fixed {
            padding: 0 20px;
          }

          .project-title-page {
            padding: 80px 20px 40px;
          }

          .project-details-section {
            padding: 80px 20px 40px;
          }

          .details-container {
            padding: 40px 30px;
            margin: 20px 0;
          }

          .details-header h2 {
            font-size: 2rem;
          }

          .title-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn {
            min-width: 200px;
          }

          .title-tech-stack {
            gap: 8px;
          }

          .tech-pill {
            padding: 8px 16px;
            font-size: 12px;
          }

          .details-actions {
            flex-direction: column;
            align-items: center;
          }

          .action-btn {
            min-width: 250px;
          }
        }
      `}</style>
    </>
  );
}
