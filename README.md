# Shared editorial CMS

Status: local foundation, not deployed. Owner: Site Delivery. Reviewed: 2026-11-02.
Canonical repository: cloud1mediaLtd/c1m-sanity. Historical copies are untouched.

Use Node 24, `pnpm install --frozen-lockfile`, then `pnpm dev` (loopback 3333).
Sanity authentication is required to edit hosted content. This is not an offline
editor: use the checked-in JSON fixtures for credential-free content rehearsals.
`pnpm verify` checks new schemas and all TypeScript; `pnpm build` builds Studio.
The existing older schema lint baseline is not silently weakened or rewritten.

Sites: cloud1media and simplevan. Copy records have fixed fields and layouts;
booking, prices, CRM and authorization are not CMS content. Site references are
required; slug uniqueness and document references are checked within the site.
Authors and assets are shared. External customer editing is not supported.

`pnpm migration:plan /path/to/export.ndjson` prints an offline reviewable plan.
It never applies writes. Export and inspect the hosted dataset separately before
any authorized migration. Existing records are patched conditionally by revision;
new seeds use createIfNotExists. A rerun against a migrated export is a no-op.
No deletion or replacement of existing drafts/content is performed.

Deploy the company's site-filtered queries after its backfill and before
publishing another site's content. The shared site-content package must be
published before registry-only site consumers can adopt it. Hosted writes,
package publication and deployments need separate authorization.
