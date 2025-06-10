/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(className: string): R
      toHaveTextContent(text: string | RegExp): R
      toBeVisible(): R
      toBeEnabled(): R
      toBeDisabled(): R
      toBeChecked(): R
      toHaveFocus(): R
      toHaveValue(value: string | string[] | number): R
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
      toBeRequired(): R
      toBeInvalid(): R
      toBeValid(): R
    }
  }
}
