# Maturity

Status: early public reference edition.

## What is complete

- Credential-free deterministic demo runtime
- Responsive dashboard and guided onboarding route
- Pure visibility scoring module
- Tenant-scoped in-memory storage boundary
- Demo and generic HTTP provider adapter boundaries
- Automated isolation and determinism tests
- Build, type, and lint scripts

## Deliberate limitations

- No authentication, authorization UI, OAuth, payments, customer records, or account management
- No database, background scheduler, durable queue, retry policy, or cache
- No native provider request or response formats
- No production deployment or observability configuration
- No analytics or behavioral telemetry
- No claim that the illustrative score predicts business outcomes

## Suitable uses

- Local product demonstration
- UI and information-architecture exploration
- Review of server/client, provider, and tenant boundaries
- Starting point for independently designed prototypes

## Not suitable without additional work

- Public or shared multi-user hosting
- Processing sensitive or regulated data
- Automated decisions, compliance reporting, or billing
- High-volume provider monitoring

Adopters should threat-model their own system, replace in-memory storage with enforced tenant-aware persistence, implement identity and authorization, and add provider-specific validation before deployment.
