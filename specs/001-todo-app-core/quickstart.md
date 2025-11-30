# Quickstart: React 19 Todo App 核心功能

**Date**: 2025-11-30  
**Feature**: 001-todo-app-core

---

## 快速開始

### 1. 安裝相依套件

```bash
# 安裝 runtime 相依套件
npm install zustand

# 安裝測試相依套件
npm install -D vitest @testing-library/react @testing-library/user-event jsdom jest-axe @types/jest-axe
```

### 2. 設定測試環境

更新 `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    css: true,
  }
})
```

建立 `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from 'jest-axe';

expect.extend(matchers);
```

更新 `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## 開發順序

遵循 TDD 原則，建議開發順序如下：

### Phase 1: 基礎架構

1. **型別定義** - `src/types/index.ts`
   - Todo, FilterType 等核心型別

2. **全域樣式** - `src/styles/neo-brutalism.css`
   - CSS 變數
   - 基礎元件樣式（按鈕、輸入框、checkbox）

### Phase 2: 狀態管理

3. **Zustand Store** - `src/stores/todoStore.ts`
   - 先寫測試 `src/stores/todoStore.test.ts`
   - 實作狀態與 actions

### Phase 3: 核心元件 (P1 功能)

4. **TodoInput** - 新增功能 (User Story 1)
   - 測試 → 實作 → 樣式

5. **TodoItem** - 切換完成 + 刪除 (User Story 2, 3)
   - 測試 → 實作 → 樣式

6. **ConfirmDialog** - 刪除確認
   - 測試 → 實作 → 樣式

7. **TodoList** - 項目容器
   - 測試 → 實作 → 樣式

### Phase 4: 進階功能 (P2)

8. **TodoItem 編輯模式** (User Story 4)
   - 更新測試 → 實作

9. **TodoFilter** - 篩選功能 (User Story 5)
   - 測試 → 實作 → 樣式

10. **TodoFooter** - 統計與清除 (User Story 6, 7)
    - 測試 → 實作 → 樣式

### Phase 5: 持久化 (P1)

11. **LocalStorage 整合** (User Story 8)
    - 更新 store 使用 persist middleware
    - 整合測試

### Phase 6: 整合與優化

12. **TodoApp** - 組裝所有元件
    - 整合測試
    - 無障礙測試 (axe-core)

---

## 目錄結構

```
src/
├── components/
│   ├── TodoApp/
│   │   ├── TodoApp.tsx
│   │   ├── TodoApp.test.tsx
│   │   └── TodoApp.module.css
│   ├── TodoInput/
│   │   ├── TodoInput.tsx
│   │   ├── TodoInput.test.tsx
│   │   └── TodoInput.module.css
│   ├── TodoList/
│   │   ├── TodoList.tsx
│   │   ├── TodoList.test.tsx
│   │   └── TodoList.module.css
│   ├── TodoItem/
│   │   ├── TodoItem.tsx
│   │   ├── TodoItem.test.tsx
│   │   └── TodoItem.module.css
│   ├── TodoFilter/
│   │   ├── TodoFilter.tsx
│   │   ├── TodoFilter.test.tsx
│   │   └── TodoFilter.module.css
│   ├── TodoFooter/
│   │   ├── TodoFooter.tsx
│   │   ├── TodoFooter.test.tsx
│   │   └── TodoFooter.module.css
│   └── ConfirmDialog/
│       ├── ConfirmDialog.tsx
│       ├── ConfirmDialog.test.tsx
│       └── ConfirmDialog.module.css
├── stores/
│   ├── todoStore.ts
│   └── todoStore.test.ts
├── styles/
│   └── neo-brutalism.css
├── types/
│   └── index.ts
├── App.tsx
├── App.css
├── main.tsx
└── index.css

tests/
├── integration/
│   └── todo-flow.test.tsx
└── setup.ts
```

---

## 測試範例

### Store 測試

```typescript
// src/stores/todoStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useTodoStore } from './todoStore';

