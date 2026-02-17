/**
 * Unit Tests for Template Service
 * Example tests showing how to test the service and hooks
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import templateService, { TemplateService } from '../services/templateService'
import {
  useTemplates,
  useTemplateById,
  useTemplatesPage,
  useSearchTemplates,
} from '../hooks/useTemplates'
import { initializeTemplates, resetInitialization } from '../services/templateInit'

// Mock data
const mockTemplates = [
  {
    id: 1,
    title: 'T01',
    url: '\\public\\templates\\T01\\jmiiwedding.com\\dathaaaaa\\index.html',
    image: '\\public\\images\\T01.png',
  },
  {
    id: 2,
    title: 'T02',
    url: '\\public\\templates\\T02\\invitations.jmiiwedding.com\\dohaa.html',
    image: '\\public\\images\\T02.png',
  },
]

// Setup fetch mock
global.fetch = vi.fn()

describe('TemplateService', () => {
  beforeEach(() => {
    resetInitialization()
    ;(global.fetch as any).mockClear()
  })

  it('should be a singleton', () => {
    const service1 = TemplateService.getInstance()
    const service2 = TemplateService.getInstance()
    expect(service1).toBe(service2)
  })

  it('should load templates from data.json', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const templates = await templateService.loadTemplates()

    expect(templates).toEqual(mockTemplates)
    expect(global.fetch).toHaveBeenCalledWith('/data.json')
  })

  it('should cache templates after first load', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    // First load
    await templateService.loadTemplates()
    expect(global.fetch).toHaveBeenCalledTimes(1)

    // Second load (should use cache)
    await templateService.loadTemplates()
    expect(global.fetch).toHaveBeenCalledTimes(1) // Still 1, no second call
  })

  it('should get template by ID', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const template = await templateService.getTemplateById(1)

    expect(template).toEqual(mockTemplates[0])
  })

  it('should search templates by keyword', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const results = await templateService.searchTemplates('T01')

    expect(results).toHaveLength(1)
    expect(results[0].id).toBe(1)
  })

  it('should get paginated templates', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const result = await templateService.getTemplatesByPage(1, 1)

    expect(result.templates).toHaveLength(1)
    expect(result.total).toBe(2)
  })

  it('should handle fetch errors gracefully', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

    await expect(templateService.loadTemplates()).rejects.toThrow('Network error')
  })
})

describe('useTemplates Hook', () => {
  beforeEach(() => {
    resetInitialization()
    ;(global.fetch as any).mockClear()
  })

  it('should load templates', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const { result } = renderHook(() => useTemplates())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.templates).toEqual(mockTemplates)
  })

  it('should handle errors', async () => {
    ;(global.fetch as any).mockRejectedValueOnce(new Error('Load failed'))

    const { result } = renderHook(() => useTemplates())

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    expect(result.current.error?.message).toBe('Load failed')
  })
})

describe('useTemplateById Hook', () => {
  beforeEach(() => {
    resetInitialization()
    ;(global.fetch as any).mockClear()
  })

  it('should load template by ID', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const { result } = renderHook(() => useTemplateById(1))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.template).toEqual(mockTemplates[0])
  })
})

describe('useTemplatesPage Hook', () => {
  beforeEach(() => {
    resetInitialization()
    ;(global.fetch as any).mockClear()
  })

  it('should load paginated templates', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const { result } = renderHook(() => useTemplatesPage(1, 1))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.templates).toHaveLength(1)
    expect(result.current.total).toBe(2)
    expect(result.current.hasMore).toBe(true)
  })
})

describe('useSearchTemplates Hook', () => {
  beforeEach(() => {
    resetInitialization()
    ;(global.fetch as any).mockClear()
  })

  it('should search templates', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    const { result } = renderHook(() => useSearchTemplates('T01'))

    // Wait for debounce and load
    await waitFor(() => {
      expect(result.current.results).toHaveLength(1)
    })

    expect(result.current.results[0].id).toBe(1)
  })

  it('should clear results when search is empty', () => {
    const { result } = renderHook(() => useSearchTemplates(''))

    expect(result.current.results).toHaveLength(0)
  })
})

describe('initializeTemplates', () => {
  beforeEach(() => {
    resetInitialization()
    ;(global.fetch as any).mockClear()
  })

  it('should preload templates on initialization', async () => {
    ;(global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ templates: mockTemplates }),
    })

    await initializeTemplates()

    const templates = await templateService.getTemplates()
    expect(templates).toEqual(mockTemplates)
  })
})
