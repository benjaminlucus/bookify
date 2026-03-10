"use client"

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-amber-50 py-40 mb-10 md:mb-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left column */}
        <div className="flex flex-1 flex-col gap-6 lg:max-w-md">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              Your Library
            </h1>
            <p className="text-lg leading-relaxed text-slate-700">
              Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/books/new"
              className="inline-flex items-center justify-center rounded-md bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              + Add new book
            </Link>
          </div>
        </div>

        {/* Center illustration */}
        <div className="flex flex-1 items-center justify-center">
          <div className="relative h-[320px] w-[360px] overflow-hidden rounded-3xl bg-white shadow-xl">
            <Image
              src="/assets/hero-illustration.png"
              alt="Books and globe illustration"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Right steps */}
        <div className="flex flex-1 flex-col gap-6 lg:max-w-sm">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">How it works</p>
            <ol className="mt-6 space-y-5">
              <li className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  1
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Upload PDF</p>
                  <p className="text-sm text-slate-600">Add your book file</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  2
                </span>
                <div>
                  <p className="font-semibold text-slate-900">AI Processing</p>
                  <p className="text-sm text-slate-600">We analyze the content</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  3
                </span>
                <div>
                  <p className="font-semibold text-slate-900">Voice Chat</p>
                  <p className="text-sm text-slate-600">Discuss with AI</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
