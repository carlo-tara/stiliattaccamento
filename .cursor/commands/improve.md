# Code Improvement

## Objective

Improve code quality through refactoring, edge case testing, and standards verification.

## Process

1. Analyse code quality:
   - Function size (functions > 50 lines)
   - Code duplication
   - Missing docstrings
   - Missing type hints
   - Complex logic without comments
   - Missing analytics tracking for user actions
   - Direct analytics provider calls (should use abstraction layer)
2. Generate improvement suggestions
3. Apply improvements (with user approval)
4. Run tests to verify improvements

## Checklist

- [ ] Code quality analysed
- [ ] Improvement suggestions generated
- [ ] Improvements applied (with approval)
- [ ] Tests run to verify improvements
- [ ] All tests passing after improvements
- [ ] Analytics tracking verified (if applicable)
- [ ] Analytics abstraction layer used (not direct provider calls)

## Expected Output

- Improvement suggestions
- Code improvements applied
- Test results after improvements

## Usage

```
/improve
```

## Notes

- Focuses on **general code improvements**
- For automated refactoring of completed tasks, see Refactor Bot (`/bot_201_refactor`)
- For code review, see `/review`
- Always verify tests pass after improvements

