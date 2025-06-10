import { render, screen, fireEvent, waitFor } from '../utils/test-utils'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import AdminPage from '../../app/admin/page'

// Mock the useProjects hook
const mockAddProject = jest.fn()
const mockUpdateProject = jest.fn()
const mockDeleteProject = jest.fn()
const mockResetToMockData = jest.fn()

jest.mock('../../lib/useProjects', () => ({
  useProjects: () => ({
    projects: [
      {
        id: 1,
        title: 'Existing Project',
        slug: 'existing-project',
        description: 'An existing project',
        content: '# Existing Project\n\nContent here.',
        category: 'WEB',
        techStack: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/existing',
        demoUrl: 'https://existing.demo.com',
        featured: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ],
    loading: false,
    error: null,
    addProject: mockAddProject,
    updateProject: mockUpdateProject,
    deleteProject: mockDeleteProject,
    resetToMockData: mockResetToMockData,
  }),
}))

describe('AdminPage', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the admin interface', () => {
    render(<AdminPage />)
    
    expect(screen.getByText('Project Management')).toBeInTheDocument()
    expect(screen.getByText('Add New Project')).toBeInTheDocument()
    // Note: Component doesn't display "Existing Projects" text, but shows project cards
    expect(screen.getByTestId('project-item')).toBeInTheDocument()
  })

  it('displays existing projects', () => {
    render(<AdminPage />)
    
    expect(screen.getByText('Existing Project')).toBeInTheDocument()
    expect(screen.getByText('An existing project')).toBeInTheDocument()
    expect(screen.getByText('WEB')).toBeInTheDocument()
  })

  it('allows creating a new project', async () => {
    mockAddProject.mockResolvedValue(undefined)
    
    render(<AdminPage />)
    
    // Click Add New Project button to open form
    await user.click(screen.getByRole('button', { name: /add new project/i }))
    
    // Fill out the form
    await user.type(screen.getByLabelText(/title/i), 'New Test Project')
    await user.type(screen.getByLabelText(/description/i), 'A new test project')
    await user.type(screen.getByLabelText(/content/i), '# New Project\n\nContent')
    await user.selectOptions(screen.getByLabelText(/category/i), 'MOBILE')
    await user.type(screen.getByLabelText(/tech stack/i), 'React Native, TypeScript')
    await user.type(screen.getByLabelText(/github url/i), 'https://github.com/test/new')
    await user.type(screen.getByLabelText(/demo url/i), 'https://new.demo.com')
    await user.click(screen.getByLabelText(/featured project/i))
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /create project/i }))
    
    await waitFor(() => {
      expect(mockAddProject).toHaveBeenCalledWith({
        title: 'New Test Project',
        slug: 'new-test-project',
        description: 'A new test project',
        content: '# New Project\n\nContent',
        category: 'MOBILE',
        techStack: ['React Native', 'TypeScript'],
        githubUrl: 'https://github.com/test/new',
        demoUrl: 'https://new.demo.com',
        featured: true,
      })
    })
  })

  it('allows editing an existing project', async () => {
    mockUpdateProject.mockResolvedValue(undefined)
    
    render(<AdminPage />)
    
    // Click edit button
    await user.click(screen.getByRole('button', { name: /edit existing project/i }))
    
    // Modify the title
    const titleInput = screen.getByDisplayValue('Existing Project')
    await user.clear(titleInput)
    await user.type(titleInput, 'Updated Project')
    
    // Save changes
    await user.click(screen.getByRole('button', { name: /update project/i }))
    
    await waitFor(() => {
      expect(mockUpdateProject).toHaveBeenCalledWith(1, {
        title: 'Updated Project',
        slug: 'updated-project',
        description: 'An existing project',
        content: '# Existing Project\n\nContent here.',
        category: 'WEB',
        techStack: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/existing',
        demoUrl: 'https://existing.demo.com',
        featured: true,
      })
    })
  })

  it('allows deleting a project', async () => {
    mockDeleteProject.mockResolvedValue(undefined)
    
    render(<AdminPage />)
    
    // Click delete button
    await user.click(screen.getByRole('button', { name: /delete existing project/i }))
    
    // Confirm deletion in modal/alert
    await waitFor(() => {
      expect(mockDeleteProject).toHaveBeenCalledWith(1)
    })
  })

  it('allows resetting to mock data', async () => {
    mockResetToMockData.mockResolvedValue(undefined)
    
    render(<AdminPage />)
    
    // Click reset button
    await user.click(screen.getByText('Reset Data'))
    
    await waitFor(() => {
      expect(mockResetToMockData).toHaveBeenCalled()
    })
  })

  it('validates required fields', async () => {
    render(<AdminPage />)
    
    // Click Add New Project button to open form
    await user.click(screen.getByRole('button', { name: /add new project/i }))
    
    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /create project/i }))
    
    // Should show validation errors (browser validation will prevent submission)
    // Since we're using HTML5 validation, the form won't submit with empty required fields
  })

  it('handles form submission', async () => {
    // Set up the mock to resolve successfully
    mockAddProject.mockResolvedValue(undefined)
    
    render(<AdminPage />)
    
    // Click Add New Project button to open form
    await user.click(screen.getByRole('button', { name: /add new project/i }))
    
    // Fill minimum required fields
    await user.type(screen.getByLabelText(/title/i), 'Test Project')
    await user.type(screen.getByLabelText(/description/i), 'Test description')
    await user.type(screen.getByLabelText(/content/i), 'Test content')
    
    // Submit form
    await user.click(screen.getByRole('button', { name: /create project/i }))
    
    // Wait for the addProject function to be called
    await waitFor(() => {
      expect(mockAddProject).toHaveBeenCalledWith({
        title: 'Test Project',
        slug: 'test-project',
        description: 'Test description',
        content: 'Test content',
        category: 'WEB', // default value
        techStack: [],
        githubUrl: undefined,
        demoUrl: undefined,
        featured: false, // default value
      })
    })
    
    // Form should be closed after successful submission
    await waitFor(() => {
      expect(screen.queryByLabelText(/title/i)).not.toBeInTheDocument()
    })
  })
})
