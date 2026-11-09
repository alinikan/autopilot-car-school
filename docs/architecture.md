# Architecture

Autopilot is a Vite React application with a Vercel catalogue endpoint and Supabase account/progress storage. Its source is separated into the application shell, feature modules, shared components, curated content and pure learning logic.

| Layer           | Main files                                                    | Responsibility                                                                       |
| --------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Entry point     | `src/main.tsx`                                                | Mount React and load the stylesheet entry point                                      |
| Application     | `src/app/App.tsx`, `navigation.ts`                            | Root state, navigation and feature composition                                       |
| Layout          | `src/components/layout/AppShell.tsx`                          | Sidebar, header, page transition and footer                                          |
| Feature screens | `src/features/`                                               | Dashboard, courses, practice, library, dictionary, progress, account and preferences |
| Shared UI       | `src/components/ui/`, `media/`, `branding/`, `illustrations/` | Accessible controls, dialogs, full-frame photographs, badges and silhouettes         |
| Curriculum      | `src/content/courses/`, `foundations/`, `reference/`          | Per-manufacturer content, starter lessons, glossary and references                   |
| Photo registry  | `src/content/photos/manifest.json`, `photos.ts`               | Pictured identities, source credits and local asset resolution                       |
| Learning domain | `src/domain/learning.mjs`                                     | Progress validation, review scheduling, XP, streaks and BC dates                     |
| Persistence     | `src/features/progress/useProgress.ts`, `src/lib/supabase.ts` | Device saves, account sessions, debounced cloud writes and retry                     |
| Catalogue       | `api/catalog.js`, `public/catalog.json`                       | Official Canadian records and bundled fallback                                       |
| Database        | `supabase/schema.sql`                                         | User-owned progress records and row-level ownership policies                         |

## Teaching and photographs

`content/courses/catalog.ts` assembles 25 individual manufacturer JSON files in a stable editorial order. `lesson-builder.ts` turns their typed records into manufacturer lessons. `content/index.ts` combines those lessons with the starter course for the application.

A model guide points to one or more stable photo IDs. The photo registry resolves them to local WebP files and source credits. Shared `CarPhoto` and `PhotoGallery` components fit the complete source frame, provide labelled navigation and offer a viewport-bounded enlarged dialog. Quiz mode withholds identity captions.

## Progress and account flow

Feature screens call the pure domain functions, persist locally first, then sync a signed-in user's whole progress object after a short debounce. Errors expose retry. Concurrent devices use the latest stored whole record; there is no per-field merge. Reading drafts remain device-local.

The refactor preserves the existing account flow, client initialization, local-storage keys, progress schema and question IDs. Moving files does not require a database migration.

## Catalogue flow

The library loads the bundled snapshot and requests `/api/catalog`. A live failure retains the snapshot with an explanatory state. Vite's development middleware exposes the same handler that runs as a Vercel function. Exact government records remain distinct from family-level teaching content and visual references.

## Styling

`src/styles/index.css` is the single stylesheet entry point. It imports named sections for tokens/base rules, layout, shared controls, feature screens, responsive rules, courses, navigation reachability and photographs. The original rule order is preserved so moving styles does not alter the existing cascade.

See [project-structure.md](project-structure.md) for folder responsibilities, dependency direction and the protected-branch development workflow.
