# ILES Frontend — Bug & Fix Log

Errors discovered during code review of open pull requests on 2026-05-14.
Each entry records the PR, the exact error, the commit where it can be reproduced, and the fix commit.

---

## PR #59 — ILES-34: Feedback Modal (feature/ILES-34-feedback-modal)

**Reviewer:** Matthew Mumbere  
**Date:** 2026-05-14

### Error 1 — Missing `export default`

| Field | Detail |
|---|---|
| File | `frontend/src/pages/supervisor/FeedbackModal.js` |
| Error commit | `1d3e38f` |
| Fix commit | `c6561ce` |
| Symptom | Any page importing `FeedbackModal` would throw `Element type is invalid` at runtime — React received `undefined` instead of a component |
| Cause | `function FeedbackModal()` was defined but the file had no `export default` statement at the bottom |
| Fix | Added `export default FeedbackModal;` after the closing `}` of the function |

**To reproduce:** `git checkout 1d3e38f` and import FeedbackModal from any parent component.

---

### Error 2 — Missing semicolons in `.modal-box` CSS rule

| Field | Detail |
|---|---|
| File | `frontend/src/pages/supervisor/FeedbackModal.css` |
| Error commit | `1d3e38f` |
| Fix commit | `c6561ce` |
| Lines | 12, 15 |
| Symptom | `.modal-box` rendered with no background, no max-width — properties after the missing semicolons were silently dropped |
| Cause | `background: var(--color-surface)` and `width: 100%` were both missing trailing semicolons, causing the CSS parser to merge subsequent declarations into invalid values |
| Fix | Added `;` after both values |

---

### Error 3 — Invalid CSS property in `.modal-header h3`

| Field | Detail |
|---|---|
| File | `frontend/src/pages/supervisor/FeedbackModal.css` |
| Error commit | `1d3e38f` |
| Fix commit | `c6561ce` |
| Line | 31 |
| Symptom | Modal header `h3` text rendered in browser default colour instead of the design system colour |
| Cause | `var(--color-text)` appeared as a bare value with no property name: `font-size: 1rem; font-weight: 700;  var(--color-text);` — the `color:` keyword was missing |
| Fix | Changed to `color: var(--color-text);` |

---

### Error 4 — Wrong CSS variable syntax in `.modal-hint`

| Field | Detail |
|---|---|
| File | `frontend/src/pages/supervisor/FeedbackModal.css` |
| Error commit | `1d3e38f` |
| Fix commit | `c6561ce` |
| Line | 58 |
| Symptom | `.modal-hint` character counter text rendered in black instead of muted grey |
| Cause | `color: (var-text-muted)` — used parentheses-around-hyphenated-name syntax instead of `var(--color-text-muted)` |
| Fix | Changed to `color: var(--color-text-muted);` |

---

## PR #60 — ILES-39: Homepage (feature/ILES-39-homepage)

**Reviewer:** Matthew Mumbere  
**Date:** 2026-05-14

### Error 5 — File wrapped in markdown code fence

| Field | Detail |
|---|---|
| File | `frontend/src/pages/HomePage.js` |
| Error commit | `0bb60ea` |
| Fix commit | `b42d399` |
| Symptom | Full application crashed on load with `SyntaxError: Unexpected token` — the entire app failed to compile |
| Cause | The file started with ` ```jsx ` and ended with ` ``` ` — the developer copied code from a markdown/AI response and pasted it including the code fence delimiters directly into the `.js` file |
| Fix | Removed the opening ` ```jsx ` on line 1 and the closing ` ``` ` on line 342 |

**To reproduce:** `git checkout 0bb60ea` and run `npm start` — the build will fail immediately.

---

### Error 6 — Empty text content across multiple sections

| Field | Detail |
|---|---|
| File | `frontend/src/pages/HomePage.js` |
| Error commit | `0bb60ea` |
| Fix commit | `b42d399` |
| Symptom | Hero badge, hero title, hero subtitle, How It Works subtitle, Platform Features subtitle, CTA title, CTA description, nav "Go to Dashboard" link, nav "Login" link, footer brand text, footer links all rendered blank |
| Cause | JSX elements contained only whitespace — the text content was never written, likely due to incomplete copy-paste from a design spec or AI-generated scaffold |
| Fix | Filled all empty elements with appropriate text content matching the ILES product description |

Affected lines: 151, 159, 176, 180–184, 188, 229–231, 260–262, 287–293, 299–301, 319–321, 325–329, 333–336

---

## PR #58 — ILES-51: Onboarding Page Redesign (feat/ILES-51-onboarding-page-redesign)

**Reviewer:** Matthew Mumbere  
**Date:** 2026-05-14

