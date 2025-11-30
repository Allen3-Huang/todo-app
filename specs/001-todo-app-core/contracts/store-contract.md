# Store Contract: todoStore

**Date**: 2025-11-30  
**Feature**: 001-todo-app-core  
**Type**: Zustand State Management Contract

---

## 概述

此文件定義了 `todoStore` 的公開介面契約，包含狀態結構、Actions 規格和 Selectors 規格。

---

## Store 定義

### 建立方式

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      (set, get) => ({
        // state & actions
      }),
      { 
        name: 'todos-storage',
        version: 1,
        partialize: (state) => ({
          todos: state.todos,
          filter: state.filter
        })
      }
    ),
    { name: 'TodoStore' }
  )
);
```

---

## 狀態契約

### State

```typescript
interface TodoState {
  todos: Todo[];
  filter: FilterType;
}
```

| 屬性     | 型別         | 初始值  | 持久化 |
| -------- | ------------ | ------- | ------ |
| `todos`  | `Todo[]`     | `[]`    | ✅      |
| `filter` | `FilterType` | `'all'` | ✅      |

---

## Actions 契約

### addTodo

新增一個 todo 項目。

```typescript
addTodo: (text: string) => void
```

**行為規格**:
- 若 `text.trim()` 為空，不執行任何操作
- 產生新 `Todo` 物件：
  - `id`: `crypto.randomUUID()`
  - `text`: `text.trim()`
  - `completed`: `false`
  - `createdAt`: `new Date()`
- 新項目附加至 `todos` 陣列末尾

**對應需求**: FR-002, FR-003, FR-004

---

### toggleTodo

切換 todo 的完成狀態。

```typescript
toggleTodo: (id: string) => void
```

**行為規格**:
- 尋找 `id` 匹配的 todo
- 將該 todo 的 `completed` 反轉（true → false, false → true）
- 若找不到匹配的 todo，不執行任何操作

**對應需求**: FR-008

---

### deleteTodo

刪除一個 todo 項目。

```typescript
deleteTodo: (id: string) => void
```

**行為規格**:
- 從 `todos` 陣列中移除 `id` 匹配的項目
- 若找不到匹配的 todo，不執行任何操作

**對應需求**: FR-006

---

### updateTodo

更新 todo 的文字內容。

```typescript
updateTodo: (id: string, text: string) => void
```

**行為規格**:
- 若 `text.trim()` 為空，呼叫 `deleteTodo(id)`
- 否則更新該 todo 的 `text` 為 `text.trim()`
- 若找不到匹配的 todo，不執行任何操作

**對應需求**: FR-010 (Edge Case: 編輯時清空內容則刪除)

---

### setFilter

設定篩選條件。

```typescript
setFilter: (filter: FilterType) => void
```

**行為規格**:
- 將 `filter` 狀態設為指定值
- 不驗證 `filter` 值（TypeScript 已確保型別正確）

**對應需求**: FR-013

---

### clearCompleted

清除所有已完成的 todo 項目。

```typescript
clearCompleted: () => void
```

**行為規格**:
- 從 `todos` 陣列中移除所有 `completed === true` 的項目
- 若沒有已完成項目，不執行任何操作

**對應需求**: FR-016

---

## Selectors 契約

### selectFilteredTodos

取得根據篩選條件過濾後的 todo 清單。

```typescript
const selectFilteredTodos = (state: TodoState): Todo[]
```

**行為規格**:
- `filter === 'all'`: 返回全部 todos
- `filter === 'active'`: 返回 `completed === false` 的 todos
- `filter === 'completed'`: 返回 `completed === true` 的 todos

**對應需求**: FR-013

---

### selectActiveCount

取得未完成 todo 的數量。

```typescript
const selectActiveCount = (state: TodoState): number
```

**行為規格**:
- 返回 `todos.filter(t => !t.completed).length`

**對應需求**: FR-014

---

### selectHasCompleted

判斷是否有已完成的 todo。

```typescript
const selectHasCompleted = (state: TodoState): boolean
```

**行為規格**:
- 返回 `todos.some(t => t.completed)`
- 用於決定是否顯示 "Clear completed" 按鈕

**對應需求**: FR-015 (按鈕可隱藏)

---

## 使用範例

### 在元件中使用

```typescript
// 選取狀態
const todos = useTodoStore((state) => state.todos);
const filter = useTodoStore((state) => state.filter);

// 選取 actions
const addTodo = useTodoStore((state) => state.addTodo);
const toggleTodo = useTodoStore((state) => state.toggleTodo);

// 使用 selector
const filteredTodos = useTodoStore(selectFilteredTodos);
const activeCount = useTodoStore(selectActiveCount);

// 多值選取（使用 useShallow）
import { useShallow } from 'zustand/react/shallow';

const { todos, filter } = useTodoStore(
  useShallow((state) => ({
    todos: state.todos,
    filter: state.filter
  }))
);
```

### DevTools Action 名稱

```typescript
// 在 set 中指定 action 名稱
addTodo: (text) => set(
  (state) => ({ todos: [...state.todos, newTodo] }),
  undefined,
  'todos/add'
)
```

---

## 持久化契約

### LocalStorage Key

```
todos-storage
```

### 儲存格式

```typescript
{
  "state": {
    "todos": [
      {
        "id": "uuid-string",
        "text": "todo text",
        "completed": false,
        "createdAt": "2025-11-30T10:00:00.000Z"
      }
    ],
    "filter": "all"
  },
  "version": 1
}
```

### 資料型別轉換

載入時需將 `createdAt` 從 ISO 字串轉換為 `Date` 物件：

```typescript
persist(stateCreator, {
  name: 'todos-storage',
  version: 1,
  onRehydrateStorage: () => (state) => {
    if (state) {
      state.todos = state.todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
  }
})
```

---

## 錯誤處理

### LocalStorage 容量上限

依據 spec.md Edge Cases:

> LocalStorage 達到容量上限時，靜默失敗不儲存新資料但不影響當前操作

```typescript
persist(stateCreator, {
  name: 'todos-storage',
  storage: {
    getItem: (name) => {
      const value = localStorage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name, value) => {
      try {
        localStorage.setItem(name, JSON.stringify(value));
      } catch (e) {
        // 靜默失敗 - 可能是 QuotaExceededError
        console.warn('LocalStorage quota exceeded, data not saved');
      }
    },
    removeItem: (name) => localStorage.removeItem(name)
  }
})
```
