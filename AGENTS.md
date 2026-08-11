# MOA Frontend Codex Guide

## Project
- React 19 + Vite frontend for MOA.
- Production static assets are deployed to a private S3 bucket and served through CloudFront.
- Production API base URL is injected through `VITE_API_BASE_URL` during CI.

## Local checks
- Install: `npm ci`
- Lint: `npm run lint`
- Test: `npm run test:run`
- Build: `npm run build`

## Deployment
- Pushes and pull requests to `main` or `dev` run CI.
- A successful CI run for `main` triggers the CloudFront deployment workflow.
- AWS access uses GitHub OIDC. Do not add long-lived AWS access keys.
- Never put secrets in `VITE_*` variables because Vite embeds them in browser assets.

## Safety
- Preserve unrelated user changes.
- Do not commit credentials, private keys, local environment files, or production user data.
- Verify the public frontend and API after every production deployment.
