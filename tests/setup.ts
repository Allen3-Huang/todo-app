import '@testing-library/jest-dom'
import { expect } from 'vitest'
import { toHaveNoViolations } from 'jest-axe'

// 擴展 expect 以支援 jest-axe 匹配器
expect.extend(toHaveNoViolations)

// 全域清理 localStorage
beforeEach(() => {
  localStorage.clear()
})