### Error 7 — Import of non-existent `PageShell` component

| Field | Detail |
|---|---|
| File | `frontend/src/pages/student/PlacementOnBoardingPage.js` |
| Error commit | `9ba1973` |
| Fix commit | `a27f126` |
| Symptom | Navigating to the onboarding route threw `Cannot find module '../components/PageShell/PageShell'` — the page could not render at all |
| Cause | The component imported `PageShell` from `../components/PageShell/PageShell` which does not exist in this codebase. The ILES project uses a `Layout` component via `react-router-dom` `<Outlet>` for page shells — `PageShell` appears to have been copied from a different project or design reference |
| Fix | Removed the `PageShell` import and replaced `<PageShell role="student">` wrapper with a plain `<div className="page">`, which is the correct pattern used by all other student pages |

**To reproduce:** `git checkout 9ba1973`, navigate to `/student/onboarding` — app throws module-not-found error.

---

## Vercel Build Failures (discovered 2026-05-14)

The following errors were not caught locally but surfaced in Vercel preview deployments triggered by the PRs.

### Error 8 — `EvaluationPage` has no export default (Vercel build crash)

| Field | Detail |
|---|---|
| File | `frontend/src/pages/EvaluationPage.js` |
| PR | #60 ILES-39 (feature/ILES-39-homepage) |
| Vercel deployment | `dpl_CtLzKC6QhMiNR4eZD9TRdH5HxEAf` |
| Error commit | `b42d399` |
| Fix commit | `2421f2f` |
| Vercel error | `Attempted import error: './pages/EvaluationPage' does not contain a default export (imported as 'EvaluationPage').` |
| Symptom | Vercel build failed — the entire app could not compile on CI even though it may have passed locally if the import was not exercised |
| Cause | `EvaluationPage.js` on this branch was an incomplete work-in-progress fragment: it contained only a local `Crit` helper component with no imports, no `EvaluationPage` function, and no `export default`. `App.js` on this branch imports and routes to it, so the build failed at compile time |
| Fix | Replaced file content with a minimal valid stub: `function EvaluationPage()` + `export default EvaluationPage` |

**To reproduce:** `git checkout b42d399` and run `npm run build` — compile error on import.

---

### Error 9 — Wrong import path depth for `Primitives` and `Icons` (Vercel build crash)

| Field | Detail |
|---|---|
| File | `frontend/src/pages/student/PlacementOnBoardingPage.js` |
| PR | #58 ILES-51 (feat/ILES-51-onboarding-page-redesign) |
| Vercel deployment | `dpl_955w5EbZF4DYkmiJ7yJLuQZVbKbc` |
| Error commit | `a27f126` |
| Fix commit | _(pushed with path fix — see branch)_ |
| Vercel error | `Module not found: Error: Can't resolve '../components/common/Primitives'` |
| Symptom | Vercel build failed — page could not compile at all |
| Cause | Import paths used `../components/common/Primitives` and `../components/common/Icons` but the file lives at `pages/student/PlacementOnBoardingPage.js` — one directory deeper than `pages/`. The correct relative path requires two levels up: `../../components/...`. This error was masked locally if the dev was running from a different working directory or an IDE with path resolution |
| Fix | Changed both import paths from `../components/...` to `../../components/...` |

**To reproduce:** `git checkout a27f126` and run `npm run build` — module not found error on Primitives.

---

## PRs with No Errors

| PR | Ticket | Branch | Status |
|---|---|---|---|
| #55 | ILES-49 | feat/ILES-49-student-progress-page | No errors found |
| #56 | ILES-50 | feat/ILES-50-student-profile-page | No errors found |
| #63 | ILES-54 | feat/ILES-54-student-documents-page | No errors found |

---

## Summary Table

| # | PR | File | Error Type | Severity | Fixed |
|---|---|---|---|---|---|
| 1 | #59 ILES-34 | FeedbackModal.js | Missing `export default` | Critical — runtime crash | ✅ `c6561ce` |
| 2 | #59 ILES-34 | FeedbackModal.css | Missing semicolons (×2) | High — broken layout | ✅ `c6561ce` |
| 3 | #59 ILES-34 | FeedbackModal.css | Missing `color:` property name | Medium — wrong colour | ✅ `c6561ce` |
| 4 | #59 ILES-34 | FeedbackModal.css | `(var-text-muted)` invalid syntax | Medium — wrong colour | ✅ `c6561ce` |
| 5 | #60 ILES-39 | HomePage.js | Markdown code fence in JS file | Critical — build crash | ✅ `b42d399` |
| 6 | #60 ILES-39 | HomePage.js | Empty text content (×11 elements) | High — blank UI | ✅ `b42d399` |
| 7 | #58 ILES-51 | PlacementOnBoardingPage.js | Non-existent `PageShell` import | Critical — runtime crash | ✅ `a27f126` |
| 8 | #60 ILES-39 | EvaluationPage.js | No `export default` — Vercel build crash | Critical — CI failure | ✅ `2421f2f` |
| 9 | #58 ILES-51 | PlacementOnBoardingPage.js | Wrong import path depth (`../` vs `../../`) | Critical — CI failure | ✅ _(branch pushed)_ |

