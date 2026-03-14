"use client";

import React, { useRef } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadSchema } from "@/lib/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import {
  voiceOptions,
  voiceCategories,
  DEFAULT_VOICE,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { VoiceCard } from "@/components/VoiceCard";
import { BookUploadFormValues } from "../../../../../types";
import Image from "next/image";

const NewBookPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: DEFAULT_VOICE as BookUploadFormValues["voice"],
    },
  });

  // Watch voice selection at top level for reliable reactivity
  const selectedVoice = form.watch("voice");

  const [pdfPreview, setPdfPreview] = React.useState<string | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

  const onSubmit = (values: BookUploadFormValues) => {
    console.log("SUCCESS! Form values:", values);
    alert("Form submitted successfully! Check console for values.");
  };

  const onInvalid = (errors: FieldErrors<BookUploadFormValues>) => {
    console.error("VALIDATION FAILED:", errors);
    alert("Please fix the errors in the form.");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "file" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(field, file, { shouldValidate: true });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "file") {
          setPdfPreview(file.name);
        } else {
          setCoverPreview(reader.result as string);
        }
      };
      if (field === "coverImage") {
        reader.readAsDataURL(file);
      } else {
        setPdfPreview(file.name);
      }
    }
  };

  const removeFile = (field: "file" | "coverImage") => {
    form.setValue(field, undefined as unknown as File, { shouldValidate: true });
    if (field === "file") {
      setPdfPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setCoverPreview(null);
      if (coverImageInputRef.current) coverImageInputRef.current.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 space-y-2">
        <h1 className="text-2xl font-semibold text-[#212a3b]">
          Upload a PDF to generate your interactive interview
        </h1>
        <p className="text-sm text-[#3d485e]">
          5 of 10 books used{" "}
          <span className="cursor-pointer font-medium text-[#212a3b] underline">
            (Upgrade)
          </span>
        </p>
      </div>

      <Form form={form} onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <div className="space-y-8">
          {/* Book PDF File Section */}
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-[#212a3b]">
                  Book PDF File
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    {pdfPreview ? (
                      <div className="flex items-center justify-between rounded-xl border border-[#663820] bg-[#fff6e5]/30 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#663820]/10">
                            <FileText className="h-6 w-6 text-[#663820]" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#212a3b] line-clamp-1">
                              {pdfPreview}
                            </span>
                            <span className="text-xs text-[rgba(33,42,59,0.5)]">
                              PDF file ready
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile("file")}
                          className="rounded-full p-1 hover:bg-[#663820]/10"
                        >
                          <X className="h-5 w-5 text-[#663820]" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(33,42,59,0.12)] bg-white py-12 transition-colors hover:border-[rgba(33,42,59,0.2)]",
                        )}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf"
                          onChange={(e) => handleFileChange(e, "file")}
                        />
                        <Upload className="mb-4 h-10 w-10 text-[#663820]" />
                        <p className="text-lg font-medium text-[#212a3b]">
                          Click to upload PDF
                        </p>
                        <p className="mt-1 text-sm text-[rgba(33,42,59,0.5)]">
                          PDF file (max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cover Image Section */}
          <FormField
            control={form.control}
            name="coverImage"
            render={() => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-[#212a3b]">
                  Cover Image (Optional)
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    {coverPreview ? (
                      <div className="relative h-48 w-full overflow-hidden rounded-xl border border-[#663820]">
                        <Image
                          src={coverPreview}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile("coverImage")}
                          className="absolute top-2 right-2 rounded-full bg-white/80 p-1 shadow-sm hover:bg-white"
                        >
                          <X className="h-5 w-5 text-[#663820]" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => coverImageInputRef.current?.click()}
                        className={cn(
                          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[rgba(33,42,59,0.12)] bg-white py-12 transition-colors hover:border-[rgba(33,42,59,0.2)]",
                        )}
                      >
                        <input
                          type="file"
                          ref={coverImageInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "coverImage")}
                        />
                        <Upload className="mb-4 h-10 w-10 text-[#663820]" />
                        <p className="text-lg font-medium text-[#212a3b]">
                          Click to upload cover image
                        </p>
                        <p className="mt-1 text-sm text-[rgba(33,42,59,0.5)]">
                          Leave empty to auto-generate from PDF
                        </p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Title Input */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-[#212a3b]">
                    Book Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Rich Dad Poor Dad"
                      {...field}
                      className="h-12 rounded-xl border-[rgba(33,42,59,0.12)] text-lg focus-visible:ring-[#663820]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Author Input */}
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-[#212a3b]">
                    Author Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Robert Kiyosaki"
                      {...field}
                      className="h-12 rounded-xl border-[rgba(33,42,59,0.12)] text-lg focus-visible:ring-[#663820]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Choose Assistant Voice Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-[#212a3b]">
              Choose Assistant Voice
            </h2>

            {/* Male Voices */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[rgba(33,42,59,0.6)] uppercase tracking-wider">
                Male Voices
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {voiceCategories.male.map((voiceKey) => {
                  const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
                  return (
                    <VoiceCard
                      key={voiceKey}
                      voiceKey={voiceKey}
                      name={voice.name}
                      description={voice.description}
                      isSelected={selectedVoice === voiceKey}
                      onSelect={(key) => {
                        console.log("Selecting voice:", key);
                        form.setValue("voice", key as BookUploadFormValues["voice"], {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Female Voices */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[rgba(33,42,59,0.6)] uppercase tracking-wider">
                Female Voices
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {voiceCategories.female.map((voiceKey) => {
                  const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
                  return (
                    <VoiceCard
                      key={voiceKey}
                      voiceKey={voiceKey}
                      name={voice.name}
                      description={voice.description}
                      isSelected={selectedVoice === voiceKey}
                      onSelect={(key) => {
                        console.log("Selecting voice:", key);
                        form.setValue("voice", key as BookUploadFormValues["voice"], {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-xl bg-[#663820] py-4 text-xl font-bold text-white transition-colors hover:bg-[#7a4528]"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Processing..." : "Begin Synthesis"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default NewBookPage;
