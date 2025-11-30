<!--
===============================================================================
SYNC IMPACT REPORT
===============================================================================
Version change: 1.0.0 → 1.1.0 (Minor - New principle added)

Modified principles: None

Added sections:
- VII. Neo Brutalism Design System

Removed sections: None

Templates requiring updates:
- ✅ plan-template.md (Constitution Check - add VII principle row)
- ⚠️ spec-template.md (No changes needed - design is implementation detail)
- ⚠️ tasks-template.md (No changes needed - styling tasks covered by existing structure)

Follow-up TODOs: None
===============================================================================
-->

# Todo App Constitution
<!-- Frontend React Secure Development Constitution -->

## Core Principles

### I. Component-First Architecture

All features MUST be implemented as self-contained, reusable React components following these requirements:

- **Functional Components Only**: All components MUST use functional components with hooks. Class components are prohibited except for Error Boundaries.
- **Single Responsibility**: Each component MUST have one clear purpose. Components exceeding 200 lines SHOULD be decomposed.
- **Props Interface**: All components MUST define explicit TypeScript interfaces for props with JSDoc documentation.
- **Colocation**: Component-related files (styles, tests, types) MUST be colocated in the same directory.
- **React 19 Patterns**: Components SHOULD leverage modern React 19 features including `use()` hook, `useFormStatus`, `useOptimistic`, and `useActionState` where applicable.

**Rationale**: Self-contained components enable independent testing, parallel development, and straightforward refactoring. Modern hooks reduce boilerplate and improve code maintainability.

### II. Type Safety First

TypeScript MUST be used throughout the codebase with strict type checking:

- **Strict Mode**: `tsconfig.json` MUST enable `strict: true` with no implicit any.
- **Explicit Types**: All function parameters, return types, and props MUST have explicit type annotations.
- **Discriminated Unions**: State machines and variant types MUST use discriminated unions for exhaustiveness checking.
- **No Type Assertions**: Use of `as` type assertions MUST be minimized and justified. Prefer type guards and narrowing.
- **Generic Components**: Reusable components MUST use generics for type-safe flexibility.

**Rationale**: Strong typing catches errors at compile time, improves IDE support, and serves as living documentation.

### III. Test-Driven Development (NON-NEGOTIABLE)

Testing is mandatory for all features with the following requirements:

- **Test First**: Tests MUST be written before implementation. Red-Green-Refactor cycle strictly enforced.
- **Testing Library**: Use React Testing Library for component tests - test user behavior, not implementation.
- **Coverage Requirements**:
  - Unit tests: All utility functions and hooks
  - Component tests: All user-facing components
  - Integration tests: Critical user flows
- **Accessibility Testing**: All components MUST pass axe-core automated accessibility tests.
- **Test Naming**: Tests MUST follow the pattern: `it('should [expected behavior] when [condition]')`.

**Rationale**: TDD ensures code correctness, prevents regressions, and forces better component design.

### IV. Accessibility by Default (NON-NEGOTIABLE)

All features MUST be accessible following WCAG 2.1 AA standards:

- **Semantic HTML**: Use appropriate HTML elements (`<button>`, `<nav>`, `<main>`, `<article>`) - no div soup.
- **Keyboard Navigation**: All interactive elements MUST be keyboard accessible with visible focus indicators.
- **ARIA Attributes**: ARIA labels, roles, and live regions MUST be correctly implemented when semantic HTML is insufficient.
- **Color Contrast**: Text MUST meet minimum contrast ratios (4.5:1 for normal text, 3:1 for large text).
- **Screen Reader Testing**: Critical flows MUST be tested with screen readers before release.
- **Reduced Motion**: Animations MUST respect `prefers-reduced-motion` media query.

**Rationale**: Accessibility is not optional. Inclusive design ensures all users can access the application.

### V. Security-First Development (NON-NEGOTIABLE)

All code MUST follow OWASP security best practices and secure coding guidelines:

- **XSS Prevention**:
  - NEVER use `dangerouslySetInnerHTML` without DOMPurify sanitization.
  - Prefer `.textContent` over `.innerHTML` for dynamic content.
  - All user input MUST be treated as untrusted.
- **Secure Data Handling**:
  - NEVER store sensitive data (tokens, PII) in localStorage. Use httpOnly cookies.
  - API keys and secrets MUST NEVER be committed to the repository.
  - Environment variables MUST be used for configuration.
- **Dependency Security**:
  - Run `npm audit` before every release.
  - Dependencies with critical vulnerabilities MUST be updated or replaced.
- **HTTPS Only**: All API calls MUST use HTTPS in production.
- **Content Security Policy**: CSP headers MUST be configured to prevent XSS and injection attacks.

**Rationale**: Security vulnerabilities can have severe consequences. Secure-by-default prevents common attack vectors.

### VI. Performance Optimization

Applications MUST meet Core Web Vitals standards:

