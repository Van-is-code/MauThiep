/**
 * Template Viewer Component
 * Safely displays wedding invitation templates using iframe
 * This prevents parsing issues with malformed HTML from HTTrack
 */

import React, { useState } from 'react'

export interface Template {
  id: number
  title: string
  url: string
  image: string
}

interface TemplateViewerProps {
  template: Template
  onClose?: () => void
}

/**
 * Opens template in new tab (for direct access)
 */
export const TemplateLink: React.FC<{ template: Template }> = ({ template }) => {
  return (
    <a 
      href={template.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="template-link"
    >
      View Full Page →
    </a>
  )
}

/**
 * Displays template in an iframe (recommended)
 */
export const TemplateFrame: React.FC<TemplateViewerProps> = ({ 
  template, 
  onClose 
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUrl, setCurrentUrl] = useState(template.url)
  const [attemptedFallback, setAttemptedFallback] = useState(false)

  const handleIframeError = () => {
    setLoading(false)
    
    // If we haven't tried fallback yet and current URL is direct path
    if (!attemptedFallback && template.url.startsWith('/')) {
      setAttemptedFallback(true)
      // Try API endpoint as fallback
      setCurrentUrl(`/api/template?url=${encodeURIComponent(template.url)}`)
      setError(null)
      setLoading(true)
    } else {
      setError('Could not load template')
      console.error('Failed to load template:', template.url)
    }
  }

  return (
    <div className="template-frame-container">
      <div className="template-frame-header">
        <h3>{template.title}</h3>
        {onClose && (
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Close template"
          >
            ✕
          </button>
        )}
      </div>

      <div className="template-frame-wrapper">
        {loading && <div className="template-loading">Loading template...</div>}
        
        {error && (
          <div className="template-error">
            <p>Error loading template: {error}</p>
            <p style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
              Trying to open in new tab...
            </p>
            <TemplateLink template={template} />
          </div>
        )}

        {!error && (
          <iframe
            key={`${template.id}-${currentUrl}`}
            src={currentUrl}
            title={template.title}
            className="template-iframe"
            onLoad={() => setLoading(false)}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
          />
        )}
      </div>

      <div className="template-frame-footer">
        <TemplateLink template={template} />
      </div>
    </div>
  )
}

/**
 * Modal viewer for templates
 */
export const TemplateModal: React.FC<TemplateViewerProps> = ({ template, onClose }) => {
  return (
    <div className="template-modal-overlay" onClick={onClose}>
      <div 
        className="template-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <TemplateFrame template={template} onClose={onClose} />
      </div>
    </div>
  )
}

/**
 * Card component showing template preview
 */
export const TemplateCard: React.FC<{
  template: Template
  onView?: (template: Template) => void
}> = ({ template, onView }) => {
  return (
    <div className="template-card">
      <div className="template-card-image">
        <img 
          src={template.image} 
          alt={template.title}
          loading="lazy"
        />
      </div>
      <div className="template-card-content">
        <h4>{template.title}</h4>
        <div className="template-card-actions">
          {onView && (
            <button 
              className="btn-preview"
              onClick={() => onView(template)}
            >
              Preview
            </button>
          )}
          <a 
            href={template.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-open"
          >
            Open
          </a>
        </div>
      </div>
    </div>
  )
}

/**
 * Gallery with template cards
 */
export const TemplateGallery: React.FC<{
  templates: Template[]
}> = ({ templates }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  return (
    <>
      <div className="template-gallery">
        {templates.map((template) => (
          <TemplateCard 
            key={template.id}
            template={template}
            onView={setSelectedTemplate}
          />
        ))}
      </div>

      {selectedTemplate && (
        <TemplateModal 
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </>
  )
}

export default TemplateGallery
