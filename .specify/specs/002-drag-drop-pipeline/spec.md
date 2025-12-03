# Feature Specification: Interactive Pipeline Board with Drag-and-Drop

**Feature Branch**: `002-drag-drop-pipeline`  
**Created**: 2025-11-06  
**Status**: Draft  
**Input**: User description: "improve the pipelines page. create a drag and drop board where users can move the stages of the deal card. Also add insights and allow users to edit deals data in the card."

## User Scenarios *(mandatory)*

### User Story 1 - Move Deals Through Pipeline Stages (Priority: P1)

Sales representatives need to quickly update deal stages as they progress through the sales pipeline. Currently, they must open each deal individually to change its stage, which is inefficient when managing multiple deals simultaneously.

**Why this priority**: This is the core functionality that provides immediate productivity gains. Moving deals visually through stages reduces clicks and cognitive load, enabling sales reps to process more deals in less time.

**Independent Verification**: Can be verified by dragging a deal card from one column to another and confirming the stage updates persist after page refresh. Delivers immediate value by reducing the time to update deal stages.

**Acceptance Scenarios**:

1. **Given** a sales rep is viewing the pipeline board with deals in various stages, **When** they drag a deal card from "Qualification" column to "Proposal" column, **Then** the deal moves to the new column and its stage is updated in the system
2. **Given** a deal is being dragged, **When** the user moves the cursor over a valid drop zone, **Then** visual feedback indicates the drop zone is available (e.g., highlight, border change)
3. **Given** a deal is being dragged, **When** the user releases it over an invalid area, **Then** the deal returns to its original position and no stage change occurs
4. **Given** multiple deals exist in a single stage, **When** a user drags a deal to reorder it within the same column, **Then** the deal position updates and the new order is maintained
5. **Given** a deal has been moved to a new stage, **When** the page is refreshed or the user navigates away and returns, **Then** the deal remains in the new stage

---

### User Story 2 - View Pipeline Insights (Priority: P2)

Sales managers and representatives need quick visibility into pipeline health and performance metrics to make informed decisions about where to focus their efforts.

**Why this priority**: Insights drive strategic decisions and help identify bottlenecks. While important, this can be added after the core drag-and-drop functionality is working, as it enhances rather than enables the primary workflow.

**Independent Verification**: Can be verified by viewing the pipeline board and confirming that key metrics (deal count, total value, conversion rates) are displayed for each stage. Delivers value by eliminating the need to navigate to separate analytics pages.

**Acceptance Scenarios**:

1. **Given** deals exist in multiple pipeline stages, **When** the user views the pipeline board, **Then** each column displays the total number of deals in that stage
2. **Given** deals have monetary values, **When** the user views the pipeline board, **Then** each column displays the total value of all deals in that stage
3. **Given** historical deal data exists, **When** the user views a pipeline stage, **Then** conversion rate metrics are displayed (e.g., "65% move to next stage")
4. **Given** deals have age/duration data, **When** the user views the pipeline board, **Then** average time spent in each stage is displayed
5. **Given** the user wants to understand pipeline health, **When** they view the board, **Then** visual indicators highlight stages with unusual metrics (e.g., too many deals stagnating)

---

### User Story 3 - Quick Edit Deal Details (Priority: P3)

Sales representatives need to update deal information quickly without leaving the pipeline view. Frequent updates include customer contact details, deal value, closing date, and notes.

**Why this priority**: This completes the streamlined workflow by eliminating context switching. However, it's lower priority because users can still accomplish updates through existing detail pages if needed.

**Independent Verification**: Can be verified by clicking edit on a deal card, modifying fields like deal value or closing date, saving changes, and confirming updates persist. Delivers value by keeping users in the pipeline context.

**Acceptance Scenarios**:

1. **Given** a deal card is displayed on the pipeline board, **When** the user clicks an "edit" action on the card, **Then** editable fields appear on the card (inline or modal overlay)
2. **Given** deal fields are editable, **When** the user modifies the deal value, closing date, or contact information, **Then** changes are saved and reflected immediately on the card
3. **Given** the user is editing deal fields, **When** they enter invalid data (e.g., negative value, past closing date), **Then** validation errors are displayed before saving
4. **Given** multiple users are viewing the same pipeline, **When** one user edits a deal, **Then** other users see the updated information within 5 seconds
5. **Given** a user is editing a deal card, **When** they click outside the edit area or press "cancel", **Then** changes are discarded and the card returns to view mode

