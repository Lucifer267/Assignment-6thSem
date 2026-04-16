import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Post } from "../types";
import { ArrowUpRight, Calendar, User } from "lucide-react";

interface PostCardProps {
  post: Post;
  index: number;
}

export default function PostCard({ post, index }: PostCardProps) {
  const formattedDate = new Date(post.publishedDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group natural-card flex flex-col h-full"
    >
      <div className="h-48 bg-sand relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(45deg, #5A5A40 25%, transparent 25%), linear-gradient(-45deg, #5A5A40 25%, transparent 25%)",
            backgroundSize: "20px 20px"
          }}
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Article</span>
          <span className="text-stone-300">•</span>
          <span className="font-serif italic text-sm text-muted">{formattedDate}</span>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="text-2xl font-serif font-bold text-ink group-hover:text-accent transition-colors leading-tight mb-3">
            {post.title}
          </h3>
        </Link>

        <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-6">
          {post.excerpt || post.content.substring(0, 120) + "..."}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-sand">
          <span className="text-xs font-bold text-ink/60 uppercase tracking-wider">{post.author}</span>
          <Link 
            to={`/post/${post.slug}`}
            className="text-accent hover:text-ink transition-colors"
          >
            <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
