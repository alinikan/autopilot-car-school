# Release verification

Verified 2026-11-09 for the published photo update.

| Check                                   | Result                                                            |
| --------------------------------------- | ----------------------------------------------------------------- |
| Automated Node tests                    | 17 passed                                                         |
| Production TypeScript/Vite build        | Vercel READY                                                      |
| Model-guide photo coverage              | 166 of 166 guides                                                 |
| Locally hosted reference photos         | 214                                                               |
| Production asset status and hash checks | 214 of 214 HTTP 200, WebP responses, matching local file hashes   |
| Desktop enlarged view                   | 1440 × 900; image fits its frame and viewport                     |
| Phone enlarged view                     | 390 × 844 and 320 × 568; no horizontal overflow                   |
| Landscape enlarged view                 | 844 × 390; image and dialog fit the screen                        |
| Gallery navigation                      | Changes the image and pictured-model label together               |
| Photo quiz                              | Image loads, uses contain sizing, and withholds identity captions |
| Recent browser/runtime error scan       | No matching errors observed during verification                   |

The image audit included source descriptions and visual contact-sheet inspection, with replacements for mistaken or unsuitable body/market examples. Automated checks cover the complete photo manifest and all model guides. Browser verification samples the shared rendering component and representative flows; it does not claim to test every possible device or every individual lesson interactively.

Existing quiz-answer compatibility tests passed. This photo release did not migrate or reset progress records or account credentials. The database and auth implementation were retained.

Repeat the checks when changing the curriculum or media. `npm run verify:photos -- <origin>` checks the current files against a deployed origin; it is intentionally separate from PR CI, because an unmerged photo change may legitimately differ from production.
