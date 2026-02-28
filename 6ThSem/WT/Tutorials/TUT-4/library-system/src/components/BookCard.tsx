import React from "react";
import { Book } from "../types";
import { User, Calendar, Tag } from "lucide-react";
import { motion } from "motion/react";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
          <Tag className="w-5 h-5 text-indigo-600" />
        </div>
        <span className="text-lg font-bold text-indigo-600">
          ₹{Number(book.price).toFixed(2)}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
        {book.title}
      </h3>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <User className="w-4 h-4" />
          <span>{book.author}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Calendar className="w-4 h-4" />
          <span>Added {new Date(book.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <button className="w-full py-2.5 bg-gray-50 text-gray-900 rounded-xl text-sm font-semibold hover:bg-indigo-600 hover:text-white transition-all">
        View Details
      </button>
    </motion.div>
  );
};

export default BookCard;
