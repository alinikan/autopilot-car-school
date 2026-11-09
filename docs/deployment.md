# Deployment and accounts

The live application is [autopilot-car-school.vercel.app](https://autopilot-car-school.vercel.app).

## Local development

Use Node 24, run `npm ci`, and start with `npm run dev`. Vite's middleware exposes the same catalogue handler as the Vercel function. `npm run preview` serves the built frontend only; it does not emulate Vercel functions.

Without Supabase variables the app runs in guest mode. To enable account flows, copy `.env.example` to `.env.local` and provide your own project's URL and publishable key. Vite reads these at build/start time, so restart after changing them.

## A new Supabase project

1. Create or select the intended Supabase project.
2. Run `supabase/schema.sql` once in a **new** database setup. It defines the progress table, policies and update trigger. For an existing deployment, inspect its schema and prepare an appropriate migration instead of rerunning the bootstrap.
3. In Authentication URL configuration, set the production application origin as the Site URL and add intended local/preview origins as allowed redirect URLs.
4. Enable the email authentication methods required by the app. Test an email-link sign-in, email confirmation when enabled, and password recovery with a disposable account.
5. Configure a verified custom SMTP provider if the built-in delivery restrictions or sending limits do not meet your launch needs.

`learning_progress.user_id` references the authenticated user. Row-level policies allow each signed-in user to read and change only their own row; anonymous table access is revoked. Keep those policies when adapting the schema.

## Vercel

Use the app directory as the project root with:

| Setting   | Value           |
| --------- | --------------- |
| Framework | Vite            |
| Node.js   | 24.x            |
| Install   | `npm ci`        |
| Build     | `npm run build` |
| Output    | `dist`          |

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the environments where accounts should work. They are public client configuration, not administrative credentials. The Vercel function and security/SPA routing headers are configured in `vercel.json`.

For the existing live project, preserve its environment and Supabase URL configuration. The GitHub test workflow runs checks only; pushing this repository is not itself a statement that Vercel Git integration has been connected. If connecting Git integration, link the **existing** Vercel project to this repository rather than creating an accidental second production site.

## Release checks

- Run `npm test` and `npm run build` on the intended code.
- Test the staged app on desktop and a narrow phone. Open a model gallery, switch photos, enlarge one, close it and enter the quiz.
- Check visible image loads, full-frame fitting, text wrapping and modal bounds, including landscape.
- Run `npm run verify:photos -- <deployment-origin>` to compare all deployed images with the local files.
- For auth changes, test using disposable accounts and check ownership/RLS behaviour. Do not use a learner's account for destructive tests.
- Release the tested code with production environment configuration, then confirm the live origin and inspect recent errors.

Keep source archives and deployment environment files separate. `.env.local`, `.vercel`, dependencies, build output and account backups do not belong in Git.
