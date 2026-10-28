# GitHub Pages deployment

## Authoritative workflow

`.github/workflows/deploy.yml` is the only workflow that deploys to GitHub
Pages. Pull requests run dependency installation, tests, and site validation;
the deploy job is skipped for pull requests. Pushes to `main` and manually
started runs can deploy. Only the deploy job holds the `pages-deploy`
concurrency lock (never cancelled), so pull-request validation cannot replace a
queued production deployment. Builds use a per-ref group; newer pushes to the
same pull request cancel the older PR build. The build job has `pages: read`
because `actions/configure-pages` reads the Pages configuration.

The workflow builds the repository root with the same Jekyll Pages action and
source used by the previously successful `jekyll-gh-pages.yml` workflow. This
preserves the current site structure: README-derived documentation at `/`,
the existing `/SECURITY.html`, `/DESKTOP.html`, and `/assets/` routes, and the
application site under `/public/`. It validates those generated routes and
compares the generated `_site/public` tree against `public/` before upload.

## Verified production artifact

Before consolidating workflows, the successful Pages deployment was traced to
Jekyll run `40602957655` at main commit
`2d53496cb2b424bd632ab8a82135b52426a4480f`. The live site was
`https://knoksen.github.io/archeng-nexus/`. The deployed artifact contained
the root documentation pages and the `public/` application subtree. The
separate static workflow artifact contained only the three `public/` files.
Deploying that smaller artifact at the site root would replace the documentation
home page and remove the existing security, desktop, and assets routes.

The deployed `public/` files matched the corresponding GitHub source files.
Their raw SHA256 values differed in a Windows checkout only because Git
converted LF to CRLF; normalizing the working-tree line endings back to LF
produced byte-for-byte matches. No `public/` source files are changed by this
consolidation.

## Rollback

- **Before merge:** Close the PR. Pull-request runs do not deploy, so the
  published site remains unchanged.
- **After merge, if a Pages regression is observed:** Stop further merges that
  change Pages content. Open a rollback PR restoring the last verified root
  Jekyll build (`source: ./`, destination `./_site`, upload `_site`) in
  `deploy.yml`, while keeping `jekyll-gh-pages.yml` removed. Validate the
  generated routes and `public/` equality check before merging. Do not restore
  the old Jekyll workflow file, because that would reintroduce competing
  deployers. Merging a rollback PR causes the single authoritative workflow to
  deploy; do not use workflow dispatch as an unreviewed production rollback.

No production Pages settings are changed by this repository workflow.
