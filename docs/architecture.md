# Architecture

Autopilot is a Vite React application with one Vercel catalogue endpoint. Curated teaching content and photographs ship with the frontend; learner accounts and progress use Supabase.

| Area | Files | Responsibility |
| --- | --- | --- |
| Navigation and screens | `src/main.tsx`, `src/AcademyUI.tsx`, `src/UI.tsx` | Dashboard, courses, library, practice and accessible modal/tab interactions |
| Curriculum | `src/content.ts`, `src/academy.ts`, `src/academy-data.json` | Foundation content, manufacturer guides and stable quiz IDs |
| Teaching activities | `src/LessonActivities.tsx`, `src/Diagrams.tsx` | Matching, worked examples, diagrams and interactive fundamentals |
| Photography | `src/CarPhoto.tsx`, `src/photo-manifest.json` | Verified identities, local URLs, full-frame fitting, captions and enlargement |
| Learning logic | `src/learning.mjs` | Review intervals, XP, streaks, backups and BC calendar dates |
| Persistence | `src/useProgress.ts`, `src/supabase.ts` | Device state, account sessions, delayed cloud writes and retry |
| Vehicle catalogue | `api/catalog.js`, `vite.config.js` | Fetch/normalize official records; expose the same handler during development |
| Fallback data | `public/catalog.json`, `scripts/refresh-catalog.py` | Included government-data snapshot and its refresh script |
| Database | `supabase/schema.sql` | One private progress row per authenticated user, with ownership RLS |

## Content and photo flow

`academy.ts` builds manufacturer lessons from the JSON course data. A model guide points to one or more photo IDs; the manifest resolves those IDs to local WebP files and source credits. `CarPhoto` supplies the shared image frame. `PhotoGallery` adds model labels, navigation and a separate photo dialog. Quiz mode withholds identity captions and uses a neutral accessible description.

Images load lazily except where a priority image is appropriate. The source photo's full frame is fitted with `contain`; the frame has a bounded viewport-aware height. The image is positioned inside that frame to avoid intrinsic grid sizing making it taller than its container.

## Learning and sync flow

Reading and quiz UI call the pure learning functions, then persist progress on the device. Signed-in sessions sync the whole progress object to a user-owned Supabase row after a short debounce. Errors expose a retry. When devices write concurrently, the latest stored whole record wins; there is no per-field merge.

A reading draft is device-local. An existing cloud record is restored on sign-in; a missing cloud record can be initialized from local progress. Stable question IDs allow spaced-review history to survive curriculum expansion.

## Catalogue flow

The browser loads the bundled snapshot and requests `/api/catalog`. A live failure retains the snapshot with an explanatory state. Vercel caches official responses; a historical request can extend coverage back to 1995. The library distinguishes exact government records from curated family-level lessons and visual references.

## Boundaries

The application does not generate an exhaustive catalogue, automatically rewrite lessons, store service-role credentials, or promise real-world fuel use. Current specifications and prices require the exact year, version and Canadian source. These boundaries are reflected in the UI and content notes.
