# Run Tests

## Objective

Execute all tests (BDD, unit, integration, plugin tests).

## Process

1. Run BDD tests (`pytest -m feature`)
2. Run unit tests (`pytest -m unit`)
3. Run integration tests (`pytest -m integration`)
4. Run plugin tests (Kanban, Plugin System)
5. Generate test report
6. Show coverage report (if available)

## Test Types

### Core Tests
- **BDD**: Feature files in `business/test/bdd/` (`.feature` files)
- **Unit**: Unit tests in `business/test/unit/`
- **Integration**: Integration tests in `business/test/integration/`

### Plugin Tests
- **Kanban Plugin**: Tests in `backend/plugins/kanban/test/`
  - Unit tests: `test_kanban_*.py`
  - Integration tests: `test_kanban_integration.py`, `test_kanban_bot_runtime.py`
- **Plugin System**: Tests in `backend/plugins/test/`
  - Unit tests: `test_plugins_*.py`
  - Integration tests: `test_plugins_integration.py`

## Test Locations

```
business/test/
├── bdd/              # BDD feature tests
├── unit/             # Core unit tests (AppController, etc.)
└── integration/      # Core integration tests

backend/plugins/
├── kanban/test/      # Kanban plugin tests
│   ├── test_kanban_*.py
│   ├── test_kanban_integration.py
│   └── test_kanban_bot_runtime.py
└── test/             # Plugin system tests
    ├── test_plugins_*.py
    └── test_plugins_integration.py
```

## Checklist

- [ ] BDD tests executed
- [ ] Core unit tests executed
- [ ] Core integration tests executed
- [ ] Plugin tests executed (Kanban)
- [ ] Plugin system tests executed
- [ ] Analytics tests executed (if applicable)
- [ ] Test report generated
- [ ] Coverage report generated (if available)
- [ ] All tests passing

## Expected Output

- Test results (passed/failed)
- Test coverage report
- Detailed test output
- Plugin-specific test results

## Usage

```
/test
```

## Equivalent Terminal Commands

### Run All Tests
```bash
pytest -v
```

### Run Core Tests Only
```bash
pytest business/test/ -v
```

### Run Plugin Tests Only
```bash
# Kanban plugin tests
pytest backend/plugins/kanban/test/ -v

# Plugin system tests
pytest backend/plugins/test/ -v

# All plugin tests
pytest backend/plugins/ -v
```

### Run by Marker
```bash
pytest -m feature    # BDD tests
pytest -m unit       # Unit tests
pytest -m integration # Integration tests
```

### Run Specific Plugin Test
```bash
pytest backend/plugins/kanban/test/test_kanban_lock_manager.py -v
pytest backend/plugins/test/test_plugins_base_plugin.py -v
```

## Analytics Testing

When testing analytics integration:

- Verify analytics abstraction layer works correctly
- Test event tracking for user actions
- Verify privacy compliance (user consent, no PII)
- Test offline mode (PWA queue functionality)
- Verify mobile performance (non-blocking, battery efficient)

## Notes

- Run tests before committing code
- Verify all tests pass (core + plugins)
- Check coverage report for gaps
- Use markers: `-m feature`, `-m unit`, `-m integration`
- Plugin tests are co-located with plugin code for better modularity
- Each plugin has its own `conftest.py` with plugin-specific fixtures
- Analytics tests verify abstraction layer, not direct provider integration

