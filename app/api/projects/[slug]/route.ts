import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const project = await prisma.project.findUnique({
      where: {
        slug: slug
      },
      include: {
        images: {
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Parse techStack JSON
    const projectWithParsedTechStack = {
      ...project,
      techStack: JSON.parse(project.techStack || '[]')
    }

    return NextResponse.json(projectWithParsedTechStack)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { title, description, content, category, techStack, githubUrl, demoUrl, imageUrl, featured } = body

    // Generate new slug if title changed
    const newSlug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : slug

    const project = await prisma.project.update({
      where: {
        slug: slug
      },
      data: {
        ...(title && { title, slug: newSlug }),
        ...(description !== undefined && { description }),
        ...(content !== undefined && { content }),
        ...(category && { category }),
        ...(techStack && { techStack: JSON.stringify(techStack) }),
        ...(githubUrl !== undefined && { githubUrl }),
        ...(demoUrl !== undefined && { demoUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(featured !== undefined && { featured }),
        updatedAt: new Date()
      },
      include: {
        images: {
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    })

    // Parse techStack JSON
    const projectWithParsedTechStack = {
      ...project,
      techStack: JSON.parse(project.techStack || '[]')
    }

    return NextResponse.json(projectWithParsedTechStack)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    // Delete related images first
    await prisma.projectImage.deleteMany({
      where: {
        project: {
          slug: slug
        }
      }
    })
    
    // Delete the project
    await prisma.project.delete({
      where: {
        slug: slug
      }
    })

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
