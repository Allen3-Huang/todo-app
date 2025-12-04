import type { TodoFooterProps } from '../../types'
import { TodoFilter } from '../TodoFilter/TodoFilter'
import styles from './TodoFooter.module.css'

/**
 * TodoFooter - 底部統計與操作區
 * @see component-contracts.md
 */
export function TodoFooter({
  activeCount,
  hasCompleted,
  currentFilter,
  hasTodos,
  onFilterChange,
  onClearCompleted,
}: TodoFooterProps) {
  // 若無任何 todo 項目，不渲染
  if (!hasTodos) {
    return null
  }

  return (
    <footer className={styles.footer} role="contentinfo">
      <span className={styles.count} aria-live="polite">
        {activeCount} 項未完成
      </span>

      <TodoFilter
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />

      {hasCompleted && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClearCompleted}
          aria-label="清除已完成項目"
        >
          清除已完成
        </button>
      )}
    </footer>
  )
}
