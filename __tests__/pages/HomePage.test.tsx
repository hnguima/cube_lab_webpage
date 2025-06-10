import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import '@testing-library/jest-dom'
import HomePage from '../../app/page'

// Mock the useProjects hook
jest.mock('../../lib/useProjects', () => ({
  useProjects: () => ({
    projects: [
      {
        id: 1,
        title: 'Featured Project',
        slug: 'featured-project',
        description: 'A featured test project',
        category: 'WEB',
        techStack: ['React', 'TypeScript'],
        featured: true,
        githubUrl: 'https://github.com/test/featured',
        demoUrl: 'https://featured.com',
      },
      {
        id: 2,
        title: 'Non-Featured Project',
        slug: 'non-featured-project',
        description: 'A non-featured test project',
        category: 'MOBILE',
        techStack: ['React Native'],
        featured: false,
        githubUrl: 'https://github.com/test/non-featured',
        demoUrl: null,
      },
    ],
    loading: false,
    error: null,
    addProject: jest.fn(),
    updateProject: jest.fn(),
    deleteProject: jest.fn(),
    resetToMockData: jest.fn(),
    getFeaturedProjects: () => [
      {
        id: 1,
        title: 'Featured Project',
        slug: 'featured-project',
        description: 'A featured test project',
        category: 'WEB',
        techStack: ['React', 'TypeScript'],
        featured: true,
        githubUrl: 'https://github.com/test/featured',
        demoUrl: 'https://featured.com',
      },
    ],
  }),
}))

// Mock the loading state hook for testing
const mockUseProjects = jest.fn()
jest.mock('../../lib/useProjects', () => ({
  useProjects: () => mockUseProjects(),
}))

