import type { TodoFilterProps, FilterType } from '../../types'
import styles from './TodoFilter.module.css'

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' },
]

/**
 * TodoFilter - 篩選按鈕群組元件
 * @see component-contracts.md
 */
export function TodoFilter({ currentFilter, onFilterChange }: TodoFilterProps) {
  return (
    <div
      role="group"
      aria-label="篩選待辦事項"
      className={styles.filterGroup}
    >
      {FILTER_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className={`${styles.filterButton} ${currentFilter === value ? styles.active : ''}`}
          aria-pressed={currentFilter === value}
          onClick={() => onFilterChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
