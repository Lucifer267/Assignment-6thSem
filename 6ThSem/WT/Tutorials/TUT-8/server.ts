import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Feed } from "feed";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_in_production";

// Local database - in-memory storage with sample data
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  publishedDate: Date;
  createdAt: Date;
}

interface User {
  id: string;
  username: string;
  password: string;
}

let posts: Post[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with React",
    slug: "building-modern-web-applications-with-react",
    excerpt: "Learn how to build scalable and efficient web applications using React and modern JavaScript practices.",
    content: "React has become one of the most popular JavaScript libraries for building user interfaces. In this comprehensive guide, we'll explore the best practices and patterns for building modern web applications.\n\n## Getting Started with React\nReact makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.\n\n## Key Concepts\n- Components: Reusable building blocks\n- State Management: Managing application state\n- Hooks: Functional components with state\n- Context API: Sharing state across components\n\n## Best Practices\n1. Keep components small and focused\n2. Use functional components with hooks\n3. Implement proper error boundaries\n4. Optimize performance with React.memo\n5. Follow the single responsibility principle\n\nReact continues to evolve with regular updates and improvements. Stay updated with the latest features and patterns to write better code.",
    author: "Sarah Johnson",
    authorId: "user1",
    publishedDate: new Date("2024-04-10"),
    createdAt: new Date("2024-04-10")
  },
  {
    id: "2",
    title: "The Future of Web Development: Trends to Watch in 2024",
    slug: "future-of-web-development-trends-2024",
    excerpt: "Discover the emerging technologies and trends that are shaping the future of web development this year.",
    content: "As we progress through 2024, several exciting trends are emerging in web development. From AI integration to improved performance optimization, the landscape is rapidly evolving.\n\n## Emerging Technologies\n\n### AI-Powered Development\nArtificial Intelligence is revolutionizing how we code. Tools like GitHub Copilot and ChatGPT are changing development workflows.\n\n### Edge Computing\nEdge computing is bringing computation closer to data sources, reducing latency and improving performance.\n\n### Web Components\nWeb Components provide a standardized way to create reusable components across frameworks.\n\n## Performance Focus\nWeb performance continues to be critical:\n- Core Web Vitals optimization\n- Server-Side Rendering (SSR)\n- Static Site Generation (SSG)\n- Progressive Web Apps (PWA)\n\n## Developer Experience\nTools and frameworks are focusing more on developer experience with:\n- Better error messages\n- Faster build times\n- Improved debugging\n- Simplified deployment\n\nThe web development landscape is more exciting than ever. Staying informed about these trends will help you make better technology choices for your projects.",
    author: "Michael Chen",
    authorId: "user2",
    publishedDate: new Date("2024-04-08"),
    createdAt: new Date("2024-04-08")
  },
  {
    id: "3",
    title: "TypeScript: Why You Should Consider Using It",
    slug: "typescript-why-you-should-use-it",
    excerpt: "A deep dive into TypeScript and why it's becoming the standard for large-scale JavaScript projects.",
    content: "TypeScript has become increasingly popular in the JavaScript community, and for good reason. Let's explore why you should consider using TypeScript in your next project.\n\n## What is TypeScript?\nTypeScript is a superset of JavaScript that adds static type checking and other language features. It compiles to plain JavaScript that runs in any browser.\n\n## Key Benefits\n\n### Type Safety\nCatch errors before runtime with static type checking.\n\n### Better IDE Support\nGet excellent autocomplete and refactoring capabilities.\n\n### Self-Documenting Code\nTypes serve as documentation for your code.\n\n### Easier Refactoring\nChange code with confidence knowing the type checker has your back.\n\n## Getting Started\n1. Install TypeScript globally or locally\n2. Create a tsconfig.json file\n3. Start converting your JS files to TS\n4. Enjoy the benefits!\n\n## Common Challenges\n- Learning curve for beginners\n- Additional build step required\n- Third-party library types may be incomplete\n\nDespite some challenges, TypeScript offers significant long-term benefits for large projects and teams.",
    author: "Emma Rodriguez",
    authorId: "user1",
    publishedDate: new Date("2024-04-05"),
    createdAt: new Date("2024-04-05")
  },
  {
    id: "4",
    title: "Mastering CSS Grid: From Basics to Advanced",
    slug: "mastering-css-grid-basics-advanced",
    excerpt: "Learn CSS Grid from the fundamentals to advanced techniques for creating complex layouts.",
    content: "CSS Grid is a powerful layout system that has revolutionized how we build responsive designs. Let's master it from the basics to advanced techniques.\n\n## What is CSS Grid?\nCSS Grid is a two-dimensional layout system that allows you to create complex layouts with ease.\n\n## Basic Concepts\n- Grid Container and Items\n- Tracks (rows and columns)\n- Gap and Alignment\n- Explicit and Implicit Grid\n\n## Advanced Techniques\n\n### Auto-fit vs Auto-fill\nUnderstand the difference and when to use each.\n\n### Template Areas\nUse named template areas for cleaner, more maintainable code.\n\n### Responsive Design\nCreate responsive layouts without media queries using minmax().\n\n## Combining with Flexbox\nUse CSS Grid for page layout and Flexbox for component layout.\n\n## Browser Support\nCSS Grid is supported in all modern browsers. Check caniuse.com for detailed support information.\n\nMastering CSS Grid will make you a more efficient frontend developer and enable you to create beautiful, responsive layouts.",
    author: "David Park",
    authorId: "user3",
    publishedDate: new Date("2024-04-01"),
    createdAt: new Date("2024-04-01")
  }
];

