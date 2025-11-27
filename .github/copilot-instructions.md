# Copilot / AI Agent Instructions for my-markdown

This project is a small NestJS application. The following notes capture the essential, discoverable patterns and workflows an AI coding agent should follow to be productive here.

- **Architecture:** NestJS app using modules under `src/` (e.g. `logger`, `note`, `status`). The app boots from `src/main.ts` and follows standard Nest module/controller/service separation.

- **Where to look first:** `src/app.module.ts`, `src/main.ts`, and `src/logger/logger.module.ts` show global wiring and bootstrap behavior. `src/note` and `src/status` contain feature modules, controllers and DTOs.

- **Logger pattern (important):**
  - The project exposes a DI token `LOGGER` in `src/logger/logger.module.ts` (export: `export const LOGGER = Symbol("Logger");`). Inject it with `@Inject(LOGGER)` where needed.
  - Two implementations exist in `src/logger/logger-service/`: `WinstonLoggerService` and `ConsoleLoggerService`. Their API surface is described in `src/logger/logger-service/interface/logger-service.interface.ts`.
  - `LoggerModule` is a `@Global()` module and provides `LOGGER` via `LoggerModule.register()`. Note: the current `useFactory` references `isConsole` (a variable not defined in that file). Search the repo for `isConsole` or prefer using `ConfigService`/env var to control which implementation is returned.

- **Dependency & integration points:**
  - Uses `@nestjs/config` for configuration and `winston` for structured logging (`package.json` includes `winston`).
  - Config files: `src/app.module.ts` already calls `ConfigModule.forRoot()` and expects environment files named `.dev.env` (development) and `.prod.env` (production). Place these files in the project root (not in `dist/`). A recommended flow is to keep `.prod.env` off source control and commit a `.prod.env.example` that can be copied on the host.
  - Tests use Jest; e2e config: `test/jest-e2e.json`. Unit tests live under `src/**/*.spec.ts`.

- **Project scripts (use exact `package.json` commands):**
  - `npm install` — install deps
  - `npm run start` — start app
  - `npm run start:dev` — watch mode
  - `npm run start:prod` — production entry (`NODE_ENV=production node dist/main`)
  - `npm run build` — `nest build`
  - `npm run test` / `npm run test:e2e` / `npm run test:cov`
  - `npm run lint` and `npm run format`

- **File and code conventions to follow:**
  - DTOs under `dto/`, interfaces under `interface/` next to services/controllers.
  - Tests colocated with the unit code as `*.spec.ts` files in the same folder.
  - Use constructor injection via Nest patterns. When injecting the logger, use the `LOGGER` symbol token: `constructor(@Inject(LOGGER) private readonly logger: ILoggerService) {}`.
  - Modules may expose `register()` returning a `DynamicModule` (see `LoggerModule`). Look for `@Global()` usage as it affects provider visibility across modules.

- **Common fixes and code smells an agent may encounter here:**
  - The `LoggerModule` provider factory references `isConsole` but does not define or inject it — search for the intended configuration and prefer `ConfigService` usage (inject `ConfigService` in `useFactory` via `inject: [ConfigService]`).
  - Watch for slight method-signature differences between logger implementations (e.g., `WinstonLoggerService.error` accepts extra args). Match to the declared `ILoggerService` interface.

- **Testing & debugging tips:**
  - Unit tests: `npm run test`. Root jest config for unit tests is in `package.json` (rootDir `src`).
  - E2E: `npm run test:e2e` uses `test/jest-e2e.json` (rootDir is `.` for e2e runs).
  - For runtime issues, run in dev mode with `npm run start:dev` to get hot reloads.

- **What to change and how to propose PRs:**
  - If altering DI tokens or exported symbols, update all imports that reference `LOGGER` (search `@Inject(LOGGER)`).
  - For configuration changes (e.g., logger selection), prefer adding environment variables (document them in README) and use `@nestjs/config` (inject `ConfigService` into factories).

If anything here is unclear or you'd like the agent to include more examples (for instance, a suggested `LoggerModule` factory implementation using `ConfigService`), tell me which sections to expand and I'll update the file.
