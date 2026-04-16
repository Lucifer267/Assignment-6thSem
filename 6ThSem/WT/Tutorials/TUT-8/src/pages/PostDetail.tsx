import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Post } from "../types";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setPost(data);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-40 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4">Story Not Found</h2>
        <p className="text-stone-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="text-stone-900 font-bold uppercase tracking-widest text-sm hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(post.publishedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors mb-12"
        >
          <ArrowLeft size={14} />
          Back to Stories
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-6 mb-8 text-xs font-bold uppercase tracking-widest text-accent">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={14} />
              {post.author}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight mb-8 text-ink">
            {post.title}
          </h1>

          <div className="h-[1px] w-full bg-sand mb-8" />
          
          <div className="flex justify-between items-center">
            <p className="text-xl text-muted font-serif italic max-w-2xl leading-relaxed">
              {post.excerpt}
            </p>
            <button className="p-3 rounded-full border border-sand hover:bg-sand transition-colors text-accent">
              <Share2 size={20} />
            </button>
          </div>
        </header>

        <div className="prose prose-stone prose-lg max-w-none">
          <div className="whitespace-pre-wrap font-sans text-ink/90 leading-loose text-lg">
            {post.content}
          </div>
        </div>

        <footer className="mt-20 pt-12 border-t border-sand">
          <div className="bg-sand rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h4 className="font-serif text-2xl font-bold mb-2 text-ink">Enjoyed this story?</h4>
              <p className="text-muted text-sm">Subscribe to our RSS feed to never miss an update.</p>
            </div>
            <a 
              href="/feed" 
              target="_blank"
              className="px-8 py-4 bg-accent text-white rounded-full font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all"
            >
              Subscribe via RSS
            </a>
          </div>
        </footer>
      </motion.div>
    </article>
  );
}
