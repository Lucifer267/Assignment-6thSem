import { Link } from "react-router-dom";
import { Newspaper, Rss, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-paper border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-accent">The Chronicle</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium uppercase tracking-wider text-ink hover:text-accent transition-colors"
            >
              Home
            </Link>
            <a 
              href="/feed" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-accent text-white rounded-full text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-all"
            >
              RSS Feed
            </a>
            <Link 
              to="/admin" 
              className="text-sm font-medium uppercase tracking-wider text-ink hover:text-accent transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
