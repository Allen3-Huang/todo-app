/**
 * Todo App 核心型別定義
 * @see data-model.md
 */

/**
 * 待辦事項實體
 */
export interface Todo {
  /** 唯一識別碼，使用 crypto.randomUUID() 產生 */
  id: string
  
  /** 待辦事項內容，純文字，已去除首尾空白 */
  text: string
  
  /** 完成狀態，預設為 false */
  completed: boolean
  
  /** 建立時間，用於排序（最新項目在最下方） */
  createdAt: Date
}

/**
 * 篩選類型
 * - 'all': 顯示所有 todo 項目
 * - 'active': 只顯示未完成的項目 (completed === false)
 * - 'completed': 只顯示已完成的項目 (completed === true)
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * Todo App 狀態
 */
export interface TodoState {
  /** 所有 todo 項目 */
  todos: Todo[]
  
  /** 當前篩選條件 */
  filter: FilterType
}

/**
 * Todo App Actions
 */
export interface TodoActions {
  /** 新增 todo 項目 */
  addTodo: (text: string) => void
  
  /** 切換 todo 完成狀態 */
  toggleTodo: (id: string) => void
  
  /** 刪除 todo 項目 */
  deleteTodo: (id: string) => void
  
  /** 更新 todo 內容 */
  updateTodo: (id: string, text: string) => void
  
  /** 設定篩選條件 */
  setFilter: (filter: FilterType) => void
  
  /** 清除所有已完成項目 */
  clearCompleted: () => void
}

/**
 * 完整 Store 型別
 */
export type TodoStore = TodoState & TodoActions

/**
 * TodoInput 元件 Props
 */
export interface TodoInputProps {
  /** 新增 todo 的回呼函式 */
  onAdd: (text: string) => void
  
  /** 是否已達到上限 (5 個) */
  isAtLimit?: boolean
}

/**
 * TodoList 元件 Props
 */
export interface TodoListProps {
  /** 要顯示的 todo 項目（已過濾） */
  todos: Todo[]
  
  /** 切換完成狀態的回呼 */
  onToggle: (id: string) => void
  
  /** 刪除項目的回呼（呼叫後需顯示確認對話框） */
  onDelete: (id: string) => void
  
  /** 更新內容的回呼 */
  onUpdate: (id: string, text: string) => void
}

/**
 * TodoItem 元件 Props
 */
export interface TodoItemProps {
  /** Todo 資料 */
  todo: Todo
  
  /** 切換完成狀態的回呼 */
  onToggle: (id: string) => void
  
  /** 刪除項目的回呼 */
  onDelete: (id: string) => void
  
  /** 更新內容的回呼 */
  onUpdate: (id: string, text: string) => void
}

/**
 * TodoFooter 元件 Props
 */
export interface TodoFooterProps {
  /** 未完成項目數量 */
  activeCount: number
  
  /** 是否有已完成項目 */
  hasCompleted: boolean
  
  /** 當前篩選條件 */
  currentFilter: FilterType
  
  /** 是否有任何 todo 項目（用於決定是否渲染 footer） */
  hasTodos: boolean
  
  /** 篩選變更的回呼 */
  onFilterChange: (filter: FilterType) => void
  
  /** 清除已完成的回呼 */
  onClearCompleted: () => void
}

/**
 * TodoFilter 元件 Props
 */
export interface TodoFilterProps {
  /** 當前篩選條件 */
  currentFilter: FilterType
  
  /** 篩選變更的回呼 */
  onFilterChange: (filter: FilterType) => void
}

/**
 * ConfirmDialog 元件 Props
 */
export interface ConfirmDialogProps {
  /** 是否顯示對話框 */
  isOpen: boolean
  
  /** 對話框標題 */
  title: string
  
  /** 對話框內容描述 */
  description: string
  
  /** 確認按鈕的回呼 */
  onConfirm: () => void
  
  /** 取消按鈕的回呼 */
  onCancel: () => void
}
