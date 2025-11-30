---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Per Constitution III (Test-Driven Development), tests are MANDATORY. Tests MUST be written first and verified to FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

<!-- 
  ============================================================================
  IMPORTANT: The tasks below are SAMPLE TASKS for illustration purposes only.
  
  The /speckit.tasks command MUST replace these with actual tasks based on:
  - User stories from spec.md (with their priorities P1, P2, P3...)
  - Feature requirements from plan.md
  - Entities from data-model.md
  - Endpoints from contracts/
  
  Tasks MUST be organized by user story so each story can be:
  - Implemented independently
  - Tested independently
  - Delivered as an MVP increment
  
  DO NOT keep these sample tasks in the generated tasks.md file.
  ============================================================================
-->

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure per implementation plan
- [ ] T002 Initialize [language] project with [framework] dependencies
- [ ] T003 [P] Configure linting and formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

Examples of foundational tasks (adjust based on your project):

- [ ] T004 Setup database schema and migrations framework
- [ ] T005 [P] Implement authentication/authorization framework
- [ ] T006 [P] Setup API routing and middleware structure
- [ ] T007 Create base models/entities that all stories depend on
- [ ] T008 Configure error handling and logging infrastructure
- [ ] T009 Setup environment configuration management

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - [Title] (Priority: P1) 🎯 MVP

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 1 (Constitution III - Mandatory) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation (TDD mandatory per Constitution III)**

- [ ] T010 [P] [US1] Component test for [component] in src/components/[name]/__tests__/
- [ ] T011 [P] [US1] Integration test for [user journey] in tests/integration/
- [ ] T012 [P] [US1] Accessibility test with axe-core (Constitution IV)

### Implementation for User Story 1

- [ ] T013 [P] [US1] Create [Component1] in src/components/[name1]/
- [ ] T014 [P] [US1] Create [Component2] in src/components/[name2]/
- [ ] T015 [US1] Implement custom hook in src/hooks/use[Name].ts (depends on T013, T014)
- [ ] T016 [US1] Add TypeScript interfaces in src/types/[name].ts (Constitution II)
- [ ] T017 [US1] Add accessibility attributes (ARIA, keyboard nav) (Constitution IV)
- [ ] T018 [US1] Validate user input and sanitize content (Constitution V)

**Checkpoint**: At this point, User Story 1 should be fully functional, accessible, and testable independently

---

## Phase 4: User Story 2 - [Title] (Priority: P2)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 2 (Constitution III - Mandatory) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T018 [P] [US2] Component test for [component] in src/components/[name]/__tests__/
- [ ] T019 [P] [US2] Integration test for [user journey] in tests/integration/

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create [Component] in src/components/[name]/
- [ ] T021 [US2] Implement hook/service in src/hooks/ or src/services/
- [ ] T022 [US2] Integrate with User Story 1 components (if needed)
- [ ] T023 [US2] Add accessibility attributes (ARIA, keyboard nav)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - [Title] (Priority: P3)

**Goal**: [Brief description of what this story delivers]

**Independent Test**: [How to verify this story works on its own]

### Tests for User Story 3 (Constitution III - Mandatory) ⚠️

- [ ] T024 [P] [US3] Component test for [component] in src/components/[name]/__tests__/
- [ ] T025 [P] [US3] Integration test for [user journey] in tests/integration/

### Implementation for User Story 3

- [ ] T026 [P] [US3] Create [Component] in src/components/[name]/
- [ ] T027 [US3] Implement hook/service in src/hooks/ or src/services/
- [ ] T028 [US3] Add accessibility attributes (ARIA, keyboard nav)

**Checkpoint**: All user stories should now be independently functional

---

[Add more user story phases as needed, following the same pattern]

---

## Phase N-1: Security & Accessibility Audit (Constitution IV & V - NON-NEGOTIABLE)

**Purpose**: Verify compliance with Constitution security and accessibility principles

### Security Audit Tasks (Constitution V)

- [ ] TXXX Verify no sensitive data in localStorage
- [ ] TXXX Verify all user inputs are sanitized
- [ ] TXXX Run `npm audit` and resolve critical vulnerabilities
- [ ] TXXX Verify HTTPS for all API calls
- [ ] TXXX Check for XSS vulnerabilities in dynamic content

### Accessibility Audit Tasks (Constitution IV)

- [ ] TXXX Run axe-core automated accessibility tests
- [ ] TXXX Verify keyboard navigation for all interactive elements
- [ ] TXXX Verify color contrast ratios meet WCAG 2.1 AA
- [ ] TXXX Test with screen reader for critical user flows
- [ ] TXXX Verify all images have alt text

---

## Phase N: Polish & Performance Optimization (Constitution VI)

**Purpose**: Improvements that affect multiple user stories and meet performance targets

### Performance Tasks

- [ ] TXXX Analyze bundle size with build tools
- [ ] TXXX Implement code splitting for routes
- [ ] TXXX Implement lazy loading for heavy components
- [ ] TXXX Optimize images (WebP/AVIF, lazy loading)
- [ ] TXXX Measure Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Polish Tasks

- [ ] TXXX [P] Documentation updates in docs/
- [ ] TXXX Code cleanup and refactoring
- [ ] TXXX [P] Additional unit tests in tests/unit/
- [ ] TXXX Run quickstart.md validation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Security & Accessibility Audit (Phase N-1)**: After all user stories complete
- **Performance & Polish (Final Phase)**: After audit phase

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - May integrate with US1 but should be independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - May integrate with US1/US2 but should be independently testable

### Within Each User Story (Constitution III - TDD)

- Tests MUST be written and FAIL before implementation
- Components must be typed (Constitution II)
- Components must be accessible (Constitution IV)
- Security considerations must be addressed (Constitution V)
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - Constitution III):
Task: "Component test for [component] in src/components/[name]/__tests__/"
Task: "Integration test for [user journey] in tests/integration/"

# Launch all components for User Story 1 together:
Task: "Create [Component1] in src/components/[name1]/"
Task: "Create [Component2] in src/components/[name2]/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (with tests first - Constitution III)
4. **STOP and VALIDATE**: Test User Story 1 independently (including accessibility)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Security & Accessibility Audit → Remediate issues
6. Performance Optimization → Meet Core Web Vitals targets
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently
4. Team performs Security & Accessibility Audit together

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- **Constitution III**: Verify tests fail before implementing (TDD mandatory)
- **Constitution IV**: Include accessibility tasks for each component
- **Constitution V**: Include security verification tasks
- **Constitution VI**: Include performance measurement tasks
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
