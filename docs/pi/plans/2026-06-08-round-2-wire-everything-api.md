# Plan: Round 2 — Wire Everything to API + Fill Gaps

> **Spec:** Remove all mock data, wire every page to real API, build missing pages (My Students, Users, Criteria), remove dead pages (Progress, Documents), fix PlacementSerializer status bug.
> **Linear:** ILES-72 → ILES-78
> **Created:** 2026-06-08

---

## Pre-flight Checklist
- [ ] Branch from `develop` for each ticket
- [ ] `python manage.py test` passes on baseline (backend)
- [ ] `npm run build` passes on baseline (frontend)
- [ ] No uncommitted changes on `develop`

---

## Execution Order

```
Ticket 1 → ILES-72 (Backend: fix PlacementSerializer)   [BLOCKER for ILES-76]
Ticket 2 → ILES-73 (Student cleanup)                     [independent]
Ticket 3 → ILES-74 (WS: Students + Evaluation wire)      [depends on ILES-72 for eval]
Ticket 4 → ILES-75 (AS: Students + Evaluation wire)      [depends on ILES-72 for eval]
Ticket 5 → ILES-76 (Admin: Placements API)               [depends on ILES-72]
Ticket 6 → ILES-77 (Admin: Users page)                   [independent]
Ticket 7 → ILES-78 (Admin: Criteria page)                [independent]
```

---

## 🔁 After Every Ticket — REQUIRED

1. Push: `git push ILES <branch>`
2. PR: `gh pr create --title "..." --base develop --assignee @me`
3. Merge: `gh pr merge <#> --merge --delete-branch`
4. Sync: `git checkout develop && git pull ILES develop`
5. Linear → Done

---

## Ticket 1: ILES-72 — Fix PlacementSerializer status field

> **Branch:** `fix/ILES-72-placement-serializer-status`
> **Type:** Backend only

### Task 1.1: Add status to PlacementSerializer fields
**Commit:** `fix(serializer): add status field to PlacementSerializer [ILES-72]`
**Files:** `backend/placements/serializers.py`

**Steps:**
1. Add `"status"` to `PlacementSerializer.Meta.fields` list
2. No other changes needed — model already has the field, DRF handles it automatically

**Done when:**
- [ ] `"status"` appears in the fields list
- [ ] `python manage.py test` passes

### Task 1.2: Verify API response includes status
**Commit:** `test(placements): verify status field in placement API response [ILES-72]`
**Files:** No code changes — verification only

**Steps:**
1. Run backend: `python manage.py runserver`
2. `curl -H "Authorization: Bearer <token>" http://localhost:8000/api/placements/`
3. Confirm each placement object has `"status": "pending"` (or approved/rejected)

**Done when:**
- [ ] API response includes `status` field for all placements

### Task 1.3: Verify detail endpoint also returns status
**Commit:** `test(placements): verify status in detail endpoint [ILES-72]`
**Files:** No code changes — verification only

**Steps:**
1. `curl http://localhost:8000/api/placements/1/`
2. Confirm status field present

**Done when:**
- [ ] Detail response includes `status`

### Task 1.4: Add status_display for frontend convenience
**Commit:** `feat(serializer): add status_display field to PlacementSerializer [ILES-72]`
**Files:** `backend/placements/serializers.py`

**Steps:**
1. Add `status_display = serializers.CharField(source="get_status_display", read_only=True)` to PlacementSerializer
2. Add `"status_display"` to fields list

**Done when:**
- [ ] API returns `"status_display": "Pending"` (or Approved/Rejected)

### Task 1.5: Final verification and test
**Commit:** `test(placements): run full test suite after serializer change [ILES-72]`
**Files:** No code changes — verify tests pass

**Steps:**
1. `python manage.py test placements`
2. `python manage.py test`
3. Verify no regressions

**Done when:**
- [ ] All tests pass
- [ ] Status field confirmed in both list and detail responses

---

## Ticket 2: ILES-73 — Remove Student Progress & Documents, strip Schedule mock

> **Branch:** `feat/ILES-73-cleanup-student-pages`
> **Type:** Frontend only

