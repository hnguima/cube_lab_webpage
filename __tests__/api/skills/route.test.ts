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
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    skill: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

import { GET, POST } from '../../../app/api/skills/route'
import { prisma } from '../../../lib/prisma'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('/api/skills', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/skills', () => {
    it('should return all skills ordered by category and name', async () => {
      const mockSkills = [
        {
          id: 1,
          name: 'JavaScript',
          category: 'Programming Languages',
          proficiency: 90,
          iconUrl: 'https://example.com/js-icon.png',
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-01'),
        },
        {
          id: 2,
          name: 'React',
          category: 'Frameworks',
          proficiency: 85,
          iconUrl: 'https://example.com/react-icon.png',
          createdAt: new Date('2023-01-02'),
          updatedAt: new Date('2023-01-02'),
        },
      ]

      mockPrisma.skill.findMany.mockResolvedValue(mockSkills)
      mockNextResponse.json.mockReturnValue({
        json: async () => mockSkills,
        status: 200,
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockSkills)
      expect(mockPrisma.skill.findMany).toHaveBeenCalledWith({
        orderBy: [
          { category: 'asc' },
          { name: 'asc' },
        ],
      })
    })

    it('should handle database errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockPrisma.skill.findMany.mockRejectedValue(new Error('Database connection error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to fetch skills' }),
        status: 500,
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch skills' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching skills:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })

  describe('POST /api/skills', () => {
    it('should create a new skill successfully', async () => {
      const newSkill = {
        name: 'Vue.js',
        category: 'Frameworks',
        proficiency: 75,
        iconUrl: 'https://example.com/vue-icon.png',
      }

      const createdSkill = {
        id: 4,
        ...newSkill,
        createdAt: new Date('2023-01-04'),
        updatedAt: new Date('2023-01-04'),
      }

      mockPrisma.skill.create.mockResolvedValue(createdSkill)
      mockNextResponse.json.mockReturnValue({
        json: async () => createdSkill,
        status: 201,
      } as any)

      const mockRequest = {
        json: jest.fn().mockResolvedValue(newSkill),
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(createdSkill)
      expect(mockPrisma.skill.create).toHaveBeenCalledWith({
        data: newSkill,
      })
    })

    it('should handle database errors during creation', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      const newSkill = {
        name: 'Error Skill',
        category: 'Test',
        proficiency: 50,
      }

      mockPrisma.skill.create.mockRejectedValue(new Error('Database constraint error'))
      mockNextResponse.json.mockReturnValue({
        json: async () => ({ error: 'Failed to create skill' }),
        status: 500,
      } as any)

      const mockRequest = {
        json: jest.fn().mockResolvedValue(newSkill),
      } as any

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create skill' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating skill:', expect.any(Error))
      
      consoleErrorSpy.mockRestore()
    })
  })
})
