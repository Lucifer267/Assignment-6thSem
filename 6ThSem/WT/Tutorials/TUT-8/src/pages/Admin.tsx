import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, AuthUser } from "../lib/auth";
import { motion } from "motion/react";
import { Plus, LogOut, CheckCircle2, AlertCircle } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const currentUser = auth.getUser();
    setUser(currentUser);
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const loggedInUser = await auth.login(loginUsername, loginPassword);
      setUser(loggedInUser);
      setLoginUsername("");
      setLoginPassword("");
      setMessage({ type: "success", text: "Logged in successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Login failed" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
    setUser(null);
    setMessage({ type: "success", text: "Logged out successfully" });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.getToken()}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to publish story");
      }

      setTitle("");
      setContent("");
      setExcerpt("");
      setMessage({ type: "success", text: "Story published successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Failed to publish story" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-40 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="natural-card p-12"
        >
          <h2 className="text-3xl font-serif font-bold mb-6 text-ink">Editor Access</h2>
          <p className="text-muted mb-8">Sign in with your editor credentials to access the Chronicle publishing platform.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Username"
                className="w-full bg-transparent border-b border-sand py-3 focus:outline-none focus:border-accent transition-colors text-ink"
                required
              />
            </div>
            <div>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-transparent border-b border-sand py-3 focus:outline-none focus:border-accent transition-colors text-ink"
                required
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>
                {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{message.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-sand">
            <p className="text-xs font-bold uppercase tracking-widest text-muted mb-4">Demo Credentials</p>
            <div className="space-y-2 text-left">
              <div className="bg-bg p-3 rounded text-xs">
                <p className="font-mono text-ink">admin / admin123</p>
              </div>
              <div className="bg-bg p-3 rounded text-xs">
                <p className="font-mono text-ink">editor / editor123</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold text-ink">Publishing Desk</h1>
          <p className="text-muted text-sm">Welcome back, {user.username}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="natural-card p-8 md:p-12 space-y-8"
      >
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}>
            {message.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="editorial-subtitle">Article Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a compelling headline..."
            className="w-full bg-transparent border-b border-sand py-4 text-3xl font-serif focus:outline-none focus:border-accent transition-colors text-ink"
          />
        </div>

        <div className="space-y-2">
          <label className="editorial-subtitle">Excerpt (Short Summary)</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A brief hook for the reader..."
            className="w-full bg-transparent border-b border-sand py-2 focus:outline-none focus:border-accent transition-colors resize-none text-ink"
          />
        </div>

        <div className="space-y-2">
          <label className="editorial-subtitle">Article Content</label>
          <textarea
            required
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
            className="w-full bg-bg border border-sand rounded-2xl p-6 focus:outline-none focus:border-accent transition-colors font-sans leading-relaxed text-ink"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <Plus size={20} />
              Publish Story
            </>
          )}
        </button>
      </motion.form>
    </div>
  );
}
