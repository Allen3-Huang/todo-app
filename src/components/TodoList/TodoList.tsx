import type { TodoListProps } from '../../types'
import { TodoItem } from '../TodoItem/TodoItem'
import styles from './TodoList.module.css'

/**
 * TodoList - Todo 項目清單容器
 * @see component-contracts.md
 */
export function TodoList({ todos, onToggle, onDelete, onUpdate }: TodoListProps) {
  return (
    <ul className={styles.list} role="list" aria-label="待辦事項清單">
      {todos.map((todo) => (
        <li key={todo.id} className={styles.item}>
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        </li>
      ))}
    </ul>
  )
}
