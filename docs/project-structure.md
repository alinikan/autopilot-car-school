# Project structure and workflow

The source is grouped by responsibility. A feature owns the screen and behaviour for one learner task; shared components contain presentation reused by multiple features. Teaching content and pure learning logic do not depend on React.

## Where changes belong

| Change                                 | Location                                        | Example                                                             |
| -------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Add or edit a manufacturer lesson      | `src/content/courses/manufacturers/`            | `mazda.json`, `bmw.json`, `tesla.json`                              |
| Change how course data becomes lessons | `src/content/courses/lesson-builder.ts`         | Quiz construction and stable IDs                                    |
| Edit starter teaching content          | `src/content/foundations/`                      | `lessons.ts` and `units.ts`                                         |
| Add a verified photo reference         | `src/content/photos/` and `public/cars/`        | Manifest entry and its locally served asset                         |
| Change the lesson screen               | `src/features/learning/`                        | `LessonPlayer.tsx` and `LessonActivities.tsx`                       |
| Change an account flow                 | `src/features/account/`                         | `AccountModal.tsx` or `PasswordRecovery.tsx`                        |
| Change device/cloud progress sync      | `src/features/progress/useProgress.ts`          | Persistence, retry and session lifecycle                            |
| Change review scheduling or XP         | `src/domain/learning.mjs`                       | Pure functions tested without a browser                             |
| Change navigation or root state        | `src/app/`                                      | `App.tsx` and `navigation.ts`                                       |
| Change shared navigation chrome        | `src/components/layout/`                        | `AppShell.tsx`                                                      |
| Change shared dialogs or photo display | `src/components/ui/` or `src/components/media/` | `Modal.tsx`, `CarPhoto.tsx`, `PhotoGallery.tsx`                     |
| Change service initialization          | `src/lib/`                                      | `supabase.ts`                                                       |
| Change visual styling                  | `src/styles/`                                   | A named feature stylesheet; import order is explicit in `index.css` |
| Change the catalogue endpoint          | `api/catalog.js`                                | Vercel's route convention requires the root `api/` folder           |

## Dependency direction

- `main.tsx` mounts the application and loads the stylesheet entry point.
- `app/` coordinates feature screens and root state.
- `features/` uses shared components, content and domain logic.
- `components/` supplies reusable UI; it does not own a screen's navigation state.
- `content/` contains typed teaching records and their lesson builder. It does not import React.
- `domain/` contains framework-independent learning rules. It does not import UI or service clients.
- `lib/` adapts external services or provides small shared helpers.

`content/courses/catalog.ts` lists manufacturers explicitly in the established editorial order. Each manufacturer's JSON file owns its model guides, source links, price examples and workshops. Changing directory names must not change lesson IDs, question answers or progress storage keys.

The root `README.md`, package files, `index.html`, Vite/TypeScript/Vercel configuration and GitHub metadata use their conventional locations so the tools can find them. Runtime browser assets remain in `public/`. Screenshots and developer guides remain in `docs/`.

## Formatting

Run `npm run format` before committing and `npm run format:check` to verify the result. Prettier is pinned in the lockfile, uses two-space indentation and wraps code at 100 columns. Generated package-lock and public asset/snapshot files are excluded from source formatting.

## Protected main workflow

1. Create a feature branch from the latest `main`.
2. Make a focused change in its owning feature or content module.
3. Run formatting, tests and the production build.
4. Open a pull request targeting `main`.
5. Resolve review conversations and wait for **Test and build** to pass on an up-to-date branch.
6. Merge the pull request.

The active main-branch ruleset has no bypass actors, blocks force pushes and deletion, and requires pull requests and the GitHub Actions check. Required approvals are zero so a sole repository owner can merge their own tested pull requests. Adding a mandatory outside reviewer can be revisited when more maintainers join.

## Refactor verification

The organization change was checked against a saved pre-refactor baseline of all 276 lessons and 1,394 questions. The curriculum is identical. Public photo URLs, file contents, account configuration and progress storage keys are preserved. Tests import the actual course builder directly with Node 24 rather than rewriting source text into a synthetic module.
