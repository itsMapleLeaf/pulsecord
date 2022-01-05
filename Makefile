build:
	pnpx tsup-node src/main.tsx \
		--out-dir dist \
		--target node16 \
		--format esm \
		--sourcemap 

start: build
	./bin/pulsecord.js
start-dev: build
	NODE_OPTIONS=--enable-source-maps ./bin/pulsecord.js

dev:
	pnpx chokidar "src" \
		--ignore "*.log" \
		--command "make start-dev" \
		--initial

install: build
	pnpm ln --global

lint":
	pnpx eslint --ext js,ts,tsx .
lint-fix":
	make lint --fix
format":
	prettier --write .
test":
	ava
typecheck":
	tsc --noEmit
