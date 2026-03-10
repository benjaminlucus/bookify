"use client";

import { useId, useState } from "react";
import { useController } from "react-hook-form";
import { FormItem, FormLabel, FormMessage } from "./ui/form";
import { LucideIcon, UploadCloud, X } from "lucide-react";
import { FileUploadFieldProps } from "@/types";
import { cn } from "../lib/utils";

export function FileUploadField<TFormValues extends Record<string, any>>({
  control,
  name,
  label,
  acceptTypes,
  disabled,
  icon,
  placeholder,
  hint,
}: FileUploadFieldProps & { control: any; name: any }) {
  const id = useId();
  const [isDragActive, setIsDragActive] = useState(false);
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const file = field.value as File | undefined;

  const Icon = icon || UploadCloud;

  const handleFileSelect = (file?: File) => {
    field.onChange(file);
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) {
      handleFileSelect(dropped);
    }
  };

  return (
    <FormItem>
      <FormLabel htmlFor={id}>{label}</FormLabel>

      <label
        htmlFor={id}
        className={cn(
          "upload-dropzone group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[rgba(33,42,59,0.3)] bg-white/60 p-8 text-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)]",
          isDragActive && "border-[var(--color-brand)] bg-[rgba(102,56,32,0.05)]",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragActive(true);
        }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={onDrop}
      >
        <input
          id={id}
          type="file"
          accept={acceptTypes.join(",")}
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            handleFileSelect(selectedFile);
          }}
        />

        <div className="flex flex-col items-center gap-2">
          <Icon className="h-8 w-8 text-[var(--color-brand)]" />
          <span className="text-base font-semibold text-[#212a3b]">{placeholder}</span>
          <span className="text-sm text-[rgba(33,42,59,0.6)]">{hint}</span>

          {file ? (
            <div className="mt-4 flex w-full flex-row items-center justify-between gap-2 rounded-xl border border-[rgba(33,42,59,0.12)] bg-white px-4 py-3 text-left shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#212a3b]">{file.name}</p>
                <p className="text-xs text-[rgba(33,42,59,0.6)]">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleFileSelect(undefined);
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(33,42,59,0.12)] bg-white text-[var(--color-brand)] transition hover:bg-[rgba(102,56,32,0.06)]"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </label>

      {error?.message ? <FormMessage>{error.message}</FormMessage> : null}
    </FormItem>
  );
}
