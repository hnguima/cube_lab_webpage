import { NextResponse } from 'next/server'

// Mock Next.js server components
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
    })),
  },
}))

// Mock Prisma
jest.mock('../../../../lib/prisma', () => ({
  prisma: {
    project: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectImage: {
      deleteMany: jest.fn(),
    },
  },
}))

import { GET, PUT, DELETE } from '../../../../app/api/projects/[slug]/route'
import { prisma } from '../../../../lib/prisma'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('/api/projects/[slug]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/projects/[slug]', () => {
    it('should return a project by slug', async () => {
      const mockProject = {
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
        images: [],
      }

      const expectedProject = {
        ...mockProject,
        techStack: ['React', 'TypeScript'], // Parsed JSON
      }

      mockPrisma.project.findUnique.mockResolvedValue(mockProject)
      mockNextResponse.json.mockReturnValue({
        json: async () => expectedProject,
        status: 200,
      } as any)

      const mockRequest = {} as any
      const params = Promise.resolve({ slug: 'test-project' })

      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(expectedProject)
      expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-project' },
        include: {
          images: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
      })
    })

    it('should return 404 when project is not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null)
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Project not found' }),
        status: 404,
      } as any)

      const mockRequest = {} as any
      const params = Promise.resolve({ slug: 'nonexistent' })

      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data).toEqual({ error: 'Project not found' })
    })

    it('should handle database errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockPrisma.project.findUnique.mockRejectedValue(new Error('Database error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to fetch project' }),
        status: 500,
      } as any)

      const mockRequest = {} as any
      const params = Promise.resolve({ slug: 'test-project' })

      const response = await GET(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch project' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching project:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('PUT /api/projects/[slug]', () => {
    it('should update a project successfully', async () => {
      const updateData = {
        title: 'Updated Project',
        description: 'Updated description',
        techStack: ['React', 'Next.js'],
      }

      const updatedProject = {
        id: 1,
        title: 'Updated Project',
        slug: 'updated-project',
        description: 'Updated description',
        content: 'Test content',
        category: 'WEB',
        techStack: '["React","Next.js"]',
        githubUrl: 'https://github.com/test',
        demoUrl: 'https://test.demo.com',
        imageUrl: 'https://test.image.com',
        featured: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        images: [],
      }

      const expectedProject = {
        ...updatedProject,
        techStack: ['React', 'Next.js'], // Parsed JSON
      }

      mockPrisma.project.update.mockResolvedValue(updatedProject)
      mockNextResponse.json.mockReturnValue({
        json: async () => expectedProject,
        status: 200,
      } as any)

      const mockRequest = {
        json: jest.fn().mockResolvedValue(updateData),
      } as any
      const params = Promise.resolve({ slug: 'test-project' })

      const response = await PUT(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(expectedProject)
      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { slug: 'test-project' },
        data: {
          title: 'Updated Project',
          slug: 'updated-project',
          description: 'Updated description',
          techStack: '["React","Next.js"]',
          updatedAt: expect.any(Date),
        },
        include: {
          images: {
            orderBy: {
              orderIndex: 'asc',
            },
          },
        },
      })
    })

    it('should handle database errors during update', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockPrisma.project.update.mockRejectedValue(new Error('Database error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to update project' }),
        status: 500,
      } as any)

      const mockRequest = {
        json: jest.fn().mockResolvedValue({ title: 'Updated Title' }),
      } as any
      const params = Promise.resolve({ slug: 'test-project' })

      const response = await PUT(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to update project' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error updating project:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('DELETE /api/projects/[slug]', () => {
    it('should delete a project and its images successfully', async () => {
      mockPrisma.projectImage.deleteMany.mockResolvedValue({ count: 2 })
      mockPrisma.project.delete.mockResolvedValue({
        id: 1,
        title: 'Deleted Project',
        slug: 'deleted-project',
        description: 'Deleted description',
        content: 'Deleted content',
        category: 'WEB',
        techStack: '["React"]',
        githubUrl: 'https://github.com/test',
        demoUrl: 'https://test.demo.com',
        imageUrl: 'https://test.image.com',
        featured: false,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      })
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ message: 'Project deleted successfully' }),
        status: 200,
      } as any)

      const mockRequest = {} as any
      const params = Promise.resolve({ slug: 'test-project' })

      const response = await DELETE(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ message: 'Project deleted successfully' })
      
      // Verify images are deleted first
      expect(mockPrisma.projectImage.deleteMany).toHaveBeenCalledWith({
        where: {
          project: {
            slug: 'test-project',
          },
        },
      })
      
      // Then project is deleted
      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
        where: {
          slug: 'test-project',
        },
      })
    })

    it('should handle database errors during deletion', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockPrisma.projectImage.deleteMany.mockRejectedValue(new Error('Database error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to delete project' }),
        status: 500,
      } as any)

      const mockRequest = {} as any
      const params = Promise.resolve({ slug: 'test-project' })

      const response = await DELETE(mockRequest, { params })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to delete project' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error deleting project:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })
})
