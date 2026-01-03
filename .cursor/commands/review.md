# Code Review

## Objective

Perform comprehensive manual code review.

## Process

1. Review functionality:
   - Code works as expected
   - Edge cases handled
   - Error handling present
2. Review code quality:
   - Code is readable
   - Functions ≤ 50 lines
   - Descriptive names
   - DRY principle followed
3. Review security:
   - Input validation present
   - Parameterised queries used
   - Path validation present
   - No secrets hardcoded
4. Review testing:
   - RGR workflow followed
   - Tests added
   - Edge cases covered
5. Review documentation:
   - Docstrings present
   - Comments explain "why" (not "what")
   - British English used
6. Review analytics integration:
   - Analytics tracking added for user actions (if applicable)
   - Analytics events use abstraction layer (not direct provider calls)
   - Privacy and GDPR compliance (user consent, no PII)
   - Mobile-optimised (PWA support, performance-conscious)
7. Generate review report

## Checklist

- [ ] Functionality: Code works, edge cases handled, error handling present
- [ ] Code Quality: Readable, functions ≤ 50 lines, descriptive names, DRY
- [ ] Security: Input validation, parameterised queries, path validation, secrets in .env
- [ ] Testing: RGR followed, tests added, edge cases covered
- [ ] Documentation: Docstrings present, comments explain "why", British English
- [ ] Analytics: Tracking added for user actions (if applicable), abstraction layer used, privacy compliant

## Expected Output

- Review report in `docs/reviews/CODE_REVIEW_*.md`
- Checklist results
- Recommendations for improvements

## Usage

```
/review
```

## Notes

- This is a **manual** review command
- For automated batch reviews, see Refactor Bot (`/bot_201_refactor`)
- Review should be thorough and comprehensive
- Document all findings in review report

