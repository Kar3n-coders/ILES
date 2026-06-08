# Plan: Complete 7 Outstanding ILES Frontend Tickets

> **Spec:** Finish ILES-69, ILES-53, ILES-71, ILES-58, ILES-59, ILES-60, ILES-68 — all frontend-only React work. Batch related tickets, 5+ commits each.
> **Branches:** One per ticket — see individual task groups
> **Linear:** ILES-69, ILES-53, ILES-71, ILES-58, ILES-59, ILES-60, ILES-68
> **Created:** 2026-06-08
> **Deadline:** 1 week

---

## Current State Assessment

| Ticket | Status | File(s) | Actual State |
|---|---|---|---|
| ILES-69 | In Progress | All 4 ProfilePages + api.js | `updateProfile()` already in api.js ✓. Profile pages render hardcoded names; need API wiring (useEffect + form state + handleSave) |
| ILES-53 | In Progress | student/EvaluationsPage.js | Fully functional mock-data page with EvalCard/Crit/Bar helpers + history table. Route `/student/evaluations` registered ✓. Much further along than stub |
| ILES-58 | Todo | workplace_supervisor/WorkplaceEvaluationPage.js | Bare `<h1>` stub — needs full build from ticket spec |
| ILES-59 | Todo | academic_supervisor/AcademicEvaluationPage.js | Bare `<h1>` stub — needs full build from ticket spec |
| ILES-60 | Todo | admin/AdminPlacementsPage.js | Bare `<h1>` stub — needs full build from ticket spec |
| ILES-68 | Todo | student/LogbookPage.js | Full mock-data page (WEEKS array, week list, sidebar). Route registered ✓. Needs API wiring |
| ILES-71 | Todo | student/EvaluationsPage.js | Same file as ILES-53. `getEvaluations()` already in api.js ✓. Needs mock→API migration. ⚠️ Blocked by ILES-65 (backend serializer fix) |

### Important Notes
- **All API functions already exist** in `frontend/src/services/api.js` — no new backend endpoints needed
- **All routes already registered** in `frontend/src/routes/AppRoutes.js`
- **Primitives available:** PageHead, Card, Chip, Bar, Btn, Field, Av, Stat, Lines (in `components/common/Primitives.js`)
- ⚠️ Currently on `main` with uncommitted changes (`.gitignore`, `manage.py`, `AGENTS.md`). Branch from `develop` per project conventions.

---

## Pre-flight Checklist
- [ ] Stash or commit uncommitted changes on `main` (`.gitignore`, `manage.py`, `AGENTS.md`)
- [ ] Verify `develop` is up to date: `git checkout develop && git pull ILES develop`
- [ ] Create all feature branches from `develop`
- [ ] `npm start` runs without errors (frontend)

---

## Execution Order & Task Groups

```
Group 1 → ILES-69 (Profile Pages API)        [independent] ✅ DONE
Group 2 → ILES-53 (EvaluationsPage UI build)  [independent — Already mostly done, just enhance to match spec]
Group 3 → ILES-58 + ILES-59 (Evaluation Forms) [independent — similar pattern, batch]
Group 4 → ILES-60 (Admin Placements)           [independent]
Group 5 → ILES-68 (Logbook API wiring)         [independent]
Group 6 → ILES-71 (Evaluations API wiring)     [last — blocked by ILES-65]
```

## 🔁 After Every Group — REQUIRED

After completing all tasks in a group:

1. **Push the branch:** `git push ILES <branch-name>`
2. **Create a PR against `develop`:**
   ```bash
   gh pr create --title "<title> [TICKET]" --body "<description>" --base develop --assignee @me
   ```
3. **Merge the PR (merge commit — no squash):**
   ```bash
   gh pr merge <PR#> --merge --delete-branch
   ```
   ⚠️ **Exception:** When merging `develop → main`, **never** use `--delete-branch`. Use:
   ```bash
   gh pr merge <PR#> --merge
   ```
   The `develop` branch is permanent and must never be deleted.
4. **Sync local develop:** `git checkout develop && git pull ILES develop`
5. **Move Linear ticket to "Done"**
6. **Create next feature branch from `develop`**

---

## Group 1: ILES-69 — Wire All Profile Pages to Real API

> **Branch:** `feat/ILES-69-wire-profile-pages-api`
> **Base:** `develop`
> **Current state:** api.js already has `updateProfile()`. All 4 ProfilePages use hardcoded names.

### Task 1.1: Add loading/error/success state scaffolding to Student ProfilePage
**Commit:** `feat(profile): add useState/useEffect, wire getProfile() to student ProfilePage [ILES-69]`
**Files:** `frontend/src/pages/student/ProfilePage.js`

