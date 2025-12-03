# Feature Specification: Deals CRUD Management

**Feature Branch**: `001-deals-crud`
**Created**: 2025-11-06
**Updated**: 2025-11-06
**Status**: Draft - Clarifications Complete
**Input**: User description: "improve the deals page, add the ability to create, read, update, delete deals. display as many useful data in the table as possible."

**Note**: All implementation clarifications documented in [clarify.md](./clarify.md)

## User Scenarios *(mandatory)*

<!--
  NOTE: Testing requirements depend on project constitution. If tests are not required,
  acceptance scenarios serve as manual verification checklists.
-->

### User Story 1 - View Comprehensive Deal Information (Priority: P1)

Users need to see all relevant deal information at a glance in a well-organized table to quickly assess the status and value of their sales pipeline.

**Why this priority**: This is the foundation for all other operations. Users must be able to view comprehensive deal data before they can create, update, or delete deals. This provides immediate value by improving visibility into the sales pipeline.

**Independent Verification**: Can be verified by loading the deals page and confirming all deal fields are displayed in a clear, organized table format with proper formatting for currency, dates, and status indicators.

**Acceptance Scenarios**:

1. **Given** I am on the deals page, **When** deals are loaded, **Then** I see a table displaying: deal title, customer name, value (formatted as currency), stage (color-coded badge), probability (progress bar + percentage), expected close date, assigned sales rep, creation date, and an actions column with edit/delete icons
2. **Given** deals exist in the database, **When** the page loads, **Then** deals are sorted by creation date (newest first)
3. **Given** I view a deal's stage, **When** the stage is displayed, **Then** it shows with appropriate color coding: prospecting (gray), qualification (blue), proposal (purple), negotiation (orange), closed-won (green), closed-lost (red)
4. **Given** I view deal values, **When** currency is displayed, **Then** it's formatted with commas and dollar signs (e.g., $150,000)
5. **Given** I view probability, **When** displayed, **Then** it shows as both a visual progress bar and percentage text (e.g., 75%)
6. **Given** no deals exist in the database, **When** the page loads, **Then** I see an empty state message "No deals yet" with a prominent "Add Deal" button
7. **Given** deals are loading, **When** the page is fetching data, **Then** I see a spinner with the text "Loading deals..."

---

### User Story 2 - Create New Deals (Priority: P1)

Users need to create new deals by entering all relevant information including customer association, deal value, stage, and expected close date to track new sales opportunities.

**Why this priority**: Creating deals is a core function that enables users to track new opportunities. Without this, the CRM cannot fulfill its primary purpose. This is part of the MVP functionality.

**Independent Verification**: Can be verified by clicking "Add Deal" button, filling out the form with valid data, submitting, and confirming the new deal appears in the table with all entered information correctly displayed.

**Acceptance Scenarios**:

1. **Given** I am on the deals page, **When** I click the "Add Deal" button, **Then** a client-side modal overlay opens with fields for: deal title, customer (simple dropdown), value, stage, expected close date, description, and assigned to
2. **Given** the create deal form is open, **When** I enter valid data and submit, **Then** the new deal is created in the database with timestamps, appears in the deals table, the modal closes, and a toast notification shows success
3. **Given** I am creating a deal, **When** I select a customer from the dropdown, **Then** the customer name is automatically populated in the deal record for denormalized queries
4. **Given** I am filling the form, **When** I set a stage, **Then** the probability field is automatically set and displayed as read-only (prospecting: 10%, qualification: 25%, proposal: 50%, negotiation: 75%, closed-won: 100%, closed-lost: 0%)
5. **Given** I submit the form with missing required fields (title, customer, value, stage), **When** validation runs, **Then** inline error messages appear highlighting missing fields
6. **Given** I am filling the form, **When** I blur any field (field loses focus), **Then** that field is validated and errors are shown immediately if invalid
7. **Given** the deal is created successfully, **When** the operation completes, **Then** the modal closes, the new deal appears at the top of the table, and a success toast notification appears

---

### User Story 3 - Edit Existing Deals (Priority: P2)

Users need to update deal information as opportunities progress through the sales pipeline, including changing stages, updating values, and modifying close dates.

**Why this priority**: Deal information changes frequently as opportunities progress. Users must be able to update records to maintain accurate pipeline data. This is essential for ongoing operations but requires viewing functionality first.

