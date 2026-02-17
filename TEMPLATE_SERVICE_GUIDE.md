# Template Service - Background Service Guide

A background service for managing and loading wedding invitation templates. This service handles data loading, caching, and provides a clean API for React components.

## Features

✅ **Singleton Pattern** - Single instance across the app  
✅ **Automatic Caching** - Cache templates after first load  
✅ **Loading Management** - Handle concurrent load requests  
✅ **Error Handling** - Proper error management and logging  
✅ **Pagination Support** - Built-in pagination helper  
✅ **Search Functionality** - Search templates by keyword  
✅ **React Hooks** - Custom hooks for easy component integration  
✅ **Preloading** - Initialize templates on app startup  

## Architecture

```
src/
├── services/
│   ├── templateService.ts       # Core singleton service
│   ├── templateInit.ts          # Initialization handler
├── hooks/
│   ├── useTemplates.ts          # React hooks for components
│   └── useTemplateInitialize.ts # App initialization hook
```

## Service Files

### 1. `templateService.ts`
Core service that manages templates data and provides API methods.

**Key Methods:**
- `loadTemplates()` - Load templates from data.json
- `getTemplates()` - Get all templates
- `getTemplateById(id)` - Get template by ID
- `getTemplateByTitle(title)` - Get template by title
- `searchTemplates(keyword)` - Search templates
- `getTemplatesByPage(page, pageSize)` - Get paginated templates
- `getTemplateCount()` - Get total template count
- `preload()` - Preload all templates
- `clearCache()` - Clear cached templates

### 2. `templateInit.ts`
Handles initialization and preloading of templates when the app starts.

**Key Functions:**
- `initializeTemplates()` - Start preloading templates
- `getInitPromise()` - Get initialization promise
- `isTemplatesLoaded()` - Check if templates are loaded
- `resetInitialization()` - Reset initialization (testing)

### 3. `useTemplates.ts`
React hooks for easy integration in components.

**Available Hooks:**
- `useTemplates()` - Load all templates
- `useTemplateById(id)` - Load single template by ID
- `useTemplatesPage(page, pageSize)` - Load templates with pagination
- `useSearchTemplates(keyword)` - Search templates
- `useTemplateInitialize()` - Initialize on app startup

## Usage Examples

### 1. Initialize Templates on App Startup

In your main `App.tsx`:

```tsx
import React from 'react'
import { useTemplateInitialize } from './hooks/useTemplateInitialize'

function App() {
  // Preload templates when app starts
  useTemplateInitialize()

  return (
    <div>
      {/* Your app content */}
    </div>
  )
}

export default App
```

### 2. Load All Templates in a Component

```tsx
import { useTemplates } from '../hooks/useTemplates'

function TemplateList() {
  const { templates, loading, error } = useTemplates()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {templates.map(template => (
        <div key={template.id}>
          <h3>{template.title}</h3>
          <img src={template.image} alt={template.title} />
        </div>
      ))}
    </div>
  )
}

export default TemplateList
```

### 3. Get Single Template by ID

```tsx
import { useTemplateById } from '../hooks/useTemplates'

function TemplateDetail({ templateId }: { templateId: number }) {
  const { template, loading, error } = useTemplateById(templateId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!template) return <div>Template not found</div>

  return (
    <div>
      <h1>{template.title}</h1>
      <a href={template.url} target="_blank">View Template</a>
    </div>
  )
}

export default TemplateDetail
```

### 4. Pagination (Gallery Component)

```tsx
import { useTemplatesPage } from '../hooks/useTemplates'

function Gallery() {
  const [currentPage, setCurrentPage] = React.useState(1)
  const { templates, loading, error, total, hasMore } = useTemplatesPage(
    currentPage,
    6 // 6 templates per page
  )

  return (
    <div>
      <div className="gallery">
        {templates.map(template => (
          <div key={template.id} className="card">
            <img src={template.image} alt={template.title} />
            <h3>{template.title}</h3>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={!hasMore}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Gallery
```

### 5. Search Templates

