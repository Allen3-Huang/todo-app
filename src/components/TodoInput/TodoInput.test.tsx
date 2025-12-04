import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { TodoInput } from './TodoInput'

expect.extend(toHaveNoViolations)

describe('TodoInput', () => {
  describe('rendering', () => {
    it('should render an input field', () => {
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should have placeholder text', () => {
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      expect(screen.getByPlaceholderText(/what needs to be done/i)).toBeInTheDocument()
    })

    it('should have aria-label for accessibility', () => {
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      expect(screen.getByLabelText(/新增待辦事項/i)).toBeInTheDocument()
    })
  })

  describe('adding todo', () => {
    it('should call onAdd with trimmed text when pressing Enter', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '  買牛奶  {enter}')
      
      expect(onAdd).toHaveBeenCalledWith('買牛奶')
    })

    it('should clear input after adding', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '買牛奶{enter}')
      
      expect(input).toHaveValue('')
    })

    it('should not call onAdd when text is empty', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '{enter}')
      
      expect(onAdd).not.toHaveBeenCalled()
    })

    it('should not call onAdd when text is only whitespace', async () => {
      const user = userEvent.setup()
      const onAdd = vi.fn()
      render(<TodoInput onAdd={onAdd} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, '   {enter}')
      
      expect(onAdd).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should have no accessibility violations', async () => {
      const onAdd = vi.fn()
      const { container } = render(<TodoInput onAdd={onAdd} />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