---

### Edge Cases

- What happens when a user drags a deal but loses network connection before the update completes?
- How does the system handle attempting to move a deal to a stage that is not a valid transition (e.g., skipping stages)?
- What happens when two users simultaneously try to move the same deal to different stages?
- How does the board perform when a single stage contains hundreds of deals?
- What happens when deal insights data is unavailable or calculation fails?
- How does the edit functionality handle concurrent edits by multiple users on the same deal?
- What happens when required deal fields are cleared during quick edit?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display pipeline stages as distinct columns in a horizontal board layout
- **FR-002**: System MUST display deal cards within their respective stage columns, showing key information (deal name, value, customer, last updated)
- **FR-003**: System MUST enable users to drag deal cards from one column to another using mouse or touch input
- **FR-004**: System MUST provide visual feedback during drag operations (card follows cursor, drop zones highlight)
- **FR-005**: System MUST update the deal stage immediately when a card is dropped in a new column
- **FR-006**: System MUST persist stage changes to the database and reflect them across all user sessions
- **FR-007**: System MUST allow deals to be reordered within the same stage column
- **FR-008**: System MUST display aggregate metrics for each pipeline stage (total deals, total value, conversion rate, average duration)
- **FR-009**: System MUST refresh insights automatically when deals are moved or updated
- **FR-010**: System MUST provide an edit action on each deal card (button, icon, or hover action)
- **FR-011**: System MUST allow users to modify deal fields without leaving the pipeline view (inline or modal edit)
- **FR-012**: System MUST validate edited data before saving (required fields, data types, business rules)
- **FR-013**: System MUST provide feedback when edits are saved successfully or fail
- **FR-014**: System MUST prevent data loss if a drag operation fails due to network issues (rollback or retry mechanism)
- **FR-015**: System MUST handle concurrent updates to the same deal gracefully (last write wins or conflict notification)
- **FR-016**: System MUST support keyboard navigation for accessibility (tab through columns, arrow keys to navigate cards)
- **FR-017**: System MUST be responsive and work on tablet devices with touch input

### Key Entities

- **Pipeline Stage**: Represents a step in the sales process (e.g., Lead, Qualification, Proposal, Negotiation, Closed Won, Closed Lost). Has a name, order/sequence, and contains multiple deals.
- **Deal Card**: Represents a sales opportunity with attributes including stage, customer name, deal value, closing date, last activity, and owner. Cards are displayed in stage columns and can be moved between stages.
- **Pipeline Insights**: Aggregate metrics calculated from deal data including deal count per stage, total value per stage, conversion rates between stages, and average time in stage.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can move a deal between stages in under 3 seconds (from click to save)
- **SC-002**: Stage changes persist immediately with users seeing updates reflected within 2 seconds
- **SC-003**: Pipeline board displays correctly with up to 200 deals across all stages without performance degradation
- **SC-004**: 95% of deal stage updates are completed using drag-and-drop instead of navigating to detail pages
- **SC-005**: Users can view key pipeline metrics (deal count, total value, conversion rate) without navigating away from the board
- **SC-006**: 80% of quick deal edits (value, date, notes) are completed from the pipeline view without opening detail pages
- **SC-007**: The board interface responds to touch input on tablet devices with the same functionality as desktop
- **SC-008**: Sales team reports 40% reduction in time spent updating deal information compared to previous workflow

## Assumptions

- Pipeline stages are predefined and will not be dynamically created/deleted by users during this feature scope
- Deal cards will display a maximum of 5-6 key fields to maintain card size and board usability
- Users have appropriate permissions to edit deals they can view
- Network connectivity is generally stable; offline editing is not required for this version
- The system uses standard optimistic updates for drag operations (assume success, rollback on failure)
- Insights calculations use cached/pre-aggregated data for performance and update asynchronously
- All users viewing the same pipeline should see consistent data within 5 seconds of any change
- Touch devices refer to tablets; mobile phone layouts are not included in this scope