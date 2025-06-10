import { mockProjects, mockSkills } from '../../../lib/mockData';

// Mock Prisma before importing anything that uses it
jest.mock('../../../lib/prisma', () => ({
  prisma: {
    project: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    skill: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

// Import handler after mocking dependencies
import { POST } from '../../../app/api/projects/reset/route';
import { prisma } from '../../../lib/prisma';

// Get the mocked functions
const mockProjectDeleteMany = prisma.project.deleteMany as jest.MockedFunction<typeof prisma.project.deleteMany>;
const mockSkillDeleteMany = prisma.skill.deleteMany as jest.MockedFunction<typeof prisma.skill.deleteMany>;
const mockSkillCreateMany = prisma.skill.createMany as jest.MockedFunction<typeof prisma.skill.createMany>;
const mockProjectCreate = prisma.project.create as jest.MockedFunction<typeof prisma.project.create>;

describe('/api/projects/reset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reset database to mock data on POST request', async () => {
    // Mock successful database operations
    mockProjectDeleteMany.mockResolvedValue({ count: 2 });
    mockSkillDeleteMany.mockResolvedValue({ count: 3 });
    mockSkillCreateMany.mockResolvedValue({ count: mockSkills.length });
    mockProjectCreate.mockResolvedValue({});

    const response = await POST();
    const data = await response.json();

    // Verify database operations were called in correct order
    expect(mockProjectDeleteMany).toHaveBeenCalledTimes(1);
    expect(mockSkillDeleteMany).toHaveBeenCalledTimes(1);
    expect(mockSkillCreateMany).toHaveBeenCalledWith({
      data: mockSkills.map(skill => ({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      }))
    });

    // Verify all mock projects were created
    expect(mockProjectCreate).toHaveBeenCalledTimes(mockProjects.length);
    
    // Check that each mock project was created with correct data
    mockProjects.forEach((project, index) => {
      expect(mockProjectCreate).toHaveBeenNthCalledWith(index + 1, {
        data: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          category: project.category,
          techStack: JSON.stringify(project.techStack),
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl || null,
          featured: project.featured
        }
      });
    });

    // Verify response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      message: 'Database reset to mock data successfully',
      projectsCount: mockProjects.length,
      skillsCount: mockSkills.length
    });
  });

  it('should handle database errors gracefully', async () => {
    // Mock database error
    mockProjectDeleteMany.mockRejectedValue(new Error('Database connection failed'));

    const response = await POST();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'Failed to reset database'
    });
  });

  it('should verify mock data integrity', () => {
    // Ensure mock data has the expected structure
    expect(mockProjects).toHaveLength(4);
    expect(mockSkills).toHaveLength(11);

    // Verify all required fields are present in mock projects
    mockProjects.forEach(project => {
      expect(project).toHaveProperty('title');
      expect(project).toHaveProperty('slug');
      expect(project).toHaveProperty('description');
      expect(project).toHaveProperty('content');
      expect(project).toHaveProperty('category');
      expect(project).toHaveProperty('techStack');
      expect(project).toHaveProperty('featured');
      expect(Array.isArray(project.techStack)).toBe(true);
    });

    // Verify all required fields are present in mock skills
    mockSkills.forEach(skill => {
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('category');
      expect(skill).toHaveProperty('proficiency');
      expect(typeof skill.proficiency).toBe('number');
      expect(skill.proficiency).toBeGreaterThanOrEqual(1);
      expect(skill.proficiency).toBeLessThanOrEqual(10);
    });
  });
});