**Independent Verification**: Can be verified by clicking an edit button/icon on a deal row, modifying one or more fields in the form, saving, and confirming the changes are reflected in the table and persisted in the database.

**Acceptance Scenarios**:

1. **Given** I am viewing the deals table, **When** I click the edit icon in the actions column of a deal row, **Then** a client-side modal overlay opens pre-populated with the existing deal data
2. **Given** the edit form is open, **When** I modify any field (value, stage, expected close date, description, assigned to) and save, **Then** the deal is updated in the database with a new `updatedAt` timestamp
3. **Given** I am editing a deal, **When** I change the stage, **Then** the probability field automatically updates to reflect the new stage's probability (read-only, cannot be manually overridden)
4. **Given** I am editing a deal, **When** I change it to "closed-won" or "closed-lost", **Then** the `actualCloseDate` field is automatically set to the current date
5. **Given** I am editing a deal, **When** any field loses focus, **Then** that field is validated immediately and errors are shown inline if invalid
6. **Given** I save changes, **When** validation passes, **Then** the modal closes, the table row updates with new values, and a success toast notification is displayed
7. **Given** I edit a deal, **When** I click cancel or close the modal, **Then** no changes are saved and the modal closes without notification

---

### User Story 4 - Delete Deals (Priority: P3)

Users need to remove deals that were created in error, are no longer relevant, or are duplicate entries to maintain a clean and accurate database.

**Why this priority**: While important for data hygiene, deletion is less frequently used than viewing, creating, or editing. It's essential for cleanup but not for core daily operations.

**Independent Verification**: Can be verified by clicking a delete button/icon on a deal row, confirming the deletion in a confirmation dialog, and verifying the deal is removed from both the table and database.

**Acceptance Scenarios**:

1. **Given** I am viewing the deals table, **When** I click the delete icon in the actions column of a deal row, **Then** a confirmation dialog appears asking "Are you sure you want to delete this deal?"
2. **Given** the delete confirmation is shown, **When** I confirm deletion, **Then** the deal is permanently removed from the database (cascade deletes related records per schema), removed from the table, and a success toast notification is shown
3. **Given** the delete confirmation is shown, **When** I cancel, **Then** no changes are made and the dialog closes
4. **Given** a deal has related activities or notes, **When** I delete the deal, **Then** all related records are automatically deleted due to the cascade delete constraint in the schema

---

### Edge Cases

- What happens when no customers exist in the database when trying to create a deal?
  * Display a message prompting user to create a customer first, with a link to the customers page
  
- What happens when the API fails to fetch deals?
  * Display an error message: "Failed to load deals. Please try again." with a retry button
  
- What happens when trying to create/update a deal with a value of 0 or negative?
  * Allow 0 values (some deals may have no monetary value initially), but reject negative values with validation error
  
- What happens when the expected close date is in the past?
  * Allow it (deals may have been expected to close earlier), but show a warning indicator
  
- What happens when editing a closed deal (closed-won or closed-lost)?
  * Allow editing but show a warning that the deal is already closed
  
- What happens when two users edit the same deal simultaneously?
  * Last write wins (acceptable for MVP; optimistic locking can be added later if needed)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a comprehensive table of all deals with columns: title, customer name, value (currency formatted), stage (color-coded badge), probability (progress bar + percentage), expected close date (formatted), assigned to, creation date, and an actions column with edit/delete icons
