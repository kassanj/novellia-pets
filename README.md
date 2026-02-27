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
4. Run the database migration: `make migrate` (when prompted, name the migration e.g. `init`)
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


