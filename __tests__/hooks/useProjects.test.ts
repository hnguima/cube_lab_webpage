import { renderHook, waitFor, act } from '@testing-library/react'
import { useProjects } from '../../lib/useProjects'
import { mockProjects } from '../../lib/mockData'

// Mock fetch globally
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('useProjects', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('fetches projects on mount', async () => {
    const mockProjectsFromAPI = [
      {
        id: 1,
        title: 'Test Project',
        slug: 'test-project',
        description: 'Test description',
        content: 'Test content',
        category: 'WEB',
        techStack: '["React"]', // JSON string format as expected from API
        githubUrl: 'https://github.com/test',
        demoUrl: 'https://test.demo.com',
        featured: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjectsFromAPI,
    } as Response)

    const { result } = renderHook(() => useProjects())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Expected result after transformation
    expect(result.current.projects).toEqual([{
      id: 1,
      title: 'Test Project',
      slug: 'test-project',
      description: 'Test description',
      content: 'Test content',
      category: 'WEB',
      techStack: ['React'], // Transformed to array
      githubUrl: 'https://github.com/test',
      demoUrl: 'https://test.demo.com',
      featured: true,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    }])
  })

  it('handles fetch errors', async () => {
    // Mock console.error to suppress expected error logs
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.projects).toEqual([])
    
    // Verify that the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading projects:', expect.any(Error))
    
    // Restore console.error
    consoleErrorSpy.mockRestore()
  })

  it('adds a new project', async () => {
    const initialProjectsFromAPI = [
      {
        id: 1,
        title: 'Existing Project',
        slug: 'existing-project',
        description: 'Existing description',
        content: 'Existing content',
        category: 'WEB',
        techStack: '["React"]',
        githubUrl: 'https://github.com/existing',
        demoUrl: 'https://existing.demo.com',
        featured: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ]

    const newProject = {
      title: 'New Project',
      slug: 'new-project',
      description: 'New description',
      content: 'New content',
      category: 'WEB' as const,
      techStack: ['TypeScript'],
      githubUrl: 'https://github.com/test/new',
      demoUrl: 'https://new.demo.com',
      featured: false,
    }

    const createdProjectFromAPI = {
      id: 2,
      title: 'New Project',
      slug: 'new-project',
      description: 'New description',
      content: 'New content',
      category: 'WEB',
      techStack: '["TypeScript"]', // API returns JSON string
      githubUrl: 'https://github.com/test/new',
      demoUrl: 'https://new.demo.com',
      featured: false,
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    }

    const updatedProjectsFromAPI = [
      ...initialProjectsFromAPI,
      createdProjectFromAPI,
    ]

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialProjectsFromAPI,
    } as Response)

    // Mock create project
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => createdProjectFromAPI,
    } as Response)

    // Mock loadProjects after creation
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProjectsFromAPI,
    } as Response)

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.addProject(newProject)
    })

    await waitFor(() => {
      expect(result.current.projects).toHaveLength(2)
    })

    expect(result.current.projects[1].title).toBe('New Project')
    expect(result.current.projects[1].techStack).toEqual(['TypeScript'])
  })

  it('updates an existing project', async () => {
    const initialProjectsFromAPI = [
      {
        id: 1,
        title: 'Test Project',
        slug: 'test-project',
        description: 'Test description',
        content: 'Test content',
        category: 'WEB',
        techStack: '["React"]',
        githubUrl: 'https://github.com/test',
        demoUrl: 'https://test.demo.com',
        featured: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ]

    const updatedProjectsFromAPI = [
      {
        ...initialProjectsFromAPI[0],
        title: 'Updated Project',
        description: 'Updated description',
        updatedAt: '2023-01-02T00:00:00.000Z',
      },
    ]

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialProjectsFromAPI,
    } as Response)

    // Mock update project
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response)

    // Mock loadProjects after update
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => updatedProjectsFromAPI,
    } as Response)

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.updateProject(1, {
        title: 'Updated Project',
        description: 'Updated description',
      })
    })

    await waitFor(() => {
      expect(result.current.projects[0].title).toBe('Updated Project')
    })

    expect(result.current.projects[0].description).toBe('Updated description')
  })

  it('deletes a project', async () => {
    const initialProjectsFromAPI = [
      {
        id: 1,
        title: 'Test Project',
        slug: 'test-project',
        description: 'Test description',
        content: 'Test content',
        category: 'WEB',
        techStack: '["React"]',
        githubUrl: 'https://github.com/test',
        demoUrl: 'https://test.demo.com',
        featured: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        title: 'Another Project',
        slug: 'another-project',
        description: 'Another description',
        content: 'Another content',
        category: 'MOBILE',
        techStack: '["React Native"]',
        githubUrl: 'https://github.com/another',
        demoUrl: 'https://another.demo.com',
        featured: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ]

    const projectsAfterDelete = [initialProjectsFromAPI[1]]

    // Mock initial fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialProjectsFromAPI,
    } as Response)

    // Mock delete project
    mockFetch.mockResolvedValueOnce({
      ok: true,
    } as Response)

    // Mock loadProjects after delete
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => projectsAfterDelete,
    } as Response)

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.deleteProject(1)
    })

    await waitFor(() => {
      expect(result.current.projects).toHaveLength(1)
    })

    expect(result.current.projects[0].slug).toBe('another-project')
  })

  it('resets data to mock data', async () => {
    // Initial projects (different from mock data)
    const initialProjects = [
      {
        id: 999,
        title: 'Custom Project',
        slug: 'custom-project',
        description: 'Custom description',
        content: 'Custom content',
        category: 'WEB',
        techStack: '["Custom Tech"]',
        githubUrl: 'https://github.com/custom',
        featured: false,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      },
    ]

    // Mock projects after reset (based on mock data)
    const resetProjects = mockProjects.map(project => ({
      ...project,
      techStack: JSON.stringify(project.techStack), // API format
      demoUrl: project.demoUrl || null,
      createdAt: project.createdAt || '2024-01-01T00:00:00.000Z',
      updatedAt: project.updatedAt || '2024-01-01T00:00:00.000Z',
    }))

    // Initial load returns custom projects
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => initialProjects,
    } as Response)

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify we start with custom project
    expect(result.current.projects).toHaveLength(1)
    expect(result.current.projects[0].title).toBe('Custom Project')

    // Mock reset API call and subsequent reload
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Reset successful' }),
      } as Response) // Reset API response
      .mockResolvedValueOnce({
        ok: true,
        json: async () => resetProjects,
      } as Response) // Reload projects response

    await act(async () => {
      await result.current.resetToMockData()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Verify projects were reset to mock data
    expect(result.current.projects).toHaveLength(mockProjects.length)
    
    // Check that each mock project is present with correct data
    mockProjects.forEach(mockProject => {
      const foundProject = result.current.projects.find(p => p.slug === mockProject.slug)
      expect(foundProject).toBeDefined()
      expect(foundProject?.title).toBe(mockProject.title)
      expect(foundProject?.category).toBe(mockProject.category)
      expect(foundProject?.featured).toBe(mockProject.featured)
      expect(foundProject?.techStack).toEqual(mockProject.techStack)
    })

    // Verify API calls were made correctly
    expect(mockFetch).toHaveBeenCalledWith('/api/projects/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('handles reset API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response)

    const { result } = renderHook(() => useProjects())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Mock failed reset API call
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    } as Response)

    await act(async () => {
      await expect(result.current.resetToMockData()).rejects.toThrow('Failed to reset database')
    })
  })
})