**Steps:**
1. Read current ProfilePage.js (has hardcoded "Karen Kawooya" etc.)
2. Add imports: `useState, useEffect` from React, `getProfile, updateProfile` from api
3. Add state: `form`, `loading`, `saving`, `error`, `success`
4. Add `useEffect` calling `getProfile()` on mount, populating form state
5. Replace hardcoded name/email with `{form.first_name} {form.last_name}` and `{form.email}`
6. Show loading spinner/text while loading
**Done when:** Student profile page shows real user data from API

### Task 1.2: Wire Save Changes button on Student ProfilePage
**Commit:** `feat(profile): wire updateProfile() to Save Changes on student ProfilePage [ILES-69]`
**Files:** `frontend/src/pages/student/ProfilePage.js`

**Steps:**
1. Wire all Field/input components to `form` state via onChange
2. Create `handleSave` async function calling `updateProfile(form)`
3. Wire "Save changes" button to `handleSave`
4. Set button to "Saving..." + disabled during request
5. Show success/error message after save
**Done when:** Clicking "Save changes" sends PATCH, shows success/error feedback

### Task 1.3: Wire Workplace Supervisor ProfilePage
**Commit:** `feat(profile): wire getProfile + updateProfile to workplace supervisor ProfilePage [ILES-69]`
**Files:** `frontend/src/pages/workplace_supervisor/ProfilePage.js`

**Steps:**
1. Apply same pattern as Task 1.1 + 1.2 (useState, useEffect, getProfile, updateProfile, handleSave)
2. Replace hardcoded "John Okello" with form data
3. Loading/saving/error/success states
**Done when:** WS profile page wired to API

### Task 1.4: Wire Academic Supervisor ProfilePage
**Commit:** `feat(profile): wire getProfile + updateProfile to academic supervisor ProfilePage [ILES-69]`
**Files:** `frontend/src/pages/academic_supervisor/ProfilePage.js`

**Steps:**
1. Apply same pattern — useState, useEffect, getProfile, updateProfile, handleSave
2. Replace hardcoded "Dr. Sarah Nakato" with form data
**Done when:** Academic supervisor profile page wired to API

### Task 1.5: Wire Admin ProfilePage
**Commit:** `feat(profile): wire getProfile + updateProfile to admin ProfilePage [ILES-69]`
**Files:** `frontend/src/pages/admin/ProfilePage.js`

**Steps:**
1. Apply same pattern
2. Replace hardcoded "Admin User" with form data
**Done when:** Admin profile page wired to API

---

## Group 2: ILES-53 — Build Student EvaluationsPage (Enhance Existing)

> **Branch:** `feat/ILES-53-student-evaluations-page`
> **Base:** `develop`
> **Current state:** Working mock-data page at `student/EvaluationsPage.js`. Route registered. Already has EvalCard, Crit, Bar helpers, history table with Chip statuses.

⚠️ **Reality check:** The existing EvaluationsPage.js is functional but differs from the ILES-53 spec (no 3-stat grid, no academic sidebar, no self-assessment card). Since it already works and ILES-71 will wire it to the API anyway, we just need to ensure the current page is robust and matches the spirit of the ticket. No full rewrite needed — enhance what's there.

### Task 2.1: Verify and polish existing EvaluationsPage
**Commit:** `feat(evaluations): add loading/error states to existing EvaluationsPage [ILES-53]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Add loading state (placeholder while data "loads" — currently instant with mock data)
2. Add error state display
3. Verify Bar pct calculations are correct
4. Verify Chip kinds map correctly
**Done when:** Page handles loading and error edge cases

### Task 2.2: Add empty state handling
**Commit:** `feat(evaluations): add empty states for no evaluations [ILES-53]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Add empty state message when criteria arrays are empty
2. Add empty state for history table
**Done when:** Page shows friendly message when no data exists

### Task 2.3: Verify EvaluationsPage.css is complete
**Commit:** `style(evaluations): ensure EvaluationsPage.css covers all layout cases [ILES-53]`
**Files:** `frontend/src/pages/student/EvaluationsPage.css`

**Steps:**
1. Read current CSS, verify grid layouts work
2. Verify dark mode compatibility (no hardcoded colors)
3. Add any missing responsive breakpoints
**Done when:** CSS covers all states, works in dark mode

