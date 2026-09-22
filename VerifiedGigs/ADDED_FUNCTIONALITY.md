# Added Functionality

This pass (2026-09-22, second audit) went beyond the previous
audit-and-cleanup pass and **added real functionality**, on explicit
request. Everything below is a genuine addition or fix — verified with
`node --check` on every touched backend file and cross-referenced
against the actual routed frontend components in `App.jsx`.

## 1. Admin gig management (closes a documented gap from the prior pass)

The Admin "Gigs" page could previously only see `OPEN` gigs (via the
public `/api/gigs` endpoint) and had no way to delete a gig. Added:

- `getAllGigsAdmin()` / `deleteGigAdmin()` in `server/models/gigModel.js`
- `adminGigs` / `adminDeleteGig` controllers in
  `server/controllers/managementController.js`
- Routes: `GET /api/admin/gigs`, `DELETE /api/admin/gigs/:gigId`
  (admin-only, in `server/routes/managementRoutes.js`)
- Frontend `AdminGigs` (`client/client/src/components/AdminPortal.jsx`)
  now calls `/admin/gigs`, shows gigs of **every** status with a status
  filter, and has a working Delete button. The old "not available"
  notice was removed since the gap it described is now closed.

## 2. Fixed a real, build-breaking dependency bug

`StudentDashboard.jsx` does `import axios from "axios"`, but `axios`
was never listed in `client/client/package.json` or
`package-lock.json` — this would fail on a clean `npm install` and
break the dashboard at runtime even if a stray copy of axios happened
to be present locally. Added `axios` to `dependencies`. (Run
`npm install` in `client/client` once to refresh the lockfile.)

## 3. Wired up the notification system (was previously inert)

The notifications API, database table, and both portals' Notifications
pages all existed and worked — but **nothing in the app ever created a
notification** except a manual, admin-only `POST /api/notifications`
endpoint nobody would call in normal use. In practice the Notifications
page was always empty. Added automatic `createNotification(...)` calls
at the natural trigger points, all wrapped in try/catch so a
notification failure never breaks the primary action:

| Event | Who is notified |
|---|---|
| Student applies to a gig | The client who owns the gig |
| Client changes an application's status (shortlisted/accepted/rejected) | The applying student |
| Client creates a project from an accepted application | The student |
| Client changes a project's status | The student |
| Client adds a milestone | The student |
| Client marks a milestone complete | The student |
| Client processes a payment | The student |
| Client refunds a payment | The student |
| Either party sends a project/direct message | The message receiver |
| Admin approves a verification document | The student |
| Admin rejects a verification document | The student, with the rejection reason |
| Admin changes a report's status | The original reporter |

Touched files: `server/controllers/applicationController.js`,
`projectController.js`, `milestoneController.js`,
`paymentController.js`, `messageController.js`,
`verificationDocumentController.js`, `reportController.js`, plus small
read-only helper additions to `server/models/applicationModel.js`
(`getGigOwnerByGigId`, `getApplicantByApplicationId`) and
`server/models/userModel.js` (`getUserIdByStudentId`,
`getUserIdByClientId`). No existing route, response shape, or
authorization check was changed.

## 4. Removed dead, buggy code

`ClientGigs` (a second, unused implementation of the "My gigs" page
inside `ClientPortal.jsx`) was never imported by `App.jsx` — the routed
`/client/gigs` page is `ClientOwnedGigs.jsx`, a separate, correct
implementation that already uses the right `/client/gigs` endpoint.
The dead `ClientGigs` export additionally called the wrong endpoint
(`/gigs`, public open-only) and would have under-reported a client's
own gigs if it had ever been wired up. Removed it entirely rather than
leaving confusing, misleading dead code alongside a correct
implementation.

## What was intentionally left alone

- No database schema was invented (see `PROJECT_STATUS.md` §3).
- No new pages, routes, or workflows beyond the two items above were
  added — this was a gap-filling pass, not a redesign.
- Skill/category edit and delete endpoints are still absent (documented
  limitation, not fixed this pass — say so explicitly if you'd like
  those added too).

