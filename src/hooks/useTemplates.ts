/**
 * Custom React Hook for using Template Service
 * Handles loading state, error handling, and data caching
 */

import { useState, useEffect, useCallback } from 'react';
import templateService, { Template } from '../services/templateService';

interface UseTemplatesResult {
  templates: Template[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all templates
 */
export const useTemplates = (): UseTemplatesResult => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
  };
};

interface UseTemplateByIdResult {
  template: Template | undefined;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch a single template by ID
 */
export const useTemplateById = (id: number): UseTemplateByIdResult => {
  const [template, setTemplate] = useState<Template | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await templateService.getTemplateById(id);
        setTemplate(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [id]);

  return { template, loading, error };
};

interface UseTemplatesPageResult {
  templates: Template[];
  loading: boolean;
  error: Error | null;
  total: number;
  hasMore: boolean;
}

/**
 * Hook to fetch templates with pagination
 */
export const useTemplatesPage = (
  page: number,
  pageSize: number = 6
): UseTemplatesPageResult => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await templateService.getTemplatesByPage(page, pageSize);
        setTemplates(result.templates);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page, pageSize]);

  const hasMore = (page - 1) * pageSize + templates.length < total;

  return { templates, loading, error, total, hasMore };
};

interface UseSearchTemplatesResult {
  results: Template[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to search templates
 */
export const useSearchTemplates = (keyword: string): UseSearchTemplatesResult => {
  const [results, setResults] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await templateService.searchTemplates(keyword);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  return { results, loading, error };
};
