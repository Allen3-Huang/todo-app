import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { TodoFooter } from './TodoFooter'
import type { FilterType } from '../../types'

expect.extend(toHaveNoViolations)

describe('TodoFooter', () => {
  const mockOnFilterChange = vi.fn()
  const mockOnClearCompleted = vi.fn()

  const defaultProps = {
    activeCount: 5,
    hasCompleted: true,
    currentFilter: 'all' as FilterType,
    onFilterChange: mockOnFilterChange,
    onClearCompleted: mockOnClearCompleted,
    hasTodos: true,
  }

  beforeEach(() => {
    mockOnFilterChange.mockClear()
    mockOnClearCompleted.mockClear()
  })

  describe('rendering', () => {
    it('should render footer when hasTodos is true', () => {
      render(<TodoFooter {...defaultProps} />)
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })

    it('should not render footer when hasTodos is false', () => {
      render(<TodoFooter {...defaultProps} hasTodos={false} />)
      
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
    })
  })

  describe('active count display (FR-014)', () => {
    it('should display singular form for 1 item', () => {
      render(<TodoFooter {...defaultProps} activeCount={1} />)

      expect(screen.getByText('1 項未完成')).toBeInTheDocument()
    })

    it('should display plural form for 0 items', () => {
      render(<TodoFooter {...defaultProps} activeCount={0} />)

      expect(screen.getByText('0 項未完成')).toBeInTheDocument()
    })

    it('should display plural form for multiple items', () => {
      render(<TodoFooter {...defaultProps} activeCount={5} />)

      expect(screen.getByText('5 項未完成')).toBeInTheDocument()
    })

    it('should have aria-live="polite" for count updates', () => {
      render(<TodoFooter {...defaultProps} />)

      const countElement = screen.getByText(/項未完成/)
      expect(countElement).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('filter integration', () => {
    it('should render TodoFilter component', () => {
      render(<TodoFooter {...defaultProps} />)

      expect(screen.getByRole('group', { name: /篩選待辦事項/i })).toBeInTheDocument()
    })

    it('should pass currentFilter to TodoFilter', () => {
      render(<TodoFooter {...defaultProps} currentFilter="active" />)

      const activeButton = screen.getByRole('button', { name: /未完成/i })
      expect(activeButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('should call onFilterChange when filter button is clicked', async () => {
      const user = userEvent.setup()
      render(<TodoFooter {...defaultProps} currentFilter="all" />)

      // 使用 aria-pressed 區分 filter button 與 clear button
      const completedFilterButton = screen.getByRole('button', { name: /已完成/i, pressed: false })
      await user.click(completedFilterButton)
      expect(mockOnFilterChange).toHaveBeenCalledWith('completed')
    })
  })

  describe('clear completed button (FR-016)', () => {
    it('should show clear button when hasCompleted is true', () => {
      render(<TodoFooter {...defaultProps} hasCompleted={true} />)

      expect(screen.getByRole('button', { name: /清除已完成/i })).toBeInTheDocument()
    })

    it('should hide clear button when hasCompleted is false', () => {
      render(<TodoFooter {...defaultProps} hasCompleted={false} />)

      expect(screen.queryByRole('button', { name: /清除已完成/i })).not.toBeInTheDocument()
    })

    it('should call onClearCompleted when clear button is clicked', async () => {
      const user = userEvent.setup()
      render(<TodoFooter {...defaultProps} hasCompleted={true} />)

      await user.click(screen.getByRole('button', { name: /清除已完成/i }))
      expect(mockOnClearCompleted).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<TodoFooter {...defaultProps} />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have accessible clear button label', () => {
      render(<TodoFooter {...defaultProps} hasCompleted={true} />)

      const clearButton = screen.getByRole('button', { name: /清除已完成/i })
      expect(clearButton).toBeInTheDocument()
    })

    it('should use semantic footer element', () => {
      render(<TodoFooter {...defaultProps} />)

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    })
  })
})
