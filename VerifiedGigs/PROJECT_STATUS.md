# VerifiedGigs — Project Status

_Last audited: 2026-09-22_

## 1. How this document came to be

This project was handed over as a zip for completion into a working
Student + Client + Admin marketplace. On inspection, **the large majority
of the three portals was already implemented** by prior work — real API
integration throughout, no mock data, consistent auth. This pass was a
full audit (every route, every controller, every page) plus targeted
cleanup, not a rebuild. See "What this pass actually changed" (§10) for
the concrete diff.

**Important environment note:** this audit was done in a sandbox with no
network access and no MySQL server, matching the project's `.env`
(`DB_HOST=localhost`, a local MySQL instance). That means:
- Every backend and frontend file was read and hand-verified for logic
  and route/field consistency, and all backend files pass
  `node --check` (syntax-valid).
- The frontend could **not** be built with `vite build` here — `vite`
  and `oxlint`'s native bindings for this sandbox's platform aren't
  present and there's no network to fetch them. This is an install
  artifact of the sandbox, not a code defect (rerun `npm install` in
  `client/client` on your machine, or just `npm run dev` — dev pulls in
  the platform binary that matches your OS and normally isn't an issue).
- **No live click-through testing against a real database was possible.**
  You'll need to run `npm run dev` (client) and `npm run dev` / `node
  server.js` (server) against your MySQL instance and walk the flows
  yourself. Section 13 below lists exactly what to click through.

## 2. Architecture

- **Backend**: Node.js + Express 5, MySQL via `mysql2/promise` (raw
  parameterized SQL, no ORM), JWT auth (`jsonwebtoken`), `bcryptjs` for
  password hashing. Layered as `routes/ → controllers/ → models/`, one
  file per resource. Config in `server/config/db.js` reads `server/.env`.
- **Frontend**: React 19 + Vite + `react-router-dom` v7. No component
  library, no axios — plain `fetch` wrapped in small `request()`/`api()`
  helpers local to each portal file. Auth state lives in
  `AuthContext`/`localStorage` (token + user).
- **Roles**: `STUDENT`, `CLIENT`, `ADMIN`, enforced both by
  `ProtectedRoute` (frontend) and `authenticateToken` +
  `authorizeRoles(...)` middleware (backend) on every non-public route.

## 3. Database

**No schema file existed in `database/`** (the folder was empty — no
`.sql`, no migration files). The schema below was reverse-engineered by
reading every SQL query across all 19 model files; it is not an
authoritative DDL export. Tables referenced by the code:

`users`, `students`, `clients`, `gigs`, `gig_categories`, `gig_skills`,
`skills`, `student_skills`, `applications`, `projects`,
`project_milestone`, `payment`, `favorite_gig`, `verification_documents`,
`reviews`, `reports`, `messages`, `notifications`, `portfolios`.

Key relationships observed: `users.user_id` is the root identity row;
`students`/`clients` each hold a `user_id` FK plus role-specific
profile fields; `gigs.client_id → clients`, `gigs.category_id →
gig_categories`; `applications` links `gig_id` + `student_id` with a
status enum (`PENDING`/`SHORTLISTED`/`ACCEPTED`/`REJECTED`/`WITHDRAWN`);
`projects` is created from an `ACCEPTED` application and drives
`project_milestone` and `payment`. Because there is no schema file to
verify against, **you should export your actual live schema
(`mysqldump --no-data verifiedgigs`) and keep it in `database/schema.sql`**
— I did not fabricate one, per the "don't invent schema" instruction.

## 4. Student Portal — status: essentially complete

All required pages exist and call real endpoints, no mock data:

| Page | Route | Backend |
|---|---|---|
| Dashboard | `/student/dashboard` | `/api/student/dashboard/*` |
| Browse Gigs | `/student/gigs` | `GET /api/gigs` |
| Gig Details + Apply | `/student/gigs/:gigId` | `GET /api/gigs/:id`, `POST /api/student/applications`, favorite toggle |
| My Applications (+ withdraw) | `/student/applications` | `GET/DELETE /api/student/applications` |
| Projects list / detail | `/student/projects[/:id]` | `GET /api/student/projects[/:id]`, milestones, payments |
| Portfolio (CRUD) | `/student/portfolio` | `/api/student/portfolio` |
| Favorites | `/student/favorites` | `/api/favorites` |
| Skills (add/remove) | inside Profile | `/api/student/skills` |
| Profile + verification upload | `/student/profile` | `/api/student/profile`, `/api/verification-documents` |
| Notifications / Messages | `/student/notifications`, `/student/messages` | `/api/notifications`, `/api/messages` |
| Payments (read-only) | `/student/payments` | `/api/projects/:id/payments` |
| Reports / Reviews | `/student/reports`, `/student/reviews` | `/api/reports`, `/api/projects/:id/reviews` |

Workflow Browse → View → Apply → Track → Accepted → Project →
Milestones is fully wired end to end.

## 5. Client Portal — status: essentially complete

| Page | Route | Backend |
|---|---|---|
| Dashboard | `/client/dashboard` | `/api/client/dashboard/stats` |
| My Gigs | `/client/gigs` | `GET /api/client/gigs` (client-owned, via `managementController`) |
| Post / Edit Gig | `/client/gigs/new`, `/client/gigs/:id/edit` | `POST/PUT /api/client/gigs` |
| Gig detail / delete | `/client/gigs/:id` | `GET/DELETE /api/client/gigs/:id` |
| Applications (shortlist/accept/reject) | `/client/applications[/:id]` | `GET /api/client/applications`, `PUT .../status` |
| Create project from accepted application | inside application detail | `POST /api/client/projects` |
| Projects + milestones + payments | `/client/projects[/:id]` | `/api/client/projects`, `/api/projects/:id/milestones`, `/api/projects/:id/payments` |
| Messages / Notifications | `/client/messages`, `/client/notifications` | `/api/messages`, `/api/notifications` |
| Profile | `/client/profile` | `/api/client/profile` |
| Reports / Reviews | `/client/reports`, `/client/reviews` | shared with student side |

Workflow Post Gig → Applications → Select Applicant → Project →
Milestones → Complete is fully wired.

## 6. Admin Portal — status: essentially complete

| Page | Route | Backend |
|---|---|---|
| Dashboard (live counts) | `/admin/dashboard` | `/api/admin/dashboard/stats` |
| Users (search, status change) | `/admin/users` | `/api/admin/users[/:id]`, `/api/admin/users/:id/status` |
| Gigs (read-only listing) | `/admin/gigs` | `GET /api/gigs` — see limitation below |
| Verification queue (approve/reject) | `/admin/verifications` | `/api/verification-documents/*` |
| Reports (status change) | `/admin/reports` | `/api/reports/*` |
| Categories & Skills (create) | `/admin/catalog` | `/api/categories`, `/api/skills` |
| Projects monitoring | `/admin/projects` | `/api/admin/projects` |
| Payments monitoring | `/admin/payments` | `/api/admin/payments` |
| Admin profile | `/admin/profile` | `/api/admin/profile` |

**Known limitation, documented rather than faked**: `AdminGigs`
(`/admin/gigs`) can only list gigs through the public `GET /api/gigs`
endpoint, which only returns `OPEN` gigs. There is no admin-scoped
"all gigs regardless of status" or gig-delete-by-admin endpoint in the
existing backend. The UI says this explicitly instead of pretending
otherwise. Adding one would need a new controller function + route
(small, backend-only change, consistent with the existing schema) —
flagged here rather than built, per the instruction to stop and explain
before adding scope.

## 7. Frontend architecture note (important)

The frontend uses a **file-per-portal, multi-export pattern**: most of
the real page implementations for the Student and Client portals live
as named exports inside `StudentPortal.jsx` / `ClientPortal.jsx` (not in
the per-page files whose names you'd expect, like `StudentGigs.jsx`).
`App.jsx`'s imports are the source of truth for what's actually routed —
always check there first. Several older, unused single-page placeholder
files with matching names existed alongside the real ones and have been
archived (see §10).

## 8. API routes (full list)

`/api/auth/{register,login}` · `/api/gigs`, `/api/gigs/:id` ·
`/api/client/gigs[/:id]` · `/api/student/applications[/:id]` ·
`/api/client/applications[/:id][/status]` · `/api/client/projects[/:id][/status]` ·
`/api/student/projects[/:id]` · `/api/projects/:id/milestones` ·
`/api/milestones/:id[/complete]` · `/api/projects/:id/payments` ·
`/api/payments/:id[/process|/fail|/refund]` · `/api/student/profile` ·
`/api/client/profile` · `/api/student/portfolio[/:id]` ·
`/api/student/skills[/:id]` · `/api/skills` · `/api/favorites[/:id][/check]` ·
`/api/verification-documents[/my|/pending|/:id][/approve|/reject]` ·
`/api/categories[/:id]` · `/api/reports[/my][/:id][/status]` ·
`/api/projects/:id/reviews` · `/api/users/:id/reviews` ·
`/api/messages` · `/api/projects/:id/messages` · `/api/conversations/:id` ·
`/api/messages/:id/read` · `/api/notifications[/unread-count][/:id/read][/read-all]` ·
`/api/student/dashboard/*` · `/api/client/dashboard/stats` ·
`/api/admin/{dashboard/stats,users[/:id][/status],projects,payments,profile}`.

## 9. Verification performed this pass

- Read all 19 route files, 22 controller files, 19 model files in full.
- `node --check` on every backend `.js` file — all pass (no syntax errors).
- Cross-checked every `req.user.*` field reference across all
  controllers against the JWT payload shape signed in
  `authController.js` (`{ user_id, role }`) — **consistent everywhere**,
  no drift.
- Cross-checked every frontend `fetch`/`request()` path string against
  the actual mounted route in `server.js` + the relevant `routes/*.js`
  — no mismatches found.
- Confirmed no hardcoded `student_id`/`client_id`/`user_id` anywhere in
  controllers; IDs are always derived from `req.user` via the
  `getStudentIdByUserId`/`getClientIdByUserId` model helpers.
- Attempted `npm run build` and `npx oxlint` — both fail in this sandbox
  only due to missing platform-native binaries with no network to fetch
  them (see §1). Not a code defect; please build locally.

## 10. What this pass actually changed

1. **Archived 12 dead/unreferenced frontend files** into
   `client/client/src/_archive_unused/` — they were never imported by
   `App.jsx` (confirmed by grep across the whole `src/` tree) and were
   superseded by working implementations elsewhere:
   `StudentGigs.jsx`, `StudentGigDetail.jsx`, `StudentApplications.jsx`,
   `StudentProjects.jsx`, `StudentProjectDetail.jsx`,
   `StudentPortfolio.jsx`, `StudentFavorites.jsx`, `StudentSkills.jsx`
   (all superseded by the working named exports in `StudentPortal.jsx`),
   `AdminDashboard.jsx` (superseded by `AdminDashboardLive` in
   `AdminManagement.jsx`), and `Navbar.jsx`/`Sidebar.jsx`/`Layout.jsx`
   (an unused alternate nav shell — every portal builds its own header
   inline instead).
2. **Removed 4 dead exports** (`AdminDashboardPortal`, `AdminUsers`,
   `AdminProfile`, and their shared `Missing` helper) from
   `AdminPortal.jsx` — these were "not implemented" placeholder stubs
   for pages that are actually served by the real, working
   `AdminDashboardLive`/`AdminUsersLive`/`AdminProfileLive` components
   in `AdminManagement.jsx`, which is what `App.jsx` actually routes to.
   Nothing user-visible changes; this only removes confusing dead code.
3. Wrote this file and `ADDED_FUNCTIONALITY.md`.

Nothing in routing, auth, controllers, models, or any working page was
rewritten — the existing implementation was sound.

## 11. Known limitations (not bugs — backend gaps, left undone by design)

- Admin "Gigs" view can only see `OPEN` gigs (no admin-scoped
  all-status listing endpoint exists).
- Admin cannot delete/close a gig directly (no such endpoint exists).
- `ClientApplicationDetail`'s "create project" form doesn't pre-fill
  from the application's proposed price/days — a small UX nicety, not
  a functional gap (the backend supports it; the form just starts blank).
- No schema file existed to begin with; §3 above is a reconstruction,
  not a verified export.

## 12. Testing performed

Static only, per §1: syntax validation of all backend files, manual
route/controller/model cross-referencing, JWT-field consistency check,
manual read-through of every frontend page for prop/state correctness.
**No live requests were made against a database** — this sandbox has no
network and no MySQL server. Please run these flows locally before
considering the app production-ready:

- **Student**: register → login → dashboard → browse gigs → view gig →
  apply → my applications → (as client) accept → student projects →
  project detail → milestones.
- **Client**: register → login → post gig → my gigs → receive
  application → view application → accept → create project → add
  milestone → mark milestone complete.
- **Admin**: login (seed an ADMIN row manually — there's no admin
  signup path, by design) → dashboard → users → verifications →
  approve/reject a document → reports.
