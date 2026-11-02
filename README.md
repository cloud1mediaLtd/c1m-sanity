# Shared editorial CMS

Status: Studio and guide pilot deployed; Great Removals custom-domain cutover pending. Owner: Site Delivery. Reviewed: 2026-11-02.
Canonical repository: cloud1mediaLtd/c1m-sanity. Historical copies are untouched.

Use Node 24, `pnpm install --frozen-lockfile`, then `pnpm dev` (loopback 3333).
Sanity authentication is required to edit hosted content. This is not an offline
editor: use the checked-in JSON fixtures for credential-free content rehearsals.
`pnpm verify` checks new schemas and all TypeScript; `pnpm build` builds Studio.
The existing older schema lint baseline is not silently weakened or rewritten.

Sites: cloud1media, simplevan and greatremovals. Copy records have fixed fields and layouts;
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

## Articles and guides

The existing `post` document is labelled **Article** in Studio. Its existing
Article Category reference is the taxonomy: use category slug `guide` for guides.
There is no duplicate Guide document type or parallel label system. Internal
editors choose a site under **Content by site**, then Articles or Article
categories; new records inherit that site. Newly created sites appear there
without editing the Studio menu. Existing authors and media stay shared.

Articles have rich text, featured media, excerpt, category and SEO fields.
A future publication date keeps a published article out of the new reader's
public feed until that time. Service documents remain available as existing
infrastructure; no service-page or design cutover is included.

`pnpm demo:articles` produces a credential-free offline import plan for the
existing SimpleVan and Great Removals guides. `pnpm articles:plan export.ndjson`
checks a real export without making changes. Existing guide titles, slugs,
paragraphs and checklists become draft articles, linked to each site's Guide
category. Existing site/slug matches are not overwritten; the plan is idempotent.
Images are listed for separate review/upload, never fabricated as CMS assets.
Publication dates are not invented. Review media, SEO, links and dates before
any separately authorized hosted import/publication. Existing website routes
stay code-backed until a deliberate tested cutover.

## Production rollout tools

The Studio is hosted at https://c1media.sanity.studio/ in project `g2dro3ti`,
dataset `production`. `sanity.cli.ts` pins its existing application ID.
Production data backups and generated plans stay outside Git.

`node scripts/plan-site-backfill.mjs export.ndjson` plans revision-guarded
company ownership and legacy article-category copies. Existing legacy categories
are preserved. All new public IDs and references must use root IDs without dots;
Sanity treats dotted IDs as private. The regression suite checks this boundary.

After separate migration approval, an authenticated operator can apply a reviewed
plan with `sanity exec scripts/apply-reviewed-plan.ts --with-user-token --
PLAN --apply-g2dro3ti-production`. This runner allows conditional creates and
revision-guarded patches only. Never feed an unreviewed plan into it.

`sanity exec scripts/publish-imported-guides.ts --with-user-token --
SITES_ROOT --apply-g2dro3ti-production` publishes the six reviewed baseline
guides and uploads their existing images. Unlike the offline draft planner, this
is an explicitly authorized publication tool. It uses conditional creates,
skips existing articles and never replaces or deletes content. The source root
must contain the two commissioned site checkouts and their public image files.
Deploy the company frontend's site filters before publishing other sites' content.
