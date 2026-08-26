# Security

## Intended use

RentalRadar public edition is a demo and reference architecture. It is safe to run locally in its default configuration because it uses deterministic fixtures and does not require credentials, persist user input, or send analytics.

It is not ready to operate as a public multi-user service without additional identity, authorization, durable storage, rate limiting, provider-specific validation, audit logging, and operational controls.

## Secret handling

- `.env*` files are ignored except for the placeholder-only `.env.example`.
- API keys are read only by server configuration and server-only HTTP adapter modules.
- Public configuration is created through an allowlist and excludes keys, endpoints, and models.
- Client components do not import server configuration or provider adapters.
- Demo mode ignores all adapter credential variables.

Never prefix secrets with `NEXT_PUBLIC_`. Never commit populated environment files.

## Tenant isolation

The in-memory repository requires a non-empty tenant scope. Every record stores its owning tenant, and every read or write checks ownership inside the repository. Cross-tenant access fails with a generic unavailable error so callers cannot use it to enumerate identifiers.

This boundary is defense-in-depth for the reference design. A production database must repeat tenant filters in every query and enforce authorization before a repository scope is constructed.

## HTTP adapters

Configured mode sends the brand and prompt to the explicitly configured endpoint using a bearer token. Endpoints must use HTTP or HTTPS. The adapter accepts only a small normalized JSON response and does not return raw headers or credentials.

Before using configured mode, evaluate the destination's data retention, terms, response schema, timeouts, rate limits, and error behavior. Add request size limits and an outbound host allowlist for any untrusted configuration surface.

## Data and telemetry

The repository contains no production data, identifiers, accounts, payment state, or deployment settings. The application includes no analytics or tracking scripts. Onboarding state lives only in React component memory and disappears on refresh.

## Reporting a security issue

Open a private security advisory in the repository hosting interface. Do not include secrets, personal information, or active exploit data in a public issue.
