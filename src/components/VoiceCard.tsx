"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { VoiceCardProps } from "../../types";

export const VoiceCard = ({
  voiceKey,
  name,
  description,
  isSelected,
  onSelect,
}: VoiceCardProps) => {
  return (
    <div
      onClick={() => {
        console.log("VoiceCard clicked:", voiceKey);
        onSelect(voiceKey);
      }}
      className={cn(
        "relative flex cursor-pointer flex-col rounded-xl border-2 border-[rgba(33,42,59,0.12)] bg-white p-4 transition-all hover:shadow-md",
        isSelected
          ? "border-[#663820] bg-[#663820]/5 shadow-sm"
          : "hover:border-[rgba(33,42,59,0.2)]",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
              isSelected
                ? "border-[#663820] bg-[#663820]"
                : "border-[rgba(33,42,59,0.2)] bg-white",
            )}
          >
            {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
          </div>
          <span className="font-bold text-[#212a3b]">{name}</span>
        </div>
        {isSelected && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#663820] text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs leading-relaxed text-[rgba(33,42,59,0.7)]">
        {description}
      </p>
    </div>
  );
};
