# Next Bootstrap

This project, `yann-next-bootstrap`, is intended to be used as a starting point for building a modern web application using Next.js, React, Tailwind CSS and shadcn/ui.b applications.

## Database

We use prisma and sqlite.

Interface to the database during dev: `npx prisma studio`

It needs one environement variable:
- `DATABASE_URL`

### Updating the database

1. Edit the [schema file](prisma/schema.prisma)
2. Run a migration: `npx prisma migrate dev --name <migration_name>`

## Auth

Based on https://github.com/lucia-auth/example-nextjs-google-oauth

I needs 3 environment variables:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `ORIGIN`
