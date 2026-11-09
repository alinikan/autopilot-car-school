# Contributing

Autopilot teaches complete beginners. Prefer clear explanations, concrete examples and comparisons that explain a real trade-off.

## Development

1. Use Node 24 (`nvm use`) and install dependencies with `npm ci`.
2. Create a branch for a focused change.
3. Run `npm test` and `npm run build`.
4. For a UI change, check a narrow phone, desktop and landscape viewport. Inspect the actual rendered result.
5. Describe the problem, resulting behaviour and validation in the pull request.

Guest mode works without a Supabase project. Use your own Supabase project to test accounts; do not use a real learner's account or overwrite their progress for testing. Keep environment files, session tokens and progress backups out of commits and issue attachments.

## Curriculum changes

Manufacturer content lives in `src/academy-data.json`; foundations live in `src/content.ts`. Use an official Canadian source for current local specifications or price examples, and record the model year, version, exclusions and source date. Distinguish a model family from a particular trim or market.

Question IDs are saved in learners' review history. Preserve an existing ID's correct answer. If the underlying meaning changes, give the replacement question a new ID and consider how existing progress should behave. The compatibility fixture in `tests/fixtures/legacy-course-answers.json` guards previously learned answers.

Do not change that fixture just to make a failing compatibility check pass. Explain and explicitly handle any necessary migration.

## Photographs

Follow [docs/content-and-photography.md](docs/content-and-photography.md). Verify the pictured make, family and relevant body/powertrain distinction from the source and by looking at the photograph. Include photographer and licence metadata. Use the shared photo components so the full image stays visible, and keep answer-revealing captions out of quizzes.

## Pull requests

Keep changes focused. Include a screenshot when the UI changes and describe any source or account configuration needed. Tests should check meaningful behaviour or data integrity. Do not add a test that merely repeats a styling implementation.
