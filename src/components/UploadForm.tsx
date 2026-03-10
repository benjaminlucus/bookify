"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { BookUploadFormValues } from "@/types";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { FileUploadField } from "./FileUploadField";
import { VoiceSelector } from "./VoiceSelector";
import { UploadCloud, Image } from "lucide-react";
import { UploadSchema } from "../lib/zod";
import { DEFAULT_VOICE } from "../lib/constants";

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      voice: DEFAULT_VOICE,
    },
  });

  const onSubmit = async (values: BookUploadFormValues) => {
    setIsSubmitting(true);
    try {
      // Replace with your API call / upload logic
      await new Promise((resolve) => setTimeout(resolve, 1300));
      console.log("Uploaded values", values);
      form.reset({ voice: DEFAULT_VOICE });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-book-wrapper relative">
      {isSubmitting && (
        <div className="loading-wrapper">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            </div>
            <p className="text-white text-lg font-semibold">Generating your book…</p>
          </div>
        </div>
      )}

      <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid gap-6">
          <FileUploadField
            control={form.control}
            name="file"
            label="Book PDF File"
            acceptTypes={["application/pdf"]}
            icon={UploadCloud}
            placeholder="Click to upload PDF"
            hint="PDF file (max 50MB)"
          />

          <FileUploadField
            control={form.control}
            name="coverImage"
            label="Cover Image (Optional)"
            acceptTypes={["image/png", "image/jpeg", "image/jpg", "image/webp"]}
            icon={Image}
            placeholder="Click to upload cover image"
            hint="Leave empty to auto-generate from PDF"
          />

          <FormItem>
            <FormLabel htmlFor="title">Title</FormLabel>
            <FormControl>
              <Input
                id="title"
                placeholder="ex: Rich Dad Poor Dad"
                {...form.register("title")}
              />
            </FormControl>
            {form.formState.errors.title?.message ? (
              <FormMessage>{form.formState.errors.title?.message}</FormMessage>
            ) : null}
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="author">Author Name</FormLabel>
            <FormControl>
              <Input
                id="author"
                placeholder="ex: Robert Kiyosaki"
                {...form.register("author")}
              />
            </FormControl>
            {form.formState.errors.author?.message ? (
              <FormMessage>{form.formState.errors.author?.message}</FormMessage>
            ) : null}
          </FormItem>

          <FormItem>
            <FormLabel>Choose Assistant Voice</FormLabel>
            <FormControl>
              <FormField
                control={form.control}
                name="voice"
                render={({ field }) => (
                  <VoiceSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormControl>
            {form.formState.errors.voice?.message ? (
              <FormMessage>{form.formState.errors.voice?.message}</FormMessage>
            ) : null}
          </FormItem>

          <Button type="submit" className="form-btn">
            Begin Synthesis
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UploadForm;
