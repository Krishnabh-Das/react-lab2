# Prompt log — React Lab 2

Part of what you submit. It shows *how* you used AI: did you hand it the contract and the
rules, or type "make it work"? Fill it in **as you go**, not from memory at the end.

- Name and roll number: Krishnabh Das / MT2026045
- AI tool and plan (e.g. ChatGPT free, Gemini, Claude free, Copilot): Cursor (Composer)

**Log every prompt you send, in order — including the ones that didn't help.** Paste each
prompt in full. One exception: if you pasted CONTRACT.md's prompt 1 unchanged, write
"CONTRACT.md prompt 1, unchanged". Summarise each reply; don't paste whole files.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:** one big `CoursesPage.jsx`. List + form + fetch all together. Had
`useCallback`, `useMemo`, `useRef`. loading and error as two booleans. After add it called
`fetchCourses()` again. `key={index}`. Extra courseCount line. Other three files still TODO.

**Did it run?** (`npm run dev`: list loads? add works? 409 shown? fieldErrors shown?
`npm test`: ~18 passed / ~44 failed — browser looked ok, but useCourses / CoursesView /
AddCourseForm tests fail)

**What I did with it:** put it in `src/courses/CoursesPage.jsx`, clicked around once, started
AUDIT before asking it to change anything.

---

## Prompt 2 —

**Why I sent it:** i saw two requests when i add a course and didnt get why

**Sent:**

```text
hey wait in network after i click Add course i see POST and then another GET /api/courses.
can u explain what fetchCourses is doing here and why its running again after add? like is
that needed or what
```

**What came back:** explained that handleSubmit POSTs then calls `fetchCourses()` again to
refresh the whole list. Said it works but the contract wants you to use the 201 body and
insert locally instead of a second GET. Also said useCallback around fetchCourses is just
wrapping, not required.

**What I kept, and what I rejected:** kept the explanation. didnt change code yet — wanted
to understand first then decide in the audit.

---

## Prompt 3 —

**Why I sent it:** after understanding the reload — now ask for that change only

**Sent:**

```text
ok got it. so then dont call fetchCourses after add. just take the course from the 201
response and put it in the courses state sorted by code. also that courseCount thing at the
top, we dont need it right? remove that
```

**What came back:** changed handleSubmit to insert + sort from the created course. removed
courseCount. still one fat file, still useMemo/useCallback/useRef, still loading+error
booleans.

**What I kept, and what I rejected:** kept the no-reload insert. left the rest for after
audit — tests still want the §4 split.

---

## Prompt 4 —

**Why I sent it:** trying to understand status vs booleans and why there are empty files

**Sent:**

```text
ok another doubt. in the code theres loading and error as separate useStates. but the lab /
tests keep saying one status field like loading | ready | error. whats the difference, why
do they care? and also we have useCourses.js CoursesView.jsx AddCourseForm.jsx still TODO —
like whats supposed to go in each, explain briefly before i change anything
```

**What came back:** one `status` means the view can switch on one value (no impossible
loading+error both true). §4 wants: hook owns fetch/list/addCourse, View only renders,
Form owns inputs and calls `onAdd`, Page just wires them. useMemo/useCallback/useRef are on
the not-yet list so cut them.

**What I kept, and what I rejected:** kept the mental model. still didnt paste a giant rebuild
yet — this was understand-only. (had already written AUDIT 0–4 from this)

---

## Prompt 5 —

**Why I sent it:** now do the split based on what i understood + audit decisions

**Sent:**

```text
ok now change it. split like u said — useCourses with status/error/addCourse and ignore
cleanup, CoursesView only props, AddCourseForm with onAdd, CoursesPage just wires them.
cut useMemo useCallback useRef. form state only in the form. key should be course.id
```

**What came back:** four files in §4 shape. most courses tests went green. page still loaded
and add worked without the extra GET.

**What I kept, and what I rejected:** kept basically all of it. one prompt earlier where i
half-asked “just move fetch somehow” (before this) was messy and i threw that version away —
this clean split is what stayed.

---

## Prompt 6 —

**Why I sent it:** field errors worked in the browser but i wasnt sure about a11y / placement

**Sent:**

```text
one more thing — when 400 comes with fieldErrors, explain what aria-invalid and
aria-describedby are supposed to do for the Code input. then can u put the reason text
right under that input (not inside the label) and wire those attrs, and form message should
be role=alert
```

**What came back:** short explain (screen reader reads invalid + the reason via describedby),
then updated AddCourseForm with error `<p id=…>` under each field + aria on inputs + alert
on the form error. fieldErrors tests passed after that.

**What I kept, and what I rejected:** kept all. last real code tweak.

---

## Afterwards

- How many prompts did the whole feature take?
  6 (generate + understand reload + change reload + understand status/split + do the split
  + understand/fix a11y). plus one dud half-move i discarded before prompt 5.

- Which of your prompts would you write differently now, and how?
  The dud “just move fetch somehow keep rest same” — shouldve asked to explain the split
  first (like prompt 4) then change once. Jumping half-way made a mess.

- One thing the rules in prompt 1 prevented (or failed to prevent):
  Rules said no useMemo/useCallback/useRef but prompt 1 still gave me all of them. Asking
  “explain why / what earns it” then cutting was what actually fixed it.
