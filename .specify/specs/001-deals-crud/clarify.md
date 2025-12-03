# Clarification Document: Deals CRUD Management

**Feature**: 001-deals-crud
**Created**: 2025-11-06
**Status**: ✅ Clarified
**Updated**: 2025-11-06
**Related**: [spec.md](./spec.md)

## Purpose

This document identifies ambiguities, open questions, and implementation decisions that need clarification before proceeding with the implementation plan and tasks.

## ✅ Status: All Clarifications Received

---

## 🔴 Critical Clarifications Needed

### 1. Customer Selection Interface

**Question**: How should customers be selected when creating/editing a deal?

**Current Spec**: "customer (dropdown/search)" - but implementation details unclear

**Options**:
- **A)** Simple dropdown listing all customers (name + company)
  - Pros: Simple to implement, reuses existing patterns
  - Cons: Won't scale beyond ~100 customers
  
- **B)** Searchable dropdown/combobox (type to filter)
  - Pros: Scales better, better UX
  - Cons: More complex, may need new component
  
- **C)** Modal customer picker with search and pagination
  - Pros: Best for large datasets
  - Cons: Most complex, requires additional modal component

**Recommendation**: Option A for MVP (simple dropdown), can enhance later if needed

**✅ DECISION**: Option A - Simple dropdown listing all customers (name + company)

---

### 2. Modal Implementation Pattern

**Question**: Should the create/edit modal be a separate route or a client-side modal overlay?

**Options**:
- **A)** Client-side modal overlay (stays on /deals page)
  - Pros: Faster transitions, maintains context, simpler state management
  - Cons: URL doesn't change (can't share/bookmark)
  
- **B)** Next.js intercepting route (`/deals/(.)new`, `/deals/(.)edit/[id]`)
  - Pros: Bookmarkable URLs, browser back button works, SSR support
  - Cons: More complex routing, requires parallel routes setup

**Current Implementation**: Page already uses client-side state, suggesting overlay pattern

**Recommendation**: Option A (client-side modal) for consistency with current implementation

**✅ DECISION**: Option A - Client-side modal overlay (stays on /deals page)

---

### 3. Action Buttons Placement

**Question**: Where should edit/delete buttons be placed in the table?

**Options**:
- **A)** Actions column at the end with icon buttons (edit pencil, delete trash)
  - Pros: Standard pattern, clear placement
  - Cons: Takes up table width
  
- **B)** Row hover actions (buttons appear on hover)
  - Pros: Cleaner table, more space for data
  - Cons: Not keyboard accessible by default, hidden affordance
  
- **C)** Click row to enter edit mode, delete in edit modal
  - Pros: Minimal UI, intuitive
  - Cons: No quick delete, requires entering modal for all edits

**Recommendation**: Option A (actions column) - most accessible and clear

**✅ DECISION**: Option A - Actions column at the end with icon buttons (edit pencil, delete trash)

---

## 🟡 Medium Priority Clarifications

### 4. Form Validation Strategy

**Question**: Should validation be inline (real-time) or on submit?

**Current Spec**: "error messages appear highlighting missing fields" - timing unclear

**Options**:
- **A)** Validate on blur (field loses focus)
- **B)** Validate on submit only
- **C)** Validate on blur + on submit (belt and suspenders)

**Recommendation**: Option C for best UX

**✅ DECISION**: Option C - Validate on blur + on submit (belt and suspenders)

---

### 5. Success/Error Message Display

**Question**: How should success/error messages be displayed?

**Options**:
- **A)** Toast notifications (temporary, corner of screen)
- **B)** Alert banner at top of page (dismissible)
- **C)** Inline in modal (for errors only, success closes modal)

**Recommendation**: Option A (toast) for success, Option C (inline) for errors

**✅ DECISION**: Option A - Toast notifications for both success and errors (temporary, corner of screen)

---

### 6. Probability Auto-Fill Behavior

**Question**: Should auto-suggested probability be overridable during initial selection?

**Current Spec**: "suggested probability is auto-filled" but can it be changed immediately?

**Options**:
- **A)** Auto-fill and allow immediate manual override
- **B)** Auto-fill as placeholder, user must explicitly set
- **C)** Read-only based on stage (no override allowed)

**Recommendation**: Option A - pre-fill but allow override

**✅ DECISION**: Option C - Read-only based on stage (no override allowed). Probability automatically updates when stage changes.

---

### 7. Date Picker Component

**Question**: What date input method should be used for expected close date?

