import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe, toHaveNoViolations } from 'jest-axe'
import { useTodoStore } from '../../src/stores/todoStore'
import { TodoApp } from '../../src/components/TodoApp/TodoApp'

expect.extend(toHaveNoViolations)

describe('Todo App Integration', () => {
  beforeEach(() => {
    // 重置 store 狀態
    useTodoStore.setState({ todos: [], filter: 'all' })
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('complete user journey', () => {
    it('should complete a full todo workflow', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 1. 新增第一個 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, '買牛奶')
      await user.keyboard('{Enter}')

      expect(screen.getByText('買牛奶')).toBeInTheDocument()
      expect(screen.getByText('1 項未完成')).toBeInTheDocument()

      // 2. 新增第二個 todo
      await user.type(input, '讀書')
      await user.keyboard('{Enter}')

      expect(screen.getByText('讀書')).toBeInTheDocument()
      expect(screen.getByText('2 項未完成')).toBeInTheDocument()

      // 3. 完成第一個 todo
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      expect(screen.getByText('1 項未完成')).toBeInTheDocument()

      // 4. 切換篩選到 "已完成"
      await user.click(screen.getByRole('button', { name: /^已完成$/i }))
      
      // 篩選後只顯示已完成的項目
      expect(screen.getByText('買牛奶')).toBeInTheDocument()
      expect(screen.queryByText('讀書')).not.toBeInTheDocument()

      // 5. 切換篩選到 "未完成"
      await user.click(screen.getByRole('button', { name: /未完成/i }))

      // 篩選後只顯示未完成的項目
      expect(screen.queryByText('買牛奶')).not.toBeInTheDocument()
      expect(screen.getByText('讀書')).toBeInTheDocument()

      // 6. 切換回 "全部"
      await user.click(screen.getByRole('button', { name: /全部/i }))

      // 顯示所有項目
      expect(screen.getByText('買牛奶')).toBeInTheDocument()
      expect(screen.getByText('讀書')).toBeInTheDocument()
    })

    it('should edit a todo item via double-click', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 新增 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, '舊的內容')
      await user.keyboard('{Enter}')

      // 雙擊進入編輯模式
      const todoText = screen.getByText('舊的內容')
      await user.dblClick(todoText)

      // 編輯內容
      const editInput = screen.getByDisplayValue('舊的內容')
      await user.clear(editInput)
      await user.type(editInput, '新的內容')
      await user.keyboard('{Enter}')

      expect(screen.getByText('新的內容')).toBeInTheDocument()
      expect(screen.queryByText('舊的內容')).not.toBeInTheDocument()
    })

    it('should delete a todo item with confirmation', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 新增 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, '要刪除的項目')
      await user.keyboard('{Enter}')

      // 點擊刪除按鈕
      const deleteButton = screen.getByRole('button', { name: /刪除/i })
      await user.click(deleteButton)

      // 確認對話框出現
      expect(screen.getByRole('alertdialog')).toBeInTheDocument()
      expect(screen.getByText(/確定要刪除/i)).toBeInTheDocument()

      // 確認刪除
      await user.click(screen.getByRole('button', { name: /確認刪除/i }))

      // Todo 已被刪除
      expect(screen.queryByText('要刪除的項目')).not.toBeInTheDocument()
    })

    it('should cancel deletion when clicking cancel', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 新增 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, '不要刪除')
      await user.keyboard('{Enter}')

      // 點擊刪除按鈕
      const deleteButton = screen.getByRole('button', { name: /刪除/i })
      await user.click(deleteButton)

      // 點擊取消
      await user.click(screen.getByRole('button', { name: /取消/i }))

      // Todo 仍然存在
      expect(screen.getByText('不要刪除')).toBeInTheDocument()
    })

    it('should clear all completed todos', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 新增多個 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, 'Todo 1')
      await user.keyboard('{Enter}')
      await user.type(input, 'Todo 2')
      await user.keyboard('{Enter}')
      await user.type(input, 'Todo 3')
      await user.keyboard('{Enter}')

      // 完成前兩個
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])
      await user.click(checkboxes[1])

      expect(screen.getByText('1 項未完成')).toBeInTheDocument()

      // 清除已完成
      await user.click(screen.getByRole('button', { name: /清除已完成/i }))

      // 只剩下 Todo 3
      expect(screen.queryByText('Todo 1')).not.toBeInTheDocument()
      expect(screen.queryByText('Todo 2')).not.toBeInTheDocument()
      expect(screen.getByText('Todo 3')).toBeInTheDocument()
    })
  })

  describe('keyboard accessibility', () => {
    it('should allow navigating and interacting with keyboard', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 新增 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, '鍵盤測試')
      await user.keyboard('{Enter}')

      // Tab 到 checkbox
      await user.keyboard('{Tab}')
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveFocus()

      // Space 切換完成狀態
      await user.keyboard(' ')
      expect(checkbox).toBeChecked()

      // Tab 到文字區域
      await user.keyboard('{Tab}')

      // F2 進入編輯模式
      await user.keyboard('{F2}')
      const editInput = screen.getByDisplayValue('鍵盤測試')
      expect(editInput).toHaveFocus()

      // Escape 取消編輯
      await user.keyboard('{Escape}')
      expect(screen.queryByDisplayValue('鍵盤測試')).not.toBeInTheDocument()
    })

    it('should trap focus within confirmation dialog', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      // 新增並嘗試刪除
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, 'Focus trap 測試')
      await user.keyboard('{Enter}')

      await user.click(screen.getByRole('button', { name: /刪除/i }))

      // 確認 dialog 獲得焦點
      const cancelButton = screen.getByRole('button', { name: /取消/i })
      expect(cancelButton).toHaveFocus()

      // Tab 應在 dialog 內循環
      await user.keyboard('{Tab}')
      expect(screen.getByRole('button', { name: /確認刪除/i })).toHaveFocus()

      // Escape 關閉 dialog
      await user.keyboard('{Escape}')
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    })
  })

  describe('empty states', () => {
    it('should not render footer when no todos exist', () => {
      render(<TodoApp />)

      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
      expect(screen.queryByText(/項未完成/i)).not.toBeInTheDocument()
    })

    it('should render footer when todos exist', async () => {
      const user = userEvent.setup()
      render(<TodoApp />)

      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, '新 todo')
      await user.keyboard('{Enter}')

      expect(screen.getByRole('contentinfo')).toBeInTheDocument()
      expect(screen.getByText('1 項未完成')).toBeInTheDocument()
    })
  })

  describe('full accessibility audit', () => {
    it('should have no accessibility violations with empty state', async () => {
      const { container } = render(<TodoApp />)

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with todos', async () => {
      const user = userEvent.setup()
      const { container } = render(<TodoApp />)

      // 新增一些 todo
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, 'Accessibility test 1')
      await user.keyboard('{Enter}')
      await user.type(input, 'Accessibility test 2')
      await user.keyboard('{Enter}')

      // 完成一個
      const checkboxes = screen.getAllByRole('checkbox')
      await user.click(checkboxes[0])

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations with dialog open', async () => {
      const user = userEvent.setup()
      const { container } = render(<TodoApp />)

      // 新增並開啟刪除對話框
      const input = screen.getByLabelText(/新增待辦事項/i)
      await user.type(input, 'Dialog a11y test')
      await user.keyboard('{Enter}')

      await user.click(screen.getByRole('button', { name: /刪除/i }))

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
