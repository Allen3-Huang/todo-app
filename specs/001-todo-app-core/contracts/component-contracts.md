# Component Contracts: React 19 Todo App

**Date**: 2025-11-30  
**Feature**: 001-todo-app-core  
**Type**: React Component API Contract

---

## 元件階層

```
TodoApp (root)
├── TodoInput
├── TodoList
│   └── TodoItem (multiple)
├── TodoFooter
│   └── TodoFilter
└── ConfirmDialog
```

---

## TodoApp

根元件，負責整體布局。

### Contract

```typescript
interface TodoAppProps {
  // 無 props - 使用 Zustand 管理狀態
}

function TodoApp(): JSX.Element
```

### 職責

- 提供語意化 HTML 結構（header/main/footer）
- 渲染子元件
- 不直接處理業務邏輯

### 無障礙要求

- 使用 `<header>`, `<main>`, `<footer>` 語意元素
- 頁面標題使用 `<h1>` (唯一)

---

## TodoInput

新增 todo 的輸入元件。

### Contract

```typescript
interface TodoInputProps {
  /** 新增 todo 的回呼函式 */
  onAdd: (text: string) => void;
}

function TodoInput(props: TodoInputProps): JSX.Element
```

### 行為規格

| 事件       | 條件               | 行為                                  |
| ---------- | ------------------ | ------------------------------------- |
| `onSubmit` | `text.trim()` 非空 | 呼叫 `onAdd(text.trim())`，清空輸入框 |
| `onSubmit` | `text.trim()` 為空 | 不執行任何操作                        |
| Enter 鍵   | -                  | 觸發 form submit                      |

### 無障礙要求

- 輸入框需有 `aria-label` 或關聯的 `<label>`
- 建議使用 `placeholder` 提供視覺提示
- 自動 focus（`autoFocus`）

### UI 規格 (Neo Brutalism)

- 粗黑邊框 (3px)
- Hard shadow (4px 4px)
- Focus 時邊框變色 + 位移效果

---

## TodoList

Todo 項目清單容器。

### Contract

```typescript
interface TodoListProps {
  /** 要顯示的 todo 項目（已過濾） */
  todos: Todo[];
  
  /** 切換完成狀態的回呼 */
  onToggle: (id: string) => void;
  
  /** 刪除項目的回呼（呼叫後需顯示確認對話框） */
  onDelete: (id: string) => void;
  
  /** 更新內容的回呼 */
  onUpdate: (id: string, text: string) => void;
}

function TodoList(props: TodoListProps): JSX.Element
```

### 行為規格

- 渲染 `<ul>` 包含所有 todo 項目
- 每個項目使用 `TodoItem` 元件
- 傳遞對應的 handlers 給子元件

### 無障礙要求

- 使用 `<ul role="list">` 語意（確保 list-style: none 時仍有語意）
- `aria-label="待辦事項清單"`

---

## TodoItem

單一 todo 項目元件。

### Contract

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

const TodoItem: React.MemoExoticComponent<(props: TodoItemProps) => JSX.Element>
```

### 狀態

```typescript
// 內部狀態
const [isEditing, setIsEditing] = useState(false);
const [editText, setEditText] = useState(todo.text);
```

### 行為規格

| 互動            | 行為                                             |
| --------------- | ------------------------------------------------ |
| 點擊 checkbox   | 呼叫 `onToggle(todo.id)`                         |
| 點擊刪除按鈕    | 呼叫 `onDelete(todo.id)`                         |
| 雙擊文字        | 進入編輯模式                                     |
| 編輯時按 Enter  | 呼叫 `onUpdate(todo.id, editText)`，退出編輯模式 |
| 編輯時按 Escape | 恢復原文字，退出編輯模式                         |
| 編輯時 blur     | 呼叫 `onUpdate(todo.id, editText)`，退出編輯模式 |
| F2 鍵（聚焦時） | 進入編輯模式（鍵盤替代雙擊）                     |

### 無障礙要求

- 使用原生 `<input type="checkbox">`
- checkbox 需有 `aria-label`（如：`標記 "${text}" 為完成`）
- 刪除按鈕需有 `aria-label`（如：`刪除 "${text}"`）
- 已完成項目使用視覺隱藏文字標示狀態
- 編輯模式自動 focus 輸入框

### UI 規格 (Neo Brutalism)

- 粗黑邊框 (3px)，項目間邊框合併
- 已完成：文字刪除線 + 淡化顏色 (#666)
- Checkbox：自訂樣式，勾選時背景變色
- 刪除按鈕：hover 時顯示，或始終顯示

---

## TodoFooter

底部統計與操作區。

### Contract

```typescript
interface TodoFooterProps {
  /** 未完成項目數量 */
  activeCount: number;
  
