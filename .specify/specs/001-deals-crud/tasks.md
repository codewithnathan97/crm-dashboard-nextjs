# Tasks: Deals CRUD Management

**Input**: Design documents from `/specs/001-deals-crud/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), clarify.md

**Tests**: No testing required per project constitution. Quality assurance through manual review and runtime validation only.

**Organization**: Tasks are grouped by user story to enable independent implementation and verification of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, FOUND)
- Include exact file paths in descriptions

## Path Conventions

- **Next.js App Router**: `app/` for pages and components, `app/api/` for API routes
- **Components**: `app/components/` for shared components
- **Database**: `db/` for schema and utilities
- **Types**: `types/` for TypeScript type definitions

---

## Phase 1: Foundational (Shared Infrastructure)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Utility Components

- [ ] T001 [P] [FOUND] Create Toast notification component in `app/components/Toast.tsx`
  - Implement ToastProps interface (message, type, duration, onClose)
  - Add success (green) and error (red) variants with lucide-react icons
  - Implement auto-dismiss timer with manual close button
  - Style with Tailwind: fixed top-right, z-50, smooth animations
  - Export component

- [ ] T002 [P] [FOUND] Create ConfirmDialog component in `app/components/ConfirmDialog.tsx`
  - Implement ConfirmDialogProps interface (isOpen, title, message, onConfirm, onCancel, confirmText, cancelText)
  - Add backdrop overlay with click-to-close
  - Style confirm button as dangerous action (red) for delete operations
  - Implement keyboard support (Enter to confirm, Escape to cancel)
  - Use portal pattern for proper z-indexing
  - Export component

### State Management Setup

- [ ] T003 [FOUND] Set up extended state management in `app/(dashboard)/deals/page.tsx`
  - Add useState for modalMode: 'create' | 'edit' | null
  - Add useState for selectedDeal: Deal | null
  - Add useState for customers: Customer[]
  - Add useState for toasts: Toast[] array
  - Add useState for confirmDelete: { isOpen: boolean; dealId?: number }
  - Import necessary types from types/index.ts

- [ ] T004 [FOUND] Create toast management utilities in `app/(dashboard)/deals/page.tsx`
  - Add addToast function: (message: string, type: 'success' | 'error') => void
  - Add removeToast function: (id: string) => void
  - Generate unique toast IDs (timestamp or UUID)
  - Implement toast array management

### API Data Fetching

- [ ] T005 [FOUND] Add customer data fetching in `app/(dashboard)/deals/page.tsx`
  - Create fetchCustomers async function
  - Call /api/customers endpoint
  - Update customers state
  - Handle errors with console.error
  - Call in useEffect alongside fetchDeals

**Checkpoint**: Foundation ready - shared components and data available for all user stories

---

## Phase 2: User Story 1 - View Comprehensive Deal Information (Priority: P1) 🎯 MVP

**Goal**: Display all deal data in enhanced table with actions column, empty state, and improved loading state

**Independent Verification**: Load deals page, confirm all columns display correctly including actions, verify empty state when no deals, check loading state

### Table Enhancement

- [ ] T006 [US1] Update table columns configuration in `app/(dashboard)/deals/page.tsx`
  - Add 'assignedTo' column with label "Assigned To" and simple text render
  - Add 'createdAt' column with label "Created" and date formatting using date-fns format()
  - Keep existing columns: title, value, stage, probability, expectedCloseDate
  - Ensure value column uses toLocaleString('en-US', { style: 'currency', currency: 'USD' }) for proper currency formatting
  - Verify deals are displayed sorted by createdAt DESC (newest first) - API already implements this
  - Ensure all columns have proper TypeScript types

- [ ] T007 [US1] Add actions column to table in `app/(dashboard)/deals/page.tsx`
  - Create 'actions' column with label "Actions"
  - Import Pencil and Trash2 icons from lucide-react
  - Render function returns two icon buttons in flex container with gap-2
  - Edit button: Pencil icon, onClick opens edit modal with deal data
  - Delete button: Trash2 icon, onClick opens confirm dialog
  - Style buttons: hover:bg-gray-100 dark:hover:bg-gray-700, rounded p-1, transition
  - Ensure onClick handlers prevent row click event bubbling

### Empty State

- [ ] T008 [US1] Add empty state rendering in `app/(dashboard)/deals/page.tsx`
  - Check if deals.length === 0 and !loading
  - Replace table with centered div containing empty state message
  - Display "No deals yet" text in gray-500
  - Add prominent "Add Your First Deal" button with Plus icon
  - Button onClick sets modalMode to 'create'
  - Style with Tailwind: flex flex-col items-center justify-center py-16

### Loading State Enhancement

- [ ] T009 [US1] Enhance loading state in `app/(dashboard)/deals/page.tsx`
  - Import Loader2 icon from lucide-react (built-in spinner)
  - Replace loading text with flex container
  - Add Loader2 icon with animate-spin class
  - Add "Loading deals..." text beside spinner
  - Center container with flex items-center justify-center py-12

**Checkpoint**: At this point, User Story 1 should be fully functional and verifiable independently

---

## Phase 3: User Story 2 - Create New Deals (Priority: P1) 🎯 MVP

**Goal**: Enable creating new deals via modal form with validation

**Independent Verification**: Click "Add Deal", fill form with valid data, submit, confirm new deal appears in table with toast notification

### DealModal Component - Create Mode

- [ ] T010 [P] [US2] Create DealModal component file in `app/components/DealModal.tsx`
  - Define DealModalProps interface (mode, deal?, customers, isOpen, onClose, onSuccess)
  - Set up component structure with portal rendering
  - Add backdrop overlay (onClick closes modal)
  - Add modal container with max-width and padding
  - Export component

- [ ] T011 [US2] Implement form state management in `app/components/DealModal.tsx`
  - Add useState for form fields: title, customerId, value, stage, expectedCloseDate, description, assignedTo
  - Add useState for errors: Record<string, string>
  - Add useState for isSubmitting: boolean
  - Initialize form from props.deal when in edit mode
  - Clear form and errors on modal close

- [ ] T012 [P] [US2] Create stage-to-probability mapping constant in `app/components/DealModal.tsx`
  - Define STAGE_PROBABILITY constant with Record<DealStage, number>
  - Map: prospecting: 10, qualification: 25, proposal: 50, negotiation: 75, closed-won: 100, closed-lost: 0
  - Use as read-only reference when stage changes

- [ ] T013 [US2] Build form UI structure in `app/components/DealModal.tsx`
  - Add modal header with title ("Create Deal" or "Edit Deal" based on mode) and close X button
  - Add form container with proper spacing
  - Style with Tailwind: modal centered, max-w-2xl, rounded-lg, shadow-xl
  - Add keyboard handler for Escape key to close modal

- [ ] T014 [P] [US2] Add title input field in `app/components/DealModal.tsx`
  - Label: "Deal Title", required indicator
  - Input type text, value bound to state
  - onChange updates state, onBlur triggers validation
  - Show error message below field if errors.title exists
  - Style with Tailwind form classes

- [ ] T015 [P] [US2] Add customer dropdown in `app/components/DealModal.tsx`
  - Label: "Customer", required indicator
  - Select element with options from props.customers
  - Option format: "{customer.name} - {customer.company}"
  - onChange updates customerId state and captures customer.name in separate customerName state variable for API submission
  - onBlur triggers validation
  - Show error message if errors.customerId exists
  - Handle empty customers case: if customers.length === 0, show message "No customers found. Please create a customer first." with Link component to /dashboard/customers

- [ ] T016 [P] [US2] Add value input field in `app/components/DealModal.tsx`
  - Label: "Deal Value", required indicator
  - Input type number, min 0, step 0.01
  - Value bound to state
  - onChange updates state, onBlur triggers validation
  - Show error message if errors.value exists
  - Add dollar sign prefix in input styling

- [ ] T017 [P] [US2] Add stage dropdown in `app/components/DealModal.tsx`
  - Label: "Stage", required indicator
  - Select element with stage options
  - Options: prospecting, qualification, proposal, negotiation, closed-won, closed-lost
  - Format option labels: capitalize first letter, replace hyphens
  - onChange updates stage AND automatically sets probability
  - onBlur triggers validation
  - Show error message if errors.stage exists

- [ ] T018 [P] [US2] Add probability display field in `app/components/DealModal.tsx`
  - Label: "Probability (auto-calculated)"
  - Display as disabled input or read-only text with percentage
  - Value calculated from STAGE_PROBABILITY[stage]
  - Show info icon with tooltip explaining it's auto-calculated
  - Style as read-only/disabled with gray background

- [ ] T019 [P] [US2] Add expected close date input in `app/components/DealModal.tsx`
  - Label: "Expected Close Date" (optional)
  - Input type date (native HTML5)
  - Value bound to state as ISO date string
  - onChange updates state
  - No past date validation (allowed per spec)
  - onBlur triggers validation if needed

- [ ] T020 [P] [US2] Add description textarea in `app/components/DealModal.tsx`
  - Label: "Description" (optional)
  - Textarea rows 4, maxLength 1000
  - Value bound to state
  - onChange updates state
  - Show character count: "{description.length}/1000"

- [ ] T021 [P] [US2] Add assigned to input field in `app/components/DealModal.tsx`
  - Label: "Assigned To" (optional)
  - Input type text, maxLength 100
  - Value bound to state
  - onChange updates state
  - Placeholder: "Enter name"

### Form Validation

- [ ] T022 [US2] Implement field validation functions in `app/components/DealModal.tsx`
  - Create validateTitle: checks non-empty, max 200 chars
  - Create validateCustomer: checks valid customerId selected
  - Create validateValue: checks non-negative number
  - Create validateStage: checks valid stage value
  - Each returns error string or null
  - Add to validation map by field name

- [ ] T023 [US2] Implement onBlur validation handlers in `app/components/DealModal.tsx`
  - Create handleFieldBlur function taking field name
  - Call appropriate validation function for field
  - Update errors state for that field
  - Clear error if validation passes

- [ ] T024 [US2] Implement form submission validation in `app/components/DealModal.tsx`
  - Create validateForm function: validates all required fields
  - Returns boolean indicating if form is valid
  - Updates errors state with all validation errors
  - Call before API submission

### API Integration - Create

- [ ] T025 [US2] Implement create deal submission in `app/components/DealModal.tsx`
  - Create handleSubmit async function
  - Prevent default form submission
  - Call validateForm, return early if invalid
  - Set isSubmitting to true
  - Build request body with all form fields plus probability
  - POST to /api/deals with JSON body
  - Handle success: call props.onSuccess(), close modal
  - Handle error: show error via toast (passed from parent)
  - Set isSubmitting to false in finally block

- [ ] T026 [US2] Add form submission UI in `app/components/DealModal.tsx`
  - Create footer with Cancel and Submit buttons
  - Cancel button: gray, onClick calls props.onClose
  - Submit button: blue, disabled when isSubmitting or validation fails
  - Show loading spinner in submit button when isSubmitting
  - Submit button text: "Creating..." when submitting, "Create Deal" normally

### Page Integration - Create

- [ ] T027 [US2] Wire up DealModal for create mode in `app/(dashboard)/deals/page.tsx`
  - Render DealModal component conditionally when modalMode is set
  - Pass mode='create' when modalMode === 'create'
  - Pass customers array from state
  - Pass isOpen={modalMode === 'create'}
  - Pass onClose handler: resets modalMode to null, clears selectedDeal
  - Pass onSuccess handler: calls fetchDeals(), adds success toast, resets modal state

- [ ] T028 [US2] Update "Add Deal" button handler in `app/(dashboard)/deals/page.tsx`
  - Button onClick sets modalMode to 'create'
  - Ensure selectedDeal is null for create mode
  - Button already exists, just needs proper onClick handler

**Checkpoint**: At this point, User Story 2 (create) should be fully functional and verifiable independently

---

## Phase 4: User Story 3 - Edit Existing Deals (Priority: P2)

**Goal**: Enable editing deals via same modal with pre-populated data

**Independent Verification**: Click edit icon on deal row, verify form pre-populated, modify fields, save, confirm changes reflected

### DealModal Component - Edit Mode

- [ ] T029 [US3] Add edit mode initialization in `app/components/DealModal.tsx`
  - In useEffect, check if mode === 'edit' and props.deal exists
  - Pre-populate all form fields from props.deal
  - Set title, customerId, value, stage, expectedCloseDate, description, assignedTo
  - Calculate and set probability from stage
  - Add dependency array: [props.mode, props.deal]

- [ ] T030 [US3] Update modal title for edit mode in `app/components/DealModal.tsx`
  - Change title text based on props.mode
  - "Create Deal" when mode === 'create'
  - "Edit Deal" when mode === 'edit'

- [ ] T031 [US3] Implement edit submission logic in `app/components/DealModal.tsx`
  - Update handleSubmit to check mode
  - If mode === 'edit': PUT to /api/deals/[id] with deal.id
  - If mode === 'create': POST to /api/deals (already implemented)
  - Include all form fields in PUT request body
  - Auto-set actualCloseDate if stage is 'closed-won' or 'closed-lost'
  - Handle responses and errors same as create

- [ ] T032 [US3] Update submit button text for edit mode in `app/components/DealModal.tsx`
  - When mode === 'edit' and isSubmitting: "Saving..."
  - When mode === 'edit' and not submitting: "Save Changes"
  - Keep create mode text as is

### API Endpoint - Update

- [ ] T033 [US3] Create PUT endpoint file in `app/api/deals/[id]/route.ts`
  - Import necessary modules: NextRequest, NextResponse, db, deals, eq
  - Export async function PUT with request and params
  - Extract id from params.id (convert to number)
  - Parse request body as Partial<Deal>

- [ ] T034 [US3] Implement update logic in `app/api/deals/[id]/route.ts`
  - Query existing deal by id first (to verify it exists)
  - If not found, return 404 error
  - Build update data object with provided fields
  - Set updatedAt to current datetime
  - If stage is 'closed-won' or 'closed-lost', set actualCloseDate to current date
  - Use db.update(deals).set(updateData).where(eq(deals.id, id))
  - Fetch and return updated deal record
  - Handle errors with 500 status

- [ ] T035 [US3] Add validation in PUT endpoint `app/api/deals/[id]/route.ts`
  - Validate required fields if provided: title, customerId, value, stage
  - Check value is non-negative if provided
  - Check stage is valid enum value if provided
  - Return 400 error with validation messages if invalid
  - Allow partial updates (only update provided fields)

### Page Integration - Edit

- [ ] T036 [US3] Wire up edit button in actions column in `app/(dashboard)/deals/page.tsx`
  - Edit button onClick: setModalMode('edit'), setSelectedDeal(deal)
  - Prevent event bubbling to avoid triggering row click
  - Button styled with hover effects already implemented

- [ ] T037 [US3] Update DealModal rendering for edit mode in `app/(dashboard)/deals/page.tsx`
  - Render DealModal when modalMode === 'edit'
  - Pass mode='edit'
  - Pass deal={selectedDeal}
  - Pass customers, isOpen, onClose, onSuccess (same as create)
  - Ensure onSuccess refreshes deals and shows toast

**Checkpoint**: At this point, User Stories 1-3 (view, create, edit) should all work independently

---

## Phase 5: User Story 4 - Delete Deals (Priority: P3)

**Goal**: Enable deleting deals with confirmation dialog

**Independent Verification**: Click delete icon, confirm in dialog, verify deal removed from table with toast notification

### API Endpoint - Delete

- [ ] T038 [US4] Add DELETE export to `app/api/deals/[id]/route.ts`
  - Export async function DELETE with request and params
  - Extract id from params.id (convert to number)
  - Query existing deal first to verify it exists
  - If not found, return 404 error

- [ ] T039 [US4] Implement delete logic in `app/api/deals/[id]/route.ts`
  - Use db.delete(deals).where(eq(deals.id, id))
  - Cascade deletes handled by schema (onDelete: 'cascade')
  - Return 204 No Content or deleted deal object
  - Handle errors with 500 status
  - Log deletion for audit trail

### Page Integration - Delete

- [ ] T040 [US4] Wire up delete button in actions column in `app/(dashboard)/deals/page.tsx`
  - Delete button onClick: setConfirmDelete({ isOpen: true, dealId: deal.id })
  - Prevent event bubbling
  - Button already styled with hover effects

- [ ] T041 [US4] Implement delete confirmation handler in `app/(dashboard)/deals/page.tsx`
  - Create handleDeleteConfirm async function
  - Get dealId from confirmDelete state
  - DELETE to /api/deals/[dealId]
  - Handle success: close dialog, refresh deals, show success toast
  - Handle error: close dialog, show error toast
  - Close confirmation dialog after operation

- [ ] T042 [US4] Render ConfirmDialog for delete in `app/(dashboard)/deals/page.tsx`
  - Render ConfirmDialog component
  - Pass isOpen={confirmDelete.isOpen}
  - Pass title="Delete Deal"
  - Pass message="Are you sure you want to delete this deal? This action cannot be undone."
  - Pass onConfirm={handleDeleteConfirm}
  - Pass onCancel={() => setConfirmDelete({ isOpen: false })}
  - Pass confirmText="Delete" (red button)
  - Pass cancelText="Cancel"

**Checkpoint**: All user stories now complete and functional independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final touches and verification

- [ ] T043 [P] [POLISH] Add toast rendering in `app/(dashboard)/deals/page.tsx`
  - Render toast container at top-right of page (fixed positioning)
  - Map over toasts array and render Toast component for each
  - Pass message, type, duration to each Toast
  - Pass onClose handler that removes toast from array
  - Style container: fixed top-4 right-4 z-50 flex flex-col gap-2

- [ ] T044 [P] [POLISH] Add toast animations in `app/globals.css` (if needed)
  - Add @keyframes for slide-in from right
  - Add @keyframes for fade-out
  - Apply to toast class
  - Use Tailwind's built-in transition classes if sufficient

- [ ] T045 [P] [POLISH] Verify all error handling in `app/(dashboard)/deals/page.tsx`
  - fetchDeals error shows error toast
  - fetchCustomers error shows error toast
  - All API errors caught and displayed via toast
  - Network errors handled gracefully

- [ ] T046 [P] [POLISH] Verify TypeScript types in all new files
  - All components have proper interface definitions
  - No implicit any types
  - All function return types explicit
  - Import types from types/index.ts where appropriate

- [ ] T047 [POLISH] Manual verification of User Story 1 acceptance scenarios
  - Load page, verify all 8 columns display correctly
  - Verify deals are sorted by creation date (newest first)
  - Verify stage colors match spec (gray, blue, purple, orange, green, red)
  - Verify currency formatting ($X,XXX format) using toLocaleString with proper dollar signs and commas
  - Verify probability shows both bar and percentage
  - Verify dates formatted as "MMM d, yyyy"
  - Verify empty state when no deals
  - Verify loading state with spinner

- [ ] T048 [POLISH] Manual verification of User Story 2 acceptance scenarios
  - Click "Add Deal", verify modal opens
  - Fill form with valid data, submit
  - Verify new deal appears in table at top
  - Verify success toast appears
  - Test validation: submit with empty fields, verify inline errors
  - Test field blur validation
  - Test stage change updates probability automatically

- [ ] T049 [POLISH] Manual verification of User Story 3 acceptance scenarios
  - Click edit icon on deal, verify modal opens with pre-populated data
  - Modify fields, save
  - Verify changes reflected in table immediately
  - Verify success toast
  - Change stage to closed-won, verify actualCloseDate set
  - Test validation on edit
  - Click cancel, verify no changes saved

- [ ] T050 [POLISH] Manual verification of User Story 4 acceptance scenarios
  - Click delete icon, verify confirmation dialog
  - Cancel, verify deal not deleted
  - Click delete again, confirm
  - Verify deal removed from table
  - Verify success toast
  - Check database to confirm cascade delete of related records

- [ ] T051 [POLISH] Verify constitution compliance
  - Component count: exactly 3 new components (DealModal, Toast, ConfirmDialog)
  - Existing components reused: Card, Table
  - No test files created
  - All code uses TypeScript strict mode
  - All styling uses Tailwind CSS only
  - All database operations use Drizzle ORM

- [ ] T052 [POLISH] Performance verification
  - Check deals page load time with ~100 deals (should be < 500ms)
  - Check modal open/close animation smoothness
  - Check table scroll performance
  - Verify no console errors or warnings

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational (Phase 1)**: No dependencies - can start immediately
  - BLOCKS all user stories until complete
- **User Story 1 (Phase 2)**: Depends on Foundational completion
- **User Story 2 (Phase 3)**: Depends on Foundational completion
- **User Story 3 (Phase 4)**: Depends on Foundational + User Story 2 completion (reuses DealModal)
- **User Story 4 (Phase 5)**: Depends on Foundational completion
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (View)**: Can start after Foundational - No dependencies on other stories
- **US2 (Create)**: Can start after Foundational - DealModal built here, no dependencies
- **US3 (Edit)**: Depends on US2 completion (extends DealModal)
- **US4 (Delete)**: Can start after Foundational - No dependencies on other stories (parallel with US2)

### Within Each User Story

- Foundation tasks (T001-T005) can run in parallel where marked [P]
- US1 tasks mostly sequential (table updates)
- US2 tasks: DealModal structure first, then form fields in parallel, then validation, then integration
- US3 tasks: relatively short, mostly sequential additions to existing code
- US4 tasks: API endpoint parallel with page integration setup
- Polish tasks mostly parallel where marked [P]

### Parallel Opportunities

Within Foundational phase:
- T001 (Toast) and T002 (ConfirmDialog) can run in parallel
- T003-T005 (state setup and fetching) are sequential

Within US2 (Create):
- T010-T012 (component setup and constants) form fields can run somewhat in parallel
- T014-T021 (all form fields) can be built in parallel
- T022-T024 (validation) sequential after fields
- T025-T026 (submission) sequential after validation

---

## Parallel Example: Foundational Phase

```bash
# Launch utility components together:
Task: "Create Toast notification component in app/components/Toast.tsx"
Task: "Create ConfirmDialog component in app/components/ConfirmDialog.tsx"

