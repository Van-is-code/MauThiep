# Deploy to Vercel - Complete Guide

## Problem on Vercel

After deploying to Vercel, template files return 404 or don't load in iframes. This is because:

1. **Development vs Production Difference**
   - Local: Vite dev server serves files with custom plugin
   - Vercel: Static file hosting from `public/` folder

2. **Template Path Issues**
   - HTML files from HTTrack have relative paths that don't work on static hosting
   - Resource links in HTML may fail to load

3. **Static File Serving**
   - Vercel automatically serves `public/` folder as root
   - `/templates/T01/...` maps to `public/templates/T01/...`

## Solution - Production Setup

### Step 1: Vercel Configuration Files

**Created:**
- `vercel.json` - Build settings and headers
- `.vercelignore` - Files to ignore during deployment
- `api/template.ts` - API endpoint to serve templates

### Step 2: How It Works on Vercel

```
1. User views template
   ↓
2. iframe tries to load /templates/T01/jmiiwedding.com/.../index.html
   ↓
3. Vercel checks URL:
   - Is file in public/templates/? YES → Serve directly ✅
   - Is file not found? Try API endpoint /api/template?url=...
   ↓
4. API endpoint:
   - Reads file from server
   - Sets proper headers
   - Returns content
```

### Step 3: Fallback Mechanism

TemplateFrame component now:
1. **Tries direct path first** (faster)
2. **Falls back to API** if direct path fails
3. **Shows error** only if both fail

```tsx
// Try direct path
<iframe src="/templates/T01/..." />

// If fails → Try API
<iframe src="/api/template?url=/templates/T01/..." />

// If both fail → Show error + link to open in new tab
```

## Deployment Steps

### 1. Connect to Vercel

**Option A: Using Vercel CLI**
```bash
npm i -g vercel
vercel login
vercel
```

**Option B: Connect GitHub Repository**
1. Go to https://vercel.com/new
2. Import GitHub repository
3. Click "Import"

### 2. Build Settings

Vercel should auto-detect:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables

Add to Vercel dashboard if needed:
- No environment variables required for basic setup

### 4. Deploy

```bash
# Automatic: Push to main branch
git push origin main

# Manual: Deploy via CLI
vercel --prod
```

## File Structure for Vercel

```
public/
├── templates/           ← All template HTML files
│   ├── T01/
│   ├── T02/
│   └── ...T12/
├── images/             ← Template preview images
│   ├── T01.png
│   ├── T02.png
│   └── ...T12.png
├── data.json           ← Template metadata
└── index.html          ← Served by Vite

api/
└── template.ts         ← API endpoint for fallback

src/
├── components/
│   └── TemplateViewer.tsx    ← Updated with fallback
├── utils/
│   └── templateUrl.ts        ← URL resolution
└── ...
```

## Verification Checklist

Before deploying:

- [ ] All templates in `public/templates/` folder
- [ ] All images in `public/images/` folder
- [ ] `vercel.json` exists
- [ ] `api/template.ts` exists
- [ ] `TemplateViewer.tsx` has fallback logic
- [ ] `data.json` has correct paths (starting with `/`)
- [ ] `.vercelignore` exists

After deploying:

- [ ] Build succeeds (check Vercel dashboard)
- [ ] Gallery page loads (no 404s in console)
- [ ] Images display correctly
- [ ] Click "Preview" button → iframe loads
- [ ] Try opening template in new tab → works
- [ ] Check Network tab → templates load (direct or via API)

## Troubleshooting

### Templates return 404

1. Check Vercel deployment log
   - Look for build errors
   - Check if `public/templates` is included

2. Verify file paths
   ```bash
   # Check locally first
   ls -la public/templates/
   ```

3. Check network requests
   - Open DevTools → Network tab
   - Try to load a template
   - See if request returns 404 or error

### Templates load but don't display

1. Check iframe console
   - Right-click iframe → Inspect
   - Check Console for errors

2. Issue: Relative paths in HTML
   - HTTrack HTML has `../` paths
   - These don't work in iframes on different paths
   - Need to update HTML files or use API proxy

3. Solution: Use API endpoint
   - Already implemented in `api/template.ts`
   - TemplateViewer component tries API as fallback

### API endpoint returns 500

1. Check Vercel logs
   ```bash
   vercel logs
   ```

2. Verify API path resolving
   - Issue: May be accessing wrong file path
   - Check `api/template.ts` security checks

3. Check file permissions
   - Ensure `public/templates` files are readable

## Optimization Tips

### 1. Reduce Build Size
```bash
# The large template files will be in dist/
# Vercel handles this fine
# No optimization needed unless > 100MB
```

### 2. Cache Headers
Already configured in `vercel.json`:
- Templates: 1 hour cache
- Images: 1 year cache (immutable)

### 3. Monitor Performance
Check Vercel dashboard:
- Build time
- Deployment size
- Function invocations

## API Endpoint Details

**Endpoint**: `GET /api/template`

**Parameters**:
```
url: string (required)
  - Path to template file
  - Must contain '/templates/'
  - Must end with '.html'
  - Example: '/templates/T01/jmiiwedding.com/dathaaaaa/index.html'
```

**Response**:
```
Content-Type: text/html; charset=utf-8
Body: HTML file content
```

**Security**:
- ✅ Only allows `/templates/*.html` files
- ✅ Prevents directory traversal attacks
- ✅ Validates file exists
- ✅ Sets proper CORS headers

## Continuous Deployment

### Auto-deploy on Git Push

```bash
# Push to main branch
git add .
git commit -m "Update"
git push origin main

# Vercel automatically:
# 1. Runs npm install
# 2. Runs npm run build
# 3. Deploys dist/ folder
# 4. Makes api/ routes available
```

### Preview Deployments

Each branch gets a preview URL:
- Click "Visit" in Vercel dashboard
- Share with team for testing
- No impact on production

## Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| **404 on templates** | Files not deployed | Check `public` folder in Vercel logs |
| **iframe blank** | API endpoint error | Check `/api/template` works |
| **CORS error** | Headers missing | Already fixed in `vercel.json` |
| **Images missing** | Wrong paths | Verify `public/images` folder |
| **Build fails** | Export errors | Check local `npm run build` |

## Summary

✅ Works locally via Vite plugin  
✅ Works on Vercel via:
   - Direct static file serving
   - API endpoint fallback
   - Proper header configuration  
✅ Zero downtime deployment  
✅ Preview URLs for testing  
✅ Automatic HTTPS  

## Next Steps

1. Push code to GitHub
2. Connect GitHub to Vercel
3. Set production domain
4. Enable auto-deploy

**That's it! Your app is live!** 🚀
