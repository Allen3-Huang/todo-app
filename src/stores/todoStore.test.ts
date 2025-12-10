import { describe, it, expect, beforeEach } from 'vitest'
import { useTodoStore, selectFilteredTodos, selectActiveCount, selectHasCompleted, selectIsAtLimit } from './todoStore'

describe('todoStore', () => {
  beforeEach(() => {
    // 重置 store 狀態
    useTodoStore.setState({ todos: [], filter: 'all' })
  })

  describe('initial state', () => {
    it('should have empty todos array', () => {
      const { todos } = useTodoStore.getState()
      expect(todos).toEqual([])
    })

    it('should have filter set to "all" by default (FR-019)', () => {
      const { filter } = useTodoStore.getState()
      expect(filter).toBe('all')
    })
  })

  describe('addTodo', () => {
    it('should add a new todo with trimmed text (FR-002)', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('  買牛奶  ')
      
      const { todos } = useTodoStore.getState()
      expect(todos).toHaveLength(1)
      expect(todos[0].text).toBe('買牛奶')
    })

    it('should set completed to false by default (FR-003)', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      
      const { todos } = useTodoStore.getState()
      expect(todos[0].completed).toBe(false)
    })

    it('should generate unique id using crypto.randomUUID', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      
      const { todos } = useTodoStore.getState()
      expect(todos[0].id).not.toBe(todos[1].id)
      expect(todos[0].id).toMatch(/^[a-f0-9-]{36}$/)
    })

    it('should set createdAt to current time', () => {
      const before = new Date()
      const { addTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      
      const after = new Date()
      const { todos } = useTodoStore.getState()
      expect(todos[0].createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
      expect(todos[0].createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    })

    it('should append new todo to the end of the list', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      addTodo('Todo 3')
      
      const { todos } = useTodoStore.getState()
      expect(todos[0].text).toBe('Todo 1')
      expect(todos[2].text).toBe('Todo 3')
    })

    it('should not add todo when text is empty', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('')
      addTodo('   ')
      
      const { todos } = useTodoStore.getState()
      expect(todos).toHaveLength(0)
    })

    it('should not add more than 5 todos', () => {
      const { addTodo } = useTodoStore.getState()
      
      // Add 5 todos
      addTodo('Todo 1')
      addTodo('Todo 2')
      addTodo('Todo 3')
      addTodo('Todo 4')
      addTodo('Todo 5')
      
      const { todos: after5 } = useTodoStore.getState()
      expect(after5).toHaveLength(5)
      
      // Try to add 6th todo
      addTodo('Todo 6')
      
      const { todos: final } = useTodoStore.getState()
      expect(final).toHaveLength(5)
      expect(final.every(t => !t.text.includes('Todo 6'))).toBe(true)
    })

    it('should allow adding after deleting when at limit', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState()
      
      // Add 5 todos
      for (let i = 1; i <= 5; i++) {
        addTodo(`Todo ${i}`)
      }
      
      const { todos: before } = useTodoStore.getState()
      expect(before).toHaveLength(5)
      
      // Delete one
      deleteTodo(before[0].id)
      
      const { todos: afterDelete } = useTodoStore.getState()
      expect(afterDelete).toHaveLength(4)
      
      // Should be able to add again
      addTodo('New Todo')
      
      const { todos: final } = useTodoStore.getState()
      expect(final).toHaveLength(5)
      expect(final.some(t => t.text === 'New Todo')).toBe(true)
    })
  })

  describe('toggleTodo', () => {
    it('should toggle completed from false to true (FR-008)', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos: before } = useTodoStore.getState()
      
      toggleTodo(before[0].id)
      
      const { todos: after } = useTodoStore.getState()
      expect(after[0].completed).toBe(true)
    })

    it('should toggle completed from true to false', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      
      toggleTodo(todos[0].id)
      toggleTodo(todos[0].id)
      
      const { todos: after } = useTodoStore.getState()
      expect(after[0].completed).toBe(false)
    })

    it('should do nothing when id not found', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      toggleTodo('non-existent-id')
      
      const { todos } = useTodoStore.getState()
      expect(todos[0].completed).toBe(false)
    })
  })

  describe('deleteTodo', () => {
    it('should remove todo by id (FR-006)', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      const { todos } = useTodoStore.getState()
      
      deleteTodo(todos[0].id)
      
      const { todos: after } = useTodoStore.getState()
      expect(after).toHaveLength(1)
      expect(after[0].text).toBe('Todo 2')
    })

    it('should do nothing when id not found', () => {
      const { addTodo, deleteTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      deleteTodo('non-existent-id')
      
      const { todos } = useTodoStore.getState()
      expect(todos).toHaveLength(1)
    })
  })

  describe('updateTodo', () => {
    it('should update todo text (FR-010)', () => {
      const { addTodo, updateTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      
      updateTodo(todos[0].id, '買豆漿')
      
      const { todos: after } = useTodoStore.getState()
      expect(after[0].text).toBe('買豆漿')
    })

    it('should trim text before updating', () => {
      const { addTodo, updateTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      
      updateTodo(todos[0].id, '  買豆漿  ')
      
      const { todos: after } = useTodoStore.getState()
      expect(after[0].text).toBe('買豆漿')
    })

    it('should delete todo when text is empty (Edge Case)', () => {
      const { addTodo, updateTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      
      updateTodo(todos[0].id, '')
      
      const { todos: after } = useTodoStore.getState()
      expect(after).toHaveLength(0)
    })

    it('should delete todo when text is only whitespace', () => {
      const { addTodo, updateTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      const { todos } = useTodoStore.getState()
      
      updateTodo(todos[0].id, '   ')
      
      const { todos: after } = useTodoStore.getState()
      expect(after).toHaveLength(0)
    })

    it('should do nothing when id not found', () => {
      const { addTodo, updateTodo } = useTodoStore.getState()
      
      addTodo('買牛奶')
      updateTodo('non-existent-id', '買豆漿')
      
      const { todos } = useTodoStore.getState()
      expect(todos[0].text).toBe('買牛奶')
    })
  })

  describe('setFilter', () => {
    it('should set filter to active (FR-013)', () => {
      const { setFilter } = useTodoStore.getState()
      
      setFilter('active')
      
      const { filter } = useTodoStore.getState()
      expect(filter).toBe('active')
    })

    it('should set filter to completed', () => {
      const { setFilter } = useTodoStore.getState()
      
      setFilter('completed')
      
      const { filter } = useTodoStore.getState()
      expect(filter).toBe('completed')
    })

    it('should set filter back to all', () => {
      const { setFilter } = useTodoStore.getState()
      
      setFilter('completed')
      setFilter('all')
      
      const { filter } = useTodoStore.getState()
      expect(filter).toBe('all')
    })
  })

  describe('clearCompleted', () => {
    it('should remove all completed todos (FR-016)', () => {
      const { addTodo, toggleTodo, clearCompleted } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      addTodo('Todo 3')
      const { todos } = useTodoStore.getState()
      
      toggleTodo(todos[0].id)
      toggleTodo(todos[2].id)
      clearCompleted()
      
      const { todos: after } = useTodoStore.getState()
      expect(after).toHaveLength(1)
      expect(after[0].text).toBe('Todo 2')
    })

    it('should do nothing when no completed todos', () => {
      const { addTodo, clearCompleted } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      clearCompleted()
      
      const { todos } = useTodoStore.getState()
      expect(todos).toHaveLength(2)
    })
  })

  describe('selectFilteredTodos', () => {
    beforeEach(() => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      addTodo('Active 1')
      addTodo('Completed 1')
      addTodo('Active 2')
      const { todos } = useTodoStore.getState()
      toggleTodo(todos[1].id)
    })

    it('should return all todos when filter is "all"', () => {
      useTodoStore.setState({ filter: 'all' })
      const state = useTodoStore.getState()
      
      const filtered = selectFilteredTodos(state)
      
      expect(filtered).toHaveLength(3)
    })

    it('should return only active todos when filter is "active"', () => {
      useTodoStore.setState({ filter: 'active' })
      const state = useTodoStore.getState()
      
      const filtered = selectFilteredTodos(state)
      
      expect(filtered).toHaveLength(2)
      expect(filtered.every(t => !t.completed)).toBe(true)
    })

    it('should return only completed todos when filter is "completed"', () => {
      useTodoStore.setState({ filter: 'completed' })
      const state = useTodoStore.getState()
      
      const filtered = selectFilteredTodos(state)
      
      expect(filtered).toHaveLength(1)
      expect(filtered.every(t => t.completed)).toBe(true)
    })
  })

  describe('selectActiveCount', () => {
    it('should return count of active todos', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      addTodo('Todo 3')
      const { todos } = useTodoStore.getState()
      toggleTodo(todos[0].id)
      
      const state = useTodoStore.getState()
      expect(selectActiveCount(state)).toBe(2)
    })

    it('should return 0 when all todos are completed', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      const { todos } = useTodoStore.getState()
      toggleTodo(todos[0].id)
      
      const state = useTodoStore.getState()
      expect(selectActiveCount(state)).toBe(0)
    })
  })

  describe('selectHasCompleted', () => {
    it('should return true when there are completed todos', () => {
      const { addTodo, toggleTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      const { todos } = useTodoStore.getState()
      toggleTodo(todos[0].id)
      
      const state = useTodoStore.getState()
      expect(selectHasCompleted(state)).toBe(true)
    })

    it('should return false when no completed todos', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      
      const state = useTodoStore.getState()
      expect(selectHasCompleted(state)).toBe(false)
    })

    it('should return false when todos is empty', () => {
      const state = useTodoStore.getState()
      expect(selectHasCompleted(state)).toBe(false)
    })
  })

  describe('selectIsAtLimit', () => {
    it('should return true when todos count is 5', () => {
      const { addTodo } = useTodoStore.getState()
      
      for (let i = 1; i <= 5; i++) {
        addTodo(`Todo ${i}`)
      }
      
      const state = useTodoStore.getState()
      expect(selectIsAtLimit(state)).toBe(true)
    })

    it('should return false when todos count is less than 5', () => {
      const { addTodo } = useTodoStore.getState()
      
      addTodo('Todo 1')
      addTodo('Todo 2')
      
      const state = useTodoStore.getState()
      expect(selectIsAtLimit(state)).toBe(false)
    })

    it('should return false when todos is empty', () => {
      const state = useTodoStore.getState()
      expect(selectIsAtLimit(state)).toBe(false)
    })
  })
})
