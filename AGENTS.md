# Project Rules

- Keep one named class or API interface per file, with a matching filename. Extract nested implementation classes as well; companion objects and anonymous implementations may remain with their owner.
- Document API types and every API member consistently with neighboring files: summary, units, fallback behavior, parameters, return values, lifecycle and platform limits. Use TSDoc (`@category`, `@public`, `@platform`, `@remarks`) for the public TypeScript API and KDoc for Android APIs.
- Keep facade implementations policy-free. Integrations own playback synchronization and advertising lifecycle; native player access must bypass facade overrides.
- Use `bun run` for package scripts and Node as the runtime. Run `bun run typescript`, `bun run lint`, and focused Node tests with `node --test src/__tests__/PlayerFacade.test.ts` (Node 22.18+).
- For library-only type checking, run `bun run typescript --project tsconfig.build.json`. The root typecheck also includes example and E2E sources.
- Android facade tests run from `example/android`: `./gradlew :react-native-theoplayer:testDebugUnitTest --tests com.theoplayer.PlayerFacadeTest --console=plain`.
