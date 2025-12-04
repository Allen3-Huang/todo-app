import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { ConfirmDialog } from './ConfirmDialog'

expect.extend(toHaveNoViolations)

describe('ConfirmDialog', () => {
  const defaultProps = {
    isOpen: true,
    title: '確認刪除',
    description: '確定要刪除這個項目嗎？',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render when isOpen is true', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('should not render when isOpen is false', () => {
      render(<ConfirmDialog {...defaultProps} isOpen={false} />)
      
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })

    it('should render title', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByRole('heading', { name: '確認刪除' })).toBeInTheDocument()
    })

    it('should render description', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByText('確定要刪除這個項目嗎？')).toBeInTheDocument()
    })

    it('should render confirm button', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /確認|刪除/i })).toBeInTheDocument()
    })

    it('should render cancel button', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByRole('button', { name: /取消/i })).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onConfirm when confirm button is clicked', async () => {
      const user = userEvent.setup()
      render(<ConfirmDialog {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /確認|刪除/i }))
      
      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup()
      render(<ConfirmDialog {...defaultProps} />)
      
      await user.click(screen.getByRole('button', { name: /取消/i }))
      
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when Escape key is pressed', async () => {
      const user = userEvent.setup()
      render(<ConfirmDialog {...defaultProps} />)
      
      await user.keyboard('{Escape}')
      
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when clicking overlay', async () => {
      const user = userEvent.setup()
      render(<ConfirmDialog {...defaultProps} />)
      
      const overlay = screen.getByTestId('dialog-overlay')
      await user.click(overlay)
      
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('should have role="alertdialog"', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    })

    it('should have aria-modal="true"', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('should have aria-labelledby pointing to title', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      const dialog = screen.getByRole('alertdialog')
      const titleId = dialog.getAttribute('aria-labelledby')
      expect(titleId).toBeTruthy()
      expect(document.getElementById(titleId!)).toHaveTextContent('確認刪除')
    })

    it('should have aria-describedby pointing to description', () => {
      render(<ConfirmDialog {...defaultProps} />)
      
      const dialog = screen.getByRole('alertdialog')
      const descId = dialog.getAttribute('aria-describedby')
      expect(descId).toBeTruthy()
      expect(document.getElementById(descId!)).toHaveTextContent('確定要刪除這個項目嗎？')
    })

    it('should have no accessibility violations', async () => {
      const { container } = render(<ConfirmDialog {...defaultProps} />)
      
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