### Task 2.1: Delete ProgressPage and remove route
**Commit:** `chore(student): delete ProgressPage.js and remove /student/progress route [ILES-73]`
**Files:** `frontend/src/pages/student/ProgressPage.js`, `frontend/src/routes/AppRoutes.js`

**Steps:**
1. Delete `frontend/src/pages/student/ProgressPage.js`
2. Remove `import ProgressPage` line from AppRoutes.js
3. Remove `<Route path="/student/progress" element={<ProgressPage />} />` from AppRoutes.js

**Done when:**
- [ ] File deleted, route removed, no broken imports

### Task 2.2: Delete DocumentsPage and remove route
**Commit:** `chore(student): delete DocumentsPage.js and remove /student/documents route [ILES-73]`
**Files:** `frontend/src/pages/student/DocumentsPage.js`, `frontend/src/routes/AppRoutes.js`

**Steps:**
1. Delete `frontend/src/pages/student/DocumentsPage.js`
2. Remove `import DocumentsPage` and route from AppRoutes.js

**Done when:**
- [ ] File deleted, route removed

### Task 2.3: Strip mock data from SchedulePage
**Commit:** `chore(schedule): replace mock SCHEDULE data with empty state [ILES-73]`
**Files:** `frontend/src/pages/student/SchedulePage.js`

**Steps:**
1. Delete `const SCHEDULE = [...]` mock array
2. Replace with empty array: `const SCHEDULE = [];`
3. Verify empty state renders: "No events scheduled yet."

**Done when:**
- [ ] No mock data in SchedulePage
- [ ] Empty state message displays

### Task 2.4: Remove sidebar nav references (if any)
**Commit:** `chore(sidebar): remove Progress and Documents from sidebar navigation [ILES-73]`
**Files:** `frontend/src/components/layout/Sidebar.js`

**Steps:**
1. Check if Sidebar has links to Progress or Documents
2. If yes, remove them

**Done when:**
- [ ] No dead sidebar links to removed pages

### Task 2.5: Verify build and routes
**Commit:** `test(routes): verify removed routes return 404, build passes [ILES-73]`
**Files:** No code changes — verification

**Steps:**
1. `npm run build` — must pass
2. Verify removed routes don't appear in route list

**Done when:**
- [ ] Build passes, no broken references

---

## Ticket 3: ILES-74 — WS: My Students page + wire Evaluation

> **Branch:** `feat/ILES-74-ws-students-evaluation-api`
> **Type:** Frontend only

### Task 3.1: Add updatePlacement to api.js (needed for ILES-76, add now)
**Commit:** `feat(api): add updatePlacement PATCH function [ILES-74]`
**Files:** `frontend/src/services/api.js`

**Steps:**
1. Add:
```js
export function updatePlacement(id, data) {
  return request(`/placements/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
