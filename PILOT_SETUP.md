# Discovery Agent pilot setup

The prototype is implemented for campaign audience selection. The hosted site starts private. The interactive sample is available immediately; its changes last only for the current browser session. Real workspaces use durable storage and require Microsoft Entra sign-in.

## 1. Register the Microsoft Entra application

A tenant administrator or a user with app-registration rights must create the registration in the intended company tenant.

- Name: **Tredence Discovery Agent Pilot**
- Supported account types: **Accounts in this organizational directory only**
- Platform: **Web**, not SPA
- Exact redirect URI: **https://tredence-discovery-agent-pilot.mellow-cloud-4870.chatgpt.site/api/auth/callback**
- Post-logout redirect: **https://tredence-discovery-agent-pilot.mellow-cloud-4870.chatgpt.site**
- Use authorization-code sign-in. The application implements PKCE, state, nonce, signature, issuer, audience, tenant, expiry, and token-age validation.
- No Microsoft Graph application permissions, mailbox access, or directory-wide read permissions are needed for this pilot.
- In Enterprise applications, use “Assignment required” and assign the intended pilot participants if company policy requires an explicit admission list.

Record the **Directory (tenant) ID** and **Application (client) ID**. Those two identifiers can be shared with the implementer. Create a client secret under the company's normal policy and configure its value securely as `ENTRA_CLIENT_SECRET`; do not paste it in chat, place it in source, or expose it in the browser.

Hosted runtime settings:

| Setting | Value | Secret |
|---|---|---|
| ENTRA_TENANT_ID | Company tenant GUID | No |
| ENTRA_CLIENT_ID | Application/client GUID | No |
| ENTRA_CLIENT_SECRET | Client secret value | Yes |
| APP_ORIGIN | https://tredence-discovery-agent-pilot.mellow-cloud-4870.chatgpt.site | No |

Change hosted values through Sites environment settings, then redeploy the saved version to apply them. Do not store them in `.openai/hosting.json`.

Official instructions: [Register an app](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [add a redirect URI](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-redirect-uri), [authorization-code flow](https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow).

## 2. Connect live AI

Enable the OpenAI Developers plugin to provision/configure an approved API key through its secure setup flow. Configure:

| Setting | Value | Secret |
|---|---|---|
| OPENAI_API_KEY | Approved project API key | Yes |
| OPENAI_MODEL | gpt-4.1 by default, or a compatible approved model | No |

The server uses the Responses API with structured outputs and `store: false`. Files go to the model only after the contributor authorizes processing. Uploads remain stored if extraction is unavailable or fails. No real model run has been verified without a configured API key.

Supported pilot processing: text/CSV/JSON, PDF, Word and PowerPoint text, spreadsheet inputs, images, and audio transcription. Each upload is capped at 12 MB. Videos can be recorded and stored; add a transcript or screenshots for extraction. Source preview/download and manual expert checking remain necessary, including for AI-proposed citations.

OpenAI documentation: [File inputs](https://developers.openai.com/api/docs/guides/file-inputs), [structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [file transcription](https://developers.openai.com/api/docs/guides/speech-to-text).

## 3. Admit pilot participants

After Entra and AI are configured, verify sign-in with a real authorized company user. That user creates a clean or synthetic workspace and becomes its administrator. Invite colleagues with single-use, seven-day links, choosing Contributor, Domain expert, Business owner, or Viewer.

Project membership controls every saved API action. Domain experts review questions and answers. Business owners approve critical rules and publish context. Administrators can perform both stages, with explicit administrator events in the audit trail. The pilot does not enforce two different people when an administrator performs both stages.

The Sites audience is still owner-private. A separate, intentional Sites sharing change is needed before colleagues can reach it. Entra remains the application's authentication layer. No external users have been invited automatically.

## 4. Acceptance checks after configuration

1. Sign in through Entra; verify wrong-tenant and expired sessions are rejected.
2. Create a clean workspace; invite one contributor, one expert, and one business owner.
3. Upload a non-sensitive document, classify it under several requirements, and authorize AI extraction.
4. Compare proposed passages with the original. Approve a question, answer it, request a follow-up, verify the answer, and obtain owner sign-off on a critical rule.
5. Confirm contributor accounts cannot approve answers or download reviewer-only evidence.
6. Approve acceptance cases; run the same cases against baseline and current context. Have an expert grade both outputs.
7. Publish and download a versioned context package. Upload a source revision and verify affected assets/tests reopen without modifying the old release.

## Current boundaries

- In-app collaboration is implemented. Teams, Slack, and email are previews; no external messages are sent.
- File revisions and explicit revalidation requests drive refresh. Unattended repository monitoring is not connected.
- Source restrictions are enforced within project APIs. Downloads and exported packages still need appropriate handling outside the application.
- This pilot stores each workspace as an optimistic-concurrency-controlled document in D1, with membership/session tables and original bytes in R2. It is not a high-volume production document-management system.
- Production rollout still needs service-specific rate limits and quotas, retention/deletion controls, malware scanning, external security review, operational alerting, and the company's data-processing approval.
