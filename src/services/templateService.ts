/**
 * Template Service
 * Manages loading and caching of wedding invitation templates
 */

export interface Template {
  id: number;
  title: string;
  url: string;
  image: string;
}

interface TemplateData {
  templates: Template[];
}

class TemplateService {
  private static instance: TemplateService;
  private templates: Template[] = [];
  private isLoading: boolean = false;
  private loadPromise: Promise<Template[]> | null = null;

  /**
   * Singleton pattern - get instance of service
   */
  static getInstance(): TemplateService {
    if (!TemplateService.instance) {
      TemplateService.instance = new TemplateService();
    }
    return TemplateService.instance;
  }

  /**
   * Load templates from data.json file
   * Returns cached data if already loaded
   */
  async loadTemplates(): Promise<Template[]> {
    // Return from cache if already loaded
    if (this.templates.length > 0) {
      return this.templates;
    }

    // Prevent multiple simultaneous loads
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    this.isLoading = true;

    this.loadPromise = (async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error(`Failed to load templates: ${response.statusText}`);
        }

        const data: TemplateData = await response.json();
        this.templates = data.templates;
        console.log(`Successfully loaded ${this.templates.length} templates`);
        return this.templates;
      } catch (error) {
        console.error('Error loading templates:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    })();

    return this.loadPromise;
  }

  /**
   * Get all templates
   */
  async getTemplates(): Promise<Template[]> {
    if (this.templates.length === 0) {
      await this.loadTemplates();
    }
    return this.templates;
  }

  /**
   * Get a single template by ID
   */
  async getTemplateById(id: number): Promise<Template | undefined> {
    const templates = await this.getTemplates();
    return templates.find(t => t.id === id);
  }

  /**
   * Get template by title
   */
  async getTemplateByTitle(title: string): Promise<Template | undefined> {
    const templates = await this.getTemplates();
    return templates.find(t => t.title.toLowerCase() === title.toLowerCase());
  }

  /**
   * Search templates by keyword
   */
  async searchTemplates(keyword: string): Promise<Template[]> {
    const templates = await this.getTemplates();
    const lowerKeyword = keyword.toLowerCase();
    return templates.filter(t =>
      t.title.toLowerCase().includes(lowerKeyword) ||
      t.url.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * Get total number of templates
   */
  async getTemplateCount(): Promise<number> {
    const templates = await this.getTemplates();
    return templates.length;
  }

  /**
   * Get templates by page for pagination
   */
  async getTemplatesByPage(
    page: number,
    pageSize: number = 6
  ): Promise<{ templates: Template[]; total: number }> {
    const allTemplates = await this.getTemplates();
    const total = allTemplates.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const templates = allTemplates.slice(start, end);

    return { templates, total };
  }

  /**
   * Preload all templates (useful for deployment)
   */
  async preload(): Promise<void> {
    try {
      await this.loadTemplates();
    } catch (error) {
      console.error('Failed to preload templates:', error);
    }
  }

  /**
   * Clear cache if needed
   */
  clearCache(): void {
    this.templates = [];
    this.loadPromise = null;
  }
}

// Export singleton instance
export default TemplateService.getInstance();

// Export the class for testing purposes
export { TemplateService };
