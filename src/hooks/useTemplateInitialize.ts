import { useEffect } from 'react';
import { initializeTemplates } from './services/templateInit';

/**
 * Custom hook to initialize templates service
 * Use this in your main App component to preload templates on startup
 */
export const useTemplateInitialize = () => {
  useEffect(() => {
    initializeTemplates();
  }, []);
};
