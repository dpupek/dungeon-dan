# Contributing to Dan's Dungeon

All code changes must be tied to a GitHub issue in this repository.

## Required workflow

1. Start from an existing GitHub issue. If the work is not tracked yet, create the issue first.
2. Create a branch that includes the issue number.
3. Make the change on that branch.
4. Open a pull request to `main`.
5. Reference the issue in the PR body using `Closes #<issue-number>` or `Refs #<issue-number>`.
6. Wait for review and required checks before merge.

The repository is configured to require pull requests for non-admin contributors. A PR policy check will fail if the pull request does not reference an issue number.

## Branch naming

Use one of these formats:

- `issue-12-walking-animation`
- `feature/12-walking-animation`
- `fix/12-room-edge-platforms`

The important part is the issue number.

## Commit guidance

- Keep commits focused and scoped.
- Mention the issue number in commit messages when practical.
- Do not mix unrelated cleanup into the same branch unless the repo is broken without it.

## Validation

Run these before opening a PR:

- `npm run build`
- `npm test`

If the change affects asset loading or deployment behavior, also verify the Pages-hosted path behavior.

## Finding conventions

Start here:

- `README.md`
- `AGENTS.md`
- `docs/gameplay-architecture.md`
- `docs/room-authoring.md`
- `docs/debugging-checklist.md`
- `docs/art-pipeline.md`
- `docs/asset-inventory.md`

## Contributor instructions by workflow

### Using Codex or another AI agent

- Read `AGENTS.md` before changing code.
- Tell the agent which GitHub issue it is working on.
- Keep the agent scoped to one issue at a time.
- Require the agent to preserve gameplay behavior unless the issue explicitly changes gameplay.
- Require the agent to cite the issue number in branch names, PR text, and any planning docs it creates.
- Review the final diff yourself before opening the PR.

Suggested prompt starter:

`Work on issue #12 in E:\\Sandbox\\dungeon-dan. Follow AGENTS.md and CONTRIBUTING.md. Keep changes scoped to that issue, run build and test, and prepare a PR summary that closes #12.`

### Using non-agentic development

- Read `README.md` and `AGENTS.md` first.
- Review the issue and acceptance criteria before writing code.
- Search the existing docs before inventing a new pattern.
- Keep the branch focused on a single issue.
- Run build and test locally before opening the PR.
- Reference the issue in the PR body with `Closes #<issue-number>`.

## Pull request expectations

A good PR should include:

- a short summary of the change
- the linked issue number
- validation performed
- screenshots or short notes if the change affects visuals or gameplay feel

## What not to do

- Do not push directly to `main` unless you are the repo owner operating under the admin exception.
- Do not open PRs without an issue reference.
- Do not weaken tests to hide a bug.
- Do not silently change naming away from `Dan's Dungeon`.
