import React from 'react'
import { sampleBooks } from '../lib/constants'
import BookCard from '../components/BookCard'
import HeroSection from '../components/HeroSection'

const Home = () => {
  return (
    <div className='wrapper container'>
      <HeroSection />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 md:gap-x-10 gap-y-7 md:gap-y-9">
        {sampleBooks.map((book) => (
          <BookCard
            key={book._id}
            author={book.author}
            title={book.title}
            slug={book.slug}
            coverURL={book.coverURL}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
