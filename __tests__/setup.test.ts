// Simple utility function for testing
function add(a: number, b: number): number {
  return a + b
}

describe('Test Environment Setup', () => {
  it('should run basic tests', () => {
    expect(1 + 1).toBe(2)
  })

  it('should test utility functions', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('should have testing library matchers', () => {
    const element = document.createElement('div')
    element.textContent = 'Hello World'
    document.body.appendChild(element)
    
    expect(element).toBeInTheDocument()
  })
})
