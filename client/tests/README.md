# Frontend Testing Guide

This directory contains all testing infrastructure and test files for the MusicVista frontend application.

## 📁 Directory Structure

```
tests/
├── components/              # Component tests
│   ├── ArtistCard.test.tsx
│   ├── AlbumCard.test.tsx
│   ├── TrackCard.test.tsx
│   ├── StatCard.test.tsx
│   ├── Navigation.test.tsx
│   ├── ErrorBoundary.test.tsx
│   ├── Layout.test.tsx
│   ├── ArtistList.test.tsx
│   ├── AlbumList.test.tsx
│   └── TrackList.test.tsx
├── lib/                     # API and utility tests
│   ├── artistApi.test.ts
│   ├── albumApi.test.ts
│   ├── trackApi.test.ts
│   └── insightApi.test.ts
├── pages/                   # Page component tests
│   └── HomePage.test.tsx
├── mocks/                   # Mock data
│   └── mockData.ts
├── utils/                   # Test utilities
│   └── test-utils.tsx
├── setup.ts                 # Global test setup
├── vitest.d.ts              # TypeScript declarations
└── README.md                # This file
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- ArtistCard.test.tsx
```

### Run tests for specific component
```bash
npm test -- components/
```

### Run tests matching pattern
```bash
npm test -- --grep "Artist"
```

## 🛠️ Testing Stack

- **Vitest**: Fast unit test framework for Vite projects
- **@testing-library/react**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom matchers for DOM assertions
- **@testing-library/user-event**: Simulate user interactions
- **jsdom**: Browser environment simulation

## 📝 Writing Tests

### Component Testing Example

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { MyComponent } from '../../src/components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### API Testing Example

```typescript
import { describe, it, expect, vi } from 'vitest';
import { myApiFunction } from '../../src/lib/myApi';

describe('myApiFunction', () => {
  it('fetches data successfully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const result = await myApiFunction();
    expect(result.data).toBe('test');
  });
});
```

## 🎯 Best Practices

1. **Use Custom Render**: Always import `render` from `../utils/test-utils` to include necessary providers
2. **Use Relative Imports**: Import from source using `../../src/` prefix
3. **Mock External Dependencies**: Mock API calls, browser APIs, and third-party libraries
4. **Test User Behavior**: Focus on testing what users see and do, not implementation details
5. **Descriptive Test Names**: Use clear, descriptive test names that explain what is being tested
6. **Arrange-Act-Assert**: Structure tests with setup, action, and assertion phases
7. **Test Edge Cases**: Include tests for error states, empty states, and boundary conditions
8. **Keep Tests Isolated**: Each test should be independent and not rely on others

## 🧩 Available Utilities

### Test Utils (`utils/test-utils.tsx`)
- `render()`: Custom render with Router provider
- All exports from `@testing-library/react`

### Mock Data (`mocks/mockData.ts`)
- `mockArtist`: Single artist mock data
- `mockArtists`: Array of artist mock data
- `mockAlbum`: Single album mock data
- `mockAlbums`: Array of album mock data
- `mockTrack`: Single track mock data
- `mockTracks`: Array of track mock data
- `mockApiResponse()`: Helper to create API response structure

### Setup (`setup.ts`)
- Global test configuration
- DOM cleanup after each test
- Mock for `window.matchMedia`
- Mock for `IntersectionObserver`
- Mock for `fetch` API

## 📊 Test Coverage

### Current Coverage

**Components:**
- ✅ ArtistCard (10 tests)
- ✅ AlbumCard (11 tests)
- ✅ TrackCard (16 tests)
- ✅ StatCard (10 tests)
- ✅ Navigation (15 tests)
- ✅ ErrorBoundary (5 tests)
- ✅ Layout (10 tests)
- ✅ ArtistList (20 tests)
- ✅ AlbumList (18 tests)
- ✅ TrackList (19 tests)

**APIs:**
- ✅ artistApi (20+ tests)
- ✅ albumApi (17 tests)
- ✅ trackApi (15 tests)
- ✅ insightApi (4 tests)

**Pages:**
- ✅ HomePage (10 tests)

**Total: 200+ test cases**

### Run Coverage Report
```bash
npm run test:coverage
```

Coverage reports are generated in:
- Terminal output
- `coverage/` directory (HTML report)

### Coverage Goals
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## 🔍 Debugging Tests

### Run tests with verbose output
```bash
npm test -- --reporter=verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["test"],
  "console": "integratedTerminal"
}
```

### Use `screen.debug()`
```typescript
import { screen } from '../utils/test-utils';

it('debugs component', () => {
  render(<MyComponent />);
  screen.debug(); // Prints current DOM structure
});
```

### Filter specific test
```bash
npm test -- --grep "renders correctly"
```

## 📚 Testing Patterns

### Testing Links
```typescript
const link = screen.getByRole('link');
expect(link).toHaveAttribute('href', '/expected-path');
```

### Testing Images
```typescript
const img = screen.getByAltText('Image Alt') as HTMLImageElement;
expect(img.src).toContain('image-url');
```

### Testing Conditional Rendering
```typescript
expect(screen.getByText('Visible')).toBeInTheDocument();
expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
```

### Testing CSS Classes
```typescript
const element = screen.getByText('Styled');
expect(element).toHaveClass('expected-class');
```

### Testing API Calls
```typescript
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({ data: 'test' }),
});

await myApiCall();

expect(global.fetch).toHaveBeenCalledWith(
  expect.stringContaining('expected-url'),
  expect.any(Object)
);
```

## 🔧 Common Issues

### Issue: Test can't find Router context
**Solution**: Use `render` from `test-utils.tsx`, not directly from `@testing-library/react`

### Issue: matchMedia is not a function
**Solution**: Already handled in `setup.ts` - make sure it's imported in `vitest.config.ts`

### Issue: Fetch is not defined
**Solution**: Already mocked in `setup.ts` - use `vi.fn()` to override in individual tests

### Issue: Test timeout
**Solution**: Increase timeout in test:
```typescript
it('long test', async () => {
  // test code
}, 10000); // 10 second timeout
```

## 📈 Adding New Tests

### For a new component:
1. Create `tests/components/ComponentName.test.tsx`
2. Import from `../utils/test-utils`
3. Import component from `../../src/components/ComponentName`
4. Add mock data to `mocks/mockData.ts` if needed
5. Write tests following existing patterns

### For a new API function:
1. Create `tests/lib/apiName.test.ts`
2. Mock `global.fetch`
3. Test success and error cases
4. Test parameter handling

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Test Checklist

When writing tests for a component, make sure to test:
- [ ] Basic rendering with required props
- [ ] Optional props and default values
- [ ] User interactions (clicks, inputs, etc.)
- [ ] Conditional rendering
- [ ] Links and navigation
- [ ] Images and media
- [ ] CSS classes and styling
- [ ] Error states
- [ ] Edge cases (empty, null, undefined)
- [ ] Accessibility (ARIA attributes, roles)

When writing tests for an API function:
- [ ] Successful requests
- [ ] Failed requests (4xx, 5xx errors)
- [ ] Network errors
- [ ] Parameter validation
- [ ] Response parsing
- [ ] Error messages

---

**Happy Testing! 🎉**
