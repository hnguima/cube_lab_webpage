# 🧪 Testing Environment Documentation

This document outlines the comprehensive testing setup for the Cube Lab portfolio website, including unit tests, integration tests, and end-to-end testing.

## 🏗️ Testing Architecture

### **Testing Pyramid**
```
    /\
   /  \     E2E Tests (Playwright)
  /____\    ↑ High-level user journeys
 /      \   
/________\   Integration Tests (Jest + RTL)
           ↑ Component interactions, API routes
          
Unit Tests (Jest + RTL)
↑ Individual functions, hooks, components
```

## 📚 Testing Stack

### **Unit & Integration Testing**
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **@testing-library/jest-dom** - Additional DOM matchers

### **End-to-End Testing**
- **Playwright** - Cross-browser E2E testing
- **Multiple browsers** - Chromium, Firefox, WebKit
- **Mobile testing** - Responsive design validation

### **Mocking & Utilities**
- **Global mocks** - Next.js navigation, Prisma client, Web APIs
- **Test utilities** - Custom render functions, mock data
- **Coverage reporting** - Code coverage analysis

## 🎯 Test Categories

### **1. Unit Tests**
Test individual components, functions, and hooks in isolation.

**Location**: `__tests__/`
- `hooks/` - Custom hook testing
- `utils/` - Utility function testing
- Components (when created)

**Example**:
```bash
npm test useProjects.test.ts
```

### **2. Integration Tests**
Test component interactions, API routes, and data flow.

**Location**: `__tests__/`
- `api/` - API route testing
- `pages/` - Page component testing

**Example**:
```bash
npm test AdminPage.test.tsx
```

### **3. End-to-End Tests**
Test complete user journeys across browsers.

**Location**: `e2e/`
- `portfolio.spec.ts` - Main user flows

**Example**:
```bash
npm run test:e2e
```

## 🚀 Available Test Commands

```bash
# Unit & Integration Tests
npm test                    # Run all Jest tests once
npm run test:watch          # Run tests in watch mode
npm run test:coverage       # Run tests with coverage report
npm run test:ci             # Run tests for CI/CD

# End-to-End Tests
npm run test:e2e            # Run Playwright tests headless
npm run test:e2e:ui         # Run with Playwright UI
npm run test:e2e:debug      # Run in debug mode
npm run playwright:install # Install browser dependencies
```

## 📂 Test File Structure

```
__tests__/
├── utils/
│   └── test-utils.tsx      # Custom render & mock data
├── hooks/
│   └── useProjects.test.ts # Hook testing
├── api/
│   └── projects.test.ts    # API route testing
└── pages/
    ├── HomePage.test.tsx   # Homepage testing
    └── AdminPage.test.tsx  # Admin panel testing

e2e/
└── portfolio.spec.ts       # End-to-end scenarios

jest.config.js              # Jest configuration
jest.setup.js               # Global test setup
playwright.config.ts        # Playwright configuration
```

## 🔧 Configuration Files

### **Jest Configuration** (`jest.config.js`)
- Next.js integration with `next/jest`
- jsdom environment for DOM testing
- Module path mapping for imports
- Coverage collection settings
- Global setup file configuration

### **Jest Setup** (`jest.setup.js`)
- Testing Library DOM matchers
- Global mocks (Web APIs, Next.js, Prisma)
- Utility configurations

### **Playwright Configuration** (`playwright.config.ts`)
- Multi-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automatic dev server startup
- Test reporting and traces

## 🧪 Writing Tests

### **Component Testing Example**
```typescript
import { render, screen, userEvent } from '../utils/test-utils'
import MyComponent from '../../components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)
    
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Clicked!')).toBeInTheDocument()
  })
})
```

### **API Route Testing Example**
```typescript
import { createMocks } from 'node-mocks-http'
import handler from '../../app/api/projects/route'

describe('/api/projects', () => {
  it('returns projects list', async () => {
    const { req } = createMocks({ method: 'GET' })
    const response = await handler.GET(req)
    
    expect(response.status).toBe(200)
  })
})
```

