# Security Policy

## Scope

This project is a static, offline-first web app. It has no server, no backend
database, and no authenticated endpoints. All state lives in the user's
browser (`localStorage`). This limits the attack surface but not the concern —
it's used by children.

Threats in scope:

- Cross-site scripting (XSS) via theme/config data or player names.
- Prototype pollution in game/theme JSON merging.
- Service-worker cache poisoning.
- PWA manifest / icon tampering.
- Dependency risks (self-hosted fonts, bundled assets).
- Kid-safety issues in default content (see CONTRIBUTING.md).

Out of scope:

- Attacks that require the user to willingly paste arbitrary code into the
  browser console or modify `config/app-config.js` locally.

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Instead:

1. Open a GitHub Security Advisory draft on the repo, **or**
2. Contact the maintainer directly via the email listed in the repository
   owner's GitHub profile.

When reporting, include:

- A description of the issue and why it matters.
- Steps to reproduce (exact URLs, payloads, browser versions).
- Your assessment of impact (what could a bad actor do?).

You can expect an initial acknowledgement within a few days. Fixes will be
coordinated privately before public disclosure.

## Supported versions

Only the `main` branch is supported. There are no long-lived release
branches.

## Hardening checklist for maintainers

When reviewing PRs, confirm:

- New HTML injection points use `textContent` or the `sanitizeInstructionHtml`
  helper.
- New user input is validated with `sanitizePlayerName` (or a similar helper)
  and has a length cap.
- New destructive actions (reset, delete) require an explicit confirmation
  (typing the target's name is the current pattern).
- New external resources (fonts, scripts, analytics) are **not** added. The
  project is intentionally offline-first and leaks no data about its users.
