import React from 'react'
import '../styles/Card.css'

interface Template {
  id: number
  title: string
  style: string
  category: string
  url: string
  color: string
  image: string
}

interface CardProps {
  card: Template
  index: number
  fallbackImage: string
}

export default function Card({ card, index, fallbackImage }: CardProps) {
  // Use actual image if provided, fallback to SVG
  const displayImage = card.image || fallbackImage

  const handleViewTemplate = () => {
    window.location.href = card.url
  }

  return (
    <article className="card" style={{ animationDelay: `${index * 0.06}s` }}>
      <div className="card-img-wrap">
        <img src={displayImage} alt={card.title} loading="lazy" onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          (e.target as HTMLImageElement).src = fallbackImage
        }} />
        <div className="card-overlay">
          <div className="overlay-info">
            <div className="overlay-title">{card.title}</div>
            <div className="overlay-style">{card.style}</div>
            <div className="overlay-divider"></div>
            <button className="overlay-btn" onClick={handleViewTemplate}>
              Xem Thiệp
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
