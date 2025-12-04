# Tasks: React 19 Todo App 核心功能

**Input**: Design documents from `/specs/001-todo-app-core/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Per Constitution III (Test-Driven Development), tests are MANDATORY. Tests MUST be written first and verified to FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Install runtime dependencies: `npm install zustand`
- [x] T002 Install dev dependencies: `npm install -D vitest @testing-library/react @testing-library/user-event jsdom jest-axe @types/jest-axe @vitest/coverage-v8`
- [x] T003 [P] Configure Vitest in `vite.config.ts` with jsdom environment and setup file
- [x] T004 [P] Create test setup file at `tests/setup.ts` with jest-axe matchers
- [x] T005 [P] Update `package.json` scripts: add test, test:ui, test:coverage
- [x] T006 [P] Create Neo Brutalism CSS variables at `src/styles/neo-brutalism.css` (Constitution VII)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create TypeScript type definitions at `src/types/index.ts` (Todo, FilterType, TodoStore, Props interfaces)
- [x] T008 Write Zustand store tests at `src/stores/todoStore.test.ts` (TDD - Constitution III)
- [x] T009 Implement Zustand store at `src/stores/todoStore.ts` with persist middleware
- [x] T010 [P] Create TodoApp container component at `src/components/TodoApp/TodoApp.tsx` (semantic HTML structure)
- [x] T011 [P] Create TodoApp styles at `src/components/TodoApp/TodoApp.module.css` (Neo Brutalism layout)
- [x] T012 Update `src/App.tsx` to render TodoApp and import global styles
- [x] T013 Update `src/index.css` to set global background and font

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - 新增 Todo 項目 (Priority: P1) 🎯 MVP

**Goal**: 使用者能夠在輸入框輸入文字並按 Enter 新增 todo 項目

**Independent Test**: 在輸入框輸入文字並按 Enter，驗證新項目出現在清單中且輸入框已清空

### Tests for User Story 1 (Constitution III - Mandatory) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T014 [P] [US1] Write TodoInput component test at `src/components/TodoInput/TodoInput.test.tsx`
- [x] T015 [P] [US1] Write TodoList component test at `src/components/TodoList/TodoList.test.tsx`
- [x] T016 [P] [US1] Write accessibility test for TodoInput with axe-core (Constitution IV)

### Implementation for User Story 1

- [x] T017 [P] [US1] Create TodoInput component at `src/components/TodoInput/TodoInput.tsx` (uncontrolled form)
- [x] T018 [P] [US1] Create TodoInput styles at `src/components/TodoInput/TodoInput.module.css` (Neo Brutalism input)
- [x] T019 [P] [US1] Create TodoList container at `src/components/TodoList/TodoList.tsx`
- [x] T020 [P] [US1] Create TodoList styles at `src/components/TodoList/TodoList.module.css`
- [x] T021 [US1] Wire TodoInput to store.addTodo in TodoApp
- [x] T022 [US1] Add aria-label to TodoInput for screen readers (Constitution IV)

**Checkpoint**: User Story 1 完成 - 可以新增 todo 項目

---

## Phase 4: User Story 2 - 切換 Todo 完成狀態 (Priority: P1)

**Goal**: 使用者能夠透過勾選 checkbox 標記待辦事項為已完成或未完成

**Independent Test**: 點擊現有 todo 項目的 checkbox，驗證狀態正確切換

### Tests for User Story 2 (Constitution III - Mandatory) ⚠️

- [x] T023 [P] [US2] Write TodoItem component test at `src/components/TodoItem/TodoItem.test.tsx` (toggle behavior)
- [x] T024 [P] [US2] Write accessibility test for checkbox with axe-core (Constitution IV)

### Implementation for User Story 2

- [x] T025 [P] [US2] Create TodoItem component at `src/components/TodoItem/TodoItem.tsx` with native checkbox
- [x] T026 [P] [US2] Create TodoItem styles at `src/components/TodoItem/TodoItem.module.css` (Neo Brutalism checkbox, completed state)
- [x] T027 [US2] Wire TodoItem.onToggle to store.toggleTodo in TodoList
- [x] T028 [US2] Add aria-label to checkbox: `標記 "${text}" 為完成` (Constitution IV)
- [x] T029 [US2] Add visual hidden text for completed state (screen reader support)

**Checkpoint**: User Story 2 完成 - 可以切換 todo 完成狀態

---

## Phase 5: User Story 3 - 刪除 Todo 項目 (Priority: P1)

**Goal**: 使用者能夠刪除不再需要的待辦事項，需顯示確認對話框

**Independent Test**: 點擊刪除按鈕並確認，驗證該項目從清單中移除

### Tests for User Story 3 (Constitution III - Mandatory) ⚠️

- [x] T030 [P] [US3] Write ConfirmDialog component test at `src/components/ConfirmDialog/ConfirmDialog.test.tsx`
- [x] T031 [P] [US3] Write TodoItem delete button test at `src/components/TodoItem/TodoItem.test.tsx` (add delete tests)
- [x] T032 [P] [US3] Write accessibility test for ConfirmDialog with axe-core (focus trap, ARIA)

### Implementation for User Story 3

- [x] T033 [P] [US3] Create ConfirmDialog component at `src/components/ConfirmDialog/ConfirmDialog.tsx`
- [x] T034 [P] [US3] Create ConfirmDialog styles at `src/components/ConfirmDialog/ConfirmDialog.module.css` (Neo Brutalism modal)
- [x] T035 [US3] Add delete button to TodoItem with aria-label (Constitution IV)
- [x] T036 [US3] Implement delete confirmation flow in TodoApp (state for dialog)
- [x] T037 [US3] Add focus management: return focus to trigger after dialog close
- [x] T038 [US3] Add keyboard support: Escape to cancel dialog (Constitution IV)

**Checkpoint**: User Story 3 完成 - 可以刪除 todo 項目（含確認對話框）

---

## Phase 6: User Story 8 - 資料持久化 (Priority: P1)

**Goal**: 使用者的 todo 資料在重新整理網頁後仍然保留

**Independent Test**: 新增 todo 後重新整理網頁，驗證資料正確載入

### Tests for User Story 8 (Constitution III - Mandatory) ⚠️

- [x] T039 [P] [US8] Write localStorage persistence test at `src/stores/todoStore.test.ts` (add persistence tests)
- [x] T040 [P] [US8] Write integration test for page reload at `tests/integration/persistence.test.tsx`

### Implementation for User Story 8

- [x] T041 [US8] Configure Zustand persist middleware with `todos-storage` key
- [x] T042 [US8] Add `onRehydrateStorage` to convert createdAt ISO strings to Date objects
- [x] T043 [US8] Add error handling for localStorage quota exceeded (silent fail per spec)
- [x] T044 [US8] Add version migration support for future schema changes

**Checkpoint**: User Story 8 完成 - 資料可持久化到 LocalStorage

---

## Phase 7: User Story 4 - 編輯 Todo 項目 (Priority: P2)

**Goal**: 使用者能夠透過雙擊項目進入編輯模式修改內容

**Independent Test**: 雙擊現有 todo 項目，驗證可以進入編輯模式並成功修改內容

### Tests for User Story 4 (Constitution III - Mandatory) ⚠️

- [ ] T045 [P] [US4] Write TodoItem edit mode tests at `src/components/TodoItem/TodoItem.test.tsx` (add edit tests)
- [ ] T046 [P] [US4] Write keyboard navigation tests (Enter, Escape, F2)

### Implementation for User Story 4

- [X] T047 [US4] Add isEditing state to TodoItem component
- [X] T048 [US4] Add double-click handler to enter edit mode
- [X] T049 [US4] Create edit input field with controlled state
- [X] T050 [US4] Implement Enter key to save edit (call onUpdate)
- [X] T051 [US4] Implement Escape key to cancel edit (restore original text)
- [X] T052 [US4] Implement blur to save edit
- [X] T053 [US4] Add F2 key as keyboard alternative to double-click (Constitution IV)
- [X] T054 [US4] Auto-focus edit input when entering edit mode

**Checkpoint**: User Story 4 完成 - 可以編輯 todo 項目內容

---

## Phase 8: User Story 5 - 篩選 Todo 項目 (Priority: P2)

**Goal**: 使用者能夠根據完成狀態篩選顯示的 todo 項目

**Independent Test**: 切換篩選選項，驗證顯示的項目正確

### Tests for User Story 5 (Constitution III - Mandatory) ⚠️

- [X] T055 [P] [US5] Write TodoFilter component test at `src/components/TodoFilter/TodoFilter.test.tsx`
- [X] T056 [P] [US5] Write filter selector tests at `src/stores/todoStore.test.ts` (add selectFilteredTodos tests)
- [X] T057 [P] [US5] Write accessibility test for filter buttons with axe-core

### Implementation for User Story 5

- [X] T058 [P] [US5] Create TodoFilter component at `src/components/TodoFilter/TodoFilter.tsx`
- [X] T059 [P] [US5] Create TodoFilter styles at `src/components/TodoFilter/TodoFilter.module.css` (Neo Brutalism buttons)
- [X] T060 [US5] Implement selectFilteredTodos selector in store
- [X] T061 [US5] Wire TodoFilter to store.setFilter in TodoFooter
- [X] T062 [US5] Add aria-pressed to filter buttons for current selection (Constitution IV)
- [X] T063 [US5] Add role="group" and aria-label to filter button group
- [X] T064 [US5] Use useTransition for non-urgent filter updates (React 19)

**Checkpoint**: User Story 5 完成 - 可以篩選 todo 項目 ✅

---

## Phase 9: User Story 6 - 顯示未完成計數 (Priority: P2)

**Goal**: 使用者能夠在畫面底部看到未完成待辦事項的數量

**Independent Test**: 新增、完成或刪除 todo 項目後觀察計數變化

### Tests for User Story 6 (Constitution III - Mandatory) ⚠️

- [X] T065 [P] [US6] Write TodoFooter component test at `src/components/TodoFooter/TodoFooter.test.tsx`
- [X] T066 [P] [US6] Write selectActiveCount selector test at `src/stores/todoStore.test.ts`

### Implementation for User Story 6

- [X] T067 [P] [US6] Create TodoFooter component at `src/components/TodoFooter/TodoFooter.tsx`
- [X] T068 [P] [US6] Create TodoFooter styles at `src/components/TodoFooter/TodoFooter.module.css`
- [X] T069 [US6] Implement selectActiveCount selector in store
- [X] T070 [US6] Add singular/plural text logic ("item" vs "items")
- [X] T071 [US6] Add aria-live="polite" for count updates (Constitution IV)
- [X] T072 [US6] Wire TodoFooter to TodoApp, pass activeCount and filter state

**Checkpoint**: User Story 6 完成 - 可以看到未完成計數 ✅

---

## Phase 10: User Story 7 - 清除已完成項目 (Priority: P3)

**Goal**: 使用者能夠一次清除所有已完成的待辦事項

**Independent Test**: 點擊 "Clear completed" 按鈕，驗證所有已完成項目被移除

### Tests for User Story 7 (Constitution III - Mandatory) ⚠️

- [X] T073 [P] [US7] Write clearCompleted action test at `src/stores/todoStore.test.ts`
- [X] T074 [P] [US7] Write TodoFooter clear button test at `src/components/TodoFooter/TodoFooter.test.tsx` (add clear tests)

### Implementation for User Story 7

- [X] T075 [US7] Implement selectHasCompleted selector in store
- [X] T076 [US7] Add "Clear completed" button to TodoFooter
- [X] T077 [US7] Wire button to store.clearCompleted action
- [X] T078 [US7] Hide/disable button when no completed items (per spec)

**Checkpoint**: User Story 7 完成 - 可以批次清除已完成項目 ✅

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, accessibility audit, and quality assurance

- [X] T079 Write full integration test at `tests/integration/todo-flow.test.tsx` (complete user journey)
- [X] T080 Run full accessibility audit with axe-core on TodoApp (Constitution IV)
- [X] T081 Verify all keyboard navigation flows work correctly
- [X] T082 Test with screen reader (VoiceOver/NVDA) for critical flows
- [X] T083 Run `npm audit` and fix any security vulnerabilities (Constitution V)
- [X] T084 Verify Neo Brutalism design consistency across all components (Constitution VII)
- [X] T085 Check color contrast ratios meet WCAG AA (4.5:1 minimum)
- [X] T086 Test localStorage quota exceeded edge case
- [X] T087 Performance test with 100+ todo items
- [X] T088 Final code review and cleanup

**Checkpoint**: Phase 11 完成 - 應用程式已準備好發布 ✅

---

## Dependencies Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational) - T007-T013
    ↓
    ├── Phase 3 (US1: 新增) - T014-T022 ──┐
    │       ↓                             │
    ├── Phase 4 (US2: 切換) - T023-T029 ──┤
    │       ↓                             │
    ├── Phase 5 (US3: 刪除) - T030-T038 ──┼── P1 MVP Complete
    │       ↓                             │
    └── Phase 6 (US8: 持久化) - T039-T044 ┘
            ↓
    ├── Phase 7 (US4: 編輯) - T045-T054 ──┐
    │       ↓                             │
    ├── Phase 8 (US5: 篩選) - T055-T064 ──┼── P2 Features
    │       ↓                             │
    └── Phase 9 (US6: 計數) - T065-T072 ──┘
            ↓
    Phase 10 (US7: 清除) - T073-T078 ── P3 Features
            ↓
    Phase 11 (Polish) - T079-T088
```

