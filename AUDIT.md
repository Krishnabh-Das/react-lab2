# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

---

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
| `src/courses/CoursesPage.jsx` | one `CoursesPage` — list + form + fetch all together; `useState` × many, `useEffect`, `useCallback` ×2, `useMemo`, `useRef` | ~149 |
| `useCourses.js` / `CoursesView.jsx` / `AddCourseForm.jsx` | still the TODO stubs — AI never split | — |

- Does it run? List loads / valid add appears in order / duplicate code shows the 409
  message / bad input shows fieldErrors under the inputs:
  Yes in the browser for list + add + 409 + fieldErrors. Add reloads the whole list (extra GET).
- Requests in the Network tab — on page load: **1 GET** ; per add: **1 POST + 1 GET** (bad)
- `npm test` before any fix: **~18 passed / ~44 failed**. Which test files fail?
  `useCourses`, `CoursesView`, `AddCourseForm`, `fieldErrors` (stubs). `CoursesPage` partly
  green because the one-file version can still look ok end-to-end. Search tests already green
  from pre-lab.

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders | missing — render mixed into `CoursesPage.jsx:84–108` | own `CoursesView.jsx` |
| Fetch + logic in a separate hook or module | missing — `fetchCourses` at `CoursesPage.jsx:21` | `useCourses.js` |
| `useState` for the course list, at the right level | `CoursesPage.jsx:6` | keep, but in the hook |
| `useState` for the form's inputs, at the right level | `CoursesPage.jsx:10–15` — same component as the list | move into `AddCourseForm` |
| `useEffect` — for the initial fetch only (with a cleanup) | `CoursesPage.jsx:35–37` — no ignore cleanup | `useCourses` with `[]` + ignore |
| Props down, callbacks up (the form raises "add this course") | missing — form calls `apiFetch` itself in `handleSubmit` | `onAdd` up from form |
| `.map` to render the list, with a stable `key` | `CoursesPage.jsx:92–93` but `key={index}` | `key={course.id}` |
| Loading / error / empty states, from one `status` | missing — `loading` + `error` booleans `:7–8` | one `status` string |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | `CoursesPage.jsx:39` | sorts courses for display | **cut** — sort when inserting / keep list sorted in the hook |
| `useCallback` | `CoursesPage.jsx:21`, `:43` | wrap fetch + submit | **cut** — not taught; plain functions fine |
| `useReducer` | no | — | — |
| `useRef` | `CoursesPage.jsx:19` | focus code input after add | **cut** — not needed for the contract |
| Context (`createContext`, `useContext`) | no | — | — |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` | no — uses `apiFetch` | good | keep `apiFetch` |
| TypeScript (types, interfaces, `.ts`/`.tsx`) | no | — | — |
| Anything else nobody taught you (name it) | `courseCount` state `:9`, `:82` | extra UI not in contract | **cut** |

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does *in this slice*. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
| `CoursesPage` (`:5`) | page shell | **keep** but thin — only wire children |
| `useState(courses)` `:6` | holds the list | **move** → `useCourses` |
| `useState(loading)` `:7` | loading flag | **cut** → replace with `status` |
| `useState(error)` `:8` | load error message | **keep** meaning, as `error` next to `status` in hook |
| `useState(courseCount)` `:9` | catalogue count line | **cut** |
| form field `useState`s `:10–15` | controlled inputs | **move** → `AddCourseForm` |
| `useState(submitting)` `:16` | disable button while POST | **move** → `AddCourseForm` |
| `useState(formError)` `:17` | show add error | **move** → `AddCourseForm` |
| `useState(fieldErrors)` `:18` | per-field reasons | **move** → `AddCourseForm` |
| `useRef(codeInputRef)` `:19` | refocus after add | **cut** |
| `useCallback(fetchCourses)` `:21` | load list | **cut** wrapper; plain effect in hook |
| `useEffect` `:35` | run load on mount | **move** → `useCourses` + ignore cleanup |
| `useMemo(sortedCourses)` `:39` | sort for display | **cut**; sort on insert |
| `useCallback(handleSubmit)` `:43` | POST + reload | **cut**; form calls `onAdd` |

## 4. Decisions — before any fix prompt

- I will **cut**: `useCallback`, `useMemo`, `useRef`, `courseCount`, `loading` boolean,
  `key={index}`, reload-via-`fetchCourses` after add
- I will **move** (from → to): list state + initial fetch → `useCourses`; form state +
  submit UI → `AddCourseForm`; list JSX → `CoursesView`
- I will **add** (missing from the AI's version): `useCourses` / `CoursesView` /
  `AddCourseForm` as in §4; one `status`; ignore cleanup; insert 201 body sorted; aria on
  field errors; `role="alert"` on form error
- Other smells I found (state stored that could be computed, a reload after add, browser
  validation, `key={index}`, swallowed errors…):
  reload after add (`:67`); `key={index}` (`:93`); no ignore flag so StrictMode can glitch;
  form talks to API directly instead of raising `onAdd`

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
| `useRef` (focus) | still same fails until split | still loads/adds in browser |
| `useMemo` (sort) | same | list still ok if we sort on insert |
| `useCallback` (both) | same | still works |

Prompt 1 rules said not to use these — AI used them anyway. Stripping them didn't break the
page; they were never earning their place.

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components | 1 fat `CoursesPage` | `useCourses` + `CoursesView` + `AddCourseForm` + thin `CoursesPage` |
| `useState` calls (and where) | ~12 all in `CoursesPage` | list/`status`/`error` in hook; form states in form |
| `useEffect` calls | 1 (depends on `fetchCourses`) | 1 in `useCourses` with `[]` + ignore |
| "Not yet" items | `useCallback`, `useMemo`, `useRef` | none |
| Requests: on load / per add | 1 GET / 1 POST + 1 GET | 1 GET / 1 POST |
| `npm test` | ~18 / 44 | **62 / 62** |

## 7. Two sentences

- One thing the AI got right that you might not have thought of:
  Seats text already handled Full / 1 seat left / N seats left correctly on the first try.
- One thing you will never accept from an AI without checking again:
  Reloading the whole list after a successful create — always check Network for that extra GET.
