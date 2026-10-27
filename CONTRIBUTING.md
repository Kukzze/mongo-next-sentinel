# Contributing to mongo-next-sentinel

Thank you for your interest in contributing to `mongo-next-sentinel`! We welcome contributions to make MongoDB connection monitoring more reliable in Next.js and serverless environments.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Kukzze/mongo-next-sentinel.git
   cd mongo-next-sentinel
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Run tests**:
   ```bash
   bun test
   ```

4. **Build the package**:
   ```bash
   bun run build
   ```

## Pull Request Guidelines

- Ensure all existing tests pass (`bun test`).
- Add tests for any new features or bug fixes.
- Follow conventional commits format (e.g. `feat: ...`, `fix: ...`, `docs: ...`).
- Verify TypeScript types compile cleanly with `npx tsc --noEmit`.