```

**Done when:**
- [ ] `updatePlacement` function exists in api.js

### Task 3.2: Scaffold WS StudentsPage
**Commit:** `feat(ws): scaffold StudentsPage with card list layout [ILES-74]`
**Files:** `frontend/src/pages/workplace_supervisor/StudentsPage.js`

**Steps:**
1. Create component with PageHead, imports
2. Add student card layout structure (name, email, placement company)
3. Static placeholder for now

**Done when:**
- [ ] Page renders with header and card structure

### Task 3.3: Wire StudentsPage to GET /api/users/
**Commit:** `feat(ws): wire StudentsPage to GET /api/users/ [ILES-74]`
**Files:** `frontend/src/pages/workplace_supervisor/StudentsPage.js`

**Steps:**
1. Add useState/useEffect, import getUsers from api
2. Fetch users on mount
3. Map users to student cards
4. Add loading/error/empty states

**Done when:**
- [ ] Real students from API displayed

### Task 3.4: Register /supervisor/students route + add CSS
**Commit:** `feat(ws): register /supervisor/students route, add StudentsPage.css [ILES-74]`
**Files:** `frontend/src/routes/AppRoutes.js`, `frontend/src/pages/workplace_supervisor/StudentsPage.css`

**Steps:**
1. Import StudentsPage, add route inside WS role guard
2. Create StudentsPage.css with dark mode support

**Done when:**
- [ ] /supervisor/students renders
- [ ] Dark mode works

### Task 3.5: Wire WS Evaluation — student selector to API
**Commit:** `feat(ws): wire evaluation student selector to GET /api/placements/ [ILES-74]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.js`

**Steps:**
1. Add useState/useEffect for placements and criteria
2. Fetch placements on mount (GET /api/placements/)
3. Replace hardcoded STUDENTS array with placements data
4. Student dropdown shows `student_full_name — company_name`

**Done when:**
- [ ] Dropdown shows real placed students

### Task 3.6: Wire WS Evaluation — criteria and submit to API
**Commit:** `feat(ws): wire evaluation criteria and submit to API [ILES-74]`
**Files:** `frontend/src/pages/workplace_supervisor/WorkplaceEvaluationPage.js`

**Steps:**
1. Fetch criteria from GET /api/evaluation-criteria/
2. Replace hardcoded CRITERIA with API data
3. Wire handleSubmit to POST /api/evaluation/ with placement, evalutor_type, criteria, score
4. Add success/error feedback

**Done when:**
- [ ] Criteria loaded from API
- [ ] Submit sends to API with feedback

---

## Ticket 4: ILES-75 — AS: My Students page + wire Evaluation

> **Branch:** `feat/ILES-75-as-students-evaluation-api`
> **Type:** Frontend only

Mirror of ILES-74. Tasks identical but adapted for academic supervisor context.

### Task 4.1: Scaffold AS StudentsPage
**Commit:** `feat(as): scaffold StudentsPage with card list layout [ILES-75]`
**Files:** `frontend/src/pages/academic_supervisor/StudentsPage.js`

### Task 4.2: Wire AS StudentsPage to API
**Commit:** `feat(as): wire StudentsPage to GET /api/users/ [ILES-75]`
**Files:** `frontend/src/pages/academic_supervisor/StudentsPage.js`

### Task 4.3: Register route + CSS
**Commit:** `feat(as): register /academic/students route, add StudentsPage.css [ILES-75]`
**Files:** `frontend/src/routes/AppRoutes.js`, `frontend/src/pages/academic_supervisor/StudentsPage.css`

### Task 4.4: Wire AS Evaluation student selector
**Commit:** `feat(as): wire evaluation student selector to GET /api/placements/ [ILES-75]`
**Files:** `frontend/src/pages/academic_supervisor/AcademicEvaluationPage.js`

### Task 4.5: Wire AS Evaluation criteria and submit
**Commit:** `feat(as): wire evaluation criteria and submit to API [ILES-75]`
**Files:** `frontend/src/pages/academic_supervisor/AcademicEvaluationPage.js`

---

## Ticket 5: ILES-76 — Admin: Wire Placements with approve/reject

> **Branch:** `feat/ILES-76-admin-placements-api`
> **Type:** Frontend only
> **Depends on:** ILES-72 (status in serializer)

### Task 5.1: Remove mock PLACEMENTS, add API state
**Commit:** `feat(admin): remove PLACEMENTS mock, add useState/useEffect with getPlacements() [ILES-76]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Delete `const PLACEMENTS = [...]` array
2. Add imports: `useState, useEffect`, `getPlacements, updatePlacement` from api
3. Add state: `placements`, `loading`, `error`
4. Add useEffect calling `getPlacements()`
5. Compute counts from real data

**Done when:**
- [ ] No mock data, API state in place

### Task 5.2: Wire table to real placement data
**Commit:** `feat(admin): wire placements table to real API data [ILES-76]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Replace `visible.map` with real placement data
2. Use `p.student_username` (or `student_full_name`) for student column
3. Use `p.company_name` for company column
4. Use `p.supervisor_username` (or `supervisor_full_name`) for supervisor column
5. Use `p.status` for status chip with KIND mapping
6. Use `p.status_display` for chip text

**Done when:**
- [ ] Table shows real DB placements
- [ ] Status chips reflect real status

### Task 5.3: Wire Approve button
**Commit:** `feat(admin): wire Approve button to PATCH status:approved [ILES-76]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Add `handleApprove(id)` function calling `updatePlacement(id, {status: "approved"})`
2. On success: update placement in state (optimistic or refetch)
3. Wire Approve Btn onClick
4. Add saving state (disable button during request)

**Done when:**
- [ ] Clicking Approve sends PATCH, status updates in UI

