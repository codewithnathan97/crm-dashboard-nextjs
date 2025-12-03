# Implementation Plan: Deals CRUD Management

**Branch**: `001-deals-crud` | **Date**: 2025-11-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-deals-crud/spec.md`

## Summary

Enhance the existing deals page with full CRUD (Create, Read, Update, Delete) operations. The primary requirement is to display comprehensive deal information in an enhanced table view with additional columns (actions column with edit/delete icons), implement a reusable modal component for creating and editing deals, add validation with toast notifications for user feedback, and implement API endpoints for updating and deleting deals. The technical approach uses the existing Card and Table components, creates a single DealModal component for forms, implements client-side overlay patterns for modal interactions, and extends the API routes with PUT/DELETE operations.

## Technical Context

**Language/Version**: TypeScript 5+  
**Primary Dependencies**: Next.js 16.0.1, React 19.2.0, Tailwind CSS 4+, Drizzle ORM 0.44.7, better-sqlite3 12.4.1, lucide-react 0.552.0, date-fns 4.1.0  
**Storage**: SQLite database via better-sqlite3, Drizzle ORM for queries  
**Testing**: Not required per project constitution  
**Target Platform**: Web application (desktop and tablet 768px+), browser-based  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Deal list operations < 500ms for up to 1000 deals, modal animations < 300ms  
**Constraints**: Component minimalism (reuse existing components), no testing, TypeScript strict mode, Tailwind CSS only  
**Scale/Scope**: Single-page enhancement, 3 new components maximum (DealModal, Toast, ConfirmDialog), 2 new API endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Component Minimalism & Reusability** (Principle I):
- [x] Verified that new components can't be replaced by extending existing components
  - DealModal: New requirement, handles both create/edit modes (single component for dual purpose)
  - Toast: New notification requirement, not present in existing codebase
  - ConfirmDialog: New delete confirmation requirement, simple reusable component
- [x] Component count justified and minimized: 3 new components total
- [x] Reusability strategy documented: DealModal used for both create and edit, ConfirmDialog reusable for future delete operations
- **Justification**: Table and Card components are reused. DealModal consolidates create/edit forms into one component. Toast and ConfirmDialog are minimal utility components that will be reusable across the application.

**No Testing Policy** (Principle II):
- [x] Confirmed: No test files, test frameworks, or test tasks included
- [x] Quality assurance strategy: Manual review and runtime validation
- [x] CI/CD configured without test gates: N/A (no CI/CD changes needed)

**Technology Stack Adherence** (Principle III):
- [x] Next.js v16+ (App Router) confirmed: Currently using 16.0.1
- [x] TypeScript v5+ confirmed: TypeScript 5 configured
- [x] Tailwind CSS v4+ for all styling: Tailwind 4 configured
- [x] Drizzle ORM + SQLite for data layer: Drizzle 0.44.7 + better-sqlite3 12.4.1
- [x] No alternative frameworks or libraries introduced: All dependencies already in package.json

**Type Safety & Code Quality** (Principle IV):
- [x] TypeScript strict mode enabled: Verified in tsconfig.json
- [x] All functions have explicit return types: Will be enforced in implementation
- [x] Component props fully typed: Using TypeScript interfaces
- [x] Database schema types generated and used: Types exported from db/schema.ts
- [x] Any `any` types justified with comments: Will minimize and document if necessary

**Simplicity & YAGNI** (Principle V):
- [x] Abstractions solve at least 3 current use cases: DealModal used for create/edit (2 modes), Toast for success/error feedback (multiple operations)
- [x] Design patterns justified by concrete requirements: Modal pattern specified in clarifications, required for UX
- [x] Direct implementations preferred over speculative abstractions: No unnecessary service layers or repositories
- [x] No premature optimization: Focus on functional requirements, optimize later if needed

**Violations & Justifications**:
None. All constitutional principles are satisfied.

## Project Structure

### Documentation (this feature)

```text
.specify/specs/001-deals-crud/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── clarify.md           # Clarifications document
└── tasks.md             # Task list (to be created by /speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── (dashboard)/
│   └── deals/
│       └── page.tsx                    # Enhanced with modal state, CRUD operations, toast notifications
├── api/
│   └── deals/
│       ├── route.ts                    # Enhanced with validation logic
│       └── [id]/
│           └── route.ts                # NEW: PUT (update) and DELETE operations
├── components/
│   ├── Card.tsx                        # EXISTING: Reused for page container
│   ├── Table.tsx                       # EXISTING: Reused for deals display
│   ├── DealModal.tsx                   # NEW: Reusable modal for create/edit deal forms
│   ├── Toast.tsx                       # NEW: Toast notification component
│   └── ConfirmDialog.tsx               # NEW: Confirmation dialog for delete operations
├── globals.css                         # EXISTING: May add toast animation styles
└── layout.tsx                          # EXISTING: No changes needed

