# Version Management

## Objective

Manage version numbers and versioning.

## Process

1. Read current version from `.env` (VERSION and BUILD)
2. Display current version
3. Optionally increment version:
   - MAJOR: Breaking changes
   - MINOR: New features
   - BUILD: Bug fixes
4. Update `.env` file
5. Update CHANGELOG.md (if version changed)

## Version Format

`MAJOR.MINOR.BUILD` (e.g., `0.1.0.42`)

- **MAJOR**: Breaking changes, incompatible API changes
- **MINOR**: New features, backward compatible
- **BUILD**: Bug fixes, patches, every commit/release

## Checklist

- [ ] Current version read from .env
- [ ] Version displayed
- [ ] Version incremented (if requested)
- [ ] .env updated
- [ ] CHANGELOG.md updated (if version changed)

## Expected Output

- Current version displayed
- Version incremented (if requested)
- `.env` updated
- CHANGELOG.md updated (if version changed)

## Usage

```
/version
```

## Notes

- Version format: MAJOR.MINOR.BUILD
- MAJOR increments: Breaking changes
- MINOR increments: New features (backward compatible)
- BUILD increments: Bug fixes, every commit
- Version managed in `.env` file

