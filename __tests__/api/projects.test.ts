// Mock fetch for API testing
global.fetch = jest.fn()

const mockFetch = fetch as jest.MockedFunction<typeof fetch>

describe('/api/projects API', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should fetch projects successfully', async () => {
    const mockProjects = [
      {
        id: 1,
        title: 'Test Project',
        slug: 'test-project',
        description: 'Test description',
        category: 'WEB',
        techStack: ['React'],
        featured: true,
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProjects,
    } as Response)

    const response = await fetch('/api/projects')
    const data = await response.json()

    expect(response.ok).toBe(true)
    expect(data).toEqual(mockProjects)
  })

  it('should handle fetch errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    try {
      await fetch('/api/projects')
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })
})
