import '@testing-library/jest-dom'
import './types/jest-dom.d.ts'

// Polyfill Web APIs for Next.js API routes testing
import { TextEncoder, TextDecoder } from 'util'
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock Web APIs that Next.js API routes expect
global.Request = class Request {
  constructor(input, init = {}) {
    this.url = input
    this.method = init.method || 'GET'
    this.headers = new Map(Object.entries(init.headers || {}))
    this.body = init.body
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
}

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.statusText = init.statusText || 'OK'
    this.headers = new Map(Object.entries(init.headers || {}))
    this.ok = this.status >= 200 && this.status < 300
  }
  
  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
  }
  
  async text() {
    return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
  }
  
  static json(data, init = {}) {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init.headers
      }
    })
  }
}

global.Headers = class Headers extends Map {
  constructor(init) {
    super()
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, value)
      })
    }
  }
}

// Mock IntersectionObserver for components that might use it
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver for responsive components
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia for responsive testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.confirm for dialog testing
global.confirm = jest.fn(() => true)

// Mock next/navigation for testing components that use Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Prisma client for database testing
jest.mock('./lib/prisma', () => ({
  __esModule: true,
  default: {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    skill: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))