db/
├── schema.ts                           # EXISTING: No changes needed (schema already defined)
├── index.ts                            # EXISTING: No changes needed
└── seed.ts                             # EXISTING: No changes needed

types/
└── index.ts                            # EXISTING: Types already defined for Deal, NewDeal, Customer
```

**Structure Decision**: Single project structure (Next.js App Router with App directory). All new components go into `app/components/` to maintain existing organization. API routes follow Next.js conventions with `[id]` dynamic route for individual deal operations.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All principles satisfied.

## Phase 0: Research & Analysis

**Objective**: Understand existing implementation and identify integration points

### Current State Analysis

**Existing Implementation**:
- Deals page at `app/(dashboard)/deals/page.tsx` currently fetches and displays deals
- Table displays: title, customer name, value, stage, probability, expected close date
- "Add Deal" button exists but is non-functional
- Basic table columns configured with custom renderers for stage colors and probability progress bars
- GET endpoint at `/api/deals/route.ts` fetches deals with Drizzle ORM
- POST endpoint at `/api/deals/route.ts` creates deals but is unused by UI

**Missing Functionality**:
- Modal component for creating/editing deals
- Form validation and error handling
- UPDATE (PUT) endpoint for editing deals
- DELETE endpoint for removing deals  
- Actions column in table with edit/delete buttons
- Toast notifications for user feedback
- Empty state when no deals exist
- Loading state enhancement (currently shows text only)

**Integration Points**:
- Fetch customers for dropdown: Requires `/api/customers` GET endpoint (already exists)
- Stage-to-probability mapping: Use constant object for read-only probability values
- Date formatting: Use existing date-fns library (already in dependencies)
- Currency formatting: Use JavaScript `toLocaleString()` with USD options

### Technical Decisions

**Modal Implementation**:
- Client-side overlay modal (not intercepting routes)
- Single `DealModal` component with `mode` prop ('create' | 'edit')
- Controlled form state with React hooks
- Close on Escape key, close on backdrop click, close on X button

**Validation Strategy**:
- Validate on blur for individual fields
- Validate on submit for all fields
- Show inline error messages below each invalid field
- Prevent submission if validation fails

**Toast Notifications**:
- Position: top-right corner
- Duration: 3 seconds for success, 5 seconds for errors  
- Auto-dismiss with manual dismiss option
- Queue multiple toasts if needed

**API Response Handling**:
- Success: Close modal, refresh table data, show success toast
- Error: Keep modal open, show error toast with message
- Loading: Disable submit button, show loading indicator

## Phase 1: Design Decisions

### Component Architecture

**DealModal Component**:
```typescript
interface DealModalProps {
  mode: 'create' | 'edit';
  deal?: Deal;  // Required when mode is 'edit'
  customers: Customer[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Features**:
- Dual-mode operation (create/edit)
- Pre-populated form in edit mode
- Customer dropdown populated from API
- Stage dropdown with automatic probability calculation
- Native HTML5 date input for expected close date
- Textarea for description
- Text input for assigned to
- Validation on blur and submit
- Loading state during submission

**Toast Component**:
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  duration?: number;
  onClose: () => void;
}
```

**Features**:
- Success (green) and error (red) variants
- Auto-dismiss after duration
- Manual dismiss button
- Smooth enter/exit animations
- Icon based on type (check or X)

**ConfirmDialog Component**:
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}
```

**Features**:
- Reusable for any confirmation needs
- Dangerous action styling (red confirm button for delete)
- Keyboard support (Enter to confirm, Escape to cancel)
- Focus trap while open

### Enhanced Table Columns

**New columns configuration**:
1. Title (with customer name below)
2. Value (currency formatted)
3. Stage (color-coded badge)
4. Probability (progress bar + percentage)
5. Expected Close Date (formatted)
6. Assigned To
7. Created At (formatted)
8. **Actions (NEW)**: Edit and Delete icon buttons

**Actions Column Implementation**:
- Edit button: Pencil icon, opens DealModal in edit mode
- Delete button: Trash icon, opens ConfirmDialog
- Buttons styled with hover effects
- Icon size: 20px (lucide-react icons)
- Spacing: flex gap-2 between buttons

### API Endpoint Design

**PUT `/api/deals/[id]`**:
```typescript
// Request body: Partial<Deal> (only fields that changed)
// Response: Updated Deal object
// Errors: 400 (validation), 404 (not found), 500 (server error)
```

**DELETE `/api/deals/[id]`**:
```typescript
// No request body
// Response: 204 No Content or deleted Deal object
// Errors: 404 (not found), 500 (server error)
// Cascade deletes related records per schema
```

### State Management Strategy

**Page State**:
```typescript
const [deals, setDeals] = useState<Deal[]>([]);
const [customers, setCustomers] = useState<Customer[]>([]);
const [loading, setLoading] = useState(true);
const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
const [toasts, setToasts] = useState<Toast[]>([]);
const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; dealId?: number }>({ isOpen: false });
```

**Data Flow**:
1. User clicks "Add Deal" → `setModalMode('create')`
2. User clicks edit icon → `setModalMode('edit')`, `setSelectedDeal(deal)`
3. User submits form → API call → Close modal → Refresh deals → Show toast
4. User clicks delete → Open ConfirmDialog → Confirm → API call → Refresh deals → Show toast

### Form Validation Rules

**Required Fields**:
- Title: Non-empty string, max 200 characters
- Customer: Must select valid customer ID
- Value: Non-negative number, format as currency
- Stage: Must select valid stage from enum

**Optional Fields**:
- Expected Close Date: ISO date string, no past date validation (allowed per spec)
- Description: Text, max 1000 characters
- Assigned To: Text, max 100 characters

**Validation Messages**:
- Title: "Deal title is required" / "Title too long (max 200 characters)"
- Customer: "Please select a customer"
- Value: "Deal value is required" / "Value must be positive"
- Stage: "Please select a stage"

### Probability Calculation

**Stage-to-Probability Mapping** (Read-only):
```typescript
const STAGE_PROBABILITY: Record<DealStage, number> = {
  'prospecting': 10,
  'qualification': 25,
  'proposal': 50,
  'negotiation': 75,
  'closed-won': 100,
  'closed-lost': 0,
};
```

**Behavior**:
- When stage changes, probability automatically updates
- Probability field displayed as read-only (disabled input or static text)
- Visual indicator that probability is auto-calculated

### Empty State Design

**When `deals.length === 0`**:
```tsx
<div className="flex flex-col items-center justify-center py-16">
  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No deals yet</p>
  <button onClick={() => setModalMode('create')} className="...">
    <Plus className="w-5 h-5 mr-2" />
    Add Your First Deal
  </button>
</div>
```

### Loading State Enhancement

**While `loading === true`**:
```tsx
<div className="flex items-center justify-center py-12">
  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
  <span className="text-gray-500">Loading deals...</span>
</div>
```

## Implementation Strategy

### Phase Approach

**Phase 1: Foundation**
- Create utility components (Toast, ConfirmDialog)
- Add actions column to existing table
- Set up state management in deals page

**Phase 2: Create Operation**
- Build DealModal component
- Implement create mode
- Connect to existing POST endpoint
- Add form validation

**Phase 3: Update Operation**
- Add edit mode to DealModal
- Create PUT endpoint at `/api/deals/[id]`
- Wire up edit button in actions column

**Phase 4: Delete Operation**
- Create DELETE endpoint at `/api/deals/[id]`
- Wire up delete button with ConfirmDialog
- Handle cascade deletions

**Phase 5: Polish**
- Add empty state
- Enhance loading state
- Test all operations manually
- Verify constitution compliance

### Key Technical Challenges

**Challenge 1: Customer Dropdown Population**
- **Issue**: Need to fetch customers for dropdown
- **Solution**: Fetch customers in useEffect alongside deals
- **Fallback**: If no customers exist, show message with link to customers page

**Challenge 2: Modal State Management**
- **Issue**: Managing open/close, create/edit modes, and data
- **Solution**: Use multiple state variables, clear state on close
- **Edge case**: Handle modal closure during API call (use cleanup in useEffect)

**Challenge 3: Toast Queue Management**
- **Issue**: Multiple toasts appearing simultaneously
- **Solution**: Array of toast objects, render all, auto-remove after duration
- **Enhancement**: Position them stacked with slight offset

**Challenge 4: Probability Field Updates**
- **Issue**: Keeping probability synced with stage selection
- **Solution**: useEffect that watches stage field, updates probability
- **UX**: Show visual indicator that it's auto-calculated (maybe info icon)

## Success Metrics

**Functional Verification**:
- ✅ All deals display in enhanced table with 8+ columns including actions
- ✅ "Add Deal" button opens modal with empty form
- ✅ Can create deal with all required fields, see it appear in table
- ✅ Edit button opens modal with pre-populated data
- ✅ Can update deal, see changes reflected immediately
- ✅ Delete button shows confirmation, deletes deal on confirm
- ✅ Toast notifications appear for all operations
- ✅ Form validation prevents invalid submissions
- ✅ Empty state shows when no deals exist
- ✅ Loading state shows spinner while fetching

**Performance Verification**:
- ✅ Deals load within 500ms (for reasonable dataset)
- ✅ Modal opens/closes within 300ms
- ✅ No visual lag or jank in interactions

**Constitution Compliance Verification**:
- ✅ Component count: 3 new components (DealModal, Toast, ConfirmDialog)
- ✅ Existing components reused: Card, Table
- ✅ All TypeScript with strict types
- ✅ All Tailwind CSS styling
- ✅ Drizzle ORM for all database operations
- ✅ No testing code

## Rollout Plan

**Development**:
1. Create feature branch `001-deals-crud`
2. Implement components in order: Toast, ConfirmDialog, DealModal
3. Enhance page component with state management
4. Create API endpoints
5. Wire up all interactions
6. Manual verification testing

**Deployment**:
1. Merge to main after manual verification
2. Deploy to production
3. Monitor for errors in first 24 hours
4. Document any issues for future reference

**Rollback Strategy**:
- If critical bugs found, revert merge commit
- Database schema unchanged, so no migration rollback needed
- New components are additive, removal is safe

## Notes

- Customer dropdown will show all customers; if list grows beyond ~100, consider adding search/filtering in future iteration
- Toast component is simple; could be extracted as shared utility component for other pages later
- ConfirmDialog is generic; intentionally designed for reuse across application
- Modal uses portal pattern to render at document root level for proper z-indexing
- All date handling uses date-fns for consistency with existing codebase
- Stage colors must meet WCAG 2.1 AA contrast ratios (verify against white and dark backgrounds)