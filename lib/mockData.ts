// Temporary static data until database is working
export const mockProjects = [
  {
    id: 1,
    title: '3D Printer Control System',
    slug: '3d-printer-control-system',
    description: 'Custom firmware and control interface for a DIY 3D printer',
    content: `# 3D Printer Control System

A comprehensive control system built from scratch for a custom 3D printer project.

## Overview
This project involved developing both firmware and software components to control a DIY 3D printer build.

## Technical Implementation
- **Firmware**: Written in C++ for Arduino-compatible microcontroller
- **Interface**: React-based web interface for remote control
- **Communication**: WebSocket connection for real-time updates
- **Features**: Temperature monitoring, print progress tracking, emergency stop

## Challenges Solved
- Real-time temperature control algorithms
- Precise motor control for print head positioning
- User-friendly interface for complex operations

## Results
Successfully created a fully functional 3D printer with professional-grade control software.`,
    category: 'HARDWARE',
    techStack: ['C++', 'Arduino', 'React', 'WebSockets'],
    githubUrl: 'https://github.com/example/3d-printer',
    featured: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    images: []
  },
  {
    id: 2,
    title: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'Modern portfolio website with blog-like project showcases',
    content: `# Portfolio Website

Built with Next.js 15 and modern web technologies to showcase projects and skills.

## Features
- **Dynamic Content**: Database-driven project management
- **Modern Design**: Clean, responsive interface
- **Blog-like Posts**: Detailed project writeups
- **Performance**: Optimized for speed and SEO

## Technical Stack
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma for database management
- SQLite for development

## Implementation Details
The site uses server-side rendering for optimal performance and SEO, while incorporating client-side interactivity where needed.`,
    category: 'WEB',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
    githubUrl: 'https://github.com/example/portfolio',
    demoUrl: 'https://portfolio.example.com',
    featured: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
    images: []
  },
  {
    id: 3,
    title: 'IoT Sensor Network',
    slug: 'iot-sensor-network',
    description: 'Wireless sensor network for environmental monitoring',
    content: `# IoT Sensor Network

Distributed system for collecting environmental data using wireless sensors.

## System Architecture
- **Sensors**: ESP32-based nodes with various environmental sensors
- **Communication**: MQTT protocol for data transmission
- **Backend**: Python data processing pipeline
- **Storage**: Time-series database for sensor readings

## Sensor Types
- Temperature and humidity
- Air quality (PM2.5, CO2)
- Light levels
- Soil moisture (for agricultural applications)

## Data Processing
Real-time data analysis with alerting for threshold violations and trend analysis for long-term monitoring.`,
    category: 'HARDWARE',
    techStack: ['C', 'ESP32', 'MQTT', 'Python'],
    githubUrl: 'https://github.com/example/iot-sensors',
    featured: true,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    images: []
  },
  {
    id: 4,
    title: 'Task Management App',
    slug: 'task-management-app',
    description: 'Cross-platform mobile app for project management',
    content: `# Task Management App

Intuitive mobile application for managing tasks and projects across teams.

## Features
- **Cross-platform**: iOS and Android support
- **Real-time sync**: Instant updates across devices
- **Team collaboration**: Shared projects and assignments
- **Offline support**: Work without internet connection

## Technical Implementation
Built with React Native for cross-platform compatibility, with Firebase providing backend services for authentication, data storage, and real-time synchronization.`,
    category: 'MOBILE',
    techStack: ['React Native', 'TypeScript', 'Firebase'],
    githubUrl: 'https://github.com/example/task-app',
    featured: false,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-04-01T00:00:00Z',
    images: []
  }
];

export const mockSkills = [
  // Languages
  { id: 1, name: 'C', category: 'LANGUAGES', proficiency: 9 },
  { id: 2, name: 'C++', category: 'LANGUAGES', proficiency: 8 },
  { id: 3, name: 'Python', category: 'LANGUAGES', proficiency: 9 },
  { id: 4, name: 'JavaScript', category: 'LANGUAGES', proficiency: 8 },
  { id: 5, name: 'TypeScript', category: 'LANGUAGES', proficiency: 8 },
  
  // Frameworks
  { id: 6, name: 'React', category: 'FRAMEWORKS', proficiency: 9 },
  { id: 7, name: 'Next.js', category: 'FRAMEWORKS', proficiency: 8 },
  
  // Tools
  { id: 8, name: 'AWS', category: 'TOOLS', proficiency: 7 },
  { id: 9, name: 'Git', category: 'TOOLS', proficiency: 9 },
  
  // Databases
  { id: 10, name: 'MySQL', category: 'DATABASES', proficiency: 7 },
  { id: 11, name: 'SQLite', category: 'DATABASES', proficiency: 8 },
];