# Then state management:
Task: "Set up extended state management in app/(dashboard)/deals/page.tsx"
Task: "Create toast management utilities in app/(dashboard)/deals/page.tsx"
Task: "Add customer data fetching in app/(dashboard)/deals/page.tsx"
```

## Parallel Example: User Story 2 Form Fields

```bash
# All form fields can be built in parallel:
Task: "Add title input field in app/components/DealModal.tsx"
Task: "Add customer dropdown in app/components/DealModal.tsx"
Task: "Add value input field in app/components/DealModal.tsx"
Task: "Add stage dropdown in app/components/DealModal.tsx"
Task: "Add probability display field in app/components/DealModal.tsx"
Task: "Add expected close date input in app/components/DealModal.tsx"
Task: "Add description textarea in app/components/DealModal.tsx"
Task: "Add assigned to input field in app/components/DealModal.tsx"
```

---

## Implementation Strategy

### MVP First (Foundation + US1 + US2)

1. Complete Phase 1: Foundational
2. Complete Phase 2: User Story 1 (View)
3. Complete Phase 3: User Story 2 (Create)
4. **STOP and VALIDATE**: Can view and create deals
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Foundational → Foundation ready
2. Add User Story 1 → Verify independently → Can view enhanced deals
3. Add User Story 2 → Verify independently → Can create deals (MVP!)
4. Add User Story 3 → Verify independently → Can edit deals
5. Add User Story 4 → Verify independently → Can delete deals
6. Polish → Final verification → Full CRUD complete

### Parallel Team Strategy

With multiple developers:

1. Team completes Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (View enhancements)
   - Developer B: User Story 2 (Create functionality)
   - Developer C: User Story 4 (Delete functionality)
3. Developer B then adds User Story 3 (Edit - extends US2's DealModal)
4. All converge for Polish and verification

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and verifiable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Constitution: No testing code, component count strictly controlled, TypeScript strict mode
- All new components go in app/components/ directory
- Use existing lucide-react icons, date-fns for dates, no new dependencies
- Focus on manual verification at checkpoints and polish phase