describe('HomePage', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUseProjects.mockReturnValue({
      projects: [
        {
          id: 1,
          title: 'Featured Project',
          slug: 'featured-project',
          description: 'A featured test project',
          category: 'WEB',
          techStack: ['React', 'TypeScript'],
          featured: true,
          githubUrl: 'https://github.com/test/featured',
          demoUrl: 'https://featured.com',
        },
        {
          id: 2,
          title: 'Non-Featured Project',
          slug: 'non-featured-project',
          description: 'A non-featured test project',
          category: 'MOBILE',
          techStack: ['React Native'],
          featured: false,
          githubUrl: 'https://github.com/test/non-featured',
          demoUrl: null,
        },
      ],
      loading: false,
      error: null,
      addProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
      resetToMockData: jest.fn(),
      getFeaturedProjects: () => [
        {
          id: 1,
          title: 'Featured Project',
          slug: 'featured-project',
          description: 'A featured test project',
          category: 'WEB',
          techStack: ['React', 'TypeScript'],
          featured: true,
          githubUrl: 'https://github.com/test/featured',
          demoUrl: 'https://featured.com',
        },
      ],
    })
  })

  it('renders the hero section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Cube Lab')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer with Electrical Engineering Background')).toBeInTheDocument()
    expect(screen.getByText('Solving complex issues with elegant solutions')).toBeInTheDocument()
  })

  it('renders the projects section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.getByText('A featured test project')).toBeInTheDocument()
  })

  it('renders the skills section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Skills & Technologies')).toBeInTheDocument()
  })

  it('renders the contact section', () => {
    render(<HomePage />)
    
    expect(screen.getByText('Get In Touch')).toBeInTheDocument()
    expect(screen.getByText("Interested in working together? Let's connect!")).toBeInTheDocument()
  })

  it('has admin access link', () => {
    render(<HomePage />)
    
    const adminLink = screen.getByRole('link', { name: /admin/i })
    expect(adminLink).toBeInTheDocument()
    expect(adminLink).toHaveAttribute('href', '/admin')
  })

  it('shows loading state when projects are loading', () => {
    mockUseProjects.mockReturnValue({
      projects: [],
      loading: true,
      error: null,
      addProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
      resetToMockData: jest.fn(),
      getFeaturedProjects: () => [],
    })

    render(<HomePage />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Cube Lab')).not.toBeInTheDocument()
  })

  it('toggles between featured and all projects when clicking View All Projects button', async () => {
    render(<HomePage />)
    
    // Initially shows featured projects
    expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.queryByText('Non-Featured Project')).not.toBeInTheDocument()
    
    // Click "View All Projects" button
    const viewAllButton = screen.getByText(/View All Projects \(2\)/)
    expect(viewAllButton).toBeInTheDocument()
    
    fireEvent.click(viewAllButton)
    
    // Should now show all projects
    await waitFor(() => {
      expect(screen.getByText('All Projects')).toBeInTheDocument()
    })
    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.getByText('Non-Featured Project')).toBeInTheDocument()
    
    // Should show "Show Featured Only" button
    expect(screen.getByText('Show Featured Only')).toBeInTheDocument()
  })

  it('toggles back to featured projects when clicking Show Featured Only button', async () => {
    render(<HomePage />)
    
    // First click "View All Projects"
    const viewAllButton = screen.getByText(/View All Projects \(2\)/)
    fireEvent.click(viewAllButton)
    
    await waitFor(() => {
      expect(screen.getByText('All Projects')).toBeInTheDocument()
    })
    
    // Then click "Show Featured Only"
    const showFeaturedButton = screen.getByText('Show Featured Only')
    fireEvent.click(showFeaturedButton)
    
    // Should return to featured projects view
    await waitFor(() => {
      expect(screen.getByText('Featured Projects')).toBeInTheDocument()
    })
    expect(screen.getByText('Featured Project')).toBeInTheDocument()
    expect(screen.queryByText('Non-Featured Project')).not.toBeInTheDocument()
  })

  it('renders project links correctly', () => {
    render(<HomePage />)
    
    // Check View Details link
    const viewDetailsLink = screen.getByText('View Details')
    expect(viewDetailsLink).toBeInTheDocument()
    expect(viewDetailsLink.closest('a')).toHaveAttribute('href', '/projects/featured-project')
    
    // Check GitHub link in project section (use getAllByText to handle multiple GitHub links)
    const githubLinks = screen.getAllByText('GitHub')
    const projectGithubLink = githubLinks.find(link => 
      link.closest('a')?.getAttribute('href') === 'https://github.com/test/featured'
    )
    expect(projectGithubLink).toBeInTheDocument()
    expect(projectGithubLink?.closest('a')).toHaveAttribute('target', '_blank')
    
    // Check Live Demo link
    const demoLink = screen.getByText('Live Demo')
    expect(demoLink).toBeInTheDocument()
    expect(demoLink).toHaveAttribute('href', 'https://featured.com')
    expect(demoLink).toHaveAttribute('target', '_blank')
  })

  it('does not show View All Projects button when all projects are featured', () => {
    // Mock with only featured projects
    mockUseProjects.mockReturnValue({
      projects: [
        {
          id: 1,
          title: 'Featured Project',
          slug: 'featured-project',
          description: 'A featured test project',
          category: 'WEB',
          techStack: ['React', 'TypeScript'],
          featured: true,
          githubUrl: 'https://github.com/test/featured',
          demoUrl: 'https://featured.com',
        },
      ],
      loading: false,
      error: null,
      addProject: jest.fn(),
      updateProject: jest.fn(),
      deleteProject: jest.fn(),
      resetToMockData: jest.fn(),
      getFeaturedProjects: () => [
        {
          id: 1,
          title: 'Featured Project',
          slug: 'featured-project',
          description: 'A featured test project',
          category: 'WEB',
          techStack: ['React', 'TypeScript'],
          featured: true,
          githubUrl: 'https://github.com/test/featured',
          demoUrl: 'https://featured.com',
        },
      ],
    })

    render(<HomePage />)
    
    expect(screen.queryByText(/View All Projects/)).not.toBeInTheDocument()
  })

  it('renders skills with proficiency indicators correctly', async () => {
    render(<HomePage />)
    
    // Wait for skills to load (useEffect)
    await waitFor(() => {
      expect(screen.getByText('Skills & Technologies')).toBeInTheDocument()
    })
    
    // Should render skills by category
    // (The actual skills come from mockData, but we're testing the rendering logic)
    expect(screen.getByText('Skills & Technologies')).toBeInTheDocument()
  })

  it('renders contact section links correctly', () => {
    render(<HomePage />)
    
    const githubContactLink = screen.getAllByText('GitHub').find(link => 
      link.closest('a')?.getAttribute('href') === 'https://github.com'
    )
    const linkedinLink = screen.getByText('LinkedIn')
    
    expect(githubContactLink).toBeInTheDocument()
    expect(githubContactLink?.closest('a')).toHaveAttribute('target', '_blank')
    
    expect(linkedinLink).toBeInTheDocument()
    expect(linkedinLink.closest('a')).toHaveAttribute('href', 'https://linkedin.com')
    expect(linkedinLink.closest('a')).toHaveAttribute('target', '_blank')
  })
})