---

## Runtime Errors Discovered in Production (2026-06-06)

### Error 10 — GET /api/evaluation/ returns 500 for workplace supervisor

| Field | Detail |
|---|---|
| Endpoint | `GET https://iles-backend.projecthive.cfd/api/evaluation/` |
| User | Workplace supervisor (`dr.santos`, role=workplace_supervisor) |
| Symptom | Workplace supervisor dashboard fails to load entirely — the page renders but the data panels stay blank/loading because the evaluation API call throws 500 |
| Reproduced | HAR log captured 2026-06-06 from live deployment (`develop` branch, commit `a715a29`) |

**Root cause: Three independent bugs caused or could cause 500 errors:**

#### Bug 10a — `AttributeError` on null `placement.student` in EvaluationSerializer

| Field | Detail |
|---|---|
| File | `backend/evaluation/serializers.py` |
| Line | `student_username = serializers.CharField(source="placement.student.username", read_only=True)` |
| Fix commit | `9dae806` |
| Cause | `InternshipPlacement.student` allows `null=True`. When a placement exists without an assigned student, `placement.student` is `None`, and accessing `.username` on `None` raises `AttributeError` → DRF returns 500 |
| Fix | Replaced `CharField(source=...)` with `SerializerMethodField` that checks `obj.placement` and `obj.placement.student` for None before accessing `.username`. Returns `None` for null students and logs a warning for unexpected failures |

#### Bug 10b — `TypeError` in Evaluation.save() with null score

| Field | Detail |
|---|---|
| File | `backend/evaluation/models.py` |
| Line | `self.weighted_score = self.score * self.criteria.weight` |
| Fix commit | `ce564f7` |
| Cause | `score` field has `null=True` in the model. The `save()` method unconditionally multiplies `self.score * self.criteria.weight`, but if score is `None`, Python raises `TypeError: unsupported operand type(s) for *: 'NoneType' and 'float'` — this crashes any operation that triggers save (create, update, or even admin actions) |
| Fix | Added None guards: if score or criteria is None, sets `weighted_score = None` instead of attempting multiplication |

#### Bug 10c — `AttributeError` on null `Logbook.student` in LogReviewSerializer (defensive)

| Field | Detail |
|---|---|
| File | `backend/reviews/serializers.py` |
| Lines | `student_username = serializers.CharField(source="Logbook.student.username", read_only=True)` |
| Fix commit | `995383e` |
| Cause | Same pattern as Bug 10a — if a LogReview's Logbook somehow has a null student (shouldn't happen with CASCADE, but defensive), accessing `.username` on None raises `AttributeError` |
| Fix | Replaced `CharField(source=...)` with `SerializerMethodField` returning `None` when `Logbook` or `student` is missing. Also added `allow_null=True` to `logbook_week` IntegerField |

#### Bug 10d — Duplicate `registerUser` in api.js (Vercel build failure)

| Field | Detail |
|---|---|
| File | `frontend/src/services/api.js` |
| Fix commit | `a5595d4` |
| Cause | Two PRs (#72 ILES-67 and #73 ILES-66) both added `registerUser()` to api.js. The merge into develop kept both, producing `SyntaxError: Identifier 'registerUser' has already been declared` at build time |
| Fix | Removed the generic pass-through version at line 53 (from ILES-67), kept the explicit field-mapping version at line 167 (from ILES-66) |

**Trigger chain in production:**
1. Workplace supervisor logs in → navigates to `/supervisor/dashboard`
2. Frontend fires `GET /api/evaluation/` to populate evaluation stats
3. Evaluation queryset includes records where `placement.student is NULL`
4. Serializer hits `placement.student.username` → `None.username` → `AttributeError`
5. DRF catches exception → returns 500 HTML response
6. Frontend receives 500 (not JSON) → dashboard data panels fail to render

**Prevention:**
- All `source` chains that traverse nullable FK fields should use `SerializerMethodField` with explicit null checks
- Add database constraints or migration to ensure `placement.student` is NOT NULL if business logic requires it
- Consider `select_related` coverage audit — all FK traversal paths in serializers should be prefetched