```tsx
import { useState } from 'react'
import { useSearchTemplates } from '../hooks/useTemplates'

function SearchTemplates() {
  const [keyword, setKeyword] = useState('')
  const { results, loading, error } = useSearchTemplates(keyword)

  return (
    <div>
      <input
        type="text"
        placeholder="Search templates..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      {loading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}

      <div className="results">
        {results.map(template => (
          <div key={template.id}>{template.title}</div>
        ))}
      </div>
    </div>
  )
}

export default SearchTemplates
```

### 6. Direct Service Usage

If you need to use the service directly without React hooks:

```tsx
import templateService from '../services/templateService'

// Load templates
const templates = await templateService.getTemplates()

// Get single template
const template = await templateService.getTemplateById(1)

// Search
const results = await templateService.searchTemplates('T01')

// Paginate
const { templates: pageTemplates, total } = await templateService.getTemplatesByPage(1, 6)
```

## How It Works

### 1. **On App Startup**
```
useTemplateInitialize() called
    ↓
initializeTemplates() called
    ↓
templateService.preload() called
    ↓
fetch('/data.json')
    ↓
Data cached in memory
    ↓
Ready for use
```

### 2. **Component Hook Usage**
```
Component mounts
    ↓
useTemplates() called
    ↓
Check cache first
    ↓
If cached: Return immediately
    ↓
If not cached: Fetch and cache
    ↓
Component renders with data
```

### 3. **Pagination Flow**
```
Page 1 requested
    ↓
Load all templates (if not cached)
    ↓
Calculate page slice (items 0-5)
    ↓
Return sliced data + total count
    ↓
Component renders with page data
```

## Performance Benefits

✅ **Reduced Network Calls** - Data fetched once, cached in memory  
✅ **Faster Load Times** - Preloading on app startup  
✅ **Concurrent Load Prevention** - Multiple hooks won't trigger multiple fetches  
✅ **Built-in Debouncing** - Search debounced to 300ms  
✅ **Singleton Pattern** - Single service instance across entire app  

## TypeScript Support

All hooks and services are fully typed:

```tsx
interface Template {
  id: number
  title: string
  url: string
  image: string
}

const { templates, loading, error }: UseTemplatesResult = useTemplates()
```

## Error Handling

All hooks and methods include error handling:

```tsx
const { templates, error } = useTemplates()

if (error) {
  console.error(error.message)
  // Show error UI
}
```

## Integration with Existing App

To integrate with your current App.tsx:

**Before:**
```tsx
useEffect(() => {
  fetch('/data.json')
    .then(res => res.json())
    .then(data => setTemplates(data.templates))
    .catch(err => console.error('Error:', err))
}, [])
```

**After:**
```tsx
const { templates } = useTemplates()
```

## Deployment Notes

✅ Service works with static/build deployments  
✅ No server required  
✅ Works with all Node.js servers (Vercel, Netlify, etc.)  
✅ Preloading works on client-side  
✅ No external dependencies required  

## Environment Support

Works in:
- ✅ Development (with Vite dev server)
- ✅ Production builds
- ✅ Static hosting (Vercel, Netlify, GitHub Pages, etc.)
- ✅ Docker containers
- ✅ Any Node.js server

## Testing

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { useTemplates } from '../hooks/useTemplates'

test('loads templates', async () => {
  const { result } = renderHook(() => useTemplates())

  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })

  expect(result.current.templates.length).toBeGreaterThan(0)
})
```

## Troubleshooting

### Templates not loading?
1. Check that `/data.json` is accessible
2. Check browser console for fetch errors
3. Verify JSON format is valid
4. Check that service has time to initialize

### Stale data?
Call `templateService.clearCache()` and reload

### Multiple loads happening?
Service automatically prevents concurrent loads via `loadPromise`

## Future Enhancements

Possible additions:
- 🔄 Auto-refresh data at intervals
- 📱 Offline support with localStorage
- 🔍 Advanced filtering
- 🏷️ Category/tag filtering
- ⭐ Favorites management
- 👤 User preferences
