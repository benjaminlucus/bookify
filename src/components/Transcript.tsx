"use client";

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { Messages } from "../../types";

interface TranscriptProps {
  messages: Messages[];
  currentMessage?: string;
  currentUserMessage?: string;
}

const Transcript = ({
  messages,
  currentMessage,
  currentUserMessage,
}: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when messages or streaming text changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty =
    messages.length === 0 && !currentMessage && !currentUserMessage;

  if (isEmpty) {
    return (
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
    );
  }

  return (
    <div
      ref={scrollRef}
      className="bg-white rounded-xl h-[500px] overflow-y-auto p-6 space-y-4 border border-[rgba(33,42,59,0.05)] shadow-sm scrollbar-thin scrollbar-thumb-gray-200"
    >
      {/* Existing Messages */}
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full",
            msg.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] p-4 text-sm md:text-base shadow-sm",
              msg.role === "user"
                ? "bg-[#663820] text-white rounded-2xl rounded-br-none"
                : "bg-[#f3e4c7] text-[#212a3b] rounded-2xl rounded-bl-none"
            )}
          >
            {msg.content}
          </div>
        </div>
      ))}

      {/* Streaming User Message */}
      {currentUserMessage && (
        <div className="flex w-full justify-end">
          <div className="max-w-[80%] p-4 text-sm md:text-base bg-[#663820] text-white rounded-2xl rounded-br-none shadow-sm">
            {currentUserMessage}
            <span className="inline-block w-1.5 h-4 bg-white ml-1 animate-pulse align-middle" />
          </div>
        </div>
      )}

      {/* Streaming AI Message */}
      {currentMessage && (
        <div className="flex w-full justify-start">
          <div className="max-w-[80%] p-4 text-sm md:text-base bg-[#f3e4c7] text-[#212a3b] rounded-2xl rounded-bl-none shadow-sm">
            {currentMessage}
            <span className="inline-block w-1.5 h-4 bg-[#212a3b] ml-1 animate-pulse align-middle" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Transcript;
