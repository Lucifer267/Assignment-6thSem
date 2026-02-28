import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";

const db = new Database("library.db");

// Initialize Database Table
db.exec(`
  CREATE TABLE IF NOT EXISTS books (
    book_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Create Index for search performance
db.exec(`CREATE INDEX IF NOT EXISTS idx_books_title ON books(title)`);

// Seed Initial Data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM books").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare("INSERT INTO books (title, author, price) VALUES (?, ?, ?)");
  insert.run("The Great Gatsby", "F. Scott Fitzgerald", 15.99);
  insert.run("To Kill a Mockingbird", "Harper Lee", 12.50);
  insert.run("1984", "George Orwell", 14.25);
  insert.run("The Catcher in the Rye", "J.D. Salinger", 10.99);
}

// Helper function to resequence book IDs from 1
function resequenceIds() {
  try {
    // Create temporary table with new sequential IDs
    db.exec(`
      CREATE TEMPORARY TABLE books_temp AS 
      SELECT 
        ROW_NUMBER() OVER (ORDER BY created_at ASC) as new_id,
        title,
        author,
        price,
        created_at,
        updated_at
      FROM books
    `);
    
    // Clear original table
    db.exec("DELETE FROM books");
    
    // Reset auto-increment counter
    db.exec("DELETE FROM sqlite_sequence WHERE name='books'");
    
    // Reinsert with new sequential IDs
    db.exec(`
      INSERT INTO books (book_id, title, author, price, created_at, updated_at)
      SELECT new_id, title, author, price, created_at, updated_at
      FROM books_temp
    `);
    
    // Drop temporary table
    db.exec("DROP TABLE books_temp");
  } catch (error) {
    console.error("Error resequencing IDs:", error);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTES
  
  // Get all books
  app.get("/api/books", (req, res) => {
    try {
      const books = db.prepare("SELECT * FROM books ORDER BY created_at DESC").all();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch books" });
    }
  });

  // Get single book
  app.get("/api/books/:id", (req, res) => {
    try {
      const book = db.prepare("SELECT * FROM books WHERE book_id = ?").get(req.params.id);
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch book" });
    }
  });

  // Create book
  app.post("/api/books", (req, res) => {
    const { title, author, price } = req.body;
    if (!title || !author || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const info = db.prepare("INSERT INTO books (title, author, price) VALUES (?, ?, ?)")
        .run(title, author, price);
      res.status(201).json({ book_id: info.lastInsertRowid, title, author, price });
    } catch (error) {
      res.status(500).json({ error: "Failed to create book" });
    }
  });

  // Update book
  app.put("/api/books/:id", (req, res) => {
    const { title, author, price } = req.body;
    try {
      const result = db.prepare("UPDATE books SET title = ?, author = ?, price = ?, updated_at = CURRENT_TIMESTAMP WHERE book_id = ?")
        .run(title, author, price, req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
      res.json({ message: "Book updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update book" });
    }
  });

  // Delete book
  app.delete("/api/books/:id", (req, res) => {
    try {
      const result = db.prepare("DELETE FROM books WHERE book_id = ?").run(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: "Book not found" });
      
      // Resequence IDs to fill gaps
      resequenceIds();
      
      res.json({ message: "Book deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete book" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
