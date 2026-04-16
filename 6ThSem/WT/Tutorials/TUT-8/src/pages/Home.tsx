import { useState, useEffect } from "react";
import { Post } from "../types";
import PostCard from "../components/PostCard";
import { motion } from "motion/react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const rssItems = [
    { title: "Building Modern Web Applications with React", time: "2 days ago" },
    { title: "The Future of Web Development: Trends to Watch in 2024", time: "4 days ago" },
    { title: "TypeScript: Why You Should Consider Using It", time: "7 days ago" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
        {/* Main Content */}
        <div className="space-y-12">
          <header className="mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="editorial-subtitle mb-4"
            >
              Development • Technology • News
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="editorial-title mb-6"
            >
              The Chronicle <br />
              <span className="text-muted italic font-normal">Daily Digest</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-lg text-muted font-serif italic"
            >
              Exploring the intersection of technology and storytelling. 
              Your source for insights on web development, design, and modern software engineering.
            </motion.p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {posts.map((post: Post, index: number) => (
                    <div key={post.id}>
                      <PostCard post={post} index={index} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 natural-card">
                  <p className="text-muted font-serif italic">No stories found yet. Check back later.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="widget-container">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink">Latest from RSS</h3>
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            </div>
            <div className="space-y-4">
              {rssItems.map((item, i) => (
                <div key={i} className="pb-4 border-b border-sand last:border-b-0">
                  <h4 className="text-sm font-serif font-bold text-ink mb-1 line-clamp-2">{item.title}</h4>
                  <p className="text-xs text-muted">{item.time}</p>
                </div>
              ))}
            </div>
            <a href="/feed" className="block mt-6 text-xs font-bold uppercase tracking-widest text-accent hover:text-orange-600 transition-colors">
              Subscribe via RSS →
            </a>
          </div>

          <div className="widget-container">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-6">About</h3>
            <p className="text-sm text-muted leading-relaxed font-serif">
              The Chronicle is your daily source for stories about technology, web development, and the future of software engineering.
            </p>
            <div className="mt-6 space-y-3">
              <a href="/admin" className="block text-xs font-bold uppercase tracking-widest text-accent hover:text-orange-600 transition-colors">
                Editor Access →
              </a>
            </div>
          </div>

          <div className="widget-container">
            <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">Categories</h3>
            <div className="space-y-2">
              {["Development", "Web Design", "Technology", "Tutorials", "News"].map((cat) => (
                <div key={cat} className="flex items-center justify-between pb-2 border-b border-sand last:border-b-0">
                  <span className="text-sm text-muted">{cat}</span>
                  <span className="text-xs font-bold text-muted">→</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
