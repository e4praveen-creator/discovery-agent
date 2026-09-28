# Tredence Discovery Agent

An interactive demonstration and service-ready pilot for continuous enterprise discovery, centered on campaign audience selection.

## Run locally

Use Node 22.13+ and the included package lock. Install with `npm run install:ci`, copy `.env.example` to `.env`, generate migrations with `npm run db:generate` if the schema changes, and build with `npm run build`. Apply the checked-in migrations to local D1 as described in the starter's setup instructions, then start `npm run dev`.

The portable development preview provides a synthetic local account through `/signin-with-chatgpt?return_to=/`. This testing helper is development-only. Production uses Microsoft Entra ID and never accepts the local development identity.

## Main surfaces

Overview · Context blueprint · Contribute · Expert review · Knowledge library · Missions & asks · Evaluations · Releases & refresh · Team & setup.

See [PILOT_SETUP.md](PILOT_SETUP.md) for the Entra registration, AI service configuration, and live acceptance checklist. See [FEATURE_COVERAGE.md](FEATURE_COVERAGE.md) for exact coverage and integration boundaries.

## Data and security

- D1: projects, role memberships, single-use invitations, login transactions, and opaque sessions.
- R2: original uploaded bytes and contributor statements.
- Every project API checks session and membership server-side.
- Expert verification and critical owner sign-off are different transitions.
- Reviewer-only sources and dependent records are filtered from contributor views and downloads.
- Source/knowledge/test changes invalidate relevant approval/evaluation state. Published packages remain immutable.
- Secrets are runtime-only. No real company credentials or client records are included.

## Verification completed

TypeScript checks and production compilation. Synthetic local API checks cover the end-to-end approval/release/refresh path, file round trips and duplicate recognition, anonymous rejection, project isolation, source permissions, role restrictions, single-use invitations, and concurrent revision conflicts. UI checks cover navigation and the question/answer journey. Responsive checks and live Entra and OpenAI verification remain pending.
