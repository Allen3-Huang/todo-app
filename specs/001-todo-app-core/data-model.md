# Data Model: React 19 Todo App

**Date**: 2025-11-30  
**Feature**: 001-todo-app-core  
**Source**: [spec.md](./spec.md) Key Entities

---

## 實體定義

### Todo

代表一個待辦事項。

```typescript
/**
 * 待辦事項實體
 * 
 * @example
 * const todo: Todo = {
 *   id: 'a1b2c3d4',
 *   text: '買牛奶',
 *   completed: false,
 *   createdAt: new Date('2025-11-30T10:00:00Z')
 * };
 */
interface Todo {
  /** 唯一識別碼，使用 crypto.randomUUID() 產生 */
  id: string;
  
  /** 待辦事項內容，純文字，已去除首尾空白 */
  text: string;
  
  /** 完成狀態，預設為 false */
  completed: boolean;
  
  /** 建立時間，用於排序（最新項目在最下方） */
  createdAt: Date;
}
```

#### 欄位說明

| 欄位        | 型別      | 必填 | 預設值       | 說明                                       |
| ----------- | --------- | ---- | ------------ | ------------------------------------------ |
| `id`        | `string`  | ✅    | -            | UUID 格式，使用 `crypto.randomUUID()` 產生 |
| `text`      | `string`  | ✅    | -            | 純文字內容，不可為空白                     |
| `completed` | `boolean` | ✅    | `false`      | 完成狀態                                   |
| `createdAt` | `Date`    | ✅    | `new Date()` | 建立時間戳記                               |

#### 驗證規則

1. **text 不可為空**: `text.trim().length > 0`
2. **text 儲存前需 trim**: 去除首尾空白
3. **編輯時 text 為空**: 刪除該 todo 項目

---

### FilterType

代表篩選狀態。

```typescript
/**
 * 篩選類型
 * 
 * @description
 * - 'all': 顯示所有 todo 項目
 * - 'active': 只顯示未完成的項目 (completed === false)
 * - 'completed': 只顯示已完成的項目 (completed === true)
 */
type FilterType = 'all' | 'active' | 'completed';
```

#### 預設值

頁面載入時預設為 `'all'`（FR-019）。

---

## 狀態結構

### TodoStore (Zustand)

```typescript
/**
 * Todo App 全域狀態
 */
interface TodoState {
  /** 所有 todo 項目 */
  todos: Todo[];
  
  /** 當前篩選條件 */
  filter: FilterType;
}

/**
 * Todo App Actions
 */
interface TodoActions {
  /** 新增 todo 項目 */
  addTodo: (text: string) => void;
  
  /** 切換 todo 完成狀態 */
  toggleTodo: (id: string) => void;
  
  /** 刪除 todo 項目 */
  deleteTodo: (id: string) => void;
  
  /** 更新 todo 內容 */
  updateTodo: (id: string, text: string) => void;
  
  /** 設定篩選條件 */
  setFilter: (filter: FilterType) => void;
  
  /** 清除所有已完成項目 */
  clearCompleted: () => void;
}

/** 完整 Store 型別 */
type TodoStore = TodoState & TodoActions;
```

---

## 衍生狀態 (Selectors)

### 過濾後的 Todo 清單

```typescript
/**
 * 根據篩選條件取得對應的 todo 項目
 */
const selectFilteredTodos = (state: TodoState): Todo[] => {
  switch (state.filter) {
    case 'active':
      return state.todos.filter(todo => !todo.completed);
    case 'completed':
      return state.todos.filter(todo => todo.completed);
    default:
      return state.todos;
  }
};
```

### 統計數據

```typescript
/**
 * 未完成項目數量
 */
const selectActiveCount = (state: TodoState): number =>
  state.todos.filter(todo => !todo.completed).length;

/**
 * 是否有已完成項目（用於顯示/隱藏 Clear completed 按鈕）
 */
const selectHasCompleted = (state: TodoState): boolean =>
  state.todos.some(todo => todo.completed);

/**
 * 總項目數量
 */
const selectTotalCount = (state: TodoState): number =>
  state.todos.length;
```

---

## 狀態轉換

### Todo 狀態機

```
                    ┌─────────────┐
                    │   未完成    │
                    │ (active)    │
                    └──────┬──────┘
                           │
          toggleTodo()     │     toggleTodo()
              ▲            ▼           ▲
              │    ┌─────────────┐     │
              └────│   已完成    │─────┘
                   │ (completed) │
                   └─────────────┘
```

### Action 效果

| Action                 | 前置條件             | 效果           | 後置條件            |
| ---------------------- | -------------------- | -------------- | ------------------- |
| `addTodo(text)`        | text.trim() 非空     | 新增 Todo      | todos.length + 1    |
| `toggleTodo(id)`       | todo 存在            | 切換 completed | todo.completed 反轉 |
| `deleteTodo(id)`       | todo 存在            | 移除 todo      | todos.length - 1    |
| `updateTodo(id, text)` | todo 存在, text 非空 | 更新 text      | todo.text 變更      |
| `updateTodo(id, '')`   | todo 存在, text 為空 | 刪除 todo      | todos.length - 1    |
| `setFilter(filter)`    | -                    | 變更篩選       | filter 變更         |
| `clearCompleted()`     | -                    | 移除已完成     | 只保留 active todos |

---

## 持久化結構

### LocalStorage Schema

**Key**: `todos-storage`

```typescript
interface PersistedState {
  state: {
    todos: Array<{
      id: string;
      text: string;
      completed: boolean;
      createdAt: string; // ISO 8601 format
    }>;
    filter: FilterType;
  };
  version: number;
}
```

**注意事項**:
- `createdAt` 在 LocalStorage 中儲存為 ISO 字串，載入時需轉換回 `Date` 物件
- 使用 Zustand persist middleware 的 `version` 欄位進行版本控制

### 版本遷移

```typescript
// 版本 1: 初始結構
{
  version: 1,
  migrate: (state, version) => {
    // 未來擴展時在此處理遷移
    return state;
  }
}
```

---

## UI 元件 Props 型別

### TodoItemProps

```typescript
interface TodoItemProps {
  /** Todo 資料 */
  todo: Todo;
  
  /** 切換完成狀態的回呼 */
  onToggle: (id: string) => void;
  
  /** 刪除項目的回呼 */
  onDelete: (id: string) => void;
  
  /** 更新內容的回呼 */
  onUpdate: (id: string, text: string) => void;
}
```

### TodoFilterProps

```typescript
interface TodoFilterProps {
  /** 當前篩選條件 */
  currentFilter: FilterType;
  
  /** 切換篩選的回呼 */
  onFilterChange: (filter: FilterType) => void;
}
```

### ConfirmDialogProps

```typescript
interface ConfirmDialogProps {
  /** 是否顯示對話框 */
  isOpen: boolean;
  
  /** 對話框標題 */
  title: string;
  
  /** 對話框內容描述 */
  description: string;
  
  /** 確認按鈕的回呼 */
  onConfirm: () => void;
  
  /** 取消按鈕的回呼 */
  onCancel: () => void;
}
```

---

## 完整型別定義檔案

建議放置於 `src/types/index.ts`:

```typescript
// ===== 核心實體 =====
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

// ===== Store 型別 =====
export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

export interface TodoActions {
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
}

export type TodoStore = TodoState & TodoActions;

// ===== 元件 Props =====
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, text: string) => void;
}

export interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```
