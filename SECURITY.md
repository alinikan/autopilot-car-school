# Security policy

## Supported code

The current `main` branch is maintained. Older snapshots have no separate security-support commitment.

## Reporting

Use GitHub private vulnerability reporting if it is enabled for this repository. Otherwise arrange a private channel with the repository owner before sharing sensitive details. Do not post passwords, tokens, private keys, account backups or another learner's information in a public issue.

Include the affected area, reproduction steps, expected access rules and impact. A minimal reproduction using a disposable test account is preferable to real user data.

## Application boundaries

- Supabase handles authentication and session management.
- `learning_progress` enables row-level security and restricts authenticated access to the row owned by `auth.uid()`.
- Only the Supabase URL and publishable key are browser configuration. Service-role or secret keys do not belong in frontend code or `VITE_*` variables.
- Environment files, Vercel local state and dependencies are ignored by Git.
- Guest progress and exported backups are device/user data and should be treated accordingly.

The test/build CI workflow does not receive production credentials or deploy the application.
