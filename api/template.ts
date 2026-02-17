/**
 * API Route to serve template HTML files
 * Handles all templates from public/templates folder
 * 
 * Usage: GET /api/template?url=/templates/T01/jmiiwedding.com/dathaaaaa/index.html
 */

import { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { url } = req.query

    // Validate URL parameter
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid url parameter' })
    }

    // Security: Only allow access to template files
    if (!url.includes('/templates/') || !url.endsWith('.html')) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'public', url)

    // Security: Prevent directory traversal
    const normalizedPath = path.normalize(filePath)
    const publicPath = path.normalize(path.join(process.cwd(), 'public'))
    
    if (!normalizedPath.startsWith(publicPath)) {
      return res.status(403).json({ error: 'Access denied' })
    }

    // Check if file exists
    if (!fs.existsSync(normalizedPath)) {
      return res.status(404).json({ error: 'Template not found' })
    }

    // Read and serve the file
    const content = fs.readFileSync(normalizedPath, 'utf-8')

    // Set headers
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Access-Control-Allow-Origin', '*')

    return res.status(200).send(content)
  } catch (error) {
    console.error('Error serving template:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? String(error) : undefined
    })
  }
}
