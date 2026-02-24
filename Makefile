install:
	cd server && npm install
	cd client && npm install

dev:
	make -j2 dev-server dev-client

dev-server:
	cd server && npm run dev

dev-client:
	cd client && npm run dev