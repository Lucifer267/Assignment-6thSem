import { Rss, Newspaper, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-paper border-t border-sand py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-muted uppercase tracking-widest">
            © {new Date().getFullYear()} The Chronicle. Powered by Natural Design.
          </p>
          
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-muted">
            <a href="/feed" target="_blank" className="hover:text-accent transition-colors">
              RSS Feed
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Archives
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              About
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
