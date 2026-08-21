# MOHMOS GitHub Profile Dashboard — Upload Patch

This package is made for the existing repository:

`MohammedMuostafa/portfolio`

It adds a GitHub-style profile/activity page while keeping the current portfolio identity accurate and learning-oriented.

## Profile wording used
- Protocol Lead | LitVM Ecosystem
- Developer
- Web3 Builder
- Discord Server Builder
- Computer Science student
- Learning blockchain, smart contracts, decentralized systems, and Web3 development
- Goal: Blockchain Developer

## How to upload

1. Extract this ZIP.
2. Open your `portfolio` repository on GitHub.
3. Upload the extracted files and folders to the root of the repository.
4. Keep the same folder structure.
5. Replace matching files when GitHub asks.
6. Commit the changes to `main`.
7. GitHub Actions will build and deploy the site automatically.

## Added files
- `github.html`
- `css/github.css`
- `js/github-entry.js`
- `js/github-profile.js`
- `scripts/fetch-github-profile.js`
- `data/github-profile.json`
- `PROFILE_TEXT.md`

## Replaced or updated files
- `css/main.css`
- `js/app.js`
- `scripts/build-site.js`
- `package.json`
- `.github/workflows/deploy.yml`
- `sitemap.xml`

## Result

Main portfolio:
`https://mohammedmuostafa.github.io/portfolio/`

GitHub dashboard:
`https://mohammedmuostafa.github.io/portfolio/github.html`

A GitHub link is also added to the portfolio navigation.

GitHub data refreshes during the GitHub Actions build using the repository-provided `GITHUB_TOKEN`. The token is not exposed to visitors.
