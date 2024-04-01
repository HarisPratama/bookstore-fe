import { Book } from "./book";

export interface Order {
    id: number;
    userId: number;
    bookId: number;
    status: string;
    createdAt: string;
    book: Book;
}
