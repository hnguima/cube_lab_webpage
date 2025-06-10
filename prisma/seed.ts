import { PrismaClient } from '@prisma/client'
import { mockProjects, mockSkills } from '../lib/mockData'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.project.deleteMany()
  await prisma.skill.deleteMany()

  // Create skills from mock data
  const skills = await prisma.skill.createMany({
    data: mockSkills.map(skill => ({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency
    }))
  })

  console.log(`Created ${mockSkills.length} skills`)

  // Create projects from mock data
  for (const project of mockProjects) {
    await prisma.project.create({
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
    })
  }

  console.log(`Created ${mockProjects.length} projects`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
