# Next Bootstrap

This project, `yann-next-bootstrap`, is intended to be used as a starting point for building a modern web application using Next.js, React, Tailwind CSS and shadcn/ui.b applications.

## Database

We use prisma and sqlite.

Interface to the database during dev: `npx prisma studio`

### Updating the database

1. Edit the [schema file](prisma/schema.prisma)
2. Run a migration: `npx prisma migrate dev --name <migration_name>`

