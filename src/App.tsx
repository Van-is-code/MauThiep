import React, { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import SectionIntro from './components/SectionIntro'
import Gallery from './components/Gallery'
import Pagination from './components/Pagination'
import Footer from './components/Footer'

interface Template {
  id: number
  title: string
  style: string
  category: string
  url: string
  color: string
  image: string
}

function App() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const PER_PAGE = 4

  // Load data from JSON
  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => setTemplates(data.templates))
      .catch(err => console.error('Error loading data:', err))
  }, [])

  // Generate SVG image for template
  const makeCardSVG = (card: Template) => {
    const colors: { [key: string]: string[] } = {
      '#f5f0e8': ['#e8d5b0', '#c8a96e'],
      '#f0ede5': ['#ddd0b8', '#b89860'],
      '#ece8df': ['#d8ceb8', '#a88a58'],
      '#eee8da': ['#d5c8a8', '#a07848'],
      '#f2eddf': ['#e8d8a8', '#c8a040'],
      '#f5ede8': ['#e8c8b8', '#c07860'],
      '#eeeae2': ['#d8d0b8', '#a09060'],
      '#e8e2d4': ['#d0c8a8', '#988850'],
      '#e5e8df': ['#c8d0b8', '#788858'],
      '#eae6de': ['#d4ccb4', '#a08850'],
      '#f2e8e4': ['#e0c4b8', '#b87868'],
      '#e2e8ed': ['#b8c8d8', '#507898'],
    }
    const [c1, c2] = colors[card.color] || ['#ddd', '#aaa']
    const yr = 2025 + (card.id % 3)
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
        <rect width="300" height="400" fill="${card.color}"/>
        <rect x="20" y="20" width="260" height="360" rx="4" fill="none" stroke="${c1}" stroke-width="1.5"/>
        <rect x="30" y="30" width="240" height="180" rx="4" fill="${c1}" opacity=".4"/>
        <ellipse cx="150" cy="120" rx="50" ry="60" fill="${c2}" opacity=".15"/>
        <ellipse cx="110" cy="100" rx="30" ry="38" fill="${c2}" opacity=".12"/>
        <text x="150" y="240" font-family="Georgia,serif" font-size="11" fill="${c2}" text-anchor="middle" font-style="italic">Save the Date</text>
        <text x="150" y="260" font-family="Georgia,serif" font-size="16" fill="#3a2e1e" text-anchor="middle">${card.title}</text>
        <line x1="80" y1="274" x2="220" y2="274" stroke="${c2}" stroke-width=".8"/>
        <text x="150" y="292" font-family="Arial,sans-serif" font-size="9" fill="#8a7a60" text-anchor="middle" letter-spacing="2">${yr}</text>
        <circle cx="150" cy="340" r="18" fill="none" stroke="${c2}" stroke-width="1.2"/>
        <text x="150" y="345" font-family="Georgia,serif" font-size="9" fill="${c2}" text-anchor="middle">✦</text>
      </svg>
    `
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const totalPages = Math.ceil(templates.length / PER_PAGE)
  const start = (currentPage - 1) * PER_PAGE
  const currentCards = templates.slice(start, start + PER_PAGE)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
    document.querySelector('.gallery-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app">
      <Header />
      <SectionIntro />
      <Gallery
        cards={currentCards}
        makeCardImage={makeCardSVG}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Footer />
    </div>
  )
}

export default App
