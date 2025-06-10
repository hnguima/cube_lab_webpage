import { NextRequest, NextResponse } from 'next/server'

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}))

// Mock Prisma
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { GET, POST } from '../../../app/api/projects/route'
import { prisma } from '../../../lib/prisma'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('/api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects', () => {
    it('should return all projects with images', async () => {
      const mockProjects = [
        {
          id: 1,
          title: 'Test Project',
          slug: 'test-project',
          description: 'Test description',
          content: 'Test content',
          category: 'WEB',
          techStack: '["React", "TypeScript"]',
          githubUrl: 'https://github.com/test',
          demoUrl: 'https://test.demo.com',
          imageUrl: 'https://test.image.com',
          featured: true,
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
          images: [
            {
              id: 1,
              url: 'https://test.image.com',
              alt: 'Test image',
              orderIndex: 0,
              projectId: 1,
            },
          ],
        },
      ]

      mockPrisma.project.findMany.mockResolvedValue(mockProjects)
      mockNextResponse.json.mockReturnValue({
        json: async () => mockProjects,
        status: 200,
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockProjects)
      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        include: {
          images: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('should handle database errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockPrisma.project.findMany.mockRejectedValue(new Error('Database error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to fetch projects' }),
        status: 500,
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch projects' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching projects:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('POST /api/projects', () => {
    it('should create a new project successfully', async () => {
      const newProject = {
        title: 'New Project',
        description: 'New description',
        content: 'New content',
        category: 'WEB',
        techStack: ['React', 'TypeScript'],
        githubUrl: 'https://github.com/test/new',
        demoUrl: 'https://new.demo.com',
        imageUrl: 'https://new.image.com',
        featured: false,
      }

      const createdProject = {
        id: 2,
        ...newProject,
        slug: 'new-project',
        techStack: '["React","TypeScript"]',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02'),
        images: [],
      }

      mockPrisma.project.create.mockResolvedValue(createdProject)
      mockNextResponse.json.mockReturnValue({
        json: async () => createdProject,
        status: 201,
      } as any)

      // Mock the request object
      const mockRequest = {
        json: jest.fn().mockResolvedValue(newProject),
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(createdProject)
      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: {
          title: 'New Project',
          slug: 'new-project',
          description: 'New description',
          content: 'New content',
          category: 'WEB',
          techStack: '["React","TypeScript"]',
          githubUrl: 'https://github.com/test/new',
          demoUrl: 'https://new.demo.com',
          imageUrl: 'https://new.image.com',
          featured: false,
        },
        include: {
          images: true,
        },
      })
    })

    it('should generate proper slug from title', async () => {
      const projectWithComplexTitle = {
        title: 'Complex Title with Special Characters! & Numbers 123',
        description: 'Test description',
        content: 'Test content',
        category: 'WEB',
      }

      const createdProject = {
        id: 4,
        ...projectWithComplexTitle,
        slug: 'complex-title-with-special-characters-numbers-123',
        techStack: '[]',
        featured: false,
        createdAt: new Date('2023-01-04'),
        updatedAt: new Date('2023-01-04'),
        images: [],
      }

      mockPrisma.project.create.mockResolvedValue(createdProject)
      mockNextResponse.json.mockReturnValue({
        json: async () => createdProject,
        status: 201,
      } as any)

      const mockRequest = {
        json: jest.fn().mockResolvedValue(projectWithComplexTitle),
      } as any

      const response = await POST(mockRequest)

      expect(response.status).toBe(201)
      expect(mockPrisma.project.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            slug: 'complex-title-with-special-characters-numbers-123',
          }),
        })
      )
    })

    it('should handle database errors during creation', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const newProject = {
        title: 'Error Project',
        description: 'Error description',
        content: 'Error content',
        category: 'WEB',
      }

      mockPrisma.project.create.mockRejectedValue(new Error('Database constraint error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to create project' }),
        status: 500,
      } as any)

      const mockRequest = {
        json: jest.fn().mockResolvedValue(newProject),
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create project' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating project:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })
})
