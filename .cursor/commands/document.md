# Update Documentation

## Objective

Update project documentation files following the established documentation structure.

## Documentation Structure

### Standard Documentation (Project Root)

Standard documentation files remain in the project root:
- `README.md` - Project overview (< 150 lines)
- `CONTRIBUTING.md` - Development guidelines
- `STANDARDS.md` - Code standards
- `SECURITY.md` - Security policy and vulnerability reporting
- `.cursorrules` - AI development guidelines

### Extended Documentation (`docs/documentation/`)

Extended documentation files are located in `docs/documentation/`:
- `ARCHITECTURE.md` - Architecture documentation
- `API.md` - API documentation
- `DEPLOYMENT.md` - Deployment guide
- `STANDARD_PROJECT_FILES.md` - Reference for standard project files
- `.swagger.yml` - OpenAPI specification (Swagger)

**Note**: All other `.md` files must be created in `docs/` or its subdirectories, never in the project root.

## Process

1. Check current documentation files
2. Update standard documentation files (project root) if needed:
   - `README.md` - Project overview
   - `CONTRIBUTING.md` - Development guidelines
   - `STANDARDS.md` - Code standards
   - `SECURITY.md` - Security policy
   - `.cursorrules` - AI development guidelines
3. Update extended documentation files (`docs/documentation/`) if needed:
   - `ARCHITECTURE.md` - Architecture documentation
   - `API.md` - API documentation
   - `DEPLOYMENT.md` - Deployment guide
4. Verify all files are up-to-date
5. Verify file locations follow the documentation structure

## Files Updated

### Standard Documentation (Project Root)

- `README.md` - Project overview (< 150 lines)
- `CONTRIBUTING.md` - Development guidelines
- `STANDARDS.md` - Code standards
- `SECURITY.md` - Security policy and vulnerability reporting
- `.cursorrules` - AI development guidelines

### Extended Documentation (`docs/documentation/`)

- `ARCHITECTURE.md` - Architecture documentation
- `API.md` - API documentation
- `DEPLOYMENT.md` - Deployment guide
- `STANDARD_PROJECT_FILES.md` - Reference for standard project files
- `.swagger.yml` - OpenAPI specification (Swagger)

## Checklist

### Standard Documentation
- [ ] README.md updated (if needed)
- [ ] CONTRIBUTING.md updated (if needed)
- [ ] STANDARDS.md updated (if needed)
- [ ] SECURITY.md updated (if needed)
- [ ] .cursorrules updated (if needed)

### Extended Documentation
- [ ] ARCHITECTURE.md updated (if needed)
- [ ] API.md updated (if needed)
- [ ] DEPLOYMENT.md updated (if needed)
- [ ] STANDARD_PROJECT_FILES.md updated (if needed)

### Verification
- [ ] All files verified up-to-date
- [ ] File locations follow documentation structure
- [ ] British English used throughout

## Expected Output

- Documentation files updated
- Verification results
- Confirmation that file locations follow the structure

## Usage

```
/document
```

## Notes

- **File Location Rule**: All `.md` files must be created in `docs/` or its subdirectories, except standard files listed above
- **Standard Files**: `README.md`, `CONTRIBUTING.md`, `STANDARDS.md`, `SECURITY.md` remain in project root
- **Extended Documentation**: Architecture, API, deployment docs go in `docs/documentation/`
- **CHANGELOG.md**: Updated by Refactor Bot, not by this command
- **British English**: Use British English for consistency
- **README.md**: Should be < 150 lines