**Options**:
- **A)** HTML5 date input (`<input type="date">`)
  - Pros: Native, no dependencies, works on mobile
  - Cons: Inconsistent styling across browsers
  
- **B)** Third-party date picker library (react-datepicker, etc.)
  - Pros: Consistent UI, more features
  - Cons: Adds dependency (may violate constitution simplicity principle)
  
- **C)** Manual text input with date parsing
  - Pros: Most flexible
  - Cons: Error-prone, poor UX

**Recommendation**: Option A (native) to avoid dependencies per constitution

**✅ DECISION**: Option A - HTML5 date input (`<input type="date">`)

---

## 🟢 Low Priority Clarifications

### 8. Empty State Design

**Question**: What should be shown when no deals exist?

**Suggestion**: Empty state illustration with "No deals yet" and prominent "Add Deal" CTA

**✅ DECISION**: Confirmed - Empty state with "No deals yet" message and prominent "Add Deal" CTA

---

### 9. Loading State Details

**Question**: Should loading show skeleton UI or spinner?

**Current Spec**: "Loading deals..." text, but could be enhanced

**Options**:
- **A)** Current text only
- **B)** Spinner + text
- **C)** Skeleton table rows

**Recommendation**: Option B for MVP (spinner + text)

**✅ DECISION**: Option B - Spinner + text ("Loading deals...")

---

### 10. Deal Title Display

**Question**: Should deal titles be clickable to view details?

**Current Spec**: No mention of deal detail view, but title could be interactive

**Options**:
- **A)** Title is plain text (edit button only)
- **B)** Title is clickable, opens edit modal
- **C)** Title is link to future detail page (out of scope now)

**Recommendation**: Option A for MVP (keep it simple)

**✅ DECISION**: Option A - Title is plain text (edit button only, no click interaction on title)

---

### 11. Assigned To Field

**Question**: How should "Assigned To" be populated?

**Current Spec**: Field exists but no mention of data source

**Options**:
- **A)** Free text input (simple name string)
- **B)** Dropdown of team members from mockData.ts
- **C)** Future: User management system (out of scope)

**Recommendation**: Option A (free text) for MVP simplicity

**✅ DECISION**: Option A - Free text input (simple name string)

---

### 12. Table Responsiveness

**Question**: How should table adapt on smaller screens?

**Current Spec**: "responsive and usable on tablet devices (768px+)" but mobile not specified

**Options**:
- **A)** Table scrolls horizontally on mobile
- **B)** Table collapses to card view on mobile
- **C)** Mobile not supported (tablet+ only per spec)

**Current Spec Says**: "tablet devices (768px+)" - no mobile requirement

**Recommendation**: Option A (horizontal scroll) if needed, but focus on desktop/tablet

**✅ DECISION**: Option A - Table scrolls horizontally on mobile/smaller screens

---

## ✅ Final Implementation Decisions

All clarifications have been confirmed. Implementation will proceed with:

1. ✅ **Customer Selection**: Simple dropdown listing all customers (name + company)
2. ✅ **Modal Pattern**: Client-side overlay modal (stays on /deals page)
3. ✅ **Action Buttons**: Actions column at the end with icon buttons (edit pencil, delete trash)
4. ✅ **Form Validation**: Validate on blur + on submit (belt and suspenders approach)
5. ✅ **Messages**: Toast notifications (temporary, corner of screen) for both success and errors
6. ✅ **Probability**: Read-only, automatically set based on stage (no manual override)
7. ✅ **Date Picker**: Native HTML5 date input (`<input type="date">`)
8. ✅ **Empty State**: "No deals yet" message with prominent "Add Deal" CTA
9. ✅ **Loading**: Spinner + text ("Loading deals...")
10. ✅ **Title**: Plain text (non-interactive, edit via action button only)
11. ✅ **Assigned To**: Free text input (simple name string)
12. ✅ **Responsive**: Table scrolls horizontally on mobile/smaller screens

---

## Questions for Product Owner

1. Are there any specific design mockups or UI patterns from existing systems we should follow?
2. What is the expected maximum number of deals in the system? (affects pagination needs)
3. What is the expected maximum number of customers? (affects dropdown design)
4. Should we track who created/last modified each deal? (schema has fields but not in UI spec)
5. Are there any integration points with external systems we should consider?

---

## Next Steps

Once clarifications are received:

1. Update [spec.md](./spec.md) with resolved decisions
2. Create implementation plan (plan.md)
3. Create task list (tasks.md)
4. Begin implementation

**Status**: ✅ All clarifications received - Ready to proceed with implementation planning