- **Bundle Size**: Monitor bundle size with build analysis. Code splitting MUST be used for routes and large components.
- **Lazy Loading**: Routes and heavy components MUST use `React.lazy()` and dynamic imports.
- **Image Optimization**: Images MUST use lazy loading, modern formats (WebP, AVIF), and appropriate sizing.
- **Memoization**: Use `useMemo` and `useCallback` judiciously - only when profiling shows actual re-render issues. Prefer React Compiler optimization.
- **Performance Targets**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

**Rationale**: Performance directly impacts user experience, SEO, and conversion rates.

### VII. Neo Brutalism Design System

All UI components MUST follow the Neo Brutalism (新粗野/新野獸) design language with these mandatory specifications:

- **Border Style**:
  - All interactive elements MUST have solid black borders (`3px solid #000000`).
  - Border radius MUST be `0px` or minimal (`4px` maximum) to maintain sharp edges.
- **Shadow Style**:
  - Hard shadows MUST be used: `4px 4px 0px #000000` (no blur, no spread).
  - Shadows MUST shift on interaction (hover: `2px 2px`, active: `0px 0px`).
- **Color Palette**:
  - Primary colors MUST be high-saturation, bold hues (e.g., `#FF6B6B`, `#4ECDC4`, `#FFE66D`).
  - Background MUST use warm neutral (`#FEF6E4`) or pure white.
  - Text MUST be pure black (`#000000`) for maximum contrast.
- **Typography**:
  - Font weight MUST be bold (`700`) or black (`900`) for headings and buttons.
  - Prefer sans-serif system fonts or geometric typefaces.
- **Interactive States**:
  - Hover: Element MUST translate toward shadow (`transform: translate(2px, 2px)`), shadow reduces.
  - Active: Element MUST translate fully into shadow position, shadow disappears.
  - Focus: MUST show high-contrast outline (`3px solid` accent color, `2px offset`).
- **Accessibility Integration**:
  - All color combinations MUST meet WCAG 2.1 AA contrast ratios (4.5:1 minimum).
  - Black text on bright backgrounds naturally satisfies this requirement.
  - Focus indicators MUST be visible and distinct.

**CSS Variables Standard**:
```css
:root {
  --nb-primary: #FF6B6B;
  --nb-secondary: #4ECDC4;
  --nb-accent: #FFE66D;
  --nb-background: #FEF6E4;
  --nb-surface: #FFFFFF;
  --nb-text: #000000;
  --nb-border: #000000;
  --nb-border-width: 3px;
  --nb-shadow: 4px 4px 0px #000000;
  --nb-radius: 0px;
  --nb-transition: all 0.1s ease;
}
```

**Rationale**: Neo Brutalism creates a bold, memorable visual identity with high accessibility inherent in its high-contrast design. The consistent design language reduces decision fatigue and ensures visual coherence across the application.

## Technology Stack

The following technologies form the foundation of this project:

| Category         | Technology                     | Version |
| ---------------- | ------------------------------ | ------- |
| Framework        | React                          | 19.2+   |
| Language         | TypeScript                     | 5.9+    |
| Build Tool       | Vite                           | 7.x     |
| Styling          | CSS Modules / Tailwind CSS     | -       |
| Testing          | Vitest + React Testing Library | -       |
| Linting          | ESLint + TypeScript ESLint     | 9.x     |
| Formatting       | Prettier                       | -       |
| HTTP Client      | Fetch API / TanStack Query     | -       |
| State Management | React Context / Zustand        | -       |

**Stack Decisions**:
- Vite provides fast HMR and optimized builds for React 19.
- TypeScript ESLint with strict type-checked rules enforces code quality.
- React Testing Library encourages user-centric testing patterns.

## Development Workflow

### Code Review Requirements

All changes MUST pass the following quality gates before merge:

1. **Build**: `npm run build` completes without errors or warnings.
2. **Lint**: `npm run lint` passes with zero violations.
3. **Tests**: All tests pass with required coverage thresholds.
4. **Accessibility**: No axe-core violations detected.
5. **Bundle Size**: No unexplained significant size increases.

### Commit Standards

- Commits MUST follow Conventional Commits format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- Breaking changes MUST be documented in commit body

### Branch Strategy

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: Feature development
- `fix/*`: Bug fixes

## Governance

This Constitution supersedes all other development practices for this project. Amendments require:

1. **Documentation**: Proposed changes MUST be documented with rationale.
2. **Review**: Changes MUST be reviewed and approved by project maintainers.
3. **Migration Plan**: Breaking changes MUST include a migration guide.

### Compliance

- All Pull Requests MUST verify compliance with these principles.
- Violations MUST be documented and justified if exceptions are needed.
- Use `.specify/runtime-guidance.md` for session-specific development guidance.

### Language Requirements

- Constitution document: English
- Specifications, plans, and user-facing documentation: Traditional Chinese (zh-TW)

**Version**: 1.1.0 | **Ratified**: 2025-11-30 | **Last Amended**: 2025-11-30
