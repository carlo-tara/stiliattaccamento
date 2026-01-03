# Pre-Commit Checklist

## Objective

Prepare code for git commit with comprehensive checklist.

## Process

1. Run pre-commit checklist:
   - [ ] RGR workflow followed
   - [ ] All tests pass
   - [ ] Type hints present (Python)
   - [ ] Docstrings present (public functions/classes)
   - [ ] Functions ≤ 50 lines
   - [ ] All inputs validated
   - [ ] All queries parameterised
   - [ ] No secrets hardcoded
   - [ ] CHANGELOG.md updated (if feature complete)
   - [ ] British English used
2. Generate commit message (if all checks pass)
3. Suggest git commit command

## Commit Message Format

Semantic commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `security:` - Security fix
- `refactor:` - Code refactoring
- `docs:` - Documentation updates
- `test:` - Test additions/changes
- `version:` - Version bump

## Checklist

- [ ] RGR workflow followed
- [ ] All tests pass
- [ ] Type hints present (Python)
- [ ] Docstrings present (public functions/classes)
- [ ] Functions ≤ 50 lines
- [ ] All inputs validated
- [ ] All queries parameterised
- [ ] No secrets hardcoded
- [ ] CHANGELOG.md updated (if feature complete)
- [ ] British English used

## Expected Output

- Checklist results
- Commit message suggestion
- Git commit command suggestion

## Usage

```
/commit
```

## Notes

- Verify all checklist items before committing
- Use semantic commit messages
- Never commit secrets or sensitive data
- Update CHANGELOG.md for completed features

