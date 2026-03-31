import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getBookBySlug } from "@/lib/actions/book.action";
import VapiControles from "@/components/VapiControles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BookDetailsPage = async ({ params }: PageProps) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { slug } = await params;
  const { success, data: book } = await getBookBySlug(slug);

  if (!success || !book) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">

      {/* 2. Transcript area */}
     <VapiControles book={book}/>
    </div>
  );
};

export default BookDetailsPage;
