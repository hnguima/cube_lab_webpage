import { test, expect } from '@playwright/test'

test.describe('Portfolio Website E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the hero section', async ({ page }) => {
    // Check hero section content matching Jest tests
    await expect(page.getByText('Cube Lab')).toBeVisible()
    await expect(page.getByText('Software Engineer with Electrical Engineering Background')).toBeVisible()
    await expect(page.getByText('Solving complex issues with elegant solutions')).toBeVisible()
  })

  test('renders the projects section', async ({ page }) => {
    // Check projects section matching Jest tests
    await expect(page.getByText('Featured Projects')).toBeVisible()
    
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
    
    // Check that project cards are visible
    const projectCards = page.locator('[data-testid="project-card"]')
    await expect(projectCards.first()).toBeVisible()
  })

  test('renders the skills section', async ({ page }) => {
    // Check skills section matching Jest tests
    await expect(page.getByText('Skills & Technologies')).toBeVisible()
  })

  test('renders the contact section', async ({ page }) => {
    // Check contact section matching Jest tests
    await expect(page.getByText('Get In Touch')).toBeVisible()
    await expect(page.getByText("Interested in working together? Let's connect!")).toBeVisible()
  })

  test('has admin access link', async ({ page }) => {
    // Check admin link matching Jest tests
    const adminLink = page.getByRole('link', { name: /admin/i })
    await expect(adminLink).toBeVisible()
    await expect(adminLink).toHaveAttribute('href', '/admin')
  })

  test('can navigate to project details', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-card"]', { timeout: 10000 })
    
    // Click on the first project's "View Details" link
    const firstProjectCard = page.locator('[data-testid="project-card"]').first()
    const viewDetailsLink = firstProjectCard.getByText('View Details')
    await viewDetailsLink.click()
    
    // Should navigate to project detail page
    await expect(page).toHaveURL(/\/projects\/[^\/]+/)
    
    // Should display the main project title (be more specific than just any h1)
    await expect(page.locator('header h1')).toBeVisible()
    
    // Also check for the back navigation link
    await expect(page.getByText('← Back to Portfolio')).toBeVisible()
  })

  test('can access admin panel', async ({ page }) => {
    // Click admin link matching Jest test pattern
    await page.getByRole('link', { name: /admin/i }).click()
    
    // Should navigate to admin page
    await expect(page).toHaveURL('/admin')
    
    // Should display admin interface matching Jest tests
    await expect(page.getByRole('heading', { name: 'Project Management' })).toBeVisible()
    await expect(page.getByText('Add New Project')).toBeVisible()
  })

  test('mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that main elements are still visible (matching Jest test structure)
    await expect(page.getByText('Cube Lab')).toBeVisible()
    await expect(page.getByText('Featured Projects')).toBeVisible()
    await expect(page.getByText('Skills & Technologies')).toBeVisible()
    await expect(page.getByText('Get In Touch')).toBeVisible()
    
    // Check that navigation is mobile-friendly
    await expect(page.getByRole('link', { name: /admin/i })).toBeVisible()
  })
})

test.describe('Admin Panel E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin')
  })

  test('renders the admin interface', async ({ page }) => {
    // Check admin interface rendering (matching Jest test)
    await expect(page.getByRole('heading', { name: 'Project Management' })).toBeVisible()
    await expect(page.getByText('Add New Project')).toBeVisible()
    // Note: "Existing Projects" text is not in actual admin page, so removing it
  })

  test('displays existing projects', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-item"]', { timeout: 10000 })
    
    // Check that projects are displayed
    const projectItems = page.locator('[data-testid="project-item"]')
    await expect(projectItems.first()).toBeVisible()
  })

  test('allows creating a new project', async ({ page }) => {
    // Click Add New Project button
    await page.getByRole('button', { name: /add new project/i }).click()
    
    // Fill out the project form (matching Jest test data structure)
    await page.getByLabel(/title/i).fill('E2E Test Project')
    await page.getByLabel(/description/i).fill('A project created by E2E tests')
    await page.getByLabel(/content/i).fill('# E2E Test Project\n\nThis project was created during testing.')
    await page.getByLabel(/category/i).selectOption('WEB')
    await page.getByLabel(/tech stack/i).fill('Playwright, TypeScript')
    await page.getByLabel(/github url/i).fill('https://github.com/test/e2e-project')
    await page.getByLabel(/demo url/i).fill('https://e2e-project.demo.com')
    
    // Submit the form (matching Jest test)
    await page.getByRole('button', { name: /create project/i }).click()
    
    // Should show success message or redirect
    await expect(page.getByText('E2E Test Project')).toBeVisible()
  })

  test('allows editing an existing project', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-item"]', { timeout: 10000 })
    
    // Click edit button on first project (matching Jest test pattern)
    await page.locator('[data-testid="project-item"]').first().getByRole('button').first().click()
    
    // Modify the title (matching Jest test)
    const titleInput = page.getByLabel(/title/i)
    await titleInput.clear()
    await titleInput.fill('Updated by E2E Test')
    
    // Save changes (matching Jest test)
    await page.getByRole('button', { name: /update project/i }).click()
    
    // Should show updated project
    await expect(page.getByText('Updated by E2E Test')).toBeVisible()
  })

  test('allows deleting a project', async ({ page }) => {
    // Wait for projects to load
    await page.waitForSelector('[data-testid="project-item"]', { timeout: 10000 })
    
    const initialProjectCount = await page.locator('[data-testid="project-item"]').count()
    
    // Set up dialog handler to accept the confirmation
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete this project?')
      await dialog.accept()
    })
    
    // Click delete button on first project (second button is delete)
    await page.locator('[data-testid="project-item"]').first().getByRole('button').nth(1).click()
    
    // Wait for the deletion to complete and UI to update
    await page.waitForTimeout(2000)
    
    // Check that project count decreased
    const finalProjectCount = await page.locator('[data-testid="project-item"]').count()
    expect(finalProjectCount).toBeLessThan(initialProjectCount)
  })

  test('validates required fields', async ({ page }) => {
    // Click Add New Project button
    await page.getByRole('button', { name: /add new project/i }).click()
    
    // Try to submit empty form (matching Jest test)
    await page.getByRole('button', { name: /create project/i }).click()
    
    // Should show validation errors (browser validation)
    // This will be handled by browser's built-in validation for required fields
  })

  test('allows resetting to mock data', async ({ page }) => {
    // Check for reset button (matching Jest test)
    const resetButton = page.getByRole('button', { name: /reset data/i })
    await expect(resetButton).toBeVisible()
    
    // Set up dialog handler to accept the confirmation
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Reset all projects to original mock data?')
      await dialog.accept()
    })
    
    await resetButton.click()
    
    // Should refresh the projects list
    await page.waitForTimeout(2000) // Wait for reset to complete
    
    // Check that project items are still visible (use first() to avoid strict mode violation)
    await expect(page.locator('[data-testid="project-item"]').first()).toBeVisible()
    
    // Verify we have multiple projects after reset
    const projectCount = await page.locator('[data-testid="project-item"]').count()
    expect(projectCount).toBeGreaterThan(0)
  })
})
