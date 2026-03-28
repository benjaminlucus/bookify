"use client";

import React, { useRef, useState } from "react";
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
import { cn, parsePDFFile } from "@/lib/utils";
import { VoiceCard } from "@/components/VoiceCard";
import { BookUploadFormValues } from "../../../../../types";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { checkBookExists, createBook, createSegments } from "@/lib/actions/book.action";
import { upload } from "@vercel/blob/client";

const NewBookPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // For previewing the file on UI 
  const coverImageInputRef = useRef<HTMLInputElement>(null); // For previewing the file on UI 
 const [isSubmitting, setIsSubmitting] = useState<boolean>(false) // Used for loading state

  const form = useForm<BookUploadFormValues>({
    resolver: zodResolver(UploadSchema), // Follows UploadSchema zod rules for the form 
    defaultValues: { // Default values for the fields
      title: '',
      author: '',
      pdfFile: undefined,
      coverImage: undefined,
      voice: DEFAULT_VOICE as BookUploadFormValues["voice"], // The form expects only specific strings like "james" | "sarah", Only from the values included in the BookUploadFormValues schema voice field. 
    },
  }); // Defined Schema for submittion form. 

  const { userId } = useAuth(); // For authentication of the user
  const router = useRouter(); // For redirection

  // Watch voice selection at top level for reliable reactivity
  const selectedVoice = form.watch("voice"); // Check for realtime state of voice fields in order to be shown in the UI

  /*
  These both states are for previewing The state for File Upload.

    When user selects PDF
    setPdfPreview(file.name);  // Stores "my-book.pdf"

    In UI

    {pdfPreview ? (  //If there's a preview, show the file info
      <div>PDF file ready: {pdfPreview}</div>
    ) : (
      <div>Click to upload PDF</div>  // Show empty state
    )}
  */
  const [pdfPreview, setPdfPreview] = React.useState<string | null>(null);
  const [coverPreview, setCoverPreview] = React.useState<string | null>(null);

  // For Submittion of the form
  const onSubmit = async (data: BookUploadFormValues) => {
    // Authenticates the user, If not found, throw error in form of toast
    if (!userId) {
      return toast.error("Please login to upload books");
    };

    try {
      setIsSubmitting(true); // Enables loader when processing the data.

      // 
      const existsCheck = await checkBookExists(data.title); // Checks if the book exists with exists state (BOOLEAN) and book data (IF FOUND). Returns object { exists: Bool, book: Object (IF FOUND)}

      // Checks if book exists and the data is available. If available, send a toast that book already exists and redirect to /books/[id]
      if (existsCheck.exists && existsCheck.book) {
        toast.info("Book with same title already exists.");
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      // Did Not understand fully these codes::
      const fileTitle = data.title.replace(/\s+/g, '-').toLowerCase(); // Question
      const pdfFile = data.pdfFile; // Extracts the PDF File from data. Default format is Array Buffer. Would be converted later.
      const parsedPDF = await parsePDFFile(pdfFile); // Parse the Raw PDF file. Returns cover image and text segments. { cover: Image, content: Object Text String}

      // If there is no content/segments found when parse pdf, Thorw a toast error that parsing failed.
      if (parsedPDF.content.length === 0) {
        toast.error("Failed to parse PDF. Please try again with a different file.");
        return;
      }

      // Uplaods the pdf file to the cloud Vercel Platform with name. eg: Rich Dad Poor Dad as rich-dad-poor-dad.pdf Makes it publocally availble, Endpoint '/api/upload' would handle the upload and the file type is PDF
      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
        contentType: 'application/pdf'
      });

      let coverUrl: string; // Initialized the variable for the cover Image Url

      if (data.coverImage) { // If there is coverImage provided in the form 
        const coverFile = data.coverImage; // Initialized the variable accessing contentType of the file being uploaded

        // Uploads the cover image to the cloud named, :eg: rich-dad-poor-dad as rich-dad-poor-dad_cover.png
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, coverFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: coverFile.type
        });
        coverUrl = uploadedCoverBlob.url; // Set the coverUrl variable as the url of the uploadedCoverBlob
      } else {

        //Didnt understand
        const response = await fetch(parsedPDF.cover) // Sends https request to paredPdf coverImage url like data:image/png;base64,iVBORw0KGgo
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: 'public',
          handleUploadUrl: '/api/upload',
          contentType: 'image/png'
        });
        coverUrl = uploadedCoverBlob.url;
      }

      // Create the book in the databse
      const book = await createBook({
        clerkId: userId,
        author: data.author,
        title: data.title,
        voice: data.voice,
        fileURL: uploadedPdfBlob.url, // Pdf File
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      })

      // If book not created in databse, return toast error and throw a error that "Failed To create book"
      if (!book.success) {
        toast.error("Failed To create book")
        throw new Error("Failed To create book");
      };

      // If book already exists, return the toast message and reset the form. Redirect user to /books/[id]
      if (book.alreadyExists) {
        toast.info("Book with same title already exists.");
        // form.reset()
        router.push(`/books/${existsCheck.book.slug}`)
        return;
      }

      const segmments = await createSegments(book.data._id, userId, parsedPDF.content); // Create the segments for the book. 

      // If segments are not made, Throw an error that says that failed to save book segments and a Toast error. 
      if (!segmments.success) {
        toast.error("Failed To save book segments.")
        throw new Error("Failed To save book segments.");
      };

      // At the end, reset the form and push the user to the form page. 
      // form.reset();
      router.push(`/books/${fileTitle}`)

    } catch (error) {

      // Handles the error part
      console.error(error);
      return toast.error("Error occured while uploading book");
    } finally {

      //Finally, set setIsSubmitting to false. 
      setIsSubmitting(false)
    }
  };

  // This function runs when something went wrong While submitting the form in React Hook Form. 
  const onInvalid = (errors: FieldErrors<BookUploadFormValues>) => {
    console.error("VALIDATION FAILED:", errors);
    toast.error("Please fix the errors in the form.");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "pdfFile" | "coverImage",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(field, file, { shouldValidate: true });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "pdfFile") {
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
  }; // Question: Why we need this function??? what is its use??

  /*
  This function remove file is run When the user wants to remove the file That he has selected. 
  It accepts fields which can only be coverImage or pdfFile.
  It firstly clears the value of the field from form And makes it undefined. Then it checks Whether the file is a PDF file or a cover image? 
  On the basis of that It clears the states for previewing UI and From the reference of the file.   
  */
  const removeFile = (field: "pdfFile" | "coverImage") => {
    form.setValue(field, undefined as unknown as File, { shouldValidate: true });
    if (field === "pdfFile") {
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
      {/* UI Top most Part */}
      <Form form={form} onSubmit={form.handleSubmit(onSubmit, onInvalid)}>


          <div className="space-y-8">
            {/* Book PDF File Section */}
            <FormField
              control={form.control}
              name="pdfFile"
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
                            onClick={() => removeFile("pdfFile")}
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
                            onChange={(e) => handleFileChange(e, "pdfFile")}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Begin Synthesis"}
            </Button>
          </div>
      </Form>
    </div>
  );
};

export default NewBookPage;
