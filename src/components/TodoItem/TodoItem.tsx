import { memo, useState, useRef, useEffect, type KeyboardEvent } from 'react'
import type { TodoItemProps } from '../../types'
import styles from './TodoItem.module.css'

/**
 * TodoItem - 單一 todo 項目元件
 * 使用 memo 優化重新渲染
 * @see component-contracts.md
 */
export const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const editInputRef = useRef<HTMLInputElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)

  // 自動 focus 編輯輸入框
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [isEditing])

  const handleToggle = () => {
    onToggle(todo.id)
  }

  const handleDelete = () => {
    onDelete(todo.id)
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'F2') {
      setIsEditing(true)
      setEditText(todo.text)
    }
  }

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const saveEdit = () => {
    const trimmed = editText.trim()
    onUpdate(todo.id, trimmed)
    setIsEditing(false)
  }

  const cancelEdit = () => {
    setEditText(todo.text)
    setIsEditing(false)
  }

  const handleBlur = () => {
    if (isEditing) {
      saveEdit()
    }
  }

  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={todo.completed}
        onChange={handleToggle}
        aria-label={`標記 "${todo.text}" 為${todo.completed ? '未完成' : '完成'}`}
      />
      
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          className={styles.editInput}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={handleBlur}
          aria-label={`編輯 "${todo.text}"`}
        />
      ) : (
        <span
          ref={textRef}
          className={`${styles.text} ${todo.completed ? styles.completed : ''}`}
          onDoubleClick={handleDoubleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {todo.text}
          {todo.completed && (
            <span className="visually-hidden">（已完成）</span>
          )}
        </span>
      )}
      
      <button
        type="button"
        className={styles.deleteButton}
        onClick={handleDelete}
        aria-label={`刪除 "${todo.text}"`}
      >
        ×
      </button>
    </div>
  )
})
