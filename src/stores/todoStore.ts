import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import type { Todo, TodoState, TodoStore, FilterType } from '../types'

/**
 * Todo Store - Zustand 狀態管理
 * @see store-contract.md
 */
export const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始狀態
        todos: [],
        filter: 'all' as FilterType,

        // Actions
        addTodo: (text: string) => {
          const trimmed = text.trim()
          if (!trimmed) return

          // 限制最多五筆待辦事項
          const currentTodos = get().todos
          if (currentTodos.length >= 5) return

          const newTodo: Todo = {
            id: crypto.randomUUID(),
            text: trimmed,
            completed: false,
            createdAt: new Date(),
          }

          set(
            (state) => ({ todos: [...state.todos, newTodo] }),
            undefined,
            'todos/add'
          )
        },

        toggleTodo: (id: string) => {
          set(
            (state) => ({
              todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              ),
            }),
            undefined,
            'todos/toggle'
          )
        },

        deleteTodo: (id: string) => {
          set(
            (state) => ({
              todos: state.todos.filter((todo) => todo.id !== id),
            }),
            undefined,
            'todos/delete'
          )
        },

        updateTodo: (id: string, text: string) => {
          const trimmed = text.trim()
          
          if (!trimmed) {
            // 若文字為空，刪除該 todo
            get().deleteTodo(id)
            return
          }

          set(
            (state) => ({
              todos: state.todos.map((todo) =>
                todo.id === id ? { ...todo, text: trimmed } : todo
              ),
            }),
            undefined,
            'todos/update'
          )
        },

        setFilter: (filter: FilterType) => {
          set({ filter }, undefined, 'filter/set')
        },

        clearCompleted: () => {
          set(
            (state) => ({
              todos: state.todos.filter((todo) => !todo.completed),
            }),
            undefined,
            'todos/clearCompleted'
          )
        },
      }),
      {
        name: 'todos-storage',
        version: 1,
        partialize: (state) => ({
          todos: state.todos,
          filter: state.filter,
        }),
        onRehydrateStorage: () => (state) => {
          // 將 ISO string 轉換回 Date 物件
          if (state?.todos) {
            state.todos = state.todos.map((todo) => ({
              ...todo,
              createdAt: new Date(todo.createdAt),
            }))
          }
        },
      }
    ),
    { name: 'TodoStore' }
  )
)

/**
 * Selector: 根據篩選條件取得對應的 todo 項目
 */
export const selectFilteredTodos = (state: TodoState): Todo[] => {
  switch (state.filter) {
    case 'active':
      return state.todos.filter((todo) => !todo.completed)
    case 'completed':
      return state.todos.filter((todo) => todo.completed)
    default:
      return state.todos
  }
}

/**
 * Selector: 未完成項目數量
 */
export const selectActiveCount = (state: TodoState): number =>
  state.todos.filter((todo) => !todo.completed).length

/**
 * Selector: 是否有已完成項目
 */
export const selectHasCompleted = (state: TodoState): boolean =>
  state.todos.some((todo) => todo.completed)

/**
 * Selector: 總項目數量
 */
export const selectTotalCount = (state: TodoState): number => state.todos.length

/**
 * Selector: 是否達到新增上限（5筆）
 */
export const selectIsAtLimit = (state: TodoState): boolean => state.todos.length >= 5
