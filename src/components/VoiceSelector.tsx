"use client";

import { useMemo } from "react";
import type { VoiceSelectorProps } from "@/types";
import { voiceCategories, voiceOptions } from "../lib/constants";
import { cn } from "../lib/utils";

export function VoiceSelector({ value, onChange, disabled }: VoiceSelectorProps) {
  const groups = useMemo(
    () => [
      { label: "Male Voices", ids: voiceCategories.male },
      { label: "Female Voices", ids: voiceCategories.female },
    ],
    [],
  );

  return (
    <div className="grid gap-4">
      {groups.map((group) => (
        <div key={group.label} className="space-y-3">
          <p className="text-sm font-semibold text-[#212a3b]">{group.label}</p>
          <div className="grid gap-3 md:grid-cols-3">
            {group.ids.map((voiceId) => {
              const voice = voiceOptions[voiceId];
              const selected = value === voiceId;
              return (
                <label
                  key={voiceId}
                  className={cn(
                    "voice-selector-option flex flex-col gap-1 rounded-2xl border border-[rgba(33,42,59,0.18)] bg-white p-4 text-left transition",
                    selected && "voice-selector-option-selected border-[var(--color-brand)] bg-[rgba(102,56,32,0.08)]",
                    disabled && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <input
                    type="radio"
                    name="voice"
                    value={voiceId}
                    checked={selected}
                    disabled={disabled}
                    onChange={() => onChange(voiceId)}
                    className="sr-only"
                  />
                  <span className="text-base font-semibold text-[#212a3b]">{voice.name}</span>
                  <span className="text-sm text-[rgba(33,42,59,0.7)]">{voice.description}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
