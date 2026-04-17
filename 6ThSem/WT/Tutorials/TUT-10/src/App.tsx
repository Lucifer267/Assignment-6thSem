import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, User, Clock, Loader2, Sparkles } from "lucide-react";

interface Comment {
  id: string;
  username: string;
  comment_text: string;
  created_at: string;
}

export default function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const response = await fetch("/api/comments");
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle comment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !commentText.trim() || isPosting) return;

    setIsPosting(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          comment_text: commentText.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prev) => {
          if (prev.find((c) => c.id === newComment.id)) return prev;
          return [newComment, ...prev];
        });
        setCommentText("");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60));
    
    // Very simple check for "Just now"
    if (Math.abs(diff) < 1) return "Just now";
    
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      diff,
      'minute'
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#111827] flex items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-[960px] h-[680px] bg-white rounded-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E7EB] overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_400px]">
        
        {/* Left Panel: Blog Content */}
        <section className="p-8 md:p-12 border-r border-[#E5E7EB] flex flex-col overflow-y-auto">
          <div className="uppercase text-[12px] font-bold tracking-[0.1em] text-[#6B7280] mb-4">
            Engineering & Design
          </div>
          <h1 className="text-[32px] md:text-[42px] leading-[1.1] font-extrabold mb-6 tracking-[-0.02em]">
            Building the Future of Asynchronous Interaction
          </h1>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4]" />
            <div className="flex flex-col text-[14px]">
              <span className="font-semibold">Sarah Drasner</span>
              <span className="text-[#6B7280]">May 24, 2024 &bull; 8 min read</span>
            </div>
          </div>

          <div className="text-[18px] leading-[1.6] text-[#6B7280] space-y-6">
            <p>
              In the modern web, speed isn't just a luxury; it's the standard. 
              Asynchronous communication allows us to bridge the gap between static 
              content and living, breathing conversations.
            </p>
            <p>
              This implementation focuses on the subtle art of state management 
              and visual feedback, ensuring that every user interaction feels instantaneous 
              and deliberate. The poll-based real-time system ensures users are always 
              in sync with the latest community thoughts.
            </p>
          </div>

          <div className="mt-auto pt-8">
             <div className="flex items-center gap-2 text-indigo-600 font-medium text-sm">
                <Sparkles size={16} />
                <span>Powered by Modern AJAX Polling</span>
             </div>
          </div>
        </section>

        {/* Right Panel: Comments */}
        <aside className="bg-[#FAFAFA] flex flex-col h-full overflow-hidden">
          {/* Comment Header */}
          <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <h2 className="text-[16px] font-semibold">Discussion ({comments.length})</h2>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
              Live Feed
            </div>
          </div>

          {/* Comment List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-[#6B7280]">
                <Loader2 className="animate-spin mb-2" size={24} />
                <span className="text-sm">Syncing comments...</span>
              </div>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                {comments.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10 text-[#6B7280] text-sm border border-dashed border-[#E5E7EB] rounded-xl"
                  >
                    No comments yet. Start the conversation!
                  </motion.div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-semibold text-[#111827]">
                          {comment.username}
                        </span>
                        <span className="text-[11px] text-[#6B7280]">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-[14px] leading-[1.5] text-[#4B5563]">
                        {comment.comment_text}
                      </p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            )}
          </div>

          {/* Comment Form */}
          <div className="p-6 bg-white border-t border-[#E5E7EB]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Your display name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 transition-all outline-none"
                  required
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="What are your thoughts?"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-sm focus:bg-white focus:ring-2 focus:ring-black/5 transition-all outline-none min-h-[80px] resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isPosting}
                className="w-full bg-black text-white rounded-lg p-3 text-sm font-semibold hover:bg-[#333] transition-colors disabled:bg-[#6B7280] disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPosting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {isPosting ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
