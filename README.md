# Novellia Pets

A pet management app for tracking pets and their medical records (vaccines and allergies). Includes a dashboard with stats, vaccine renewal reminders, and lists of vaccinated vs unvaccinated pets.

## Tech stack

- **Client:** React 19, Vite, TypeScript, Chakra UI v3, React Router, TanStack Query (React Query), Axios
- **Server:** Express, TypeScript, Prisma, SQLite 

## Prerequisites

- Node.js (v18+)
- npm

## Setup

1. Clone the repo
2. Run `make install`
3. Copy the env file: `cp server/.env.example server/.env`
4. Run the database migration: `make migrate`
5. Seed the database with sample data: `make seed`
6. Run `make dev`

App runs at http://localhost:5173  
API runs at http://localhost:3001

## Features

- **Dashboard** – Total pets, upcoming vaccine renewals (>30 days since last dose), severe allergies count, total medical records; pie and bar charts by animal type; tables for pets with last vaccine and unvaccinated pets.
- **Pet list** – Search and filter pets; add, edit, delete; navigate to detail.
- **Pet detail** – Pet info card; vaccine renewal alert when any vaccine was given >30 days ago; medical records (vaccines and allergies) in tables with add/edit/delete.
- **Pet form** – Create and edit pet (name, animal type, owner, date of birth).
- **Medical records** – Per pet: vaccine records (name, date, administered by, notes) and allergy records (name, reactions, severity, notes).

## API

- `GET/POST /api/pets` – List (with optional `search`, `type`) and create pets
- `GET/PUT/DELETE /api/pets/:id` – Get, update, delete a pet
- `GET/POST /api/pets/:petId/records` – List and create medical records
- `PUT/DELETE /api/pets/:petId/records/:id` – Update and delete a record
- `GET /api/dashboard/stats` – Dashboard stats (totals, pets by type, upcoming vaccines, severe allergies, pets with last vaccine, unvaccinated pets)

## Project structure

```
novellia-pets/
├── client/                 # Vite + React app
│   ├── src/
│   │   ├── components/     # NavBar, PageLayout, modals, graphs
│   │   ├── pages/          # Dashboard, PetList, PetDetail, PetForm
│   │   ├── lib/            # API client, toaster
│   │   ├── types/
│   │   └── constants/
│   └── ...
├── server/                 # Express API
│   ├── src/
│   │   ├── routes/        # pets, records, dashboard
│   │   ├── lib/           # Prisma client
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma  # Pet, MedicalRecord
│   └── scripts/
│       └── seed.ts        # Seed data script
└── README.md
```

## Potential Production Upgrades

**Database** -
Migrate from SQLite to PostgreSQL for concurrent writes and production reliability. Prisma makes this nearly seamless. Read replicas would be introduced early given the app's read-dominant usage pattern, ensuring dashboard aggregations (the most expensive queries) never compete with write latency.

**Caching** -
Add Redis server-side in front of the database, targeting the dashboard stats and pet list endpoints, the routes doing the heaviest lifting.

**Auth / Security / Compliance** -
No auth layer currently exists, which is the most critical gap for a HIPAA-relevant app. Auth0 would be the first choice, providing MFA, Role-Based Access Control, and audit logging out of the box. Additional safeguards would include encrypting data at rest, scoping all queries to the authenticated user, and short-lived tokens with refresh rotation. The data model would gain a User table with roles, and every resource would carry an owner_id foreign key.

**Frontend Framework** -
Migrate from Vite to Next.js. The current app is a pure client-side SPA, which has limitations at production scale. Next.js adds SSR and static generation for faster initial loads, along with file-based routing that scales more cleanly as the app grows.

**API Layer** -
Swap Express for Fastify for better throughput. GraphQL is worth considering to reduce overfetching and better support multiple consumers such as mobile and web clients.

**Search** -
Current filtering is appropriate for MVP scale. Elasticsearch would be introduced once search complexity or data volume justifies it.

**UI** -
Quick wins include pagination, a 404 page, responsiveness, and accessibility improvements. A PetOwner dashboard is also planned.

**Testing & Monitoring** -
Add unit and end-to-end test coverage, and integrate Datadog for production monitoring and alerting.

## AI Tools

For this project, I used Cursor as my AI-assisted development environment. I leaned on it primarily  for debugging to help identify and resolve issues more efficiently and quickly. I also used Claude during the planning / architecture phase to help think through structure and approach as well as for project management.