  /** 是否有已完成項目 */
  hasCompleted: boolean;
  
  /** 當前篩選條件 */
  currentFilter: FilterType;
  
  /** 篩選變更的回呼 */
  onFilterChange: (filter: FilterType) => void;
  
  /** 清除已完成的回呼 */
  onClearCompleted: () => void;
}

function TodoFooter(props: TodoFooterProps): JSX.Element | null
```

### 行為規格

- 若無任何 todo 項目，返回 `null`（不渲染）
- 顯示未完成計數：單數 "item left"，複數 "items left"
- 包含 `TodoFilter` 元件
- "Clear completed" 按鈕：
  - `hasCompleted === true` 時顯示
  - `hasCompleted === false` 時隱藏或 disabled

### 無障礙要求

- 計數使用 `aria-live="polite"` 更新通知
- 按鈕明確標示功能

---

## TodoFilter

篩選按鈕群組。

### Contract

```typescript
interface TodoFilterProps {
  /** 當前篩選條件 */
  currentFilter: FilterType;
  
  /** 篩選變更的回呼 */
  onFilterChange: (filter: FilterType) => void;
}

function TodoFilter(props: TodoFilterProps): JSX.Element
```

### 行為規格

- 三個按鈕：All, Active, Completed
- 當前選中的按鈕視覺區別

### 無障礙要求

- 使用 `role="group"` 包裹
- `aria-label="篩選待辦事項"`
- 按鈕使用 `aria-pressed` 標示選中狀態

### UI 規格 (Neo Brutalism)

- 按鈕間有間距
- 選中按鈕：不同背景色 + 無陰影（按下狀態）
- 未選中按鈕：標準按鈕樣式

---

## ConfirmDialog

刪除確認對話框。

### Contract

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

function ConfirmDialog(props: ConfirmDialogProps): JSX.Element | null
```

### 行為規格

- `isOpen === false` 時返回 `null`
- 開啟時 focus 移至取消按鈕（較安全的預設）
- 關閉時 focus 返回原觸發元素
- 點擊背景遮罩等同取消

### 無障礙要求

- `role="alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` 連結標題
- `aria-describedby` 連結描述
- Focus trap：Tab 只在對話框內循環
- Escape 鍵關閉對話框

### UI 規格 (Neo Brutalism)

- 半透明背景遮罩（非漸層）
- 對話框：粗黑邊框 + hard shadow
- 確認按鈕：警示色（紅色系）
- 取消按鈕：一般按鈕樣式

---

## 共用 UI 元件樣式契約

### Button

```css
.nb-button {
  min-height: 44px; /* 無障礙最小點擊區域 */
  border: 3px solid var(--nb-border);
  box-shadow: 4px 4px 0px var(--nb-border);
  transition: all 0.1s ease;
}

.nb-button:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--nb-border);
}

.nb-button:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}

.nb-button:focus-visible {
  outline: 3px solid var(--nb-accent);
  outline-offset: 2px;
}
```

### Input

```css
.nb-input {
  min-height: 44px;
  border: 3px solid var(--nb-border);
  box-shadow: 4px 4px 0px var(--nb-border);
}

.nb-input:focus {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px var(--nb-border);
  border-color: var(--nb-primary);
  outline: none;
}
```

### Checkbox

```css
.nb-checkbox {
  width: 24px;
  height: 24px;
  border: 3px solid var(--nb-border);
  box-shadow: 2px 2px 0px var(--nb-border);
  appearance: none;
}

.nb-checkbox:checked {
  background-color: var(--nb-success);
}

.nb-checkbox:checked::after {
  content: "✓";
}
```
