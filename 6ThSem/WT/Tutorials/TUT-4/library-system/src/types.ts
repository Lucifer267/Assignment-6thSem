export interface Book {
  book_id: number;
  title: string;
  author: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export type BookFormData = Omit<Book, "book_id" | "created_at" | "updated_at">;
