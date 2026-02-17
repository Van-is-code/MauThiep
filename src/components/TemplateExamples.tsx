/**
 * Example component showing how to use the Template Service
 * This file demonstrates best practices for integrating the service
 */

import React from 'react'
import { useTemplates, useTemplatesPage, useSearchTemplates } from '../hooks/useTemplates'

/**
 * Example 1: Simple component to list all templates
 */
export const SimpleTemplateList = () => {
  const { templates, loading, error } = useTemplates()

  if (loading) return <div className="loading">Loading templates...</div>
  if (error) return <div className="error">Error: {error.message}</div>
  if (!templates.length) return <div>No templates found</div>

  return (
    <div className="template-list">
      {templates.map(template => (
        <div key={template.id} className="template-item">
          <h3>{template.title}</h3>
          <img src={template.image} alt={template.title} />
          <a href={template.url} target="_blank" rel="noopener noreferrer">
            View Template
          </a>
        </div>
      ))}
    </div>
  )
}

/**
 * Example 2: Component with pagination
 */
export const PaginatedTemplateGallery = ({ itemsPerPage = 6 }) => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const { templates, loading, error, total, hasMore } = useTemplatesPage(
    currentPage,
    itemsPerPage
  )

  return (
    <div className="gallery-container">
      <div className="gallery-grid">
        {templates.map(template => (
          <div key={template.id} className="gallery-item">
            <img src={template.image} alt={template.title} />
            <h3>{template.title}</h3>
          </div>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          First
        </button>

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </button>

        <span className="page-info">
          Page {currentPage} of {Math.ceil(total / itemsPerPage)}
        </span>

        <button
          disabled={!hasMore}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>

        <button
          disabled={!hasMore}
          onClick={() => setCurrentPage(Math.ceil(total / itemsPerPage))}
        >
          Last
        </button>
      </div>
    </div>
  )
}

/**
 * Example 3: Search component
 */
export const TemplateSearch = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const { results, loading } = useSearchTemplates(searchTerm)

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search templates (e.g., T01, T02)..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading && <p>Searching...</p>}

      {searchTerm && results.length === 0 && (
        <p>No templates found for "{searchTerm}"</p>
      )}

      <div className="search-results">
        {results.map(template => (
          <div key={template.id} className="search-result-item">
            <h4>{template.title}</h4>
            <p>{template.url}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Example 4: Combined component with search + pagination
 */
export const AdvancedTemplateGallery = ({ itemsPerPage = 6 }) => {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')

  // Load all templates or search results depending on search term
  const { templates, loading, error, total, hasMore } = useTemplatesPage(
    currentPage,
    itemsPerPage
  )
  const { results: searchResults } = useSearchTemplates(searchTerm)

  // Use search results if searching, otherwise use paginated templates
  const displayTemplates = searchTerm ? searchResults : templates
  const hasSearch = searchTerm.trim().length > 0

  return (
    <div className="advanced-gallery">
      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value)
            setCurrentPage(1) // Reset to page 1 when searching
          }}
          className="search-input"
        />
      </div>

      {/* Display Status */}
      {!hasSearch && (
        <p className="status">
          Showing {(currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, total)} of {total} templates
        </p>
      )}

      {hasSearch && (
        <p className="status">
          Found {displayTemplates.length} results for "{searchTerm}"
        </p>
      )}

      {/* Error Message */}
      {error && <div className="error">Error: {error.message}</div>}

      {/* Loading State */}
      {loading && <div className="loading">Loading templates...</div>}

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {displayTemplates.map(template => (
          <figure key={template.id} className="gallery-card">
            <img src={template.image} alt={template.title} />
            <figcaption>
              <h3>{template.title}</h3>
              <a
                href={template.url}
                target="_blank"
                rel="noopener noreferrer"
                className="view-btn"
              >
                View Template
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* No Results */}
      {displayTemplates.length === 0 && !loading && (
        <div className="no-results">
          {hasSearch ? "No templates found" : "No templates available"}
        </div>
      )}

      {/* Pagination - Only show if not searching */}
      {!hasSearch && displayTemplates.length > 0 && (
        <div className="pagination-controls">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            First
          </button>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Previous
          </button>

          <span className="page-info">
            Page {currentPage}
          </span>

          <button
            disabled={!hasMore}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>

          <button
            disabled={!hasMore}
            onClick={() => setCurrentPage(Math.ceil(total / itemsPerPage))}
          >
            Last
          </button>
        </div>
      )}
    </div>
  )
}

export default AdvancedTemplateGallery
