import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Comment {
  id: string;
  username: string;
  comment_text: string;
  created_at: string;
}

let comments: Comment[] = [
  {
    id: "1",
    username: "System",
    comment_text: "Welcome to the real-time blog! Feel free to leave a comment.",
    created_at: new Date().toISOString(),
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // GET latest comments
  app.get("/api/comments", (req, res) => {
    res.json(comments);
  });

  // POST new comment
  app.post("/api/comments", (req, res) => {
    const { username, comment_text } = req.body;
    
    if (!username || !comment_text) {
      return res.status(400).json({ error: "Username and comment are required" });
    }

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      username,
      comment_text,
      created_at: new Date().toISOString(),
    };

    comments.unshift(newComment); // Add to the beginning
    res.status(201).json(newComment);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