describe('todoStore', () => {
  beforeEach(() => {
    useTodoStore.setState({ todos: [], filter: 'all' });
  });

  describe('addTodo', () => {
    it('should add a new todo with trimmed text', () => {
      useTodoStore.getState().addTodo('  買牛奶  ');
      
      const todos = useTodoStore.getState().todos;
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('買牛奶');
      expect(todos[0].completed).toBe(false);
    });

    it('should not add todo with empty text', () => {
      useTodoStore.getState().addTodo('   ');
      
      expect(useTodoStore.getState().todos).toHaveLength(0);
    });
  });
});
```

### 元件測試

```typescript
// src/components/TodoInput/TodoInput.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from './TodoInput';

describe('TodoInput', () => {
  it('should call onAdd with trimmed text when submitting', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '買牛奶{enter}');
    
    expect(onAdd).toHaveBeenCalledWith('買牛奶');
    expect(input).toHaveValue('');
  });

  it('should not call onAdd with empty text', async () => {
    const onAdd = vi.fn();
    const user = userEvent.setup();
    
    render(<TodoInput onAdd={onAdd} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '   {enter}');
    
    expect(onAdd).not.toHaveBeenCalled();
  });
});
```

### 無障礙測試

```typescript
// src/components/TodoApp/TodoApp.test.tsx
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TodoApp } from './TodoApp';

expect.extend(toHaveNoViolations);

describe('TodoApp Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<TodoApp />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## 驗收檢查清單

### P1 功能

- [ ] **FR-001**: 提供輸入框新增 todo
- [ ] **FR-002**: Enter 鍵新增 todo（非空內容）
- [ ] **FR-003**: 新項目預設 completed = false
- [ ] **FR-004**: 新增後清空輸入框
- [ ] **FR-005**: 顯示刪除按鈕
- [ ] **FR-006**: 點擊刪除移除項目（經確認）
- [ ] **FR-007**: 顯示 checkbox
- [ ] **FR-008**: checkbox 切換完成狀態
- [ ] **FR-017**: 儲存至 LocalStorage
- [ ] **FR-018**: 載入時讀取 LocalStorage

### P2 功能

- [ ] **FR-009**: 雙擊進入編輯模式
- [ ] **FR-010**: Enter/blur 儲存編輯
- [ ] **FR-011**: Esc 取消編輯
- [ ] **FR-012**: 三個篩選按鈕
- [ ] **FR-013**: 根據篩選顯示項目
- [ ] **FR-019**: 預設篩選為 All
- [ ] **FR-014**: 顯示未完成計數
- [ ] **FR-015**: 提供 Clear completed 按鈕
- [ ] **FR-016**: 點擊清除已完成項目

### 無障礙 (NON-NEGOTIABLE)

- [ ] **AR-001**: 鍵盤操作支援
- [ ] **AR-002**: 表單標籤關聯
- [ ] **AR-003**: 螢幕閱讀器通知
- [ ] **AR-004**: 非純色彩區分完成狀態
- [ ] **AR-005**: 篩選選中狀態可辨識
- [ ] **AR-006**: 刪除確認對話框

### 安全性 (NON-NEGOTIABLE)

- [ ] **SR-001**: XSS 防護（React 自動處理）
- [ ] **SR-002**: LocalStorage 無敏感資料
- [ ] **SR-003**: 不輸出使用者資料至 console

---

## 執行測試

```bash
# 執行所有測試
npm test

# 監視模式
npm test -- --watch

# 查看覆蓋率
npm run test:coverage

# 只執行特定測試
npm test -- todoStore
```

---

## 常見問題

### Q: 如何測試 LocalStorage？

```typescript
import { beforeEach } from 'vitest';

beforeEach(() => {
  localStorage.clear();
});
```

### Q: 如何測試 useTransition？

```typescript
import { act } from '@testing-library/react';

await act(async () => {
  // 觸發 transition
  await user.click(filterButton);
});
```

### Q: 如何 mock crypto.randomUUID？

```typescript
import { vi } from 'vitest';

vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-123'
});
```