### Task 5.4: Wire Reject button
**Commit:** `feat(admin): wire Reject button to PATCH status:rejected [ILES-76]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Add `handleReject(id)` function calling `updatePlacement(id, {status: "rejected"})`
2. Wire Reject Btn onClick
3. Add saving state

**Done when:**
- [ ] Clicking Reject sends PATCH, status updates

### Task 5.5: Add loading, error, empty states
**Commit:** `feat(admin): add loading, error, empty states to placements page [ILES-76]`
**Files:** `frontend/src/pages/admin/AdminPlacementsPage.js`

**Steps:**
1. Loading spinner while fetching
2. Error display with retry
3. Empty state when no placements

**Done when:**
- [ ] All edge cases handled

---

## Ticket 6: ILES-77 — Admin Users page

> **Branch:** `feat/ILES-77-admin-users-page`
> **Type:** Frontend only

### Task 6.1: Scaffold UsersPage
**Commit:** `feat(admin): scaffold UsersPage with table layout [ILES-77]`
**Files:** `frontend/src/pages/admin/UsersPage.js`

**Steps:**
1. Create component with PageHead, Card, table structure
2. Columns: Username, Full Name, Email, Role, Date Joined

**Done when:**
- [ ] Page renders with table headers

### Task 6.2: Wire to GET /api/users/
**Commit:** `feat(admin): wire UsersPage to GET /api/users/ [ILES-77]`
**Files:** `frontend/src/pages/admin/UsersPage.js`

**Steps:**
1. Add useState/useEffect, import getUsers from api
2. Fetch users on mount
3. Map users to table rows

**Done when:**
- [ ] Real users displayed in table

### Task 6.3: Add role chips and date formatting
**Commit:** `feat(admin): add role chips and date formatting to UsersPage [ILES-77]`
**Files:** `frontend/src/pages/admin/UsersPage.js`

**Steps:**
1. Add ROLE_KIND mapping: student→accent, workplace_supervisor→info, academic_supervisor→accent, internship_admin→ok
2. Display role as Chip
3. Format date_joined as readable date

**Done when:**
- [ ] Roles shown as colored chips

### Task 6.4: Add loading and error states
**Commit:** `feat(admin): add loading and error states to UsersPage [ILES-77]`
**Files:** `frontend/src/pages/admin/UsersPage.js`

### Task 6.5: Register route + CSS
**Commit:** `style(admin): register /admin/users route, add UsersPage.css [ILES-77]`
**Files:** `frontend/src/routes/AppRoutes.js`, `frontend/src/pages/admin/UsersPage.css`

---

## Ticket 7: ILES-78 — Admin Criteria page

> **Branch:** `feat/ILES-78-admin-criteria-page`
> **Type:** Frontend only

### Task 7.1: Add createEvaluationCriteria to api.js
**Commit:** `feat(api): add createEvaluationCriteria POST function [ILES-78]`
**Files:** `frontend/src/services/api.js`

### Task 7.2: Scaffold CriteriaPage with list and form
**Commit:** `feat(admin): scaffold CriteriaPage with criteria list and create form [ILES-78]`
**Files:** `frontend/src/pages/admin/CriteriaPage.js`

### Task 7.3: Wire criteria list to API
**Commit:** `feat(admin): wire criteria list to GET /api/evaluation-criteria/ [ILES-78]`
**Files:** `frontend/src/pages/admin/CriteriaPage.js`

### Task 7.4: Wire create form to API
**Commit:** `feat(admin): wire create form to POST /api/evaluation-criteria/ [ILES-78]`
**Files:** `frontend/src/pages/admin/CriteriaPage.js`

### Task 7.5: Register route + CSS
**Commit:** `style(admin): register /admin/criteria route, add CriteriaPage.css [ILES-78]`
**Files:** `frontend/src/routes/AppRoutes.js`, `frontend/src/pages/admin/CriteriaPage.css`

---

## Final Checklist
- [ ] All 7 tickets complete
- [ ] `npm run build` passes
- [ ] `python manage.py test` passes
- [ ] Zero mock data arrays anywhere in frontend
- [ ] All 7 Linear tickets → Done
- [ ] PR for develop → main (WITHOUT --delete-branch)
