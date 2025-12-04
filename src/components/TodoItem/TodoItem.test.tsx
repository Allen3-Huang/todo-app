import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { TodoItem } from './TodoItem'
import type { Todo } from '../../types'

expect.extend(toHaveNoViolations)

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 'test-id-1',
    text: '買牛奶',
    completed: false,
    createdAt: new Date(),
  }

  const mockCompletedTodo: Todo = {
    ...mockTodo,
    id: 'test-id-2',
    completed: true,
  }

  const mockHandlers = {
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render todo text', () => {
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      expect(screen.getByText('買牛奶')).toBeInTheDocument()
    })

    it('should render checkbox', () => {
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should render delete button', () => {
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      expect(screen.getByRole('button', { name: /刪除/i })).toBeInTheDocument()
    })

    it('should show unchecked checkbox for active todo', () => {
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    it('should show checked checkbox for completed todo', () => {
      render(<TodoItem todo={mockCompletedTodo} {...mockHandlers} />)
      
      expect(screen.getByRole('checkbox')).toBeChecked()
    })
  })

  describe('toggle behavior', () => {
    it('should call onToggle when checkbox is clicked (FR-008)', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.click(screen.getByRole('checkbox'))
      
      expect(mockHandlers.onToggle).toHaveBeenCalledWith(mockTodo.id)
    })

    it('should call onToggle only once per click', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.click(screen.getByRole('checkbox'))
      
      expect(mockHandlers.onToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('delete behavior', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.click(screen.getByRole('button', { name: /刪除/i }))
      
      expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockTodo.id)
    })
  })

  describe('edit mode', () => {
    it('should enter edit mode on double click (FR-009)', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.dblClick(screen.getByText('買牛奶'))
      
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveValue('買牛奶')
    })

    it('should enter edit mode on F2 key press', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      // Focus the item first
      screen.getByText('買牛奶').focus()
      await user.keyboard('{F2}')
      
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should save edit on Enter key (FR-010)', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.dblClick(screen.getByText('買牛奶'))
      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, '買豆漿{enter}')
      
      expect(mockHandlers.onUpdate).toHaveBeenCalledWith(mockTodo.id, '買豆漿')
    })

    it('should save edit on blur (FR-010)', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.dblClick(screen.getByText('買牛奶'))
      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, '買豆漿')
      await user.tab() // blur
      
      expect(mockHandlers.onUpdate).toHaveBeenCalledWith(mockTodo.id, '買豆漿')
    })

    it('should cancel edit on Escape key (FR-011)', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.dblClick(screen.getByText('買牛奶'))
      const input = screen.getByRole('textbox')
      await user.clear(input)
      await user.type(input, '買豆漿')
      await user.keyboard('{Escape}')
      
      expect(mockHandlers.onUpdate).not.toHaveBeenCalled()
      expect(screen.getByText('買牛奶')).toBeInTheDocument()
    })

    it('should auto-focus edit input', async () => {
      const user = userEvent.setup()
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      await user.dblClick(screen.getByText('買牛奶'))
      
      expect(screen.getByRole('textbox')).toHaveFocus()
    })
  })

  describe('accessibility', () => {
    it('should have accessible checkbox label', () => {
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      expect(screen.getByLabelText(/標記 "買牛奶"/i)).toBeInTheDocument()
    })

    it('should have accessible delete button label', () => {
      render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      expect(screen.getByLabelText(/刪除 "買牛奶"/i)).toBeInTheDocument()
    })

    it('should have visually hidden text for completed state', () => {
      render(<TodoItem todo={mockCompletedTodo} {...mockHandlers} />)
      
      expect(screen.getByText('（已完成）')).toBeInTheDocument()
    })

    it('should have no accessibility violations for active todo', async () => {
      const { container } = render(<TodoItem todo={mockTodo} {...mockHandlers} />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations for completed todo', async () => {
      const { container } = render(<TodoItem todo={mockCompletedTodo} {...mockHandlers} />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