### **E2E Testing Example**
```typescript
import { test, expect } from '@playwright/test'

test('user can create project', async ({ page }) => {
  await page.goto('/admin')
  
  await page.getByLabel('Title').fill('New Project')
  await page.getByRole('button', { name: 'Add Project' }).click()
  
  await expect(page.getByText('New Project')).toBeVisible()
})
```

## 📊 Test Coverage

### **Running Coverage**
```bash
npm run test:coverage
```

### **Coverage Reports**
- **Terminal** - Summary in console
- **HTML Report** - `coverage/lcov-report/index.html`
- **LCOV** - `coverage/lcov.info` for CI/CD

### **Coverage Targets**
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## 🎭 Mock Data & Utilities

### **Test Utilities** (`__tests__/utils/test-utils.tsx`)
```typescript
// Custom render with providers
export const render = (ui, options) => 
  rtlRender(ui, { ...options })

// Mock project data
export const mockProject = {
  id: 1,
  title: 'Test Project',
  slug: 'test-project',
  // ... rest of properties
}
```

### **Global Mocks** (`jest.setup.js`)
- **Next.js Navigation** - `useRouter`, `usePathname`
- **Prisma Client** - Database operations
- **Web APIs** - `IntersectionObserver`, `ResizeObserver`
- **Media Queries** - `window.matchMedia`

## 🔄 CI/CD Integration

### **GitHub Actions Example**
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
```

### **Pre-commit Hooks** (Recommended)
```bash
# Install husky for git hooks
npm install --save-dev husky lint-staged

# Add to package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["npm test --findRelatedTests", "npm run lint"]
  }
}
```

## 🐛 Debugging Tests

### **Jest Debugging**
```bash
# Run specific test file
npm test HomePage.test.tsx

# Run tests matching pattern
npm test --testNamePattern="renders correctly"

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

### **Playwright Debugging**
```bash
# Debug mode with browser
npm run test:e2e:debug

# Run specific test
npx playwright test --grep "user can create project"

# Generate test code
npx playwright codegen localhost:3000
```

## 📱 Testing Best Practices

### **1. Test Structure (AAA Pattern)**
```typescript
describe('Component', () => {
  it('should do something', () => {
    // Arrange - Set up test data
    const props = { title: 'Test' }
    
    // Act - Perform action
    render(<Component {...props} />)
    
    // Assert - Verify outcome
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### **2. User-Centric Testing**
- Test from user perspective
- Use accessible queries (getByRole, getByLabelText)
- Avoid implementation details
- Test behavior, not implementation

### **3. Async Testing**
```typescript
// Wait for elements
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// User interactions
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')
```

### **4. Mock Management**
```typescript
beforeEach(() => {
  jest.clearAllMocks()
})

// Mock specific modules
jest.mock('../../lib/api', () => ({
  fetchProjects: jest.fn().mockResolvedValue([])
}))
```

## 🎯 Testing Workflow

### **Development Workflow**
1. **Write failing test** - Red
2. **Write minimal code** - Green  
3. **Refactor code** - Refactor
4. **Run full test suite** - Verify

### **Feature Development**
1. **Unit tests** - Test individual functions
2. **Integration tests** - Test component interactions
3. **E2E tests** - Test user journeys
4. **Manual testing** - Visual verification

### **Code Review Checklist**
- [ ] Tests cover new functionality
- [ ] Tests follow naming conventions
- [ ] Mocks are appropriate and minimal
- [ ] Test coverage meets requirements
- [ ] E2E tests cover critical paths

## 🚀 Quick Start

### **1. Run All Tests**
```bash
# Install dependencies (if not done)
npm install

# Run unit/integration tests
npm test

# Run E2E tests (requires dev server)
npm run dev  # In separate terminal
npm run test:e2e
```

### **2. Test-Driven Development**
```bash
# Start test watcher
npm run test:watch

# Develop feature with immediate feedback
# Tests re-run on file changes
```

### **3. Pre-deployment Validation**
```bash
# Full test suite + coverage
npm run test:coverage
npm run test:e2e

# Build verification
npm run build
npm start  # Test production build
```

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

**Built with ❤️ for reliable, maintainable code**
