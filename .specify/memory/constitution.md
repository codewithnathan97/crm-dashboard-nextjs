<!--
=============================================================================
SYNC IMPACT REPORT - Constitution v1.0.0
=============================================================================
Version Change: [TEMPLATE] → 1.0.0 (Initial ratification)

Principles Defined:
  I. Component Minimalism & Reusability
  II. No Testing Policy
  III. Technology Stack Adherence
  IV. Type Safety & Code Quality
  V. Simplicity & YAGNI

Additional Sections:
  + Technology Standards
  + Development Constraints

Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check gates defined
  ⚠️  spec-template.md - Contains test-focused user scenarios (conflicts with Principle II)
  ⚠️  tasks-template.md - Contains extensive test task examples (conflicts with Principle II)

Follow-up Actions Required:
  1. Update spec-template.md to make testing sections explicitly optional
  2. Update tasks-template.md to clearly mark all test phases as conditional
  3. Remove test-first language from task organization guidance
  4. Ensuring all template comments align with no-testing policy

Migration Notes:
  - This is the initial constitution ratification for the CRM Dashboard project
  - Testing constraints differ from typical development workflows
  - Focus on rapid development with component reusability
=============================================================================
-->

# CRM Dashboard Constitution

## Core Principles

### I. Component Minimalism & Reusability

**MUST create as few components as possible and maximize component reusability across the application.**

This principle is NON-NEGOTIABLE. Every new component must be justified by demonstrating that existing components cannot be adapted or extended to serve the new requirement. Component proliferation is explicitly forbidden.

**Rationale**: Fewer components reduce maintenance overhead, improve consistency, decrease bundle size, and simplify the codebase. Reusability ensures changes propagate uniformly across the application.

**Enforcement**:
- Before creating a new component, MUST attempt to extend or parameterize an existing component
- Component variants MUST be handled via props, not separate components
- Shared styling MUST be extracted to utility classes or reusable style objects
- Component count MUST be tracked and justified in design documents

### II. No Testing Policy

**Testing is explicitly NOT REQUIRED for this project.**

This is a conscious architectural decision to prioritize rapid development and iteration. Unit tests, integration tests, contract tests, and end-to-end tests are NOT part of this project's development workflow.

**Rationale**: The project requirements explicitly state "no testing required." This reduces development overhead and accelerates delivery while accepting increased manual verification responsibility.

**Enforcement**:
- No test files should be created in the repository
- CI/CD pipelines should not include test gates
- Task lists MUST NOT include test-related tasks
- Specifications MUST NOT require test coverage or test scenarios
- Quality assurance is performed through manual review and runtime validation

### III. Technology Stack Adherence

**MUST use the specified technology stack exclusively: Next.js (v16+), TypeScript, Tailwind CSS, Drizzle ORM, and SQLite.**

No alternative frameworks, styling solutions, ORMs, or databases are permitted without explicit constitutional amendment. This ensures consistency, maintainability, and leverages team expertise.

**Rationale**: Technology consistency prevents fragmentation, reduces learning curves, and ensures all team members can work effectively across the codebase.

**Enforcement**:
- Dependencies MUST be explicitly justified in design documents
- New packages MUST not duplicate functionality provided by the core stack
- All styling MUST use Tailwind CSS utility classes or @apply directives
- All database operations MUST use Drizzle ORM
- All type definitions MUST be written in TypeScript

### IV. Type Safety & Code Quality

**MUST maintain strict TypeScript type safety throughout the application.**

All code MUST be written in TypeScript with strict mode enabled. No `any` types are permitted except where TypeScript limitations require escape hatches, which MUST be documented with justification comments.

**Rationale**: Type safety catches errors at compile time, improves IDE support, serves as living documentation, and reduces runtime errors.