## Parallel Execution Opportunities

### Phase 1 (Setup)
- T003, T004, T005, T006 can run in parallel

### Phase 2 (Foundational)
- T010, T011 can run in parallel after T007

### Phase 3 (US1)
- T014, T015, T016 can run in parallel (tests)
- T017, T018, T019, T020 can run in parallel (implementation)

### Phase 4 (US2)
- T023, T024 can run in parallel (tests)
- T025, T026 can run in parallel (implementation)

### Phase 5 (US3)
- T030, T031, T032 can run in parallel (tests)
- T033, T034 can run in parallel (implementation)

### Phase 7 (US4)
- T045, T046 can run in parallel (tests)

### Phase 8 (US5)
- T055, T056, T057 can run in parallel (tests)
- T058, T059 can run in parallel (implementation)

### Phase 9 (US6)
- T065, T066 can run in parallel (tests)
- T067, T068 can run in parallel (implementation)

### Phase 10 (US7)
- T073, T074 can run in parallel (tests)

---

## Implementation Strategy

### MVP Scope (P1 Stories)
- **User Story 1**: 新增 Todo 項目
- **User Story 2**: 切換 Todo 完成狀態
- **User Story 3**: 刪除 Todo 項目
- **User Story 8**: 資料持久化

MVP 完成後，應用程式即可進行基本的 todo 管理操作。

### Incremental Delivery
1. **Phase 1-2**: 基礎架構設置
2. **Phase 3-6**: P1 功能 (MVP)
3. **Phase 7-9**: P2 功能 (編輯、篩選、計數)
4. **Phase 10**: P3 功能 (批次清除)
5. **Phase 11**: 品質保證與打磨

---

## Summary

| 統計項目               | 數量 |
| ---------------------- | ---- |
| 總任務數               | 88   |
| Phase 1 (Setup)        | 6    |
| Phase 2 (Foundational) | 7    |
| Phase 3 (US1: 新增)    | 9    |
| Phase 4 (US2: 切換)    | 7    |
| Phase 5 (US3: 刪除)    | 9    |
| Phase 6 (US8: 持久化)  | 6    |
| Phase 7 (US4: 編輯)    | 10   |
| Phase 8 (US5: 篩選)    | 10   |
| Phase 9 (US6: 計數)    | 8    |
| Phase 10 (US7: 清除)   | 6    |
| Phase 11 (Polish)      | 10   |
| 可平行任務 [P]         | 40   |