- **FR-002**: System MUST provide an "Add Deal" button that opens a client-side modal overlay for creating new deals
- **FR-003**: System MUST provide edit functionality for each deal row via an edit icon in the actions column that opens a pre-populated client-side modal overlay
- **FR-004**: System MUST provide delete functionality for each deal row via a delete icon in the actions column with confirmation dialog
- **FR-005**: System MUST validate required fields: title (non-empty string), customer (valid customer ID), value (non-negative number), stage (valid stage value)
- **FR-006**: System MUST display a simple dropdown for customer selection listing all customers with name and company
- **FR-007**: System MUST auto-populate customer name from selected customer for denormalized queries when creating/updating deals
- **FR-008**: System MUST automatically set probability as read-only based on stage: prospecting (10%), qualification (25%), proposal (50%), negotiation (75%), closed-won (100%), closed-lost (0%) - users cannot manually override probability
- **FR-009**: System MUST automatically set `actualCloseDate` to current date when deal stage is changed to closed-won or closed-lost
- **FR-010**: System MUST update the `updatedAt` timestamp whenever a deal is modified
- **FR-011**: System MUST refresh the deals table after create, update, or delete operations without full page reload
- **FR-012**: System MUST validate form fields on blur (when field loses focus) and on submit
- **FR-013**: System MUST display inline error messages in the modal for validation errors
- **FR-014**: System MUST display toast notifications (temporary, corner of screen) for success and error feedback on operations
- **FR-015**: System MUST sort deals by creation date (newest first) by default
- **FR-016**: System MUST format currency values with commas and dollar signs (e.g., $150,000)
- **FR-017**: System MUST format dates in a human-readable format (e.g., "Jan 15, 2025")
- **FR-018**: System MUST use native HTML5 date input (`<input type="date">`) for date selection
- **FR-019**: System MUST display empty state with "No deals yet" message and prominent "Add Deal" button when no deals exist
- **FR-020**: System MUST display spinner with "Loading deals..." text while fetching data
- **FR-021**: System MUST implement "Assigned To" as a free text input field (simple name string)
- **FR-022**: API endpoints MUST implement GET (list), POST (create), PUT/PATCH (update), and DELETE operations for deals

### Key Entities *(include if feature involves data)*

- **Deal**: Represents a sales opportunity with fields including ID, title, customer ID, customer name (denormalized), value, stage, probability, expected close date, actual close date, description, assigned to, created at, updated at
- **Customer**: Referenced by deal via customer ID; provides customer name for display purposes

### Non-Functional Requirements

- **NFR-001**: Deal list operations MUST complete within 500ms for up to 1000 deals
- **NFR-002**: Modal forms MUST open/close with smooth animations (< 300ms)
- **NFR-003**: All forms MUST be fully keyboard accessible (tab navigation, enter to submit, escape to close)
- **NFR-004**: Table MUST be responsive and usable on tablet devices (768px+)
- **NFR-005**: Color coding for stages MUST maintain contrast ratios meeting WCAG 2.1 Level AA standards

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view all deals with comprehensive information displayed in a single table view
- **SC-002**: Users can create a new deal in under 60 seconds with all required information
- **SC-003**: Users can edit an existing deal and see changes reflected in the table immediately after save
- **SC-004**: Users can delete a deal with confirmation in under 10 seconds
- **SC-005**: Zero data loss occurs during create, update, or delete operations under normal conditions
- **SC-006**: All CRUD operations complete successfully 99% of the time (excluding network failures)
- **SC-007**: Deal stage colors are immediately recognizable and consistent across the interface
- **SC-008**: Currency and date formats are consistent throughout the application
- **SC-009**: Users can distinguish between different deals at a glance using visual indicators (stage colors, progress bars)
- **SC-010**: Modal forms are intuitive and require no training to use effectively

## Technical Constraints

### Technology Adherence (Per Constitution)

- **TC-001**: MUST use existing Card and Table components; create minimal new components
- **TC-002**: MUST use TypeScript with strict type safety for all code
- **TC-003**: MUST use Tailwind CSS for all styling (utility classes)
- **TC-004**: MUST use Drizzle ORM for all database operations
- **TC-005**: MUST use Next.js API routes for backend endpoints
- **TC-006**: No testing required (manual verification only)

### Database Schema

- **TC-007**: MUST use existing deals table schema in `db/schema.ts`
- **TC-008**: MUST maintain referential integrity (customer ID foreign key)
- **TC-009**: MUST respect cascade delete constraints for related records
- **TC-010**: MUST update `updatedAt` timestamp on all modifications

### Component Reusability

- **TC-011**: MUST reuse existing Card component for page container
- **TC-012**: MUST reuse existing Table component for deals display
- **TC-013**: MUST create a single reusable client-side modal component for both create and edit operations (overlay pattern, not route-based)
- **TC-014**: MUST reuse existing button and form styling patterns

## Out of Scope

- Bulk operations (bulk delete, bulk edit)
- Deal filtering or search functionality
- Deal sorting by columns (other than default sort by creation date)
- Deal pipeline drag-and-drop stage changes
- Deal activity timeline or history
- Deal notes or attachments
- Deal collaboration features
- Export deals to CSV/Excel
- Advanced analytics or reporting
- Deal templates or cloning
- Custom fields for deals

These features may be considered for future iterations but are explicitly excluded from this specification.