import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key_change_in_production";

// Simple in-memory user database
interface User {
  id: number;
  username: string;
  password: string;
  role: string;
}

let users: User[] = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" }
];

// Middleware to verify JWT token
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
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

  type Student = {
    id: number;
    name: string;
    email: string;
    course: string;
    createdAt?: string;
  };

  // In-memory "database" for students
  let students: Student[] = [
    { id: 1, name: "Aditi Sharma", email: "aditi.sharma2026@vit.edu", course: "Computer Science", createdAt: new Date().toISOString() },
    { id: 2, name: "Arjun Nair", email: "arjun.nair2025@vit.edu", course: "Data Science", createdAt: new Date().toISOString() },
    { id: 3, name: "Kavya Reddy", email: "kavya.reddy2027@vit.edu", course: "Artificial Intelligence", createdAt: new Date().toISOString() },
    { id: 4, name: "Rohan Mehta", email: "rohan.mehta2026@vit.edu", course: "Cyber Security", createdAt: new Date().toISOString() }
  ];

  // AUTH Routes
  // Login endpoint
  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });

  // Verify token endpoint
  app.get("/api/auth/verify", verifyToken, (req, res) => {
    res.json({ user: (req as any).user });
  });

  // Student API Routes (Protected)
  // GET all students
  app.get("/api/students", verifyToken, (req, res) => {
    res.json(students);
  });

  // GET single student by ID
  app.get("/api/students/:id", verifyToken, (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  });

  // CREATE new student
  app.post("/api/students", verifyToken, (req, res) => {
    const { name, email, course } = req.body;
    if (!name || !email || !course) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Check for duplicate email
    if (students.some(s => s.email === email)) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const newStudent: Student = {
      id: Math.max(0, ...students.map((student) => student.id)) + 1,
      name,
      email,
      course,
      createdAt: new Date().toISOString()
    };
    students.push(newStudent);
    res.status(201).json(newStudent);
  });

  // UPDATE student
  app.put("/api/students/:id", verifyToken, (req, res) => {
    const { name, email, course } = req.body;
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (!name || !email || !course) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for duplicate email (excluding current student)
    if (email !== students[studentIndex].email && students.some(s => s.email === email)) {
      return res.status(400).json({ error: "Email already exists" });
    }

    students[studentIndex] = {
      ...students[studentIndex],
      name,
      email,
      course
    };

    res.json(students[studentIndex]);
  });

  // DELETE student
  app.delete("/api/students/:id", verifyToken, (req, res) => {
    const studentIndex = students.findIndex(s => s.id === parseInt(req.params.id));
    
    
    if (studentIndex === -1) {
      return res.status(404).json({ error: "Student not found" });
    }

    const deletedStudent = students.splice(studentIndex, 1);
    res.json({ message: "Student deleted successfully", student: deletedStudent[0] });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("\n" + "=".repeat(60));
    console.log("🚀 Server running on http://localhost:" + PORT);
    console.log("=".repeat(60));
    console.log("\n📚 Available API Endpoints:\n");
    
    console.log("  POST /api/auth/login");
    console.log("       └─ User login (username: admin, password: admin123)");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/auth/login");
    console.log("       └─ Body: { username, password }\n");
    
    console.log("  GET  /api/auth/verify");
    console.log("       └─ Verify JWT token");
    console.log("       └─ Header: Authorization: Bearer <token>\n");
    
    console.log("  GET  /api/students");
    console.log("       └─ Fetch all students (requires auth)");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students\n");
    
    console.log("  GET  /api/students/:id");
    console.log("       └─ Fetch single student by ID (requires auth)");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students/1\n");
    
    console.log("  POST /api/students");
    console.log("       └─ Create new student (requires auth)");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students");
    console.log("       └─ Body: { name, email, course }\n");
    
    console.log("  PUT  /api/students/:id");
    console.log("       └─ Update student information (requires auth)");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students/1");
    console.log("       └─ Body: { name, email, course }\n");
    
    console.log("  DELETE /api/students/:id");
    console.log("       └─ Delete student by ID (requires auth)");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students/1\n");
    
    console.log("=".repeat(60));
    console.log("💻 Frontend: http://localhost:" + PORT);
    console.log("=".repeat(60));
    console.log("\n📝 Demo Credentials:");
    console.log("   Username: admin, Password: admin123");
    console.log("   Username: user, Password: user123");
    console.log("=".repeat(60) + "\n");
  });
}

startServer();
