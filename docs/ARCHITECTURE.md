# Architecture

RentalRadar is a Next.js App Router application with a deliberately small separation between presentation, domain logic, storage, and provider boundaries.

## Request and data flow

1. Server configuration is parsed from the process environment. Demo mode defaults to true.
2. The provider registry selects deterministic demo adapters or configured server-side HTTP adapters.
3. Provider observations are normalized into the domain result shape.
4. The scoring module calculates an explainable visibility score.
5. A repository scope owns prompt and result access for exactly one tenant.
6. Server-rendered pages or client-only demo interactions present the result.

The current dashboard reads frozen demo fixtures directly. This keeps local rendering fast, credential-free, and predictable while the domain boundaries remain independently testable.

## Modules

- `app/` contains the dashboard, onboarding route, metadata, and responsive styles.
- `lib/config/` parses private server settings and derives a deliberately small public configuration.
- `lib/demo/` owns the fixed clock, dashboard fixture, and seeded result generator.
- `lib/domain/` contains shared records and the pure scoring function.
- `lib/providers/` defines the adapter contract, deterministic demo adapter, and server-only HTTP adapter.
- `lib/repository/` contains the tenant-scoped in-memory repository.
- `tests/` verifies isolation, determinism, provider behavior, and scoring.

## Dependency direction

Presentation may import domain values and demo fixtures. Provider and repository modules may import domain types. Pure domain modules do not depend on Next.js, React, storage, or external providers. Secret-bearing modules import the `server-only` marker and are never imported by client components.

## Runtime modes

### Demo mode

This is the default. It needs no environment file, does not call a network provider, and returns stable output for the same prompt, provider, and prompt identifier.

### Configured mode

Setting `DEMO_MODE=false` requires an endpoint and key for every selected provider. Configuration fails before an adapter is created if any required value is missing. The included HTTP adapter is a generic integration boundary, not a claim of compatibility with any provider's native API.

## Storage boundary

The repository exposes no unscoped read or write methods. A caller must obtain a tenant scope first. Reads, updates, and result writes verify ownership internally; a cross-tenant identifier produces the same error as an absent identifier. Data resets when the process stops.
