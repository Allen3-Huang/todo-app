# Implementation Plan: React 19 Todo App 核心功能

**Branch**: `001-todo-app-core` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app-core/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

建構一個 React 19 Todo App 核心功能，包含完整 CRUD 操作（新增、刪除、編輯、切換完成狀態）、篩選功能、統計顯示及 LocalStorage 持久化。採用 Neo Brutalism（新粗野/新野獸）風格設計 UI，使用 Zustand 進行狀態管理，遵循 React 19 最新模式與函式元件 hooks 開發規範。

## Technical Context

**Language/Version**: TypeScript 5.9+  
**Primary Dependencies**: React 19.2+, Zustand (狀態管理), Vite 7.x (建構工具)  
**Storage**: Browser LocalStorage (透過 Zustand persist middleware)  
**Testing**: Vitest + React Testing Library + axe-core (無障礙測試)  
**Target Platform**: 現代瀏覽器 (支援 ES2022+, localStorage)  
**Project Type**: single (純前端 SPA)  
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1, 支援 100+ todo 項目  
**Constraints**: 頁面載入 < 1s, 篩選切換 < 0.5s, 離線可用  
**Scale/Scope**: 單人使用, 無多使用者同步需求

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle                       | Status | Notes                                                                                                                                        |
| ------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Component-First Architecture | ✅      | 函式元件 + hooks，7 個獨立元件（TodoApp, TodoInput, TodoList, TodoItem, TodoFilter, TodoFooter, ConfirmDialog），均 <200 行，colocation 結構 |
| II. Type Safety First           | ✅      | tsconfig strict: true，定義 Todo, FilterType, TodoStore 等明確型別介面（見 data-model.md）                                                   |
| III. Test-Driven Development    | ✅      | Vitest + RTL + axe-core，quickstart.md 定義 TDD 開發順序與測試範例                                                                           |
| IV. Accessibility by Default    | ✅      | 語意化 HTML (header/main/footer/ul/li)、原生 checkbox、aria-live、aria-pressed、focus 管理、確認對話框（見 component-contracts.md）          |
| V. Security-First Development   | ✅      | React 自動 XSS 防護、LocalStorage 無敏感資料、console 不輸出使用者資料                                                                       |
| VI. Performance Optimization    | ✅      | Zustand selectors、React.memo(TodoItem)、useMemo(filteredTodos)、useTransition(篩選)、暫不需虛擬滾動                                         |

**Legend**: ⬜ Not Checked | ✅ Compliant | ⚠️ Justified Exception | ❌ Violation

### Post-Design Re-evaluation (2025-11-30)

所有 Constitution 原則均已在設計階段考量並規劃，無違規項目。關鍵設計決策：

- **元件拆分**: 7 個獨立元件，職責分明，均 <200 行
- **型別安全**: 完整 TypeScript 介面定義於 `data-model.md`
- **TDD 流程**: `quickstart.md` 提供測試優先的開發順序
- **無障礙**: `component-contracts.md` 詳列每個元件的 a11y 要求
- **效能**: 使用 Zustand selectors 避免不必要重新渲染

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── components/           # React 元件
│   ├── TodoApp/         # 主應用容器
│   │   ├── TodoApp.tsx
│   │   ├── TodoApp.test.tsx
│   │   └── TodoApp.module.css
│   ├── TodoInput/       # 新增 todo 輸入框
│   │   ├── TodoInput.tsx
│   │   ├── TodoInput.test.tsx
│   │   └── TodoInput.module.css
│   ├── TodoList/        # todo 清單容器
│   │   ├── TodoList.tsx
│   │   ├── TodoList.test.tsx
│   │   └── TodoList.module.css
│   ├── TodoItem/        # 單一 todo 項目
│   │   ├── TodoItem.tsx
│   │   ├── TodoItem.test.tsx
│   │   └── TodoItem.module.css
│   ├── TodoFilter/      # 篩選按鈕群組
│   │   ├── TodoFilter.tsx
│   │   ├── TodoFilter.test.tsx
│   │   └── TodoFilter.module.css
│   ├── TodoFooter/      # 底部統計與清除
│   │   ├── TodoFooter.tsx
│   │   ├── TodoFooter.test.tsx
│   │   └── TodoFooter.module.css
│   └── ConfirmDialog/   # 確認對話框
│       ├── ConfirmDialog.tsx
│       ├── ConfirmDialog.test.tsx
│       └── ConfirmDialog.module.css
├── stores/              # Zustand 狀態管理
│   ├── todoStore.ts
│   ├── todoStore.test.ts
│   └── types.ts
├── hooks/               # 自訂 hooks
│   └── useTodoActions.ts
├── styles/              # 全域樣式
│   └── neo-brutalism.css
├── utils/               # 工具函式
│   └── localStorage.ts
└── types/               # 共用型別定義
    └── index.ts

tests/
├── integration/         # 整合測試
│   └── todo-flow.test.tsx
└── setup.ts            # 測試設定
```

**Structure Decision**: 採用單一專案結構 (Option 1)，純前端 SPA 應用。元件採用 colocation 模式，將相關檔案（元件、測試、樣式）放在同一目錄。使用 Zustand 進行狀態管理，搭配 persist middleware 實現 LocalStorage 持久化。

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