### Task 2.4: Lint and final polish
**Commit:** `chore(evaluations): final polish — prop types, accessibility, cleanup [ILES-53]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Verify all imports used
2. Check table accessibility (scope attributes)
3. Remove any dead code
**Done when:** Clean, production-ready component

### Task 2.5: Final verification — route and integration
**Commit:** `test(evaluations): verify route /student/evaluations renders correctly [ILES-53]`
**Files:** `frontend/src/routes/AppRoutes.js` (verify only — route already exists)

**Steps:**
1. Run `npm start`, navigate to `/student/evaluations`
2. Verify all sections render
3. Verify dark mode toggle doesn't break layout
**Done when:** Page renders without console errors

---

## Group 3: ILES-58 + ILES-59 — Evaluation Forms (Workplace + Academic)

> **Branches:** `feat/ILES-58-workplace-evaluation-page` and `feat/ILES-59-academic-evaluation-page`
> **Strategy:** Build ILES-58 first, then copy-paste-adapt for ILES-59 since they share the same structure.

### ILES-58: Workplace Supervisor Evaluation Page

#### Task 3.1: Scaffold WorkplaceEvaluationPage with imports and structure
**Commit:** `feat(evaluation): scaffold WorkplaceEvaluationPage layout [ILES-58]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.js`

**Steps:**
1. Replace stub with full component shell (PageHead, Card grid, criteria section)
2. Import PageHead, Card, Btn, Chip from Primitives
3. Add STUDENTS and CRITERIA constant arrays (from ticket spec)
4. Skeleton JSX structure — no state yet
**Done when:** Page renders the static structure without errors

#### Task 3.2: Add student selector and criteria score inputs
**Commit:** `feat(evaluation): add student selector and criteria score inputs [ILES-58]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.js`

**Steps:**
1. Add useState for `studentId` and `scores` (object keyed by criteria key)
2. Wire `<select>` to `studentId` state
3. Render 5 criteria rows with label, max weight, and number input
4. Wire inputs to `scores` state
**Done when:** Student can be selected, scores can be entered

#### Task 3.3: Add live total score computation
**Commit:** `feat(evaluation): compute and display live total score [ILES-58]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.js`

**Steps:**
1. Compute `total` from `scores` state (sum, capped at each criteria's max)
2. Display total in dedicated Card with large number and "/100" label
3. Show "Fills as you enter scores below" hint
**Done when:** Total score updates in real-time as numbers are typed

#### Task 3.4: Add submit button (static — no API)
**Commit:** `feat(evaluation): add submit evaluation button [ILES-58]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.js`

**Steps:**
1. Add `handleSubmit` function (preventDefault, TODO comment)
2. Wire to primary Btn in PageHead actions
**Done when:** Submit button present and clickable (no-op)

#### Task 3.5: Add WorkplaceEvaluationPage.css
**Commit:** `style(evaluation): add WorkplaceEvaluationPage.css with dark mode support [ILES-58]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.css`

**Steps:**
1. Create CSS file with styles from ticket spec (weval-group, weval-select, weval-total, weval-criteria, weval-row, weval-input)
2. Ensure all colors use CSS variables (no hardcoded hex)
3. Add focus states for inputs
**Done when:** Page styled, dark mode compatible

---

### ILES-59: Academic Supervisor Evaluation Page

#### Task 3.6: Build AcademicEvaluationPage (adapt from ILES-58)
**Commit:** `feat(evaluation): build AcademicEvaluationPage with student selector and criteria [ILES-59]`
**Files:** `frontend/src/pages/academic_supervisor/AcademicEvaluationPage.js`

**Steps:**
1. Copy structure from WorkplaceEvaluationPage, adapt to academic context
2. Use 3 criteria: Logbook Quality (40), Weekly Submissions (30), Progress Report (30)
3. Same pattern: PageHead, grid--2 (student selector + total score), criteria Card, comments Card
4. Add comments textarea with state
**Done when:** Academic evaluation page renders with all sections

#### Task 3.7: Add live total and submit button
**Commit:** `feat(evaluation): add live total score and submit to AcademicEvaluationPage [ILES-59]`
**Files:** `frontend/src/pages/academic_supervisor/AcademicEvaluationPage.js`

**Steps:**
1. Total score computation (sum, capped, /100)
2. handleSubmit stub (preventDefault + TODO)
3. Wire submit button
**Done when:** Total updates live, submit button present

#### Task 3.8: Add AcademicEvaluationPage.css
**Commit:** `style(evaluation): add AcademicEvaluationPage.css with dark mode support [ILES-59]`
**Files:** `frontend/src/pages/academic_supervisor/AcademicEvaluationPage.css`

**Steps:**
1. Create CSS from ticket spec (aeval-group, aeval-select, aeval-total, aeval-criteria, aeval-row, aeval-input, aeval-textarea)
2. All CSS variables, no hardcoded colors
3. Focus states
**Done when:** Page styled, dark mode compatible

#### Task 3.9: Verify routes for both evaluation pages
**Commit:** `chore(evaluation): verify /supervisor/evaluation and /academic/evaluation routes [ILES-59]`
**Files:** `frontend/src/routes/AppRoutes.js` (verify only)

**Steps:**
1. Verify both routes already registered in AppRoutes.js
2. Run `npm start`, test both routes
3. Verify dark mode
**Done when:** Both pages render at their routes

---

## Group 4: ILES-60 — Admin Placements Page

> **Branch:** `feat/ILES-60-admin-placements-page`
> **Base:** `develop`

### Task 4.1: Scaffold AdminPlacementsPage with mock data and stats
**Commit:** `feat(admin): scaffold AdminPlacementsPage with PLACEMENTS mock data [ILES-60]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Replace `<h1>` stub with full component
2. Import PageHead, Card, Stat, Chip, Btn from Primitives
3. Add PLACEMENTS mock array (5 entries from ticket spec)
4. Add Stat row (Total, Pending, Approved, Rejected) using grid--4
**Done when:** Stats row renders correct counts

