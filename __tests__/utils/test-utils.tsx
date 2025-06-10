import { render, RenderOptions } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ReactElement } from 'react'

// Custom render function that includes providers if needed
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common test data
export const mockProject = {
  id: 1,
  title: 'Test Project',
  slug: 'test-project',
  description: 'A test project for testing purposes',
  content: '# Test Project\n\nThis is a test project.',
  category: 'WEB' as const,
  techStack: ['React', 'TypeScript', 'Jest'],
  githubUrl: 'https://github.com/test/test-project',
  demoUrl: 'https://test-project.demo.com',
  featured: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockSkill = {
  id: 1,
  name: 'TypeScript',
  category: 'LANGUAGES' as const,
  proficiency: 9,
}

export const mockProjects = [
  mockProject,
  {
    ...mockProject,
    id: 2,
    title: 'Second Project',
    slug: 'second-project',
    featured: false,
    category: 'MOBILE' as const,
  },
]

export const mockSkills = [
  mockSkill,
  {
    id: 2,
    name: 'React',
    category: 'FRAMEWORKS' as const,
    proficiency: 8,
  },
]

// Simple test to verify this file works
describe('Test Utils', () => {
  it('should export mock data correctly', () => {
    expect(mockProject.title).toBe('Test Project')
    expect(mockProjects).toHaveLength(2)
    expect(mockSkills).toHaveLength(2)
  })
})
