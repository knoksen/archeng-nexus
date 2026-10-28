# Local integration foundation

ArchEng Nexus is the application surface associated with TaksdalBT. The approved `archeng.staging.jarlhalla.com` hostname is a planning target only; this project does not configure DNS or deploy public staging.

The Express server preserves its existing `GET /health` response and adds:

- `GET /health/live` — process liveness.
- `GET /health/ready` — local server readiness.

Both new endpoints return only a status value. They expose no credentials, personal data, or upstream service details and are suitable for read-only health polling by the Command Center.

Rollback is limited to reverting this branch. It does not change the existing WordPress permalink, public menus, production routes, data, or deployment configuration.