**Enforcement**:
- TypeScript strict mode MUST remain enabled in tsconfig.json
- All functions MUST have explicit return type annotations
- Component props MUST be typed via interfaces or type aliases
- Database schema types MUST be generated via Drizzle and used consistently
- Use of `any` MUST be accompanied by a comment explaining why it's necessary

### V. Simplicity & YAGNI (You Aren't Gonna Need It)

**MUST favor simple, straightforward solutions over complex abstractions. Do not implement features or patterns until they are actually needed.**

Avoid premature optimization, over-engineering, and speculative generality. Every abstraction layer, design pattern, or architectural decision MUST be justified by concrete current requirements.

**Rationale**: Simple code is easier to understand, modify, and debug. Complexity should only be introduced when its benefits clearly outweigh its costs.

**Enforcement**:
- Abstractions MUST solve at least three current use cases before introduction
- Design patterns MUST be justified in implementation plans
- Repository patterns, service layers, and other architectural layers MUST NOT be added speculatively
- Direct implementations are preferred over abstracted implementations until reuse is proven

## Technology Standards

### Required Stack Components

- **Framework**: Next.js v16+ (App Router)
- **Language**: TypeScript v5+
- **Styling**: Tailwind CSS v4+ (utility-first approach)
- **ORM**: Drizzle ORM v0.44+
- **Database**: SQLite (better-sqlite3 driver)

### Prohibited Technologies

- Alternative CSS frameworks (Bootstrap, Material-UI component libraries, etc.)
- Alternative ORMs (Prisma, TypeORM, Sequelize, etc.)
- Alternative databases (PostgreSQL, MySQL, MongoDB, etc.) unless explicitly required and documented
- JavaScript files (all code MUST be TypeScript)

### API & Data Patterns

- Next.js API routes for backend endpoints (`/app/api/`)
- Server Components for data fetching where possible
- Client Components only when interactivity requires it
- Drizzle ORM for all database operations
- No external API calls without documentation in design specs

## Development Constraints

### File Organization

- Components in `/app/components/` (shared) or co-located with features
- API routes in `/app/api/[resource]/route.ts`
- Database schema in `/db/schema.ts`
- Database utilities in `/db/index.ts`
- Type definitions in `/types/` for shared types

### Styling Guidelines

- Tailwind utility classes MUST be used for all styling
- Custom CSS is strongly discouraged; use @apply in globals.css only when absolutely necessary
- Component-specific styles MUST be inline Tailwind classes
- Reuse existing spacing, color, and sizing scales from Tailwind
- Dark mode considerations optional unless specified

### Performance Expectations

- Optimize for developer velocity, not premature optimization
- Use Next.js Image component for images
- Minimize client-side JavaScript (prefer Server Components)
- Database queries should use indexes where filtering large datasets

## Governance

This constitution supersedes all other development practices, guidelines, and conventions. All code reviews, pull requests, and architectural decisions MUST verify compliance with these principles.

**Amendment Process**:
1. Proposed amendments MUST be documented with rationale and impact analysis
2. All affected templates and documentation MUST be updated synchronously
3. Version number MUST be incremented according to semantic versioning
4. Migration plan MUST be provided for breaking changes

**Versioning Policy**:
- MAJOR version: Breaking principle changes (removals, redefinitions, incompatible constraints)
- MINOR version: New principles added, significant guidance expansions
- PATCH version: Clarifications, wording improvements, non-semantic refinements

**Compliance Review**:
- Every feature plan MUST include a "Constitution Check" section
- Every code review MUST verify adherence to core principles
- Violations MUST be documented and justified or corrected
- Repeat violations indicate need for constitutional review

**Complexity Justification**:
If a feature requires violating core principles (e.g., creating many new components, introducing new dependencies), the implementation plan MUST include a "Complexity Tracking" section documenting:
- Which principle is being violated
- Why the violation is necessary
- What simpler alternatives were rejected and why

**Version**: 1.0.0 | **Ratified**: 2025-11-06 | **Last Amended**: 2025-11-06