### Task 4.2: Add filter chips
**Commit:** `feat(admin): add filter chips for placement status [ILES-60]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Add `filter` state (default "All")
2. Add FILTERS array: All, pending, approved, rejected
3. Render filter buttons — active state with `ap-filter--active` class
4. Compute `visible` placements based on filter
**Done when:** Clicking filter chips filters the table

### Task 4.3: Add placements table with status chips
**Commit:** `feat(admin): add placements table with status chips [ILES-60]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Render table: Student, Company, Supervisor, Status, Actions columns
2. Use Chip with KIND mapping (approved→ok, pending→warn, rejected→err)
3. Empty state row when filter has no matches
**Done when:** Table renders with correct status chips

### Task 4.4: Add Approve/Reject action buttons
**Commit:** `feat(admin): add approve/reject buttons for pending placements [ILES-60]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Show Approve + Reject Btn only when row status is "pending"
2. Buttons are static (no API yet) — add TODO comments
**Done when:** Pending rows show action buttons, others show nothing

### Task 4.5: Add AdminPlacementsPage.css
**Commit:** `style(admin): add AdminPlacementsPage.css with dark mode support [ILES-60]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.css`

**Steps:**
1. Create CSS from ticket spec (ap-filters, ap-filter, ap-table, ap-actions, ap-empty)
2. All CSS variables, no hardcoded colors
3. Active filter state styling
**Done when:** Page fully styled, dark mode compatible

---

## Group 5: ILES-68 — Wire Student Logbook Page to Real API

> **Branch:** `feat/ILES-68-wire-student-logbook-api`
> **Base:** `develop`
> **Current state:** Full mock-data page with WEEKS array. Route registered. All API functions exist (getLogbooks, createLogbook, submitLogbook).

### Task 5.1: Add API state and remove WEEKS mock array
**Commit:** `feat(logbook): add useState/useEffect, remove WEEKS mock array [ILES-68]`
**Files:** `frontend/src/pages/student/LogbookPage.js`

**Steps:**
1. Add imports: `useState, useEffect` from React; `getLogbooks, createLogbook, submitLogbook, getPlacements` from api
2. Add state: `logbooks`, `selected`, `loading`, `error`, `placement`, `creating`, `submitting`, `newEntry`
3. Add `useEffect` calling `Promise.all([getLogbooks(), getPlacements()])` on mount
4. Sort logbooks by week_number descending, set selected to first entry
5. Delete `const WEEKS = [...]` mock array
**Done when:** Page fetches real logbooks, no more WEEKS array

### Task 5.2: Wire week list to real logbook data
**Commit:** `feat(logbook): wire week list to real logbook entries from API [ILES-68]`
**Files:** `frontend/src/pages/student/LogbookPage.js`

**Steps:**
1. Replace `WEEKS.map(it => ...)` with `logbooks.map(it => ...)`
2. Use `it.week_number`, `it.start_date`, `it.end_date`, `it.status_display`
3. Map status to Chip kind via STATUS_KIND object
4. Wire selection to `selected` state
**Done when:** Week list shows real database entries

### Task 5.3: Add new entry creation form
**Commit:** `feat(logbook): add new logbook entry form wired to createLogbook() [ILES-68]`
**Files:** `frontend/src/pages/student/LogbookPage.js`

**Steps:**
1. Add new entry form with fields: week_number, start_date, end_date, activities
2. Wire form fields to `newEntry` state
3. Create `handleCreate` async function calling `createLogbook({...newEntry, placement: placement.id})`
4. On success: prepend new entry to logbooks list, select it, clear form
5. Set creating state during request
6. Disable "New week" button if no placement exists
**Done when:** New entries can be created and appear in list

### Task 5.4: Wire Submit for Review button
**Commit:** `feat(logbook): wire Submit for Review button to submitLogbook() [ILES-68]`
**Files:** `frontend/src/pages/student/LogbookPage.js`

**Steps:**
1. Create `handleSubmit(logId)` async function calling `submitLogbook(logId)`
2. On success: update entry status in logbooks state, update selected if needed
3. Wire button only on draft entries
**Done when:** Clicking "Submit for review" updates status to Pending

### Task 5.5: Add loading, error, and empty states
**Commit:** `feat(logbook): add loading, error, and empty states to LogbookPage [ILES-68]`
**Files:** `frontend/src/pages/student/LogbookPage.js`

**Steps:**
1. Loading spinner/placeholder while logbooks fetch
2. Error message display when API fails
3. Empty state when no logbook entries exist
4. Disabled "New week" button with onboarding prompt if no placement
**Done when:** All edge cases handled gracefully

---

## Group 6: ILES-71 — Wire Student Evaluations Page to Real API

> **Branch:** `feat/ILES-71-wire-student-evaluations-api`
> **Base:** `develop` (after ILES-53 merged)
> ⚠️ **Blocked by ILES-65:** Backend serializer fix for evaluation API. If ILES-65 is not done, evaluations endpoint may return errors. Test carefully.

### Task 6.1: Add API state and remove mock data arrays
**Commit:** `feat(evaluations): remove WORKPLACE_CRITERIA/ACADEMIC_CRITERIA/HISTORY mocks [ILES-71]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Add imports: `useState, useEffect` from React; `getEvaluations, getPlacements` from api
2. Add state: `workplaceCriteria`, `academicCriteria`, `history`, `loading`, `error`
3. Delete `WORKPLACE_CRITERIA`, `ACADEMIC_CRITERIA`, `HISTORY` constants
**Done when:** Mock data arrays removed, state hooks in place

