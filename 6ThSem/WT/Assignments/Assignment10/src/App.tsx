import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  UserPlus, Users, GraduationCap, Mail, BookOpen, 
  Loader2, CheckCircle2, Search, Filter, ArrowUpRight,
  TrendingUp, Calendar, Hash, MoreHorizontal, LayoutGrid, List,
  Edit2, Trash2, X, AlertCircle, Save, AlertTriangle, LogOut,
  Lock, User
} from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  course: string;
  createdAt?: string;
}

interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", course: "" });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editFormData, setEditFormData] = useState({ name: "", email: "", course: "" });
  
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const courses = [
    "Computer Science",
    "Data Science",
    "Artificial Intelligence",
    "Cyber Security",
  ];

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("/api/auth/verify", {
            headers: { "Authorization": `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setCurrentUser(data.user);
            setIsAuthenticated(true);
            fetchStudents(token);
          } else {
            localStorage.removeItem("token");
            setAuthLoading(false);
          }
        } catch (err) {
          console.error("Auth verification failed", err);
          localStorage.removeItem("token");
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginSubmitting(true);
    setLoginMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        setCurrentUser(data.user);
        setIsAuthenticated(true);
        setLoginData({ username: "", password: "" });
        setLoginMessage({ type: 'success', text: 'Login successful!' });
        fetchStudents(data.token);
      } else {
        const error = await res.json();
        setLoginMessage({ type: 'error', text: error.error || 'Login failed' });
      }
    } catch (err) {
      setLoginMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setStudents([]);
    setLoginData({ username: "", password: "" });
  };

  const fetchStudents = async (token: string) => {
    try {
      const res = await fetch("/api/students", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.course.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const getToken = () => localStorage.getItem("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newStudent = await res.json();
        setStudents(prev => [...prev, newStudent]);
        setFormData({ name: "", email: "", course: "" });
        setMessage({ type: 'success', text: 'Registration complete' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Registration failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setEditFormData({ name: student.name, email: student.email, course: student.course });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        const updatedStudent = await res.json();
        setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setEditingStudent(null);
        setMessage({ type: 'success', text: 'Student updated successfully' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Update failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/students/${studentToDelete.id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${getToken()}` },
      });

      if (res.ok) {
        setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        setStudentToDelete(null);
        setMessage({ type: 'success', text: 'Student deleted successfully' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        const error = await res.json();
        setMessage({ type: 'error', text: error.error || 'Delete failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Connection error' });
    } finally {
      setDeleteLoading(false);
    }
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#fff7ed_0%,#f8fafc_40%,#f5f7fb_100%)] text-slate-800 overflow-x-hidden flex items-center justify-center">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute top-[35%] -left-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md px-5"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.6)] md:p-8">
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-200">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="mb-2 text-3xl font-bold text-slate-900">VIT Registry</h1>
              <p className="text-sm text-slate-600">Student Management System</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Username</label>
                <div className="group relative">
                  <input
                    required
                    type="text"
                    value={loginData.username}
                    onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    placeholder="admin"
                  />
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Password</label>
                <div className="group relative">
                  <input
                    required
                    type="password"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                </div>
              </div>

              <button
                disabled={loginSubmitting}
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
              >
                {loginSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <span>Sign In</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {loginMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                      loginMessage.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-rose-200 bg-rose-50 text-rose-700'
                    }`}
                  >
                    {loginMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {loginMessage.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="mb-4 text-center text-sm font-semibold text-slate-700">Demo Credentials</p>
              <div className="space-y-2 text-sm">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-mono text-slate-900">admin / admin123</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="font-mono text-slate-900">user / user123</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Dashboard Page
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,#fff7ed_0%,#f8fafc_40%,#f5f7fb_100%)] text-slate-800 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute top-[35%] -left-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-200">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-slate-900">VIT Registry</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Student Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 md:flex">
              <button
                onClick={() => setViewMode('table')}
                className={`rounded-lg p-2 transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                aria-label="Table view"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-amber-100 text-xs font-bold text-slate-700">
                {currentUser?.username.charAt(0).toUpperCase()}
              </div>
              <span className="hidden text-sm font-semibold text-slate-900 sm:inline">{currentUser?.username}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: "Total Students", value: students.length, icon: Users, color: "text-orange-600", bg: "bg-orange-100" },
            { label: "Active Courses", value: new Set(students.map(s => s.course)).size, icon: BookOpen, color: "text-cyan-700", bg: "bg-cyan-100" },
            { label: "New This Week", value: "+12%", icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-100" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.55)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={`rounded-xl p-2.5 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-700" />
              </div>
              <div className="mb-1 text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-26px_rgba(15,23,42,0.6)] md:p-7"
            >
              <div className="mb-7">
                <h2 className="mb-2 flex items-center gap-2 text-xl font-bold text-slate-900">
                  <UserPlus className="h-5 w-5 text-orange-500" />
                  Register Student
                </h2>
                <p className="text-sm text-slate-600">Add a new student using a VIT email for a clean record set.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Full Name</label>
                  <div className="group relative">
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      placeholder="Enter full name"
                    />
                    <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">VIT Email</label>
                  <div className="group relative">
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                      placeholder="aditi.sharma2026@vit.edu"
                    />
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Course</label>
                  <div className="group relative">
                    <select
                      required
                      value={formData.course}
                      onChange={e => setFormData({ ...formData, course: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 outline-none transition-all focus:border-orange-300 focus:bg-white focus:ring-4 focus:ring-orange-100"
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-orange-500" />
                  </div>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>
                      <span>Register Student</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                        message.type === 'success'
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-rose-200 bg-rose-50 text-rose-700'
                      }`}
                    >
                      {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <Hash className="h-4 w-4" />}
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_16px_40px_-26px_rgba(15,23,42,0.6)]">
              <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
                  <p className="mt-1 text-xs font-medium text-slate-500">Showing {filteredStudents.length} records</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, or course"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100 md:w-72"
                    />
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>
                  <button className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 transition-colors hover:text-slate-800" aria-label="Filter">
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="p-2 md:p-3">
                {viewMode === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-y-2 text-left">
                      <thead>
                        <tr className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                          <th className="px-5 py-2">Student</th>
                          <th className="px-5 py-2">Course</th>
                          <th className="px-5 py-2">ID</th>
                          <th className="px-5 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-16 text-center">
                              <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-orange-500" />
                              <p className="text-sm font-medium text-slate-500">Loading students...</p>
                            </td>
                          </tr>
                        ) : filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-5 py-16 text-center">
                              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                <Search className="h-6 w-6 text-slate-400" />
                              </div>
                              <p className="font-medium text-slate-700">No students matched your search.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((student, idx) => (
                            <motion.tr
                              key={student.id}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              className="group bg-slate-50 transition-colors hover:bg-orange-50"
                            >
                              <td className="rounded-l-xl px-5 py-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-amber-100 text-xs font-bold text-slate-700">
                                    {student.name.split(' ').map(n => n[0]).join('')}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-slate-900">{student.name}</p>
                                    <p className="text-xs text-slate-500">{student.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className="inline-flex items-center rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700">
                                  {student.course}
                                </span>
                              </td>
                              <td className="px-5 py-3.5">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                  <Hash className="h-3 w-3" />
                                  <span className="font-mono">{student.id.toString().padStart(4, '0')}</span>
                                </div>
                              </td>
                              <td className="rounded-r-xl px-5 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => handleEditClick(student)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-blue-600 hover:bg-blue-50"
                                    aria-label="Edit student"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteClick(student)}
                                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-red-600 hover:bg-red-50"
                                    aria-label="Delete student"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </motion.tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2">
                    {loading ? (
                      <div className="col-span-full py-16 text-center">
                        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-orange-500" />
                        <p className="text-sm font-medium text-slate-500">Loading students...</p>
                      </div>
                    ) : filteredStudents.length === 0 ? (
                      <div className="col-span-full py-16 text-center">
                        <p className="font-medium text-slate-700">No students matched your search.</p>
                      </div>
                    ) : (
                      filteredStudents.map((student, idx) => (
                        <motion.div
                          key={student.id}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-orange-200 to-amber-100 text-sm font-bold text-slate-700">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex gap-1">
                              <button 
                                onClick={() => handleEditClick(student)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-blue-600 hover:bg-blue-50"
                                aria-label="Edit student"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteClick(student)}
                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:text-red-600 hover:bg-red-50"
                                aria-label="Delete student"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <h3 className="mb-1 font-bold text-slate-900">{student.name}</h3>
                          <p className="mb-3 text-xs text-slate-500">{student.email}</p>
                          <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700">{student.course}</span>
                            <div className="text-[10px] font-semibold text-slate-500">#{student.id.toString().padStart(4, '0')}</div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setEditingStudent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-7"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                  <Edit2 className="h-5 w-5 text-blue-500" />
                  Edit Student
                </h3>
                <button
                  onClick={() => setEditingStudent(null)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Full Name</label>
                  <div className="group relative">
                    <input
                      required
                      type="text"
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      placeholder="Enter full name"
                    />
                    <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">VIT Email</label>
                  <div className="group relative">
                    <input
                      required
                      type="email"
                      value={editFormData.email}
                      onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                      placeholder="aditi.sharma2026@vit.edu"
                    />
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Course</label>
                  <div className="group relative">
                    <select
                      required
                      value={editFormData.course}
                      onChange={e => setEditFormData({ ...editFormData, course: e.target.value })}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-10 py-3 text-slate-900 outline-none transition-all focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-100"
                    >
                      <option value="">Select Course</option>
                      {courses.map(course => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    <BookOpen className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingStudent(null)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 font-semibold text-slate-900 transition-all hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={submitting}
                    type="submit"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:from-blue-600 hover:to-blue-700 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {studentToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setStudentToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-2xl border border-red-200 bg-white p-6 shadow-2xl md:p-7"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Delete Student
                </h3>
                <button
                  onClick={() => setStudentToDelete(null)}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4">
                <p className="text-sm text-slate-700">
                  Are you sure you want to delete <span className="font-semibold">{studentToDelete.name}</span>? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStudentToDelete(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 font-semibold text-slate-900 transition-all hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  disabled={deleteLoading}
                  onClick={handleDeleteConfirm}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-2.5 font-semibold text-white shadow-lg shadow-red-200 transition-all hover:from-red-600 hover:to-red-700 disabled:opacity-60"
                >
                  {deleteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mx-auto mt-8 max-w-7xl border-t border-slate-200 px-5 py-8 md:px-8">
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2 font-medium">
            <GraduationCap className="h-4 w-4" />
            <span>VIT Registry Dashboard - Local Edition</span>
          </div>
          <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.12em]">
            <a href="#" className="transition-colors hover:text-slate-900">Docs</a>
            <a href="#" className="transition-colors hover:text-slate-900">Status</a>
            <a href="#" className="transition-colors hover:text-slate-900">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
