# Full-stack deployment

The Netlify deployment serves the website only. The Render blueprint in
`render.yaml` runs the website and Express API together and provisions PostgreSQL.
The database URL is injected into the API service automatically.

## Configuration

Create a Render Blueprint from this repository. Review its service and database
plans before applying it. The free database plan expires after 30 days; choose an
appropriate persistent plan before storing real messages. Free web services may
sleep when idle.

Provide these values in Render's environment settings, never in GitHub:

- `CLERK_PUBLISHABLE_KEY`: the publishable key from your Clerk application.
- `CLERK_SECRET_KEY`: the secret key for that same Clerk application.
- `ADMIN_EMAIL`: the email you will use to sign in as administrator.

The build copies the publishable key to the frontend. Add the deployed hostname
to the appropriate Clerk application settings and configure production domains
if using production keys. Changing the publishable key requires a rebuild.

## Data and administration

On startup, the API applies the tracked Drizzle migrations before accepting
requests. Migration failure stops startup. On the first visit, `/api/posts`
seeds the 23 unique gallery posts in a fresh database.

- `/admin/posts`: edit each post's displayed likes count and manage posts.
- `/admin/inbox`: read and reply to messages.
- `/admin/appearance`: change page appearance.
- `/api/healthz`: API availability check.

All visitors should use the Render website URL so the API and website share an
origin. The existing Netlify website does not automatically use this API.

Uploaded media currently uses Replit Object Storage. The supplied gallery photos
are bundled with the website and work without it. New story/photo uploads need
a separately configured storage provider before they can work outside Replit.

For an existing database, take a backup and review the migrations before enabling
`RUN_DATABASE_MIGRATIONS`. The gallery replacement SQL in `scripts/sql` is a
separate optional operation; it archives existing posts and must not run on every
startup. Never rerun it merely to change an individual likes count.
