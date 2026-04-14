import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  // In-memory "database" for demonstration since MySQL requires external setup.
  let students: Student[] = [
    { id: 1, name: "Aditi Sharma", email: "aditi.sharma2026@vit.edu", course: "Computer Science", createdAt: new Date().toISOString() },
    { id: 2, name: "Arjun Nair", email: "arjun.nair2025@vit.edu", course: "Data Science", createdAt: new Date().toISOString() },
    { id: 3, name: "Kavya Reddy", email: "kavya.reddy2027@vit.edu", course: "Artificial Intelligence", createdAt: new Date().toISOString() },
    { id: 4, name: "Rohan Mehta", email: "rohan.mehta2026@vit.edu", course: "Cyber Security", createdAt: new Date().toISOString() }
  ];

  // API Routes
  // GET all students
  app.get("/api/students", (req, res) => {
    res.json(students);
  });

  // GET single student by ID
  app.get("/api/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  });

  // CREATE new student
  app.post("/api/students", (req, res) => {
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
  app.put("/api/students/:id", (req, res) => {
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
  app.delete("/api/students/:id", (req, res) => {
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
    
    console.log("  GET  /api/students");
    console.log("       └─ Fetch all students");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students\n");
    
    console.log("  GET  /api/students/:id");
    console.log("       └─ Fetch single student by ID");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students/1\n");
    
    console.log("  POST /api/students");
    console.log("       └─ Create new student");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students");
    console.log("       └─ Body: { name, email, course }\n");
    
    console.log("  PUT  /api/students/:id");
    console.log("       └─ Update student information");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students/1");
    console.log("       └─ Body: { name, email, course }\n");
    
    console.log("  DELETE /api/students/:id");
    console.log("       └─ Delete student by ID");
    console.log("       └─ URL: http://localhost:" + PORT + "/api/students/1\n");
    
    console.log("=".repeat(60));
    console.log("💻 Frontend: http://localhost:" + PORT);
    console.log("=".repeat(60) + "\n");
  });
}

startServer();
