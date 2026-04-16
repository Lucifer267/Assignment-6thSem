import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, Rss, Settings, Home } from 'lucide-react';

export default function Layout() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                <Briefcase className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                JobFlow
              </span>
            </Link>
            
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/') && !isActive('/jobs') && !isActive('/admin')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              
              <Link
                to="/jobs"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/jobs')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Jobs</span>
              </Link>
              
              <a
                href="/api/rss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-orange-500 hover:bg-orange-50 transition-all"
              >
                <Rss className="w-4 h-4" />
                <span className="hidden sm:inline">RSS Feed</span>
              </a>
              
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive('/admin')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="bg-white/50 border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm">© 2025 JobFlow. All rights reserved.</span>
            </div>
            <a
              href="/api/rss"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-orange-500 transition-colors"
            >
              <Rss className="w-4 h-4" />
              Subscribe to RSS Feed
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
