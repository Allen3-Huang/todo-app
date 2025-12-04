import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useTodoStore } from '../../src/stores/todoStore'

describe('localStorage persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    useTodoStore.setState({ todos: [], filter: 'all' })
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('persist middleware', () => {
    it('should save todos to localStorage', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      
      // 等待 persist middleware 寫入
      const stored = localStorage.getItem('todos-storage')
      expect(stored).toBeTruthy()
      
      const parsed = JSON.parse(stored!)
      expect(parsed.state.todos).toHaveLength(1)
      expect(parsed.state.todos[0].text).toBe('買牛奶')
    })

    it('should save filter to localStorage', () => {
      const { setFilter } = useTodoStore.getState()
      
      setFilter('completed')
      
      const stored = localStorage.getItem('todos-storage')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.filter).toBe('completed')
    })

    it('should persist completed state', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      toggleTodo(todos[0].id)
      
      const stored = localStorage.getItem('todos-storage')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.todos[0].completed).toBe(true)
    })

    it('should remove deleted todo from localStorage', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      deleteTodo(todos[0].id)
      
      const stored = localStorage.getItem('todos-storage')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.todos).toHaveLength(0)
    })

    it('should include version number for migration support', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      
      const stored = localStorage.getItem('todos-storage')
      const parsed = JSON.parse(stored!)
      expect(parsed.version).toBe(1)
    })
  })

  describe('rehydration', () => {
    it('should restore todos on store initialization', () => {
      // 預先設定 localStorage 資料
      const mockData = {
        state: {
          todos: [
            { id: 'test-1', text: '買牛奶', completed: false, createdAt: '2025-11-30T10:00:00.000Z' },
            { id: 'test-2', text: '買豆漿', completed: true, createdAt: '2025-11-30T11:00:00.000Z' },
          ],
          filter: 'all',
        },
        version: 1,
      }
      localStorage.setItem('todos-storage', JSON.stringify(mockData))
      
      // 重新載入 store
      useTodoStore.persist.rehydrate()
      
      const { todos } = useTodoStore.getState()
      expect(todos).toHaveLength(2)
      expect(todos[0].text).toBe('買牛奶')
      expect(todos[1].text).toBe('買豆漿')
    })

    it('should convert createdAt strings to Date objects', () => {
      const mockData = {
        state: {
          todos: [
            { id: 'test-1', text: '買牛奶', completed: false, createdAt: '2025-11-30T10:00:00.000Z' },
          ],
          filter: 'all',
        },
        version: 1,
      }
      localStorage.setItem('todos-storage', JSON.stringify(mockData))
      
      useTodoStore.persist.rehydrate()
      
      const { todos } = useTodoStore.getState()
      expect(todos[0].createdAt).toBeInstanceOf(Date)
      expect(todos[0].createdAt.toISOString()).toBe('2025-11-30T10:00:00.000Z')
    })

    it('should restore filter state', () => {
      const mockData = {
        state: {
          todos: [],
          filter: 'completed',
        },
        version: 1,
      }
      localStorage.setItem('todos-storage', JSON.stringify(mockData))
      
      useTodoStore.persist.rehydrate()
      
      const { filter } = useTodoStore.getState()
      expect(filter).toBe('completed')
    })
  })

  describe('error handling', () => {
    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('todos-storage', 'invalid json')
      
      // 應該不會拋出錯誤
      expect(() => useTodoStore.persist.rehydrate()).not.toThrow()
    })

    it('should handle empty localStorage', () => {
      // localStorage 已清空
      useTodoStore.persist.rehydrate()
      
      const { todos, filter } = useTodoStore.getState()
      expect(todos).toEqual([])
      expect(filter).toBe('all')
    })
  })
})
