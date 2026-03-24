# Contributing Guide

Thank you for your interest in contributing to CryptoPrices! This guide will help you get started.

## Development Setup

1. Clone the repository
```bash
git clone <repository-url>
cd cryptocurrency-prices
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

4. Open http://localhost:3000

## Code Standards

### TypeScript
- Always use TypeScript. Avoid `any` types
- Use strict mode (enabled by default)
- Create interfaces for all data structures
- Use type over interface when appropriate

### React Components
- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Memoize expensive computations with `useMemo`
- Avoid inline function definitions in render

### File Organization
```
component/
├── Component.tsx       # Main component
├── Component.test.tsx # Tests (future)
└── useComponentState.ts # Custom hooks (if needed)
```

### Naming Conventions
- Components: PascalCase (`CryptoCard.tsx`)
- Files: Match component name exactly
- Functions/constants: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase with `I` prefix for interfaces (optional)

## Making Changes

### 1. Create a Feature Branch
```bash
git checkout -b feat/feature-name
# or
git checkout -b fix/bug-name
```

### 2. Commit Messages
Follow conventional commits format:
```
feat: Add new cryptocurrency search functionality
fix: Resolve chart rendering issue on mobile
refactor: Simplify crypto service architecture
docs: Update API documentation
style: Format code with Prettier
test: Add unit tests for formatting utilities
```

### 3. Keep Commits Atomic
Each commit should be a single, complete change
- Good: "Add useAsync hook"
- Bad: "Update various files"

### 4. Push and Create Pull Request
```bash
git push origin feat/feature-name
```

## Testing Your Changes

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

### Build Verification
```bash
npm run build
```

## Code Review Checklist

Before submitting a PR, ensure:
- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] No console errors/warnings in dev
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Error states handled gracefully
- [ ] Loading states implemented
- [ ] Component reusable where possible
- [ ] Clear commit messages
- [ ] README updated if applicable

## Project Structure

```
src/
├── components/       # Reusable UI components
├── features/         # Redux slices
├── hooks/            # Custom React hooks
├── pages/            # Page-level components (routes)
├── services/         # API and external services
├── utils/            # Utility functions
├── App.tsx           # Root component
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Common Tasks

### Adding a New API Endpoint

1. Add method to `cryptoService.ts`:
```typescript
async getNewData(params: any): Promise<Data[]> {
  const cacheKey = `newData-${JSON.stringify(params)}`
  const cached = this.getFromCache<Data[]>(cacheKey)
  if (cached) return cached

  try {
    const response = await this.api.get('/endpoint', { params })
    this.setCache(cacheKey, response.data)
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw new Error('Failed to fetch data')
  }
}
```

2. Add Redux thunk to `cryptoSlice.ts`:
```typescript
export const fetchNewData = createAsyncThunk(
  'crypto/fetchNewData',
  async ({ params }: { params: any }) => {
    return await cryptoService.getNewData(params)
  }
)
```

3. Add reducer cases for the thunk

### Adding a New Component

1. Create component file:
```typescript
interface MyComponentProps {
  title: string
  onAction?: () => void
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  onAction 
}) => {
  return (
    <div>
      {title}
    </div>
  )
}
```

2. Add proper TypeScript props interface
3. Add JSDoc comments for complex logic
4. Export from components barrel if creating a group

### Adding Styling

Use Tailwind CSS classes:
```typescript
<div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
</div>
```

Extend Tailwind in `tailwind.config.js` for custom colors:
```javascript
extend: {
  colors: {
    crypto: {
      primary: '#0066cc',
    }
  }
}
```

## Performance Tips

- Lazy load images with `loading="lazy"`
- Use Redux selectors efficiently
- Memoize components with `React.memo` if needed
- Use `useCallback` for event handlers
- Profile with React DevTools

## Debugging

### Redux DevTools
Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools-extension) to debug state changes

### React DevTools
Use [React Developer Tools](https://react-devtools-tutorial.vercel.app/) to inspect components

### API Debugging
Check Network tab in browser DevTools to inspect API calls

## Common Issues

### "Module not found" errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check import paths are correct
- Ensure all exports are in place

### TypeScript errors
- Run `npm run type-check` to see all errors
- Check tsconfig.json for proper settings
- Import types with `import type { Type }`

### CSS not applying
- Ensure Tailwind CSS is imported in `index.css`
- Use exact color values from config
- Clear build cache: `rm -rf dist/`

## Performance Benchmarks

Target metrics:
- Lighthouse Performance: 90+
- Initial bundle size: < 300KB gzipped
- API response time: < 500ms
- Page load time: < 2 seconds

## Questions?

- Check existing code for examples
- Review API documentation
- Look at similar features already implemented
- Create an issue for bugs or questions

## Thank You!

Your contributions help make CryptoPrices better for everyone! 🚀
