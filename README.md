# 🚀 Cube Lab - Developer Portfolio Website

A modern developer portfolio website built with Next.js 15, TypeScript, Tailwind CSS, and Prisma database integration.

## ✨ Features

- **Dynamic Homepage** - Hero section, featured projects, and skills showcase
- **Admin Interface** - Full CRUD operations for managing projects
- **Project Detail Pages** - Individual pages for each project with markdown content
- **Database Integration** - Prisma ORM with SQLite for data persistence
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Skills Showcase** - Categorized skills with proficiency levels

## 🏗️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Prisma ORM** - Database management and queries
- **SQLite** - Local development database

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd cube_lab_webpage
   npm install
   ```

2. **Set up database**
   ```bash
   npx prisma generate
   npm run db:seed
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

## 📁 Key Files

```
app/
├── page.tsx              # Homepage
├── admin/page.tsx        # Project management
├── api/projects/         # Project API endpoints
└── projects/[slug]/      # Dynamic project pages

lib/
├── useProjects.ts        # Project management hook
└── mockData.ts          # Sample data

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seeding
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

## 🌐 API Endpoints

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[slug]` - Get project by slug
- `PUT /api/projects/[slug]` - Update project
- `DELETE /api/projects/[slug]` - Delete project

## 📱 Pages

- **Homepage (`/`)** - Hero, featured projects, skills, contact
- **Admin Panel (`/admin`)** - Project management interface
- **Project Details (`/projects/[slug]`)** - Individual project pages

## 📋 Current Status

### ✅ Completed
- [x] Core homepage with dynamic content
- [x] Database integration with Prisma
- [x] Admin interface for project management
- [x] Dynamic project detail pages
- [x] Skills showcase with proficiency levels
- [x] Responsive design foundation
- [x] Complete API routes for CRUD operations

### 🚧 In Progress
- [ ] About Me section with timeline
- [ ] Fixed navigation header
- [ ] Signature cube design elements
- [ ] Framer Motion animations
- [ ] Image upload system
- [ ] Contact form functionality

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
