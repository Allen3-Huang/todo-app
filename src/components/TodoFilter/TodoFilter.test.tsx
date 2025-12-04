import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { TodoFilter } from './TodoFilter'
import type { FilterType } from '../../types'

expect.extend(toHaveNoViolations)

describe('TodoFilter', () => {
  const mockOnFilterChange = vi.fn()

  beforeEach(() => {
    mockOnFilterChange.mockClear()
  })

  describe('rendering', () => {
    it('should render all three filter buttons', () => {
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      expect(screen.getByRole('button', { name: /全部/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /未完成/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /已完成/i })).toBeInTheDocument()
    })

    it('should render filter button group with role="group"', () => {
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      expect(screen.getByRole('group', { name: /篩選待辦事項/i })).toBeInTheDocument()
    })
  })

  describe('filter selection', () => {
    it.each<[FilterType, string]>([
      ['all', '全部'],
      ['active', '未完成'],
      ['completed', '已完成'],
    ])('should mark %s button as pressed when currentFilter is %s', (filter, label) => {
      render(
        <TodoFilter currentFilter={filter} onFilterChange={mockOnFilterChange} />
      )

      const button = screen.getByRole('button', { name: new RegExp(label, 'i') })
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('should mark non-selected buttons as not pressed', () => {
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const activeButton = screen.getByRole('button', { name: /未完成/i })
      const completedButton = screen.getByRole('button', { name: /已完成/i })

      expect(activeButton).toHaveAttribute('aria-pressed', 'false')
      expect(completedButton).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('interaction', () => {
    it('should call onFilterChange with "all" when All button is clicked (FR-013)', async () => {
      const user = userEvent.setup()
      render(
        <TodoFilter currentFilter="active" onFilterChange={mockOnFilterChange} />
      )

      await user.click(screen.getByRole('button', { name: /全部/i }))
      expect(mockOnFilterChange).toHaveBeenCalledWith('all')
    })

    it('should call onFilterChange with "active" when Active button is clicked (FR-013)', async () => {
      const user = userEvent.setup()
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      await user.click(screen.getByRole('button', { name: /未完成/i }))
      expect(mockOnFilterChange).toHaveBeenCalledWith('active')
    })

    it('should call onFilterChange with "completed" when Completed button is clicked (FR-013)', async () => {
      const user = userEvent.setup()
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      await user.click(screen.getByRole('button', { name: /已完成/i }))
      expect(mockOnFilterChange).toHaveBeenCalledWith('completed')
    })

    it('should still call onFilterChange when clicking already selected filter', async () => {
      const user = userEvent.setup()
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      await user.click(screen.getByRole('button', { name: /全部/i }))
      expect(mockOnFilterChange).toHaveBeenCalledWith('all')
    })
  })

  describe('accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have aria-label on filter group', () => {
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const group = screen.getByRole('group')
      expect(group).toHaveAttribute('aria-label', '篩選待辦事項')
    })

    it('should have aria-pressed on all buttons', () => {
      render(
        <TodoFilter currentFilter="active" onFilterChange={mockOnFilterChange} />
      )

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed')
      })
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(
        <TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />
      )

      const allButton = screen.getByRole('button', { name: /全部/i })
      allButton.focus()
      expect(allButton).toHaveFocus()

      await user.keyboard('{Tab}')
      expect(screen.getByRole('button', { name: /未完成/i })).toHaveFocus()

      await user.keyboard('{Tab}')
      expect(screen.getByRole('button', { name: /已完成/i })).toHaveFocus()
    })
  })
})
