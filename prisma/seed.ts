import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample skills
  const skills = await prisma.skill.createMany({
    data: [
      // Languages
      { name: 'C', category: 'LANGUAGES', proficiency: 9 },
      { name: 'C++', category: 'LANGUAGES', proficiency: 8 },
      { name: 'Python', category: 'LANGUAGES', proficiency: 9 },
      { name: 'JavaScript', category: 'LANGUAGES', proficiency: 8 },
      { name: 'TypeScript', category: 'LANGUAGES', proficiency: 8 },
      
      // Frameworks
      { name: 'React', category: 'FRAMEWORKS', proficiency: 9 },
      { name: 'Next.js', category: 'FRAMEWORKS', proficiency: 8 },
      
      // Tools
      { name: 'AWS', category: 'TOOLS', proficiency: 7 },
      { name: 'Git', category: 'TOOLS', proficiency: 9 },
      
      // Databases
      { name: 'MySQL', category: 'DATABASES', proficiency: 7 },
      { name: 'SQLite', category: 'DATABASES', proficiency: 8 },
    ]
  })

  // Create sample projects
  const projects = [
    {
      title: '3D Printer Control System',
      slug: '3d-printer-control-system',
      description: 'Custom firmware and control interface for a DIY 3D printer',
      content: '# 3D Printer Control System\n\nA comprehensive control system built from scratch...',
      category: 'HARDWARE',
      techStack: JSON.stringify(['C++', 'Arduino', 'React', 'WebSockets']),
      githubUrl: 'https://github.com/example/3d-printer',
      featured: true
    },
    {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description: 'Modern portfolio website with blog-like project showcases',
      content: '# Portfolio Website\n\nBuilt with Next.js 15 and modern web technologies...',
      category: 'WEB',
      techStack: JSON.stringify(['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma']),
      githubUrl: 'https://github.com/example/portfolio',
      demoUrl: 'https://portfolio.example.com',
      featured: true
    },
    {
      title: 'IoT Sensor Network',
      slug: 'iot-sensor-network',
      description: 'Wireless sensor network for environmental monitoring',
      content: '# IoT Sensor Network\n\nDistributed system for collecting environmental data...',
      category: 'HARDWARE',
      techStack: JSON.stringify(['C', 'ESP32', 'MQTT', 'Python']),
      githubUrl: 'https://github.com/example/iot-sensors',
      featured: true
    },
    {
      title: 'Task Management App',
      slug: 'task-management-app',
      description: 'Cross-platform mobile app for project management',
      content: '# Task Management App\n\nIntuitive mobile application for managing tasks...',
      category: 'MOBILE',
      techStack: JSON.stringify(['React Native', 'TypeScript', 'Firebase']),
      githubUrl: 'https://github.com/example/task-app',
      featured: false
    }
  ]

  for (const projectData of projects) {
    await prisma.project.create({
      data: projectData
    })
  }

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
