install:
	cd server && npm install
	cd client && npm install

generate:
	cd server && npx prisma generate

migrate:
	cd server && npx prisma migrate dev

seed: generate
	cd server && npm run seed

dev:
	make -j2 dev-server dev-client

dev-server:
	cd server && npm run dev

dev-client:
	cd client && npm run dev