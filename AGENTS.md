# Arcaday — AI Agent Instructions

## Project
Arcaday is a mobile-first collection of daily arcade games.
Developed under the NUSINI brand.

Target platforms:
- Web / PWA
- iOS
- Android

## Core Principles
- Prioritize gameplay quality.
- Follow the approved visual identity.
- Build reusable and maintainable components.
- Keep mobile performance a priority.
- Avoid unnecessary complexity.

## Git Workflow
- Never develop directly on main.
- Use a dedicated branch for each task.
- Follow Conventional Commits.
- Keep commits small and meaningful.
- Use Pull Requests for integration.
- Never merge or deploy without human approval.

## Development Process
1. Understand the requirements.
2. Check existing documentation.
3. Propose a plan for significant changes.
4. Implement the approved solution.
5. Run relevant tests.
6. Review the changes.
7. Report results and limitations.

## Security
- Never commit credentials or secrets.
- Apply least-privilege principles.
- Never modify unrelated server services.
- Never bypass security restrictions.
- Request approval for privileged operations.

## Compliance
- Respect intellectual property and licenses.
- Consider privacy and data protection.
- Flag Apple and Google Play requirements.
- Request review for monetization features.

## Quality
- Prefer simple, readable code.
- Document significant architectural decisions.
- Add tests when appropriate.
- Never claim that unexecuted tests passed.
- Report failures transparently.

## Project Memory & Continuity

### Project memory
- `docs/project-status.md` is the primary entry point for a new ChatGPT assistant resuming Arcaday without access to previous conversations.
- Keep it self-contained and faithful to the project's latest verified state.

### Required updates
Codex must update `docs/project-status.md` when a mission results in:
- Completion of a significant milestone.
- An important environment change.
- A change to the Git or CI/CD workflow.
- A major new feature.
- A roadmap change.
- A change to the next planned action.

Do not update this file for every minor operation.

### Architectural decisions
- Document every significant architectural decision in `docs/architecture/decisions.md`.
- Preserve each decision's context, rationale, and status.

### Accuracy
- Never invent completed features, successful tests, Pull Requests, deployments, or adopted decisions.
- Distinguish verified facts from reported information, and explicitly mark what remains unconfirmed.

### Continuity review
Before finishing a significant mission, Codex must:
1. Check whether `docs/project-status.md` needs updating.
2. Check whether `docs/architecture/decisions.md` needs updating.
3. Make the necessary updates within the mission's authorized scope. If an explicit file restriction prevents an update, report the pending update without modifying that file.
4. Include memory updates in the same commit as the related work when appropriate and when committing is authorized.
5. Explicitly report which documents were updated.

Memory updates must never automatically trigger a publication, Pull Request, merge, or deployment. Existing security rules and approval requirements still apply.

### Loop prevention
- A documentation update alone must not automatically trigger another documentation update.
- Do not create additional commits solely to refresh timestamps.
