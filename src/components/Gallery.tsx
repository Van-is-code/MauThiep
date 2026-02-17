import React from 'react'
import Card from './Card'
import '../styles/Gallery.css'

interface Template {
  id: number
  title: string
  style: string
  category: string
  url: string
  color: string
  image: string
}

interface GalleryProps {
  cards: Template[]
  makeCardImage: (card: Template) => string
}

export default function Gallery({ cards, makeCardImage }: GalleryProps) {
  return (
    <section className="gallery-section">
      <div className="gallery-grid">
        {cards.map((card, i) => (
          <Card
            key={card.id}
            card={card}
            index={i}
            fallbackImage={makeCardImage(card)}
          />
        ))}
      </div>
    </section>
  )
}
