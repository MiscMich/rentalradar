# Contributing

Thanks for helping improve RentalRadar public edition.

## Principles

- Keep demo mode deterministic, credential-free, and enabled by default.
- Use fictional, generic examples. Do not add customer data, production identifiers, real accounts, private plans, deployment internals, or secrets.
- Preserve server-only boundaries for environment values and provider credentials.
- Keep tenant checks inside the repository layer, not only in callers.
- Prefer small dependencies and explain additions in the change description.
- Avoid analytics and telemetry in the public edition.

## Development

Install dependencies and run the local development server:

```sh
npm install
npm run dev
```

Before submitting a change, run:

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Add tests when changing environment parsing, public serialization, repository access, fixtures, adapters, or scoring. Never record real provider responses in fixtures.

## Changes

Keep pull requests focused. Describe behavior, test coverage, security implications, and any user-visible changes. Screenshots should contain only fictional demo content and should not include browser chrome, local paths, accounts, or notifications.

## Conduct

Be respectful, specific, and constructive. Assume good intent while reviewing ideas and code.
