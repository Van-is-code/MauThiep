import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

/**
 * Plugin to serve template HTML files without Vite's HTML parsing
 * This prevents parse errors from malformed HTTrack-generated HTML
 */
const rawTemplatesPlugin = {
  name: 'raw-templates',
  
  configResolved(config) {
    this.config = config
  },

  // Handle URLs requesting template files
  async resolveId(id) {
    // If it's a template file, let us handle it
    if (id.includes('/templates/') && id.endsWith('.html')) {
      return this.resolveId(id)
    }
  },

  // Custom middleware for dev server
  configureServer(server) {
    return () => {
      server.middlewares.use((req, res, next) => {
        // Intercept requests for template HTML files
        if (req.url.includes('/templates/') && req.url.endsWith('.html')) {
          try {
            // Strip query params
            const filePath = req.url.split('?')[0]
            const fullPath = path.join(process.cwd(), 'public', filePath)
            
            // Check if file exists
            if (fs.existsSync(fullPath)) {
              // Read file directly
              const content = fs.readFileSync(fullPath, 'utf-8')
              res.setHeader('Content-Type', 'text/html; charset=utf-8')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(content)
              return
            }
          } catch (error) {
            console.error('Template serve error:', error.message)
          }
        }
        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [rawTemplatesPlugin, react()],
  server: {
    port: 5173,
    open: true
  }
})
