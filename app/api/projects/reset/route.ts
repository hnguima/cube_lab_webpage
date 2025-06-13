import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { mockProjects, mockSkills } from "../../../../lib/mockData";
import { SkillCategory, Category } from "@prisma/client";

export async function POST() {
  try {
    // Clear existing data
    await prisma.project.deleteMany();
    await prisma.skill.deleteMany();

    // Recreate skills from mock data
    await prisma.skill.createMany({
      data: mockSkills.map((skill) => ({
        name: skill.name,
        category: skill.category as SkillCategory,
        proficiency: skill.proficiency,
      })),
    });

    // Recreate projects from mock data
    for (const project of mockProjects) {
      await prisma.project.create({
        data: {
          title: project.title,
          slug: project.slug,
          description: project.description,
          content: project.content,
          category: project.category as Category,
          techStack: JSON.stringify(project.techStack),
          githubUrl: project.githubUrl,
          demoUrl: project.demoUrl ?? null,
          featured: project.featured,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database reset to mock data successfully",
      projectsCount: mockProjects.length,
      skillsCount: mockSkills.length,
    });
  } catch (error) {
    console.error("Error resetting database:", error);
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
