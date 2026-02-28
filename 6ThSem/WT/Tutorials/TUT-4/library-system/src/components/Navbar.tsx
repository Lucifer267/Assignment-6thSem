import { Link } from "react-router-dom";
import { Library, LayoutDashboard, BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-700 transition-colors">
              <Library className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">Lumina Library</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Catalog
            </Link>
            <Link 
              to="/admin" 
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
