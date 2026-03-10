import { BookCardProps } from '@/types'

import Image from 'next/image'
import Link from 'next/link'

const BookCard = ({ title, author, coverURL, slug }: BookCardProps) => {
  return (
    <Link href={`/books/${slug}`}>
      <article>
        <figure className="relative bg-white rounded-[14px] overflow-hidden flex items-center justify-center h-[205px] md:h-[240px];">
          <div>
            <Image src={coverURL} width={133} height={200} alt="Book Card Image" className='w-auto h-[170px] md:h-[200px] object-cover rounded-lg' />
          </div>
        </figure>

        <figcaption className='f'>
          <h3 className='font-bold text-[#212a3b] line-clamp-1 text-base md:text-xl leading-[22px] md:leading-[30px]'>{title}</h3>
          <p className='text-sm md:text-base font-medium text-[#3d485e] line-clamp-1'>{author}</p>
        </figcaption>
      </article>
    </Link>
  )
}

export default BookCard