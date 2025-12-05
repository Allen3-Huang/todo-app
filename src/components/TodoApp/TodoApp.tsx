import { useState, useCallback, useMemo } from 'react'
import { useTodoStore, selectActiveCount, selectHasCompleted, selectTotalCount } from '../../stores/todoStore'
import { TodoInput } from '../TodoInput/TodoInput'
import { TodoList } from '../TodoList/TodoList'
import { TodoFooter } from '../TodoFooter/TodoFooter'
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog'
import styles from './TodoApp.module.css'
import '../../styles/neo-brutalism.css'
import type { Todo } from '../../types'

/**
 * TodoApp - 根元件
 * 負責整體布局與語意化 HTML 結構
 * @see component-contracts.md
 */
export function TodoApp() {
  // 取得原始 todos 陣列和 filter
  const allTodos = useTodoStore((state) => state.todos)
  const currentFilter = useTodoStore((state) => state.filter)
  
  // 在元件內使用 useMemo 過濾 todos，避免 selector 每次返回新陣列
  const todos: Todo[] = useMemo(() => {
    switch (currentFilter) {
      case 'active':
        return allTodos.filter((todo) => !todo.completed)
      case 'completed':
        return allTodos.filter((todo) => todo.completed)
      default:
        return allTodos
    }
  }, [allTodos, currentFilter])

  const addTodo = useTodoStore((state) => state.addTodo)
  const toggleTodo = useTodoStore((state) => state.toggleTodo)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const updateTodo = useTodoStore((state) => state.updateTodo)
  const setFilter = useTodoStore((state) => state.setFilter)
  const clearCompleted = useTodoStore((state) => state.clearCompleted)
  const activeCount = useTodoStore(selectActiveCount)
  const hasCompleted = useTodoStore(selectHasCompleted)
  const hasTodos = useTodoStore(selectTotalCount) > 0

  // 刪除確認對話框狀態
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; text: string } | null>(null)

  const handleDeleteRequest = useCallback((id: string) => {
    const todo = todos.find((t) => t.id === id)
    if (todo) {
      setDeleteTarget({ id, text: todo.text })
    }
  }, [todos])

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteTodo(deleteTarget.id)
      setDeleteTarget(null)
    }
  }, [deleteTarget, deleteTodo])

  const handleCancelDelete = useCallback(() => {
    setDeleteTarget(null)
  }, [])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>todos</h1>
      </header>

      <main className={styles.main}>
        <TodoInput onAdd={addTodo} />
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={handleDeleteRequest}
          onUpdate={updateTodo}
        />
      </main>

      <TodoFooter
        activeCount={activeCount}
        hasCompleted={hasCompleted}
        currentFilter={currentFilter}
        hasTodos={hasTodos}
        onFilterChange={setFilter}
        onClearCompleted={clearCompleted}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="確認刪除?"
        description={deleteTarget ? `確定要刪除「${deleteTarget.text}」嗎？此操作無法復原。` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  )
}