const editors: User[] = [
  { id: "editor1", username: "admin", password: "admin123" },
  { id: "editor2", username: "editor", password: "editor123" }
];

// Middleware to verify JWT
const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Auth Routes
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    const editor = editors.find(e => e.username === username && e.password === password);
    if (!editor) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: editor.id, username: editor.username },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { id: editor.id, username: editor.username } });
  });

  app.get("/api/auth/verify", verifyToken, (req, res) => {
    res.json({ user: req.user });
  });

  // Posts Routes
  app.get("/api/posts", (req, res) => {
    const sortedPosts = [...posts].sort((a, b) => 
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
    );
    res.json(sortedPosts);
  });

  app.get("/api/posts/:slug", (req, res) => {
    const post = posts.find(p => p.slug === req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  });

  app.post("/api/posts", verifyToken, (req, res) => {
    const { title, content, excerpt } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPost: Post = {
      id: Date.now().toString(),
      title,
      slug: slug || "untitled",
      content,
      excerpt: excerpt || content.substring(0, 160),
      author: req.user.username,
      authorId: req.user.id,
      publishedDate: new Date(),
      createdAt: new Date()
    };

    posts.push(newPost);
    res.status(201).json(newPost);
  });

  // RSS Feed Endpoint
  app.get("/feed", (req, res) => {
    try {
      const feed = new Feed({
        title: "The Chronicle News Blog",
        description: "The latest news and articles from The Chronicle.",
        id: `${process.env.APP_URL || "http://localhost:3000"}/`,
        link: `${process.env.APP_URL || "http://localhost:3000"}/`,
        language: "en",
        copyright: `All rights reserved ${new Date().getFullYear()}`,
        generator: "Feed for Node.js",
        feedLinks: {
          rss: `${process.env.APP_URL || "http://localhost:3000"}/feed`,
        },
      });

      const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
      ).slice(0, 20);

      sortedPosts.forEach(post => {
        feed.addItem({
          title: post.title,
          id: post.slug,
          link: `${process.env.APP_URL || "http://localhost:3000"}/post/${post.slug}`,
          description: post.excerpt,
          content: post.content,
          date: post.publishedDate,
          author: [{ name: post.author }],
        });
      });

      res.set("Content-Type", "application/rss+xml");
      res.send(feed.rss2());
    } catch (error) {
      console.error("RSS Feed Error:", error);
      res.status(500).send("Error generating feed");
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 The Chronicle server running on http://localhost:" + PORT);
    console.log("=".repeat(60));
    console.log("\n📚 Available Endpoints:\n");
    console.log("  PUBLIC ENDPOINTS:");
    console.log("    GET  /api/posts - Get all posts");
    console.log("    GET  /api/posts/:slug - Get single post");
    console.log("    GET  /feed - RSS feed\n");
    console.log("  AUTH ENDPOINTS:");
    console.log("    POST /api/auth/login - Login (username/password)");
    console.log("    GET  /api/auth/verify - Verify token\n");
    console.log("  PROTECTED ENDPOINTS:");
    console.log("    POST /api/posts - Create new post\n");
    console.log("📝 Demo Credentials:");
    console.log("    Username: admin   | Password: admin123");
    console.log("    Username: editor  | Password: editor123");
    console.log("\n" + "=".repeat(60) + "\n");
  });
}

startServer();
