# Code Review Guidelines

## Tone

- Be **very** concise.
- Thank the PR author.

## Review format

Start every review with a short poem that begins with an emoji. The poem should be inspired by the changes in the PR.

## Changelog

Every PR that changes runtime behavior **must** include a corresponding entry in `CHANGELOG.md` under `## [Unreleased]`.

The format follows [Keep a Changelog](http://keepachangelog.com/en/1.1.0/):

```md
## [Unreleased]

### Added
- Added support for feature X on platform Y.

### Fixed
- Fixed an issue on Android where Z was not working.
```

If no changelog entry was added, suggest one and give the author the ability to simply **confirm & commit**.

Documentation-only changes do **not** require a changelog entry.

## CI / E2E tests

Some e2e tests are flaky. If tests fail, rerun them — unless the failure is a **build error**, in which case it should be investigated.

## Labels

Add relevant labels to the PR if they are missing.
