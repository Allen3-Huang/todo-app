import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodoList } from './TodoList'
import type { Todo } from '../../types'

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'Todo 1', completed: false, createdAt: new Date() },
    { id: '2', text: 'Todo 2', completed: true, createdAt: new Date() },
    { id: '3', text: 'Todo 3', completed: false, createdAt: new Date() },
  ]

  const mockHandlers = {
    onToggle: vi.fn(),
    onDelete: vi.fn(),
    onUpdate: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render all todos', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />)
      
      expect(screen.getByText('Todo 1')).toBeInTheDocument()
      expect(screen.getByText('Todo 2')).toBeInTheDocument()
      expect(screen.getByText('Todo 3')).toBeInTheDocument()
    })

    it('should render as a list with proper role', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />)
      
      expect(screen.getByRole('list')).toBeInTheDocument()
    })

    it('should render list items', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />)
      
      const listItems = screen.getAllByRole('listitem')
      expect(listItems).toHaveLength(3)
    })

    it('should have accessible label', () => {
      render(<TodoList todos={mockTodos} {...mockHandlers} />)
      
      expect(screen.getByLabelText(/待辦事項清單/i)).toBeInTheDocument()
    })

    it('should render empty list when no todos', () => {
      render(<TodoList todos={[]} {...mockHandlers} />)
      
      const list = screen.getByRole('list')
      expect(list.children).toHaveLength(0)
    })
  })
})
