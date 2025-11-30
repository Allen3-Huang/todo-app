# Research: React 19 Todo App 核心功能

**Date**: 2025-11-30  
**Feature**: 001-todo-app-core  
**Status**: Complete

---

## 1. Zustand 狀態管理最佳實踐

### Decision: 使用 Zustand + persist middleware

**Rationale**: 
- Zustand 輕量（~1KB），比 Redux 簡潔，符合專案規模
- persist middleware 原生支援 localStorage，無需額外程式碼
- 與 React 19 完美整合，支援 hooks 模式
- TypeScript 支援良好，使用 curried form `create<T>()(...)` 確保型別安全

**Alternatives Considered**:
- **React Context + useReducer**: 需要較多 boilerplate，缺少持久化支援
- **Redux Toolkit**: 過於複雜，對小型 CRUD 應用來說是過度工程
- **Jotai/Recoil**: 原子化狀態管理，對 Todo App 來說不需要

### Store 設計決策

```typescript
interface TodoState {
  todos: Todo[]
  filter: FilterType
  addTodo: (text: string) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  updateTodo: (id: string, text: string) => void
  setFilter: (filter: FilterType) => void
  clearCompleted: () => void
}
```

**關鍵實踐**:
1. **Persist 配置**: 使用 `partialize` 只持久化 `todos` 和 `filter`
2. **Selectors**: 使用精確 selector 避免不必要重新渲染
3. **Action 命名**: 使用 `todos/add` 格式便於 DevTools 除錯
4. **不使用 Immer**: Todo 結構扁平，`map`/`filter` 已足夠簡潔

---

## 2. Neo Brutalism UI 設計

### Decision: 採用 Neo Brutalism 風格搭配 CSS Modules

**Rationale**:
- 強烈視覺風格，品牌識別度高
- CSS 複雜度低，不需要設計函式庫
- CSS Modules 提供作用域隔離，避免樣式衝突
- 黑色文字在鮮豔背景上自然符合 WCAG AA 對比度

**Alternatives Considered**:
- **Tailwind CSS**: 功能強大但增加學習曲線，且 Neo Brutalism 需要自訂
- **Styled Components**: 額外依賴，對此規模不必要
- **純 CSS**: 缺少作用域隔離，容易產生衝突

### 核心設計規範

| 元素     | 規格                              |
| -------- | --------------------------------- |
| 邊框寬度 | 3px solid #000000                 |
| 陰影     | 4px 4px 0px #000000 (hard shadow) |
| 圓角     | 0px (無圓角)                      |
| 主色     | #FF6B6B (珊瑚紅)                  |
| 輔色     | #4ECDC4 (青綠), #FFE66D (檸檬黃)  |
| 背景     | #FEF6E4 (米白)                    |
| 文字     | #000000 (純黑)                    |

### CSS 變數系統

```css
:root {
  --nb-primary: #FF6B6B;
  --nb-secondary: #4ECDC4;
  --nb-accent: #FFE66D;
  --nb-background: #FEF6E4;
  --nb-surface: #FFFFFF;
  --nb-text: #000000;
  --nb-border: 3px solid #000000;
  --nb-shadow: 4px 4px 0px #000000;
  --nb-transition: all 0.1s ease;
}
```

### 互動效果

- **Hover**: `transform: translate(2px, 2px)` + 陰影縮小
- **Active**: `transform: translate(4px, 4px)` + 陰影消失（模擬按下）
- **Focus**: 3px `#FFE66D` outline，offset 2px

---

## 3. React 19 特性應用

### Decision: 選擇性使用 React 19 新特性

**使用的特性**:

| 特性            | 使用場景      | 理由                          |
| --------------- | ------------- | ----------------------------- |
| `useTransition` | 篩選切換      | 非緊急 UI 更新，保持互動流暢  |
| `ref` as prop   | 元件 ref 傳遞 | 不需 forwardRef，程式碼更簡潔 |

**不使用的特性**:

| 特性            | 理由                                        |
| --------------- | ------------------------------------------- |
| `useOptimistic` | LocalStorage 是同步操作，無需樂觀更新       |
| `use()`         | 設計給 Promise/Context，不適用 localStorage |
| Form Actions    | 無 Server Actions 需求                      |

### Memoization 策略

