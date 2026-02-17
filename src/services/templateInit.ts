/**
 * Template Initialization Service
 * Preloads templates when the application starts
 * Useful for ensuring data is ready before components render
 */

import templateService from './templateService';

let initPromise: Promise<void> | null = null;

/**
 * Initialize and preload all templates
 * Call this once during app startup
 */
export const initializeTemplates = async (): Promise<void> => {
  // Prevent multiple initialization attempts
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      console.log('[TemplateInit] Starting template preload...');
      await templateService.preload();
      console.log('[TemplateInit] Templates preloaded successfully');
    } catch (error) {
      console.error('[TemplateInit] Failed to preload templates:', error);
      // Don't throw - let components handle missing data gracefully
    }
  })();

  return initPromise;
};

/**
 * Get the initialization promise
 * Useful if you need to wait for initialization to complete
 */
export const getInitPromise = (): Promise<void> | null => {
  return initPromise;
};

/**
 * Check if templates are already loaded
 */
export const isTemplatesLoaded = (): boolean => {
  if (!initPromise) return false;
  // If promise exists, templates might be in the process of loading
  return true;
};

/**
 * Reset initialization (useful for testing)
 */
export const resetInitialization = (): void => {
  initPromise = null;
  templateService.clearCache();
};
