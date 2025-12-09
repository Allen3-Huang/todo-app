import { useRef, type FormEvent } from 'react'
import type { TodoInputProps } from '../../types'
import styles from './TodoInput.module.css'

/**
 * TodoInput - 新增 todo 的輸入元件
 * 使用 uncontrolled form 避免 IME 問題
 * @see component-contracts.md
 */
export function TodoInput({ onAdd, isAtLimit = false }: TodoInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (isAtLimit) return
    
    const text = inputRef.current?.value.trim()
    if (!text) return
    
    onAdd(text)
    inputRef.current!.value = ''
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        placeholder={isAtLimit ? "已達上限 5 個項目" : "What needs to be done?"}
        aria-label="新增待辦事項"
        disabled={isAtLimit}
        autoFocus={!isAtLimit}
      />
    </form>
  )
}
