"use client";


import { MicOff, Mic } from 'lucide-react';
import { IBook, Messages } from '@types';
import Image from "next/image";
import Transcript from './Transcript';
import React, { useState } from 'react';
import { useVapi } from '@/hooks/useVapi';

const VapiControles = ({ book }: { book: IBook }) => {
   const { status, isActive, messages, currentMessage, currentUserMessage, duration, start, stop, clearError, limitError, isBillingError, 
    // maxDurationSeconds 
  } = useVapi(book)

  return (
    <div className="space-y-8">
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
            {/* Pulsating ring when active and AI is speaking/thinking */}
            {isActive && currentMessage && (
              <div className="absolute inset-0 -m-2">
                <div className="h-full w-full rounded-full bg-white opacity-75 animate-ping" />
              </div>
            )}
            <button 
              onClick={isActive ? stop : start} 
              disabled={status==="connecting"} 
              className="relative h-[60px] w-[60px] cursor-pointer rounded-full bg-white flex items-center justify-center shadow-md hover:shadow-lg transition-shadow border border-[rgba(33,42,59,0.05)]"
            >
              {isActive ? (
                <Mic className="h-6 w-6 text-[#212a3b]" />
              ) : (
                <MicOff className="h-6 w-6 text-[#212a3b]" />
              )}
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

      <Transcript 
        messages={messages} 
        currentMessage={currentMessage} 
        currentUserMessage={currentUserMessage} 
      />
    </div>
  )
}

export default VapiControles