```typescript
// 1. TodoItem 使用 memo()
const TodoItem = memo(function TodoItem(props: TodoItemProps) {...});

// 2. filteredTodos 使用 useMemo
const filteredTodos = useMemo(() => 
  filterTodos(todos, filter),
  [todos, filter]
);

// 3. 事件處理使用 useCallback + updater function
const handleToggle = useCallback((id: string) => {
  setTodos(todos => todos.map(t => 
    t.id === id ? { ...t, completed: !t.completed } : t
  ));
}, []); // 空依賴陣列
```

### 表單處理

**Decision**: 使用 Uncontrolled + `<form>` 提交

```typescript
function TodoInput({ onAdd }: { onAdd: (text: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = inputRef.current?.value.trim();
    if (text) {
      onAdd(text);
      inputRef.current!.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} type="text" />
    </form>
  );
}
```

**Rationale**: 
- 無需即時驗證
- 避免每次按鍵觸發重新渲染
- 原生支援 Enter 提交，不需處理 IME 問題

---

## 4. 無障礙 (Accessibility) 實踐

### Decision: 遵循 WCAG 2.1 AA 標準

**語意化結構**:

```html
<header>
  <h1>todos</h1>
  <form><!-- 新增輸入 --></form>
</header>

<main>
  <ul role="list" aria-label="待辦事項清單">
    <li><!-- todo item --></li>
  </ul>
</main>

<footer>
  <!-- 統計、篩選、清除 -->
</footer>
```

### 必須實作的無障礙功能

| 功能       | 實作方式                        |
| ---------- | ------------------------------- |
| Checkbox   | 原生 `<input type="checkbox">`  |
| 表單標籤   | `<label>` 關聯或 `aria-label`   |
| 篩選群組   | `role="group"` + `aria-pressed` |
| 狀態通知   | `aria-live="polite"` 區域       |
| Focus 管理 | 刪除後移至相鄰項目              |
| 鍵盤支援   | Tab, Enter, Space, Escape       |

### 編輯模式的鍵盤替代

- **進入編輯**: 雙擊 + Enter/F2 鍵（鍵盤替代）
- **確認編輯**: Enter 或 blur
- **取消編輯**: Escape
- **Focus**: 進入編輯時自動 focus 輸入框

### Live Region 實作

```tsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="visually-hidden"
>
  {announcement}
</div>
```

使用時機：
- 新增：「已新增待辦事項：{text}」
- 刪除：「已刪除：{text}」
- 完成狀態：「已將 {text} 標記為完成」

---

## 5. 測試策略

### Decision: Vitest + React Testing Library + axe-core

**測試類型分配**:

| 類型       | 範圍                 | 工具     |
| ---------- | -------------------- | -------- |
| 單元測試   | Zustand store, utils | Vitest   |
| 元件測試   | 各 React 元件        | RTL      |
| 無障礙測試 | 所有元件             | jest-axe |
| 整合測試   | 完整 CRUD 流程       | RTL      |

### axe-core 必測規則

- `label`: 表單元素標籤
- `button-name`: 按鈕可識別文字
- `color-contrast`: 顏色對比度
- `aria-required-attr`: ARIA 必要屬性
- `keyboard`: 鍵盤可操作性

---

## 6. 效能優化策略

### Decision: 優先使用 React 內建優化

**優化層級**:

1. **Zustand Selectors**: 精確訂閱狀態，避免無關渲染
2. **React.memo**: TodoItem 元件 memoization
3. **useMemo**: filteredTodos 計算快取
4. **useCallback**: 事件處理穩定化

**暫不需要**:
- 虛擬滾動（100+ 項目用 memo 已足夠）
- Code splitting（單頁應用，bundle 小）

---

## 7. 相依套件規劃

### 必要套件

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "vitest": "^3.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jest-axe": "^9.0.0",
    "jsdom": "^25.0.0"
  }
}
```

### 不需要的套件

| 套件                    | 理由                            |
| ----------------------- | ------------------------------- |
| immer                   | Todo 結構扁平，不需要           |
| nanoid/uuid             | 使用 `crypto.randomUUID()` 即可 |
| focus-trap-react        | 對話框簡單，手動管理即可        |
| @tanstack/react-virtual | 100+ 項目不需要虛擬滾動         |
