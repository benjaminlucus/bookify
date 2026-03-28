import { Mic, MicOff } from 'lucide-react';
import { IBook } from '@types';
import Image from "next/image";

const VapiControles = ({ book }: { book: IBook }) => {
  return (
    <>
      <div className="bg-[#f3e4c7] rounded-xl p-6 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm">
        {/* Left: Book cover image */}
        <div className="relative flex-shrink-0">
          <div className="relative w-[120px] h-[180px] rounded-lg overflow-hidden shadow-lg border border-[rgba(33,42,59,0.1)]">
            <Image
              src={book.coverURL || "/assets/book-cover.svg"}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
          {/* Overlapping Mic Button */}
          <div className="absolute -bottom-4 -right-4">
            <button className="h-[60px] w-[60px] rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow border border-[rgba(33,42,59,0.05)]">
              <MicOff className="h-6 w-6 text-[#212a3b]" />
            </button>
          </div>
        </div>

        {/* Right: Book Info */}
        <div className="flex flex-col gap-4 text-center md:text-left pt-2">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-[#212a3b] font-serif">
              {book.title}
            </h1>
            <p className="text-lg text-[#3d485e]">by {book.author}</p>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm font-medium text-[#212a3b] shadow-sm border border-[rgba(33,42,59,0.05)]">
              <div className="h-2 w-2 rounded-full bg-gray-400" />
              Ready
            </div>
            <div className="px-3 py-1 bg-white rounded-full text-sm font-medium text-[#212a3b] shadow-sm border border-[rgba(33,42,59,0.05)]">
              Voice: {book.voice || "Rachel"}
            </div>
            <div className="px-3 py-1 bg-white rounded-full text-sm font-medium text-[#212a3b] shadow-sm border border-[rgba(33,42,59,0.05)]">
              0:00/15:00
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl min-h-[400px] flex flex-col items-center justify-center p-8 border border-[rgba(33,42,59,0.05)] shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-[rgba(33,42,59,0.05)] flex items-center justify-center">
            <Mic className="h-8 w-8 text-[#3d485e]" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#212a3b]">
              No conversation yet
            </h2>
            <p className="text-[#3d485e]">
              Click the mic button above to start talking
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default VapiControles