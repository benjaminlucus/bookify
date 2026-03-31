"use server";

import { connectDB } from "@/database/connect";
import { CreateBook, TextSegment } from "@types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/BookSchema.model";
import BookSegment from "@/database/models/IBookSegment.model";

export const getAllBooks = async (search?: string) => {
    try {
        await connectDB();

        const books = await Book.find().sort({ createdAt: -1 }).lean();

        return {
            success: true,
            data: serializeData(books)
        }
    } catch (e) {
        console.error('Error connecting to database', e);
        return {
            success: false, error: e
        }
    }
}

export const checkBookExists = async (title: string) => {
    try {
        await connectDB(); // Connect to database

        const slug = generateSlug(title); // Generates the slug for the book. eg: Rich Dad Poor Dad as rich-dad-poor-dad

        const existingBook = await Book.findOne({ slug }).lean(); // Checks for the book if already exists

        // If exists, return exists state to be true and send book data back.
        if (existingBook) {
            return {
                exists: true, book: serializeData(existingBook)// This function Mongoose documents to plain JSON objects
            }
        };

        // If not exists in databse, return exists to be false with no book data as not found.
        return { exists: false }
    } catch (error) {
        console.error("Error checking book exists: ", error); // If error, log the error
        return { success: false, error: error } // Also Send the error and success to be false.
    }
}

export const createBook = async (data: CreateBook) => {
    try {
        await connectDB(); // Connect To databse

        const slug = generateSlug(data?.title); // Generates the slug for the book. eg: Rich Dad Poor Dad as rich-dad-poor-dad

        const existingBook = await Book.findOne({ slug }).lean();  // Checks for the book if already exists
        // .lean(): Returns plain JavaScript object instead of Mongoose document

        // If exists, return alreadyExists state to be true and send book data back and success true. { success: BOOLEAN, data: Object, alreadyExists: BOOLEAN }
        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true
            }
        };

        //
        const book = await Book.create({ ...data, slug, totalSegments: 0 }); // Spread the datapased in function and also aditionally add slug to be slug(as mentioned above) and initially keep the totalSegments to be 0. 

        return { success: true, data: serializeData(book) } // Set Success to be true and data to be the book createdin the database.
    } catch (error) {
        console.error("Error creating the book: ", error); // Incase of any error
        return { success: false, error: error }
    }
}

export const createSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectDB();

        console.log("Saving segments...");

        // Takes each segment from the parsed PDF,Maps to database schema fields, Adds clerkId and bookId to each segment
        const segmentsToInsert = segments.map(({ wordCount, pageNumber, segmentIndex, text }) => ({
            clerkId, bookId, content: text, segmentIndex, pageNumber, wordCount
        }));

        // Output
        /*
        segmentsToInsert = [
                                {
                                  clerkId: "user_123",
                                  bookId: ObjectId("507f1f77bcf86cd799439011"),
                                  content: "Chapter 1: The Rich Don't Work for Money...",
                                  segmentIndex: 0,
                                  pageNumber: 1,
                                  wordCount: 498
                                }
                            ]
        */

        await BookSegment.insertMany(segmentsToInsert); // Insert The segemnst to BookSegment Schema in the database
        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length }); // Update the totalSegemnt count in the book stored in the databse.

        console.log("Book Segments Saved Successfully.");

        return { success: true, data: { segmentsCreated: segments.length } } // Success To be true, data to be an object wit segmentsCreated to be the total length of segments created.
    } catch (error) {
        console.error("Error saving segments: ", error); // Handling Errors 

        /* 
        The two lines below Indicate that if an error occurred while creating the segment So delete all the segments created Because if ten segments, for example, have been created and then an error occurred, we don't want ten Segment plus half of the book. So we delete all the segments and ask to retry creating and saving the book. 
        
        We also Find the book by ID and delete it. Because a book with no segments (thus no text, just cover image) is useless. Here, segments are the inner text of the book. So if we are deleting all of the segments created, The inner text of the book, so we have to delete the book itself because nothing else is needed. 
        */

        await BookSegment.deleteMany({ bookId }); //Delete all the book segments with bookId if an error occurred. 
        await Book.findByIdAndDelete(bookId); // Also delete the book itself. 
        return { success: false, error: error }
    }
}

export const getBookBySlug = async (slug: string) => {
    try {
        await connectDB();

        const book = await Book.findOne({ slug }).lean();

        if (!book) {
            return { success: false, error: "Book not found" };
        }

        return { success: true, data: serializeData(book) };
    } catch (error) {
        console.error("Error fetching book by slug: ", error);
        return { success: false, error: error };
    }
} 