### Task 6.2: Wire getEvaluations() — group by evaluator type
**Commit:** `feat(evaluations): wire getEvaluations(), group by workplace vs academic [ILES-71]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Add `useEffect` calling `Promise.all([getEvaluations(), getPlacements()])` on mount
2. Group evaluations by `evaluator_type`: workplace vs academic
3. Map to criteria format: `{ label: e.criteria_name, score: e.score, weight: e.criteria_weight }`
4. Set `workplaceCriteria` and `academicCriteria` state
**Done when:** Criteria come from API instead of hardcoded arrays

### Task 6.3: Wire history table from API
**Commit:** `feat(evaluations): wire history table to real finalized evaluations [ILES-71]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Filter evaluations where `is_finalised === true`
2. Map to history format: `{ date, type ("Workplace"/"Academic"), evaluator, score, status }`
3. Set `history` state
4. Replace `HISTORY.map(...)` with `history.map(...)` in JSX
**Done when:** History table shows real finalized evaluations

### Task 6.4: Add empty states for no evaluations
**Commit:** `feat(evaluations): add empty state when no evaluations exist [ILES-71]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Show empty state message when `workplaceCriteria` and `academicCriteria` are both empty
2. Show "No evaluation history" when `history` is empty
3. Different message for "no evaluations yet" vs "no finalized evaluations"
**Done when:** Student with no evaluations sees friendly message, not fake data

### Task 6.5: Add loading and error states
**Commit:** `feat(evaluations): add loading spinner and error display [ILES-71]`
**Files:** `frontend/src/pages/student/EvaluationsPage.js`

**Steps:**
1. Loading spinner/placeholder while data fetches
2. Error message with retry option on failure
3. Ensure score bar percentages derive from real score field (score/weight * 100)
**Done when:** Loading and error states handled

---

## Final Checklist
- [ ] All 7 ticket checkboxes complete
- [ ] `npm start` runs without errors
- [ ] All routes render without console errors
- [ ] Dark mode verified on every new/changed page
- [ ] PR opened for each ticket against `develop` (merge commit — no squash/rebase)
- [ ] Each Linear ticket moved to "In Review" → then "Done"
- [ ] Minimum 5 commits per ticket
- [ ] No hardcoded names, no mock data arrays remain in wired pages
- [ ] ILES-65 resolved (or API confirmed working) before ILES-71 PR
